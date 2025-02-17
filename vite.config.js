import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import markdown from 'vite-plugin-markdown'
import anchor from 'markdown-it-anchor'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    markdown.plugin({
      mode: ['html', 'toc', 'frontmatter'],
      markdownIt: {
        html: true,
        linkify: true,
        typographer: true,
        breaks: true,
        use: [[anchor, {
          permalink: false,
          slugify: s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          tabIndex: false
        }]]
      }
    })
  ],
  server: {
    proxy: {
      '/api/subscribers': {
        target: 'https://camouflaged-axolotl.pikapod.net',
        changeOrigin: true,
        secure: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    }
  }
})
