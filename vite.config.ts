import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 使用 path.resolve 方法将 @ 映射到项目的 src 目录。
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/reqres': {
        target: 'https://reqres.in/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/reqres/, '')
      }
    }
  }
})
