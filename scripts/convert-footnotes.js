/**
 * Script to convert LLM-generated footnote citations to the proper markdown format for the website
 * 
 * This script handles citation formats used by LLMs including:
 * - ([Text](URL#:~:text=excerpt))
 * - ( [Text](URL#:~:text=excerpt) )
 * - ([URL](URL)) - where the URL text is the same as the actual URL
 * - URLs with special characters like \( and \)
 * 
 * Usage: node convert-footnotes.js <input_file_path>
 */

import fs from 'fs';
import path from 'path';

// Check if file path is provided
if (process.argv.length < 3) {
  console.error('Usage: node convert-footnotes.js <input_file_path>');
  process.exit(1);
}

// Get the input file path
const inputFilePath = process.argv[2];

// Read the input file
try {
  // Read the file content
  const content = fs.readFileSync(inputFilePath, 'utf8');
  
  // Process the content to extract footnotes from citations
  const finalContent = processFile(content);
  
  // Write back to the file
  fs.writeFileSync(inputFilePath, finalContent);
  console.log(`Successfully converted footnotes in ${inputFilePath}`);
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}

/**
 * Process the file content, extract citations, and format as footnotes
 * @param {string} content - File content
 * @returns {string} - Processed content with footnotes
 */
function processFile(content) {
  // Step 1: Find the Sources section if it exists
  const sourcesMatch = content.match(/\n\*\*Sources:\*\*[\s\S]+$/);
  const sourcesSection = sourcesMatch ? sourcesMatch[0] : '';
  
  // Step 2: Process content without the Sources section
  let processedContent = sourcesSection 
    ? content.substring(0, content.indexOf(sourcesSection)) 
    : content;
  
  // Step 3: Extract existing footnotes if any
  const footnoteMatches = processedContent.match(/\n\[\^(\d+)\]:[\s\S]+$/);
  const existingFootnotes = footnoteMatches ? footnoteMatches[0] : '';
  
  // Step 4: Work with content without footnotes
  if (existingFootnotes) {
    processedContent = processedContent.substring(0, processedContent.indexOf(existingFootnotes));
  }
  
  // Step 5: Process citations in content
  const citations = new Map(); // URL -> citation text
  const urlToNumber = new Map(); // URL -> footnote number
  let footnoteCount = 0;
  
  // First pass: extract all citations using manual parsing for complex URLs
  let workingContent = processedContent;
  const matches = findAllCitations(workingContent);
  
  // Process each match
  matches.forEach(match => {
    const { fullMatch, text, url } = match;
    
    // Clean URL by removing text fragments
    const cleanUrl = url.split('#:~:text=')[0];
    
    // Find citation from sources section
    let citationText = '';
    if (sourcesSection) {
      citationText = findCitationInSources(sourcesSection, cleanUrl);
    }
    
    // If no citation found, create a simple one
    if (!citationText) {
      citationText = `${text}: ${cleanUrl}`;
    }
    
    // Add to our maps if not already there
    if (!urlToNumber.has(cleanUrl)) {
      footnoteCount++;
      urlToNumber.set(cleanUrl, footnoteCount);
      citations.set(cleanUrl, citationText);
    }
    
    // Get the footnote number for this URL
    const footnoteNumber = urlToNumber.get(cleanUrl);
    
    // Replace citation with footnote reference
    workingContent = workingContent.replace(fullMatch, `[^${footnoteNumber}]`);
  });
  
  // Fix any remaining issues
  workingContent = fixTrailingParentheses(workingContent);
  
  // Add footnotes at the end
  if (footnoteCount > 0) {
    workingContent += '\n\n';
    
    // Add each footnote in order
    for (let i = 1; i <= footnoteCount; i++) {
      // Find URL for this footnote number
      let url = '';
      for (const [thisUrl, num] of urlToNumber.entries()) {
        if (num === i) {
          url = thisUrl;
          break;
        }
      }
      
      if (url) {
        const citationText = citations.get(url);
        workingContent += `[^${i}]: ${citationText}\n\n`;
      }
    }
  }
  
  return workingContent;
}

/**
 * Find all citation links in content with special handling for complex URLs
 * @param {string} content - The content to search
 * @returns {Array} - Array of citation objects
 */
