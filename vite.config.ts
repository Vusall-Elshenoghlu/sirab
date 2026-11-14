import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' — build istənilən qovluqdan / hostinqdən işləsin deyə
export default defineConfig({
  base: './',
  plugins: [react()],
})
