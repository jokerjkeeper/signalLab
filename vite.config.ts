import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5179,
    strictPort: true, // 端口被占用時直接報錯，不自動跳號
  },
});
