import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Newsletter from './Newsletter';
import WalkingCalculator from './WalkingCalculator';
import TweetEmbed from './TweetEmbed';
import YouTubeEmbed from './YouTubeEmbed';

const loadVisualizationComponent = async (slug) => {
  switch (slug) {
    case 'frequency-modulation':
      return (await import('./visualizations/FrequencyModulationVisualizer.jsx')).default;
    case 'bandwidth-window':
      return (await import('./visualizations/BandwidthVisualizer.jsx')).default;
    case 'block-transfer':
      return (await import('./visualizations/BlockTransferVisualizer.jsx')).default;
    case 'network-topology':
      return (await import('./visualizations/NetworkTopologyVisualizer.jsx')).default;
    default:
      return null;
  }
};

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        const publishedModules = import.meta.glob('../content/blog/*.md');
        const draftModules = import.meta.glob('../content/drafts/*.md');
        const allModules = { ...publishedModules, ...draftModules };
        
        const matchingPath = Object.keys(allModules).find(path => 
          path.split('/').pop().replace('.md', '') === slug
        );

        if (matchingPath) {
          const mod = await allModules[matchingPath]();
          
          // Process content to support note embedding
          let processedHtml = mod.html;
          const noteEmbedRegex = /\{\{note:([a-zA-Z0-9-]+)\}\}/g;
          let embedMatches = [...processedHtml.matchAll(noteEmbedRegex)];
          
          // Replace note embed tags with placeholders
          embedMatches.forEach((match, index) => {
            const noteSlug = match[1];
            const placeholder = `<div id="embedded-note-${index}" data-note-slug="${noteSlug}"></div>`;
            processedHtml = processedHtml.replace(match[0], placeholder);
          });
          
          // Handle walking calculator embed
          const calculatorRegex = /\{\{walking-calculator\}\}/g;
          let calculatorMatches = [...processedHtml.matchAll(calculatorRegex)];
          
          // Replace calculator tags with placeholders
          calculatorMatches.forEach((match, index) => {
            const placeholder = `<div id="walking-calculator-${index}"></div>`;
            processedHtml = processedHtml.replace(match[0], placeholder);
          });

          // Handle tweet embeds
          const tweetEmbedRegex = /\{\{tweet:\s*([\s\S]*?)\s*\}\}/gi;
          const tweetEmbeds = [];
          processedHtml = processedHtml.replace(
            tweetEmbedRegex,
            (match, rawContent) => {
              const content = rawContent.trim();
              let url = content;

              const hrefMatch = content.match(/href="([^"]+)"/i);
              if (hrefMatch) {
                url = hrefMatch[1];
              }

              if (!/^https?:\/\/(?:www\.)?(?:twitter|x)\.com\/.+/i.test(url)) {
                // If we can't find a valid tweet URL, leave content unchanged
                return match;
              }

              const idMatch = url.match(/status\/(\d+)/i);
              const tweetId = idMatch ? idMatch[1] : null;
              const index = tweetEmbeds.length;
              tweetEmbeds.push({ id: tweetId, url });
              const dataIdAttr = tweetId ? ` data-tweet-id="${tweetId}"` : '';
              return `<div id="tweet-embed-${index}" class="tweet-embed-placeholder"${dataIdAttr} data-tweet-url="${url}"></div>`;
            }
          );

          // Handle YouTube embeds
          const youtubeEmbedRegex = /\{\{youtube:\s*([\s\S]*?)\s*\}\}/gi;
          const youtubeEmbeds = [];
          processedHtml = processedHtml.replace(
            youtubeEmbedRegex,
            (match, rawContent) => {
              const content = rawContent.trim();
              let url = content;

              const hrefMatch = content.match(/href="([^"]+)"/i);
              if (hrefMatch) {
                url = hrefMatch[1];
              }

              const idMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/i);
              const videoId = idMatch ? idMatch[1] : null;

              if (!videoId) {
                return match;
              }

              const index = youtubeEmbeds.length;
              youtubeEmbeds.push({ id: videoId, url });
              return `<div id="youtube-embed-${index}" class="youtube-embed-placeholder" data-youtube-id="${videoId}" data-youtube-url="${url}"></div>`;
            }
          );
          
          // Handle visualization embeds
          const vizEmbedRegex = /\{\{viz:([a-zA-Z0-9-]+)\}\}/g;
          const vizEmbeds = [];
          processedHtml = processedHtml.replace(
            vizEmbedRegex,
            (match, slugValue) => {
              const index = vizEmbeds.length;
              vizEmbeds.push(slugValue);
              return `<div id="viz-embed-${index}" class="viz-embed-placeholder" data-viz-slug="${slugValue}"></div>`;
            }
          );
          
          // Process footNote references - convert [^1] to clickable links
          const footnoteRefRegex = /\[(\^[0-9]+)\]/g;
          let footnoteRefCount = 0;
          
          // First, extract all footnotes at the end and save them for later
          const allFootnotes = [];
          const extractFootnoteRegex = /\[\^([0-9]+)\]:\s+([\s\S]*?)(?=\[\^[0-9]+\]:|$)/g;
          let footnoteMatch;
          while ((footnoteMatch = extractFootnoteRegex.exec(processedHtml)) !== null) {
            const num = footnoteMatch[1];
            const content = footnoteMatch[2].trim();
            allFootnotes.push({ num, content });
          }
          
          // Now remove all footnote definitions from the HTML
          processedHtml = processedHtml.replace(/\[\^[0-9]+\]:\s+[\s\S]*?(?=\[\^[0-9]+\]:|$)/g, '');
          
          // Convert footnote references to clickable links
          processedHtml = processedHtml.replace(
            footnoteRefRegex,
            (match, footnoteId) => {
              const num = footnoteId.replace('^', '');
              footnoteRefCount++;
              return `<sup><a href="#fn${num}" id="fnref${num}" class="footnote-ref">${num}</a></sup>`;
            }
          );
          
          // Process footnote definitions at the end of content
          
          // Use our pre-extracted footnotes collection (if available) or create a new one
          const footnotes = allFootnotes.length > 0 ? allFootnotes : [];
          
          // If no footnotes were extracted earlier, try the original methods
          if (footnotes.length === 0) {
            // First try to find footnotes in HTML-wrapped format (first approach)
            const footnoteDefRegex = /<p>\[\^([0-9]+)\]:\s+([\s\S]*?)(<\/p>|$)/g;
            let footnoteMatches = [...processedHtml.matchAll(footnoteDefRegex)];
            
            // Process any HTML-wrapped footnotes
            for (const match of footnoteMatches) {
              const num = match[1];
              // Get the content but make sure we don't include the closing </p> tag if present
              let content = match[2];
              if (content.endsWith('</p>')) {
                content = content.slice(0, -4);
              }
              
              // Add to our collection
              footnotes.push({ num, content });
              
              // Remove the original footnote definition from the content
              processedHtml = processedHtml.replace(match[0], '');
            }
            
            // Then try to find footnotes in raw text format (second approach)
            // This regex looks for "[^n]: content" pattern at line starts or after newlines
            const rawFootnoteRegex = /(?:^|\n)\[\^([0-9]+)\]:\s+(.*?)(?=$|\n\[\^|\n\n)/gs;
            let rawMatches = [...processedHtml.matchAll(rawFootnoteRegex)];
            
            // Process any plain text footnotes
            for (const match of rawMatches) {
              const num = match[1];
              let content = match[2].trim();
              
              // Only add if we haven't processed this footnote number already
              if (!footnotes.some(fn => fn.num === num)) {
                footnotes.push({ num, content });
              }
              
              // Remove the original footnote definition from the content
              processedHtml = processedHtml.replace(match[0], '');
            }
          }
          
          // If we found footnotes with the first two approaches, create the footnotes section
          if (footnotes.length > 0) {
            // Create a properly formatted footnotes section
            let footnotesHtml = '<div class="footnotes"><h2>References</h2><ol>';
            
            // Add each footnote to the HTML
            for (const { num, content } of footnotes) {
              footnotesHtml += `<li id="fn${num}">${content} <a href="#fnref${num}" class="footnote-backref">↩</a></li>`;
            }
            
            footnotesHtml += '</ol></div>';
            
            // Add the footnotes section to the end of the content
            processedHtml += footnotesHtml;
          } else {
            // Final attempt - try a more aggressive approach using the original markdown
            const altFootnoteRegex = /\[\^([0-9]+)\]:\s+([\s\S]*?)(?=\[\^[0-9]+\]:|$)/g;
            const rawContent = mod.html;
            let altMatches = [...rawContent.matchAll(altFootnoteRegex)];
            
            if (altMatches.length > 0) {
              // Create a properly formatted footnotes section
              let footnotesHtml = '<div class="footnotes"><h2>References</h2><ol>';
              
              // Keep track of which footnotes we've processed
              const processedFootnotes = new Set();
              
              // Process each footnote and add it to the section
              for (const match of altMatches) {
                const num = match[1];
                
                // Skip if we've already processed this footnote
                if (processedFootnotes.has(num)) continue;
                processedFootnotes.add(num);
                
                // Get the content
                let content = match[2].trim();
                
                // Remove HTML tags if present
                content = content.replace(/<\/?p>/g, '');
                
                footnotesHtml += `<li id="fn${num}">${content} <a href="#fnref${num}" class="footnote-backref">↩</a></li>`;
                
                // Remove this specific footnote from the content
                // Create patterns to match different ways this footnote might appear in the HTML
                const patterns = [
                  new RegExp(`<p>\\[\\^${num}\\]:.*?<\\/p>`, 'g'),
                  new RegExp(`\\[\\^${num}\\]:.*?(\\n|$)`, 'g'),
                  new RegExp(`\\[\\^${num}\\]:.*?(<br>|<\\/p>)`, 'g')
                ];
                
                // Apply each pattern to remove the footnotes
                patterns.forEach(pattern => {
                  processedHtml = processedHtml.replace(pattern, '');
                });
              }
              
              footnotesHtml += '</ol></div>';
              
              // Add the footnotes section to the end of the content
              processedHtml += footnotesHtml;
              
              // Find where the raw footnotes section might begin
              // This looks for the first footnote definition after the main content
              const firstFootnoteDefIndex = processedHtml.search(/\[\^[0-9]+\]:/);
              
              if (firstFootnoteDefIndex > -1) {
                // Try to find a clean cutoff point - like the end of a paragraph before footnotes start
                const lastParagraphEndIndex = processedHtml.lastIndexOf('</p>', firstFootnoteDefIndex);
                
                if (lastParagraphEndIndex > -1 && lastParagraphEndIndex < firstFootnoteDefIndex) {
                  // Keep everything up to the end of the last paragraph before footnotes
                  processedHtml = processedHtml.substring(0, lastParagraphEndIndex + 4) + 
                                  processedHtml.substring(processedHtml.indexOf('<div class="footnotes">'));
                }
              }
              
              // Final cleanup - remove any raw footnote definitions that might remain
              const finalCleanupRegex = /(?:^|\n)\[\^[0-9]+\]:\s+.*?(?=$|\n\[\^|\n\n)/gs;
              processedHtml = processedHtml.replace(finalCleanupRegex, '');
            }
          }
          
          // Final safety check - clean up any remaining raw footnote definitions
          // that might appear in unexpected formats or weren't caught by our regexes
          const finalCleanupRegex = /(?:<p>)?\[\^([0-9]+)\]:(?:\s|&nbsp;)+.*?(?:<\/p>)?/g;
          processedHtml = processedHtml.replace(finalCleanupRegex, '');
          
          // Also remove any paragraphs that start with [^n]: (common raw footnote format)
          const rawFootnoteParaRegex = /<p>\[\^[0-9]+\]:.*?<\/p>/g;
          processedHtml = processedHtml.replace(rawFootnoteParaRegex, '');
          
          // Try to identify and remove the entire section of raw footnotes at the end
          // This looks for a series of footnote references at the end of the document
          const rawFootnoteBlockRegex = /(<p>\[\^[0-9]+\]:.*?<\/p>\s*){2,}$/g;
          processedHtml = processedHtml.replace(rawFootnoteBlockRegex, '');
          
          // Find and remove lines with just footnote references
          const standaloneFootnoteRegex = /\[\^[0-9]+\]:.*?(?=<\/p>|$)/g;
          processedHtml = processedHtml.replace(standaloneFootnoteRegex, '');
          
          // Additional clean-up for standalone footnote lines (not in paragraphs)
          // This handles the format used in newer blog posts - much more aggressive pattern
          const standaloneLineFootnoteRegex = /\[\^[0-9]+\]:[\s\S]*?(?=\[\^[0-9]+\]:|$)/g;
          processedHtml = processedHtml.replace(standaloneLineFootnoteRegex, '');
          
          // Even more aggressive approach - find all raw footnote definitions anywhere
          const anyFootnoteRegex = /\[\^[0-9]+\]:[\s\S]*?(?=\n\n|\n\[\^|$)/g;
          processedHtml = processedHtml.replace(anyFootnoteRegex, '');
          
          // Handle consecutive footnotes with single newlines between them
          // This matches blocks of footnotes like in the body temperature post
          const blockFootnoteRegex = /\[\^[0-9]+\][^\n]*(?:\n\[\^[0-9]+\][^\n]*)+/g;
          processedHtml = processedHtml.replace(blockFootnoteRegex, '');
          
          // Handle specific markdown footnote format with links 
          // This targets common patterns from AI-generated content with links in footnotes
          const markdownFootnoteRegex = /\[\^[0-9]+\]:[\s\S]*?(?:\[[^\]]+\]\([^)]+\)|\w+:\/\/[^\s]+)/g;
          processedHtml = processedHtml.replace(markdownFootnoteRegex, '');
          
          // Most aggressive approach: if we find a nicely formatted footnotes section,
          // look for any content that appears to be raw footnote references after the main content
          // and before the formatted footnotes section
          const formattedFootnotesIndex = processedHtml.indexOf('<div class="footnotes">');
          if (formattedFootnotesIndex > -1) {
            // Find the last main content paragraph (before any footnotes might start)
            // Look for a clear ending like "Now, quit reading" which is the last paragraph in this post
            const possibleEndMarkers = [
              'Now, quit reading',
              'In Conclusion',
              'To summarize',
              'In summary'
            ];
            
            // Try to find one of these markers
            let lastContentIndex = -1;
            for (const marker of possibleEndMarkers) {
              const idx = processedHtml.indexOf(marker);
              if (idx > -1 && idx < formattedFootnotesIndex) {
                // Find the end of this paragraph
                const paraEndIndex = processedHtml.indexOf('</p>', idx);
                if (paraEndIndex > -1 && paraEndIndex > lastContentIndex) {
                  lastContentIndex = paraEndIndex + 4; // +4 to include the </p> tag
                }
              }
            }
            
            // If we found a clear end to the main content
            if (lastContentIndex > -1) {
              // Remove everything between the last content paragraph and the formatted footnotes
              const cleanedHtml = 
                processedHtml.substring(0, lastContentIndex) + 
                processedHtml.substring(formattedFootnotesIndex);
                
              // Only use this if it doesn't remove too much content (safety check)
              if (formattedFootnotesIndex - lastContentIndex < 5000) { // if less than ~5KB was removed
                processedHtml = cleanedHtml;
              }
            }
          }
          
          setPost({
            slug,
            html: processedHtml,
            embedMatches: embedMatches.map(match => match[1]),
            calculatorMatches: calculatorMatches.length > 0,
            tweetEmbeds,
            youtubeEmbeds,
            vizEmbeds,
            attributes: mod.attributes,
            isDraft: matchingPath.includes('/drafts/')
          });
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
      }
    };

    loadBlogPost();
  }, [slug]);

  // Add copy functionality for code elements
  useEffect(() => {
    const handleCodeClick = async (e) => {
      if (e.target.tagName === 'CODE') {
        try {
          await navigator.clipboard.writeText(e.target.textContent);
          
          // Visual feedback
          const originalColor = e.target.style.backgroundColor;
          e.target.style.backgroundColor = '#3a3a3a';
          setTimeout(() => {
            e.target.style.backgroundColor = originalColor;
          }, 200);
        } catch (err) {
          console.error('Failed to copy text:', err);
        }
      }
    };

    document.addEventListener('click', handleCodeClick);
    return () => document.removeEventListener('click', handleCodeClick);
  }, []);

  // Handle walking calculator
  useEffect(() => {
    if (post && post.calculatorMatches) {
      // Render the calculator in the placeholder
      setTimeout(() => {
        const calculatorPlaceholders = document.querySelectorAll('[id^="walking-calculator-"]');
        calculatorPlaceholders.forEach(placeholder => {
          if (placeholder && !placeholder.hasChildNodes()) {
            // Create a div for React to render into
            const container = document.createElement('div');
            placeholder.appendChild(container);
            
            // Use ReactDOM to render the calculator
            import('react-dom/client').then(({ createRoot }) => {
              const root = createRoot(container);
              root.render(<WalkingCalculator />);
            }).catch(error => {
              console.error('Error rendering calculator:', error);
              placeholder.innerHTML = '<p>Error loading calculator.</p>';
            });
          }
        });
      }, 100);
    }
  }, [post]);

  // Handle tweet embeds
  useEffect(() => {
    if (!post || !post.tweetEmbeds || post.tweetEmbeds.length === 0) return;

    let isActive = true;

    const renderTweets = async () => {
      try {
        const { createRoot } = await import('react-dom/client');
        post.tweetEmbeds.forEach(({ id, url }, index) => {
          const placeholder = document.getElementById(`tweet-embed-${index}`);
          if (!placeholder || placeholder.childNodes.length > 0) return;

          const container = document.createElement('div');
          placeholder.appendChild(container);

          const root = createRoot(container);
          root.render(<TweetEmbed tweetId={id} tweetUrl={url} />);
        });
      } catch (error) {
        console.error('Error rendering tweet embed:', error);
      }
    };

    const timeout = setTimeout(() => {
      if (isActive) renderTweets();
    }, 100);

    return () => {
      isActive = false;
      clearTimeout(timeout);
    };
  }, [post]);

  // Handle visualization embeds
  useEffect(() => {
    if (!post || !post.vizEmbeds || post.vizEmbeds.length === 0) return;

    let isActive = true;

    const renderVisualizations = async () => {
      try {
        const { createRoot } = await import('react-dom/client');

        await Promise.all(
          post.vizEmbeds.map(async (slugValue, index) => {
            const placeholder = document.getElementById(`viz-embed-${index}`);
            if (!placeholder || placeholder.childNodes.length > 0) return;

            const container = document.createElement('div');
            container.className = 'viz-container';
            placeholder.appendChild(container);

            try {
              const VisualizationComponent = await loadVisualizationComponent(slugValue);

              if (!VisualizationComponent) {
                placeholder.innerHTML = `<p class="viz-error">Visualization "${slugValue}" not found.</p>`;
                return;
              }

              const root = createRoot(container);
              root.render(<VisualizationComponent />);
            } catch (error) {
              console.error('Error rendering visualization:', error);
              placeholder.innerHTML = '<p class="viz-error">Unable to load visualization.</p>';
            }
          })
        );
      } catch (error) {
        console.error('Error initializing visualizations:', error);
      }
    };

    const timeout = setTimeout(() => {
      if (isActive) renderVisualizations();
    }, 100);

    return () => {
      isActive = false;
      clearTimeout(timeout);
    };
  }, [post]);

  // Handle YouTube embeds
  useEffect(() => {
    if (!post || !post.youtubeEmbeds || post.youtubeEmbeds.length === 0) return;

    let isActive = true;

    const renderVideos = async () => {
      try {
        const { createRoot } = await import('react-dom/client');
        post.youtubeEmbeds.forEach(({ id, url }, index) => {
          const placeholder = document.getElementById(`youtube-embed-${index}`);
          if (!placeholder || placeholder.childNodes.length > 0) return;

          const container = document.createElement('div');
          placeholder.appendChild(container);

          const root = createRoot(container);
          root.render(<YouTubeEmbed videoId={id} videoUrl={url} />);
        });
      } catch (error) {
        console.error('Error rendering YouTube embed:', error);
      }
    };

    const timeout = setTimeout(() => {
      if (isActive) renderVideos();
    }, 100);

    return () => {
      isActive = false;
      clearTimeout(timeout);
    };
  }, [post]);

  // Handle embedded notes
  useEffect(() => {
    if (post && post.embedMatches && post.embedMatches.length > 0) {
      // Import the EmbeddedNote component lazily to avoid circular imports
      const renderEmbeddedNotes = async () => {
        // Wait a tick to ensure the DOM is fully rendered
        await new Promise(resolve => setTimeout(resolve, 0));
        
        post.embedMatches.forEach((noteSlug, index) => {
          const placeholder = document.getElementById(`embedded-note-${index}`);
          if (placeholder && placeholder.childNodes.length === 0) {
            // Create a container for the embedded note
            const container = document.createElement('div');
            container.className = 'embedded-note-container';
            placeholder.appendChild(container);
            
            try {
              // Create a self-contained element to avoid context issues
              container.innerHTML = `
                <div class="embedded-note">
                  <div class="embedded-note-header">
                    <h3>
                      <a href="/notes/${noteSlug}" class="embedded-note-title">Loading note...</a>
                    </h3>
                  </div>
                  <div class="embedded-note-content">
                    <p>Loading...</p>
                  </div>
                  <a href="/notes/${noteSlug}" class="embedded-note-link">
                    View full note →
                  </a>
                </div>
              `;
              
              // Now fetch the note data directly
              const fetchNote = async () => {
                try {
                  const noteModules = import.meta.glob('../content/notes/*.md');
                  const matchingPath = Object.keys(noteModules).find(path => 
                    path.split('/').pop().replace('.md', '') === noteSlug
                  );
                  
                  if (matchingPath) {
                    const mod = await noteModules[matchingPath]();
                    const titleElement = container.querySelector('.embedded-note-title');
                    const contentElement = container.querySelector('.embedded-note-content');
                    
                    if (titleElement) {
                      titleElement.textContent = mod.attributes.title || noteSlug;
                    }
                    
                    if (contentElement) {
                      // Process HTML to remove headings but keep links working
                      // Also extract just the first paragraph for a preview
                      let processedHtml = mod.html
                        .replace(/<h1[^>]*>.*?<\/h1>/gi, '') // Remove h1
                        // Keep external links functioning, but replace wiki links with spans
                        .replace(/\[\[(.*?)\]\]/g, '<span class="wiki-link">$1</span>');
                      
                      // Extract just the first paragraph for preview
                      const firstParagraphMatch = processedHtml.match(/<p>(.*?)<\/p>/s);
                      if (firstParagraphMatch) {
                        processedHtml = `<p>${firstParagraphMatch[1]}</p>`;
                      } else {
                        // If no paragraph found, limit to first ~150 characters
                        const textContent = processedHtml.replace(/<[^>]*>/g, '');
                        processedHtml = `<p>${textContent.substring(0, 150)}...</p>`;
                      }
                      
                      contentElement.innerHTML = processedHtml;
                      
                      // Add click handlers for wiki links
                      const wikiLinks = contentElement.querySelectorAll('.wiki-link');
                      wikiLinks.forEach(link => {
                        link.addEventListener('click', () => {
                          window.location.href = `/notes/${link.textContent.trim()}`;
                        });
                      });
                    }
                    
                    // Add the title to its container
                    if (titleElement && mod.attributes.title) {
                      const titleContainer = document.createElement('div');
                      titleContainer.className = 'title-container';
                      
                      // Move the title into the container
                      const headerElement = container.querySelector('.embedded-note-header');
                      const titleParent = titleElement.parentNode;
                      titleContainer.appendChild(titleElement);
                      titleParent.appendChild(titleContainer);
                      
                      // Add rating if available
                      if (mod.attributes.rating) {
                        const ratingElement = document.createElement('div');
                        ratingElement.className = 'rating';
                        ratingElement.textContent = `Rating: ${mod.attributes.rating}/5`;
                        titleContainer.appendChild(ratingElement);
                      }
                    }
                    
                    // Add tags if available
                    if (mod.attributes.tags && mod.attributes.tags.length > 0) {
                      const headerElement = container.querySelector('.embedded-note-header');
                      const tagsElement = document.createElement('div');
                      tagsElement.className = 'tags';
                      
                      mod.attributes.tags.forEach(tag => {
                        const tagLink = document.createElement('a');
                        tagLink.href = `/notes/tags/${tag}`;
                        tagLink.className = 'tag';
                        tagLink.textContent = `#${tag}`;
                        tagsElement.appendChild(tagLink);
                      });
                      
                      headerElement.appendChild(tagsElement);
                    }
                  }
                } catch (error) {
                  console.error('Error loading note:', error);
                  const contentElement = container.querySelector('.embedded-note-content');
                  if (contentElement) {
                    contentElement.innerHTML = '<p>Error loading note.</p>';
                  }
                }
              };
              
              fetchNote();
            } catch (error) {
              console.error('Error rendering embedded note:', error);
            }
          }
        });
      };
      
      renderEmbeddedNotes();
    }
  }, [post]);

  // Add IDs to headings and handle anchor links
  useEffect(() => {
    if (post) {
      const content = document.querySelector('.blog-content');
      if (!content) return;

      // First pass: collect all heading texts to handle duplicates
      const headingCounts = {};
      content.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        const baseId = heading.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        headingCounts[baseId] = (headingCounts[baseId] || 0) + 1;
      });

      // Second pass: assign IDs
      content.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        const baseId = heading.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        // If this is a duplicate heading, append a number
        if (headingCounts[baseId] > 1) {
          headingCounts[baseId]--;
          heading.id = `${baseId}-${headingCounts[baseId]}`;
        } else {
          heading.id = baseId;
        }
      });

      // Handle clicks on anchor links with special handling for footnotes
      const handleAnchorClick = (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.slice(1);
          // Try to find the target element
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            // Add visual highlighting effect for footnotes
            const isFootnote = targetId.startsWith('fn') || targetId.startsWith('fnref');
            if (isFootnote) {
              
              // Create highlight effect
              const originalBg = targetElement.style.backgroundColor;
              targetElement.style.backgroundColor = 'rgba(93, 139, 244, 0.2)';
              targetElement.style.transition = 'background-color 0.5s ease';
              
              // Reset after a delay
              setTimeout(() => {
                targetElement.style.backgroundColor = originalBg;
              }, 1500);
              
              // Scroll with offset for better positioning
              const offset = 80;
              const y = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
              
              window.scrollTo({
                top: y,
                behavior: 'smooth'
              });
            } else {
              // Standard anchor link behavior for non-footnotes
              targetElement.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Update URL without triggering another scroll
            window.history.pushState(null, '', href);
          } else {
            console.error(`Element with id "${targetId}" not found in the document`);
          }
        }
      };

      content.addEventListener('click', handleAnchorClick);
      return () => content.removeEventListener('click', handleAnchorClick);
    }
  }, [post]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="blog-container">
      <article className="blog-post" style={{ position: 'relative' }}>
        {post.isDraft && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#ff6b6b',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            Draft
          </div>
        )}
        <h1>{post.attributes.title}</h1>
        <div className="date-container">
          <div className="date">
            <span className="date-label">Published: </span>
            {new Date(post.attributes.date || post.attributes.created).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC'
            })}
          </div>
          {post.attributes.last_edited && (
            <div className="date modified">
              <span className="date-label">Last updated: </span>
              {new Date(post.attributes.last_edited).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC'
              })}
              {post.attributes.last_edited.includes(':') && (
                <span className="time">
                  {" at "}
                  {new Date(post.attributes.last_edited).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'UTC'
                  })}
                </span>
              )}
            </div>
          )}
        </div>
        {post.attributes.description && (
          <p className="description">{post.attributes.description}</p>
        )}
        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
      <Newsletter />
    </div>
  );
}

export default BlogPost;
