import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const markdownPackages = [
  '/node_modules/react-markdown/',
  '/node_modules/hast-',
  '/node_modules/mdast-',
  '/node_modules/micromark',
  '/node_modules/property-information/',
  '/node_modules/remark-',
  '/node_modules/rehype-',
  '/node_modules/unified/',
  '/node_modules/vfile/',
  '/node_modules/comma-separated-tokens/',
  '/node_modules/space-separated-tokens/',
  '/node_modules/highlight.js/',
  '/node_modules/prismjs/',
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (markdownPackages.some((pkg) => id.includes(pkg))) {
            return 'markdown'
          }
        },
      },
    },
  },
})
