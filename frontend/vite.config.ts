import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 4000,
    proxy: {
      '/api': "http://server:5000/"
    }
  },
  assetsInclude: "**/*.glb"
})
