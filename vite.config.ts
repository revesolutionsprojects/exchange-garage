import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base + hash routing lets the build run from any static host or sub-folder.
  base: './',
  plugins: [react(), tailwindcss()],
})
