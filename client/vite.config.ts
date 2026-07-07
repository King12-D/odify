import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: { proxy: { '/search': 'http://localhost:8000', '/search-places': 'http://localhost:8000', '/download': 'http://localhost:8000' } },
})
