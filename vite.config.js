import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import markdown from 'vite-plugin-markdown'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    markdown.plugin({
      mode: ['html', 'toc', 'frontmatter']
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
