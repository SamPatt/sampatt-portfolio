#!/usr/bin/env node

/**
 * Obsidian Content Sync Script
 * 
 * This script syncs content from an Obsidian vault to the website's content directories.
 * It only copies files that have `publish: true` in their frontmatter.
 * Uses last_edited frontmatter field to only sync files that have changed.
 * Routes content to appropriate directories based on the 'type' field (blog or note).
 * 
 * Usage:
 *   node sync-obsidian.js <path-to-obsidian-vault>
 * 
 * Example:
 *   node sync-obsidian.js ~/Documents/ObsidianVault
 * 
 * Frontmatter requirements:
 *   - publish: true (required for syncing)
 *   - type: "blog" or "note" (determines destination directory)
 *   - title: Content title (required for all content)
 *   - date: Publication date (added if missing)
 *   - tags: Array of tags (required for notes, optional for blog posts)
 *   - description: Summary (required for blog posts)
 *   - rating: 0-5 rating (optional, primarily for notes)
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the Obsidian vault path from command line arguments
const vaultPath = process.argv[2];
if (!vaultPath) {
  // If no vault path is provided (like in a Netlify build), just exit gracefully
  console.log('No Obsidian vault path provided - skipping sync.');
  console.log('This is normal during Netlify builds.');
  console.log('For local use, run: npm run sync-notes /path/to/your/obsidian/vault');
  process.exit(0); // Exit successfully to not break builds
}

// Destination directories for content in the website repo
const baseContentPath = path.join(__dirname, '..', 'src', 'content');
const notesPath = path.join(baseContentPath, 'notes');
const blogPath = path.join(baseContentPath, 'blog');

// Ensure the destination directories exist
if (!fs.existsSync(notesPath)) {
  fs.mkdirSync(notesPath, { recursive: true });
}

if (!fs.existsSync(blogPath)) {
  fs.mkdirSync(blogPath, { recursive: true });
}

// Keep track of statistics
let stats = {
  processed: 0,
  published: {
    total: 0,
    notes: 0,
    blog: 0
  },
  skipped: 0,
  unchanged: 0,
  unpublished: 0,
  errors: 0,
  warnings: 0
};

// Track files we've seen (to detect removals)
const seenFiles = {
  notes: new Set(),
  blog: new Set()
};

// Get existing files from both directories
const existingFiles = {
  notes: new Set(
    fs.readdirSync(notesPath)
      .filter(file => file.endsWith('.md'))
      .map(file => file)
  ),
  blog: new Set(
    fs.readdirSync(blogPath)
      .filter(file => file.endsWith('.md'))
      .map(file => file)
  )
};

/**
 * Process a single markdown file
 */
