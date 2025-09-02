import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const LOCAL_IP = '192.168.1.6';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: LOCAL_IP,
    port: 3001,
    open: true,
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
  },
});
