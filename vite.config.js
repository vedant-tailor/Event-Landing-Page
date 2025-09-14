import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true, // opens browser when running
  },
  build: {
    outDir: 'dist', // output directory
    sourcemap: true, // generate source maps for easier debugging
  }
})
