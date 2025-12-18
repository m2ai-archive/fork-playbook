import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      // Proxy n8n webhook requests to avoid CORS issues in development
      '/api/ai-coach': {
        target: 'https://fiyasolutions.app.n8n.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai-coach/, '/webhook/32fad67f-4be9-4670-8abc-d5028304fcd5'),
        secure: true,
      }
    }
  },
  preview: {
    allowedHosts: ['3000-ipxioi0x16zdyte00malr-d0b9e1e2.sandbox.novita.ai']
  },
  build: {
    outDir: 'dist'
  }
})