function findAllCitations(content) {
  const results = [];
  
  // Quick check for simple cases using regex - handles most citations
  const simpleRegex = /\(\s*\[([^\]]+)\]\(([^()]+)\)\s*\)/g;
  let match;
  
  while ((match = simpleRegex.exec(content)) !== null) {
    results.push({
      fullMatch: match[0],
      text: match[1],
      url: match[2]
    });
  }
  
  // Handle citations where URL is the text: ([URL](link))
  // This pattern specifically accounts for URLs with escaped parentheses
  const urlAsTextRegex = /\(\[([^\]]+)\]\(([^)]+(?:\\\\)*(?:\\\))*[^)]*)\)\)/g;
  while ((match = urlAsTextRegex.exec(content)) !== null) {
    results.push({
      fullMatch: match[0],
      text: match[1],
      url: match[2].replace(/\\\(/g, '(').replace(/\\\)/g, ')')
    });
  }
  
  // Special handling for complex URLs with escape chars or nested parentheses
  // Uses a specialized character-by-character parser
  const complexLinks = findComplexCitations(content);
  complexLinks.forEach(link => {
    // Check if this citation is already captured by the simple regex
    if (!results.some(r => r.fullMatch === link.fullMatch)) {
      results.push(link);
    }
  });
  
  return results;
}

/**
 * Find citations with complex URLs that may include escaped parentheses
 * @param {string} content - Content to search
 * @returns {Array} - Array of citation objects
 */
function findComplexCitations(content) {
  const results = [];
  
  // Simple regex to find potential starting points
  const startPattern = /\([^(]*\[[^[]*\]\(/g;
  let startMatch;
  let pos = 0;
  
  while ((startMatch = startPattern.exec(content)) !== null) {
    const startPos = startMatch.index;
    const urlStart = startMatch[0].lastIndexOf('(') + 1;
    const absoluteUrlStart = startPos + urlStart;
    
    // Now find the matching closing parenthesis, accounting for escaped ones
    let urlEnd = -1;
    let depth = 1;
    
    for (let i = absoluteUrlStart; i < content.length; i++) {
      const currentChar = content[i];
      const prevChar = i > 0 ? content[i - 1] : '';
      const prevTwoChars = i > 1 ? content.substring(i-2, i) : '';
      
      // Handle normal parentheses (not escaped)
      if (currentChar === '(' && prevChar !== '\\') {
        depth++;
      } else if (currentChar === ')' && prevChar !== '\\') {
        depth--;
        if (depth === 0) {
          urlEnd = i;
          break;
        }
      } 
      // Special handling for escaped parentheses in URLs
      else if (currentChar === ')' && prevChar === '\\' && prevTwoChars !== '\\\\') {
        // This is an escaped closing parenthesis \) which is part of the URL, not a delimiter
        continue;
      }
    }
    
    if (urlEnd !== -1) {
      // Find the closing parenthesis for the whole citation
      let citationEnd = urlEnd + 1;
      
      // Extract components
      const fullMatch = content.substring(startPos, citationEnd);
      
      // Extract link text
      const textStartPos = fullMatch.indexOf('[') + 1;
      const textEndPos = fullMatch.indexOf(']');
      const text = fullMatch.substring(textStartPos, textEndPos);
      
      // Extract URL - relative to the fullMatch string
      const relativeUrlStart = fullMatch.indexOf('](') + 2;
      const relativeUrlEnd = fullMatch.lastIndexOf(')');
      let url = fullMatch.substring(relativeUrlStart, relativeUrlEnd);
      
      // Unescape any escaped parentheses in the URL
      url = url.replace(/\\\(/g, '(').replace(/\\\)/g, ')');
      
      results.push({
        fullMatch,
        text,
        url
      });
      
      // Move the search position forward
      pos = citationEnd;
    } else {
      // If we can't find a matching closing parenthesis, move forward
      pos = absoluteUrlStart + 1;
    }
  }
  
  return results;
}

/**
 * Fixes issues with trailing parentheses in the text
 * @param {string} content - The content to fix
 * @returns {string} - Fixed content
 */
function fixTrailingParentheses(content) {
  let result = content;
  
  // Fix footnote+parenthesis+period
  result = result.replace(/\[\^(\d+)\]\)\./g, '[^$1].');
  
  // Fix footnote+parenthesis without period
  result = result.replace(/\[\^(\d+)\]\)/g, '[^$1]');
  
  return result;
}

/**
 * Searches for a citation in the sources section
 * @param {string} sourcesSection - The sources section text
 * @param {string} url - URL to find
 * @returns {string} - Citation text if found
 */
function findCitationInSources(sourcesSection, url) {
  // Split the sources section by numbered list items
  const sources = sourcesSection.split(/\d+\.\s+/).filter(Boolean);
  
  // Look for the URL in each source
  for (const source of sources) {
    // Clean URLs for comparison
    const cleanUrl = url.replace(/\\\(/g, '(').replace(/\\\)/g, ')').replace(/\\/g, '');
    const cleanSource = source.replace(/\\\(/g, '(').replace(/\\\)/g, ')').replace(/\\/g, '');
    
    if (cleanSource.includes(cleanUrl)) {
      return source.trim().replace(/\n/g, ' ');
    }
  }
  
  return '';
}