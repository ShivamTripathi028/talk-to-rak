// talk-to-rak/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Import the 'path' module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Define the '@' alias to point to the 'src' directory
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Optional: Keep server config if needed
  // server: {
  //   port: 5173, // Or your preferred port
  // },
})