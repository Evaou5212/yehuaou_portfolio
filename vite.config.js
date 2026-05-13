import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  root: '.',
  server: {
    port: 8080,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        games: resolve(__dirname, 'games.html'),
        about: resolve(__dirname, 'about.html'),
        digitalArt: resolve(__dirname, 'digital-art.html'),
        uiux: resolve(__dirname, 'uiux.html'),
      },
    },
  },
})
