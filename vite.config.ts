import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import checker from 'vite-plugin-checker'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        checker({
            // 如果是配置 tsconfig.app.json 需要手动指定
            // 显式启用 Vue 类型检查
            vueTsc: {
                tsconfigPath: './tsconfig.app.json' // 显式指定配置
            }
        })
    ],
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
                rewrite: path => path.replace(/^\/api/, '')
            },
            '/reqres': {
                target: 'https://reqres.in/api',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/reqres/, '')
            }
        }
    }
})
