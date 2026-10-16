import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { eventShell404Plugin } from './scripts/vite-event-404.mjs'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), eventShell404Plugin()],
  envPrefix: ['VITE_', 'GA_', 'GOOGLE_'],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(root, 'index.html'),
        privacy: path.resolve(root, 'privacy/index.html'),
        terms: path.resolve(root, 'terms/index.html'),
        resources: path.resolve(root, 'resources/index.html'),
      },
    },
  },
})
