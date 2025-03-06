#!/usr/bin/env node

/**
 * Obsidian Notes Sync Script
 * 
 * This script syncs notes from an Obsidian vault to the website's content/notes directory.
 * It only copies notes that have `publish: true` in their frontmatter.
 * Uses last_edited frontmatter field to only sync files that have changed.
 * 
 * Usage:
 *   node sync-obsidian.js <path-to-obsidian-vault>
 * 
 * Example:
 *   node sync-obsidian.js ~/Documents/ObsidianVault
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

// Destination directory for notes in the website repo
const destPath = path.join(__dirname, '..', 'src', 'content', 'notes');

// Ensure the destination directory exists
if (!fs.existsSync(destPath)) {
  fs.mkdirSync(destPath, { recursive: true });
}

// Keep track of statistics
let stats = {
  processed: 0,
  published: 0,
  skipped: 0,
  unchanged: 0,
  unpublished: 0,
  errors: 0
};

// Track files we've seen (to detect removals)
const seenFiles = new Set();
const existingFiles = new Set(
  fs.readdirSync(destPath)
    .filter(file => file.endsWith('.md'))
    .map(file => file)
);

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
    
    // Check if this note should be published
    if (!data.publish) {
      stats.skipped++;
      return;
    }
    
    // Create a destination file name (based on original filename)
    const fileName = path.basename(filePath);
    const destFilePath = path.join(destPath, fileName);
    seenFiles.add(fileName);
    
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
      console.warn(`Warning: Note at ${filePath} has publish: true but no title. Skipping.`);
      stats.skipped++;
      return;
    }
    
    // Ensure the frontmatter has all required fields
    if (!data.date) {
      data.date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    }
    
    if (!data.tags || !Array.isArray(data.tags) || data.tags.length === 0) {
      data.tags = ['uncategorized'];
    }
    
    if (!data.rating) {
      data.rating = 0;
    }
    
    // Clone the data for site version
    const siteData = { ...data };
    
    // Remove fields we don't want in the site version
    delete siteData.publish;
    delete siteData.last_edited;
    
    // Reconstruct the content with modified frontmatter
    const updatedContent = matter.stringify(markdownContent, siteData);
    
    // Write to destination
    fs.writeFileSync(destFilePath, updatedContent);
    console.log(`Published: ${fileName}`);
    stats.published++;
    
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
  for (const file of existingFiles) {
    if (!seenFiles.has(file)) {
      const destFilePath = path.join(destPath, file);
      fs.unlinkSync(destFilePath);
      console.log(`Removed: ${file} (no longer published or found in vault)`);
      stats.unpublished++;
    }
  }
}

console.log(`Starting sync from ${vaultPath} to ${destPath}`);
console.log('------------------------------------');

// Start the scanning and processing
try {
  scanDirectory(vaultPath);
  cleanupRemovedFiles();
  
  console.log('------------------------------------');
  console.log('Sync completed:');
  console.log(`  Files processed: ${stats.processed}`);
  console.log(`  Files published/updated: ${stats.published}`);
  console.log(`  Files unchanged: ${stats.unchanged}`);
  console.log(`  Files unpublished/removed: ${stats.unpublished}`);
  console.log(`  Files skipped (no publish:true): ${stats.skipped}`);
  console.log(`  Errors: ${stats.errors}`);
} catch (error) {
  console.error(`Sync failed: ${error.message}`);
  process.exit(1);
}