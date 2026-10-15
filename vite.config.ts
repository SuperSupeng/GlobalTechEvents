import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { eventShell404Plugin } from './scripts/vite-event-404.mjs'

export default defineConfig({
  plugins: [react(), eventShell404Plugin()],
  envPrefix: ['VITE_', 'GA_', 'GOOGLE_'],
})
