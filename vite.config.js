import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Port chạy frontend
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Proxy API request sang backend
        changeOrigin: true,
      },
    },
  },
});