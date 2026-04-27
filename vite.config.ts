import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    target: 'esnext',          // ← fixes top-level await error
    rollupOptions: {
      output: {
        manualChunks: {
          react:    ['react', 'react-dom'],
          router:   ['react-router-dom'],
        }
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'         // ← also needed for dev server
    }
  }
})
