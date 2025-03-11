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
      const destMatter = matter(destContent);
      const destData = destMatter.data;
      
      // Get the content for comparison
      const sourceMatter = matter(content);
      const sourceContent = sourceMatter.content.trim();
      const destContentBody = destMatter.content.trim();
      
      // For comparing data, filter out fields we don't want to compare
      // Clone the data objects to avoid modifying the originals
      const sourceDataClone = JSON.parse(JSON.stringify(data));
      const destDataClone = JSON.parse(JSON.stringify(destData));
      
      // Strip out fields we don't care about for comparison
      // Remove fields that should not affect change detection
      delete sourceDataClone.last_edited;
      delete destDataClone.last_edited;
      
      // Remove publish field from source (it's always removed from dest)
      delete sourceDataClone.publish;
      
      // If source doesn't have a date but dest does, remove date from dest for comparison
      // This handles auto-added dates that shouldn't trigger updates
      if (!sourceDataClone.date && destDataClone.date) {
        delete destDataClone.date;
      }
      
      // Normalize title field (remove quotes if present)
      if (sourceDataClone.title && typeof sourceDataClone.title === 'string') {
        sourceDataClone.title = sourceDataClone.title.replace(/^"(.*)"$/, '$1');
      }
      if (destDataClone.title && typeof destDataClone.title === 'string') {
        destDataClone.title = destDataClone.title.replace(/^"(.*)"$/, '$1');
      }
      
      // Handle tags consistently - if source doesn't have tags but dest has uncategorized,
      // add uncategorized to source for comparison
      if (!sourceDataClone.tags && destDataClone.tags && 
          Array.isArray(destDataClone.tags) && 
          destDataClone.tags.length === 1 && 
          destDataClone.tags[0] === 'uncategorized') {
        sourceDataClone.tags = ['uncategorized'];
      }
      
      const sourceDataStr = JSON.stringify(sourceDataClone);
      const destDataStr = JSON.stringify(destDataClone);
      
      // First compare content and data regardless of timestamp
      const contentMatches = sourceContent === destContentBody;
      const dataMatches = sourceDataStr === destDataStr;
      
      // If content and data match exactly, there's no need to update
      if (contentMatches && dataMatches) {
        needsUpdate = false;
        stats.unchanged++;
        return;
      }
      
      // At this point, we know content or data is different
      
      // Add debug info to help identify content differences for specific files
      if (["Andy Matuschak.md", "DNA Methylation and Aging.md", "There is Little Evidence for the Placebo Effect.md", 
           "O-ring theory of economic development.md", "Spaced Repetition Learning.md"].includes(fileName)) {
        console.log(`DEBUG ${fileName}:`);
        console.log(`- Content match: ${contentMatches}`);
        console.log(`- Data match: ${dataMatches}`);
        console.log(`- Source data: ${sourceDataStr}`);
        console.log(`- Dest data: ${destDataStr}`);
      }
      
      if (data.last_edited) {
        // If source has last_edited timestamp
        if (!destData.last_edited) {
          // Destination has no timestamp, so source is newer
          console.log(`Update needed for ${fileName}: content differs and source has timestamp`);
        } else if (data.last_edited > destData.last_edited) {
          // Source is newer than destination
          console.log(`Update needed for ${fileName}: content differs with newer timestamp`);
        } else {
          // Destination timestamp is newer or equal, but content differs
          // This is an unusual case that might indicate concurrent edits
          console.log(`Update needed for ${fileName}: content differs despite older timestamp`);
        }
      } else {
        // No timestamp, just report content difference
        console.log(`Update needed for ${fileName}: content differs`);
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
    
    // We no longer automatically add the date field
    // Instead, we'll use Obsidian's created field
    
    // Tags are now required for all content types
    if (!data.tags || !Array.isArray(data.tags) || data.tags.length === 0) {
      // Get destination data if it exists
      let existingDestData = null;
      if (fs.existsSync(destFilePath)) {
        try {
          const existingContent = fs.readFileSync(destFilePath, 'utf8');
          existingDestData = matter(existingContent).data;
        } catch (err) {
          console.log(`Warning: Could not read existing file ${destFilePath}`);
        }
      }
      
      // Default tags
      data.tags = ['uncategorized'];
      
      // Only warn if this is the first time
      if (!(existingDestData && 
           existingDestData.tags && 
           Array.isArray(existingDestData.tags) && 
           existingDestData.tags.length === 1 && 
           existingDestData.tags[0] === 'uncategorized')) {
        console.warn(`Warning: Content at ${filePath} has no tags. Adding default.`);
        stats.warnings++;
      }
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
      // Note-specific validation - only add rating for book notes
      if (data.tags && Array.isArray(data.tags) && data.tags.includes('books')) {
        if (!data.rating && data.rating !== 0) {
          data.rating = 0;
        }
      }
      // Don't add rating field to non-book notes
    }
    
    // Clone the data for site version
    const siteData = { ...data };
    
    // Handle created and last_edited dates from Obsidian
    // Use Obsidian's native timestamps directly without modification
    // These should be in the format YYYY-MM-DD-HH:mm:ss
    if (data.created) {
      siteData.created = data.created;
    }
    if (data.last_edited) {
      siteData.last_edited = data.last_edited;
    }
    
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