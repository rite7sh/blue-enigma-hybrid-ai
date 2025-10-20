import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Vite configuration for Blue Enigma Frontend
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    devSourcemap: true, // helpful for debugging Tailwind styles
  },
  server: {
    port: 5173, // optional, define frontend port
    open: true, // auto-open browser on dev start
  },
})
