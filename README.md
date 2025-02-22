
#### 创建vite脚手架
```js
npm create vite@latest
```

#### 初始化
```js
npm i
```

#### 安装核心依赖
```js
npm install vue-router@4 pinia axios
npm install element-plus @element-plus/icons-vue
npm install eslint prettier eslint-plugin-vue -D
```

#### 挂载组件
- `src/main.ts`: 下载好的组件需要挂载到vue实例上进行使用
```js
import { createApp } from 'vue'
import './style.css';
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// 创建 Pinia 实例
const pinia = createPinia();

createApp(App) // 创建vue实例
    .use(router) // 挂载路由
    .use(pinia)
    .use(ElementPlus)
    .mount('#app') // 渲染到根节点
```


#### 设计目录结构
```js
src/
├─ api/          // 接口封装
├─ assets/       // 静态资源
├─ components/   // 公共组件
├─ router/       // 路由配置
├─ stores/       // Pinia store
├─ views/        // 页面组件
├─ utils/        // 工具函数
├─ types/        // TS类型定义 如果是vue3 并使用TS时
└─ App.vue
main.ts
```


#### 配置路径别名：@
- vue3已经支持路径别名，无需额外安装
```js
// 修改文件 vite.config
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});
```

#### 配置代理
- 使用网上的公开免费api做测试练手
- 登录认证接口
    - 推荐使用 Reqres.in（专门用于测试的伪服务端）：
    - 登录接口：POST https://reqres.in/api/login
    - 请求参数：{ "email": "eve.holt@reqres.in", "password": "cityslicka" }
    - 返回 token：{ "token": "QpwL5tke4Pnpja7X4" }
- 增删改查接口
    - 推荐使用 JSONPlaceholder（经典伪 REST API）：
    - 获取列表：GET https://jsonplaceholder.typicode.com/posts
    - 新增数据：POST https://jsonplaceholder.typicode.com/posts
    - 修改数据：PUT https://jsonplaceholder.typicode.com/posts/1
    - 删除数据：DELETE https://jsonplaceholder.typicode.com/posts/1
```js
// 修改文件 vite.config
import { defineConfig } from 'vite'

export default defineConfig({
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
```

#### Axios封装
```js
// utils/request.ts
import axios from 'axios'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

// 请求拦截
service.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截
service.interceptors.response.use(
  response => response.data,
  error => {
    // 错误处理增强
    if (error.response?.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default service
```

#### 封装API请求
- src/api/auth.ts
```js
import request from '@/utils/request'

export const login = (data: { email: string; password: string }) => request.post('/reqres/login', data)
```
- src/api/post.ts
```js
import request from '@/utils/request'

export const getPosts = () => request.get('/api/posts')
export const createPost = (data: any) => request.post('/api/posts', data)
export const updatePost = (id: number, data: any) => request.put(`/api/posts/${id}`, data)
export const deletePost = (id: number) => request.delete(`/api/posts/${id}`)
```
- 最后通过src/api/index.ts统一暴露出去给业务方使用，以便统一管理
```js
import { login } from './auth'
// 导出 post中的所有方法
import * as post from './post'

// index只给一个出口
export default {
    login,
    ...post
}
```

#### 全局状态管理 Pinia
```js
// src/stores/user.ts
import { defineStore } from 'pinia'
import { login } from '@/api/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || ''
  }),
  actions: {
    async loginUser(credentials: { email: string; password: string }) {
      const { token } = await login(credentials)
      this.token = token
      localStorage.setItem('token', token)
    },
    logout() {
      this.token = ''
      localStorage.removeItem('token')
    }
  }
})
```

#### 路由配置
-- 设置路由 src/router/index.ts
```js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/posts'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/posts',
    name: 'PostList',
    component: () => import('@/views/PostListView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const isAuthenticated = localStorage.getItem('token')
  if (to.name !== 'Login' && !isAuthenticated) {
    return { name: 'Login' }
  }
})

export default router
```

- 设置路由出口 src/App.vue
```js
<script setup lang="ts">
</script>

<template>
  <router-view />
</template>
```