function processFile(filePath) {
  try {
    stats.processed++;
    
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter
    const { data, content: markdownContent } = matter(content);
    
    // Check if this content should be published
    if (!data.publish) {
      stats.skipped++;
      return;
    }
    
    // Determine content type (default to note if not specified)
    const contentType = (data.type || 'note').toLowerCase();
    
    // Validate content type
    if (contentType !== 'note' && contentType !== 'blog') {
      console.warn(`Warning: Content at ${filePath} has invalid type: ${contentType}. Defaulting to 'note'.`);
      stats.warnings++;
    }
    
    // Set destination path based on content type
    const destFolder = contentType === 'blog' ? blogPath : notesPath;
    
    // Create a destination file name (based on original filename)
    const fileName = path.basename(filePath);
    const destFilePath = path.join(destFolder, fileName);
    
    // Track this file for later cleanup
    if (contentType === 'blog') {
      seenFiles.blog.add(fileName);
    } else {
      seenFiles.notes.add(fileName);
    }
    
    // Check if file exists in destination and needs update
    let needsUpdate = true;
    if (fs.existsSync(destFilePath)) {
      // Check if target file has been modified less recently than source
      const destContent = fs.readFileSync(destFilePath, 'utf8');
      const destData = matter(destContent).data;
      
      if (data.last_edited) {
        // If source has last_edited timestamp, compare with dest
        if (!destData.last_edited || data.last_edited > destData.last_edited) {
          console.log(`Update needed for ${fileName}: newer edit timestamp`);
        } else {
          needsUpdate = false;
          stats.unchanged++;
          return;
        }
      } else {
        // Fallback to checking file modification time
        const sourceTime = fs.statSync(filePath).mtimeMs;
        const destTime = fs.statSync(destFilePath).mtimeMs;
        
        if (sourceTime <= destTime) {
          needsUpdate = false;
          stats.unchanged++;
          return;
        }
      }
    }
    
    if (!needsUpdate) {
      return;
    }
    
    // Ensure we have the required frontmatter
    if (!data.title) {
      console.warn(`Warning: Content at ${filePath} has publish: true but no title. Skipping.`);
      stats.skipped++;
      return;
    }
    
    // Ensure the frontmatter has all required fields based on content type
    
    // Common fields for all content types
    if (!data.date) {
      data.date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    }
    
    // Tags are now required for all content types
    if (!data.tags || !Array.isArray(data.tags) || data.tags.length === 0) {
      data.tags = ['uncategorized'];
      console.warn(`Warning: Content at ${filePath} has no tags. Adding default.`);
      stats.warnings++;
    }
    
    // Type-specific requirements
    if (contentType === 'blog') {
      // Blog-specific validation
      if (!data.description) {
        console.warn(`Warning: Blog post at ${filePath} has no description. Adding default.`);
        data.description = 'A blog post';
        stats.warnings++;
      }
    } else {
      // Note-specific validation
      if (!data.rating && data.rating !== 0) {
        data.rating = 0;
      }
    }
    
    // Clone the data for site version
    const siteData = { ...data };
    
    // Remove fields we don't want in the site version
    delete siteData.publish;
    
    // Reconstruct the content with modified frontmatter
    const updatedContent = matter.stringify(markdownContent, siteData);
    
    // Write to destination
    fs.writeFileSync(destFilePath, updatedContent);
    console.log(`Published ${contentType}: ${fileName}`);
    
    // Update stats
    stats.published.total++;
    if (contentType === 'blog') {
      stats.published.blog++;
    } else {
      stats.published.notes++;
    }
    
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
    stats.errors++;
  }
}

/**
 * Recursively scan directory for markdown files
 */
function scanDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    // Skip hidden files and directories
    if (item.startsWith('.')) continue;
    
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively scan subdirectories
      scanDirectory(itemPath);
    } else if (item.endsWith('.md')) {
      // Process markdown files
      processFile(itemPath);
    }
  }
}

/**
 * Remove files from the destination that are no longer in the source
 * or no longer have publish: true
 */
function cleanupRemovedFiles() {
  // Clean up notes
  for (const file of existingFiles.notes) {
    if (!seenFiles.notes.has(file)) {
      const destFilePath = path.join(notesPath, file);
      fs.unlinkSync(destFilePath);
      console.log(`Removed note: ${file} (no longer published or found in vault)`);
      stats.unpublished++;
    }
  }

  // Clean up blog posts
  for (const file of existingFiles.blog) {
    if (!seenFiles.blog.has(file)) {
      const destFilePath = path.join(blogPath, file);
      fs.unlinkSync(destFilePath);
      console.log(`Removed blog post: ${file} (no longer published or found in vault)`);
      stats.unpublished++;
    }
  }
}

console.log(`Starting sync from ${vaultPath} to content directories`);
console.log(`  Notes path: ${notesPath}`);
console.log(`  Blog path: ${blogPath}`);
console.log('------------------------------------');

// Start the scanning and processing
try {
  scanDirectory(vaultPath);
  cleanupRemovedFiles();
  
  console.log('------------------------------------');
  console.log('Sync completed:');
  console.log(`  Files processed: ${stats.processed}`);
  console.log(`  Files published/updated: ${stats.published.total}`);
  console.log(`    - Notes: ${stats.published.notes}`);
  console.log(`    - Blog posts: ${stats.published.blog}`);
  console.log(`  Files unchanged: ${stats.unchanged}`);
  console.log(`  Files unpublished/removed: ${stats.unpublished}`);
  console.log(`  Files skipped (no publish:true): ${stats.skipped}`);
  console.log(`  Warnings: ${stats.warnings}`);
  console.log(`  Errors: ${stats.errors}`);
} catch (error) {
  console.error(`Sync failed: ${error.message}`);
  process.exit(1);
}