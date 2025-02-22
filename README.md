
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

#### 安装辅助依赖
- 引入path模块时的type依赖，否则在编译打包时，TS检测识别不了path相关内容
- 当你需要 import path from 'path' 时需要处理
- 原因
  - 通常是因为path是 Node.js 内置模块，而 Vite 默认运行在浏览器环境中，TypeScript 可能无法识别path模块的类型
```js
npm install --save-dev @types/node
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
- 额外注意：
1. 配置了TS模块，需要对TS也做别名配置，vite.config.ts 不对TS生效
2. 当有tsconfig.app.json 和 tsconfig.json文件时，需要设置到 tsconfig.app.json文件中
```js
// tsconfig.app.json
{
  compilerOptions: {
    // 核心代码
    "baseUrl": ".",  // 设置根目录为基准路径，所有路径解析的起点
    "paths": {       // 定义路径映射规则
      "@/*": [       // 当检测到以 @/ 开头的路径时
        "./src/*"    // 映射到项目根目录下的 src 目录
      ]
    }
  }
}
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
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

// 自定义 Axios 返回类型：拦截器处理后直接返回数据 T，而非 AxiosResponse<T>
interface CustomAxiosInstance extends AxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  // 其他方法同理（post、put 等）
}

const service: CustomAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
}) as CustomAxiosInstance // 类型断言是关键！

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
    } else if (error.response?.status === 400) {
      ElMessage({
        showClose: true,
        message: error.response?.data?.error,
        type: 'error',
      })
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
import type { Post } from '@/types/post'

export const getPosts = () => request.get('/api/posts')
export const createPost = (data: any) => request.post('/api/posts', data)
export const updatePost = (id: number, data: any) => request.put(`/api/posts/${id}`, data)
export const deletePost = (id: number) => request.delete(`/api/posts/${id}`)

// 导出类型给其他组件使用
export type { Post }
```
- src/types/post.ts 根据接口返回，定义TS接口类型
```js
// 定义文章数据结构（根据 JSONPlaceholder 返回的实际数据结构）
export interface Post {
    id: number
    userId: number
    title: string
    body: string
}
```
- src/api/index.ts 统一暴露出去给业务方使用，以便统一管理
```js
import { login } from './auth'
// 导出 post中的所有方法
import * as post from './post'

// 当使用通配符导入并导出为对象时，类型不会被自动包含进去，因为类型在编译后会被擦除，所以需要显式导出类型。
export type { Post } from './post'

// index只给一个出口
// 注意 这里是 默认导出 所以这里使用的时候不能直接解构
export default {
    login,
    ...post
}
```

#### 全局状态管理 Pinia
```js
// src/stores/user.ts
import { defineStore } from 'pinia'
import api from '@/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || ''
  }),
  actions: {
    async loginUser(credentials: { email: string; password: string }) {
      const { token } = await api.login(credentials)
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

#### 业务代码
- 登陆页处理 src/components/LoginView.vue
```js
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();
const form = ref({
  email: "eve.holt@reqres.in",
  password: "cityslicka",
});

const handleLogin = async () => {
  await userStore.loginUser(form.value);
  router.push("/posts");
};
</script>

<template>
  <div class="login-container">
    <h2>用户登录</h2>
    <el-input v-model="form.email" placeholder="请输入邮箱" />
    <el-input
      v-model="form.password"
      type="password"
      placeholder="请输入密码"
      style="margin: 20px 0"
    />
    <el-button type="primary" @click="handleLogin">立即登录</el-button>
    <p class="tip">使用测试账号直接登录</p>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.tip {
  color: #666;
  font-size: 12px;
  margin-top: 15px;
}
</style>
```

- 详情页 src/components/PostListView.vue
```js
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import PostForm from '@/components/PostForm.vue'
import api, { type Post } from '@/api'

const posts = ref<Post[]>([])
const loading = ref(false)
const showDialog = ref(false)
const currentPost = ref<Post | null>(null)

// 加载数据
const loadData = async () => {
  loading.value = true
  posts.value = await api.getPosts()
  loading.value = false
}

// 删除确认
const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确认删除该文章吗？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await api.deletePost(id)
  posts.value = posts.value.filter(post => post.id !== id)
}

// 打开编辑对话框
const openEdit = (post: Post) => {
  currentPost.value = post
  showDialog.value = true
}

onMounted(loadData)
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>文章列表</h1>
      <el-button type="primary" @click="showDialog = true">新增文章</el-button>
    </div>

    <el-table :data="posts.slice(0,10)" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" width="180" show-overflow-tooltip/>
      <el-table-column prop="body" label="内容" width="180" show-overflow-tooltip/>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-button 
            size="small" 
            type="danger"
            @click="handleDelete(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showDialog" :title="currentPost ? '编辑文章' : '新建文章'">
      <PostForm 
        :edit-data="currentPost" 
        @submit="() => {
          loadData()
          showDialog = false
          currentPost = null
        }"
      />
    </el-dialog>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
```

- 编辑组件弹层 src/components/PostForm.vue
```js
<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const props = defineProps<{
  editData?: {
    id: number
    title: string
    body: string
  } | null
}>()

const emit = defineEmits(['submit'])

const form = ref({
  title: '',
  body: ''
})

watch(() => props.editData, (newVal) => {
  if (newVal) {
    form.value = { title: newVal.title, body: newVal.body }
  } else {
    form.value = { title: '', body: '' }
  }
})

const handleSubmit = async () => {
  try {
    if (props.editData) {
      await api.updatePost(props.editData.id, form.value)
      ElMessage.success('修改成功')
    } else {
      await api.createPost(form.value)
      ElMessage.success('创建成功')
    }
    emit('submit')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}
</script>

<template>
  <el-form :model="form" label-width="80px">
    <el-form-item label="标题">
      <el-input v-model="form.title" />
    </el-form-item>
    <el-form-item label="内容">
      <el-input v-model="form.body" type="textarea" rows="4" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">
        {{ editData ? '保存修改' : '立即创建' }}
      </el-button>
    </el-form-item>
  </el-form>
</template>
```