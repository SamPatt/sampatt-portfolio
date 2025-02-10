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
  ]
})
