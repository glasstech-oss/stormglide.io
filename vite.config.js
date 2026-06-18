import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion'))   return 'vendor-motion'
          if (id.includes('node_modules/lucide-react'))    return 'vendor-lucide'
          if (id.includes('node_modules/react-helmet'))    return 'vendor-helmet'
          if (id.includes('node_modules/react-router'))    return 'vendor-router'
          if (id.includes('node_modules/react-dom'))       return 'vendor-react-dom'
          if (id.includes('node_modules/react/'))          return 'vendor-react'
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
