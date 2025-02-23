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

#### 代码风格规范

- ESLint + Prettier：代码风格检查

    - eslint-plugin-vue用于Vue的规则
    - eslint-config-prettier来避免冲突
    - eslint-plugin-prettier
    - @typescript-eslint的解析器，用了TypeScript的话

    ```js
    // 前面已经安装
    npm install eslint prettier -D
    npm install -D eslint-plugin-vue eslint-config-prettier eslint-plugin-prettier
    npm install -D @typescript-eslint/parser typescript-eslint/eslint-plugin
    npm install -D globals
    ```

    - 配置文件
        - 需要注意，如果安装的是eslint9+版本，不能使用.eslintrc.cjs进行配置，必须改成eslint.config.js，否则lint的时候报错
            - 处理以上版本问题，要么降低版本保留原配置.eslintrc.cjs，要么迁移eslint.config.js

    ```js
    // 新增 ..prettierrc 文件在根目录
    {
        // 注释记得去掉，这是JSON格式文件，不支持添加注释
        "semi": false,          // 语句结尾不加分号
        "singleQuote": true,    // 使用单引号代替双引号
        "tabWidth": 4,          // 缩进空格数
        "trailingComma": "none",// 对象/数组最后一项不加逗号
        "printWidth": 100,      // 每行代码最大长度 (超过自动换行)
        "arrowParens": "avoid", // 箭头函数单参数时省略括号 (如 x => x)
        "htmlWhitespaceSensitivity": "ignore", // 解决 Vue 模板格式化空格问题
        "endOfLine": "auto"     // 自动识别操作系统换行符 (LF/CRLF)
    }

    // 新增 eslint.config.js 文件在根目录
    // 导入必要模块
    import globals from 'globals' // 提供全局变量检测（如 browser/node 环境变量）
    import vueParser from 'vue-eslint-parser' // Vue 文件解析器
    import tsParser from '@typescript-eslint/parser' // TS 解析器
    import tsPlugin from '@typescript-eslint/eslint-plugin' // TS 规则插件
    import vuePlugin from 'eslint-plugin-vue' // Vue 规则插件
    import prettierConfig from 'eslint-config-prettier' // 关闭与 Prettier 冲突的规则

    export default [
        // ---------------------- Vue 文件配置 ----------------------
        {
            files: ['**/*.vue'], // 仅处理 .vue 文件
            languageOptions: {
                parser: vueParser, // 使用 Vue 专用解析器
                parserOptions: {
                    parser: tsParser, // 在 Vue 的 <script> 中使用 TS 解析器
                    ecmaVersion: 'latest', // 使用最新 ECMAScript 标准
                    sourceType: 'module', // 使用 ES 模块语法
                    extraFileExtensions: ['.vue'] // 识别 Vue 文件扩展名
                },
                globals: {
                    ...globals.browser, // 注入浏览器环境全局变量 (如 document)
                    ...globals.node // 注入 Node.js 环境变量 (如 process)
                }
            },
            plugins: {
                vue: vuePlugin // 启用 Vue 插件
            },
            rules: {
                ...vuePlugin.configs['vue3-recommended'].rules, // 继承 Vue3 推荐规则
                'vue/html-indent': ['error', 4], // 自定义：HTML 缩进 4 空格
                'vue/singleline-html-element-content-newline': 'off', // 关闭单行元素换行要求
                'vue/multi-word-component-names': 'off' // 允许单单词组件名
            }
        },

        // ---------------------- TS/JS 通用配置 ----------------------
        {
            files: ['**/*.{ts,js}'], // 处理所有 TS/JS 文件
            languageOptions: {
                parser: tsParser, // 使用 TS 解析器（兼容 JS）
                parserOptions: {
                    ecmaVersion: 'latest',
                    sourceType: 'module',
                    project: './tsconfig.eslint.json' // 关联项目 TS 配置（重要！）
                }
            },
            plugins: {
                '@typescript-eslint': tsPlugin // 启用 TS 规则插件
            },
            rules: {
                ...tsPlugin.configs['recommended'].rules, // 继承 TS 推荐规则
                'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off' // 生产环境禁用 console
            }
        },
        // 配置文件专用规则
        {
            files: ['**/*.config.{ts,js}'],
            rules: {
                '@typescript-eslint/no-explicit-any': 'off',
                'no-console': 'off'
            }
        },
        // ---------------------- Prettier 集成配置 ----------------------
        {
            files: ['**/*.{vue,ts,js}'], // 所有文件类型
            ...prettierConfig // 覆盖所有与 Prettier 冲突的规则
        }
    ]

    // 新增 tsconfig.eslint.json
    {
        "extends": "./tsconfig.json",
        "include": [
            "src/**/*.ts", // 包含所有 TS 文件
            "src/**/*.vue", // 包含所有 Vue 文件
            "types/**/*.d.ts", // 包含类型声明文件
            "*.config.ts", // 根目录配置文件
            "*.config.js" // 根目录配置文件
        ],
        "compilerOptions": {
            "noEmit": true, // 禁用编译输出（仅用于类型检查）
            "types": ["vite/client"]
        }
    }

    // 修改 package.json
    "scripts": {
        "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix",
        "format": "prettier --write ."
    },
    ```

- Husky + lint-staged：Git 提交校验

#### 挂载组件

- `src/main.ts`: 下载好的组件需要挂载到vue实例上进行使用

```js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 创建 Pinia 实例
const pinia = createPinia()

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
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
})
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
```

#### plugin插件安装

- `vite-plugin-checker`

    - 专门为 Vite 设计的插件，能在开发阶段实时检查 TypeScript 错误
    - 原因：
        - Vite默认使用esbuild来转换TypeScript，但这只是在编译时进行转译，并不会进行类型检查。
        - 默认情况下，Vite在开发服务器（dev）运行时，并不会执行TypeScript的类型检查
        - build时可能会使用tsc来进行类型检查

    ```js
    // 安装插件
    npm install vite-plugin-checker --save-dev

    // vite.config.ts 配置插件
    import checker from 'vite-plugin-checker'
    export default defineConfig({
      plugins: [
        vue(),
        checker({
          // 如果是配置 tsconfig.app.json 需要手动指定
          // 显式启用 Vue 类型检查
          vueTsc: {
              tsconfigPath: "./tsconfig.app.json", // 显式指定配置
          },
        }),
      ],
    })

    // tsconfig.app.json
    {
      "compilerOptions": {
          "strict": true,
          "isolatedModules": true // 必须启用，避免 Vite 的 esbuild 问题
      },
      "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
    }
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
  // POST
  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T>

  // PUT
  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T>

  // DELETE
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
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
import type { LoginParams, LoginResponse } from '@/types/auth'

export const login = (data: LoginParams) => request.post<LoginResponse>('/reqres/login', data)
```

- src/types/auth.ts 根据接口返回，定义TS接口类型

```js
// 定义类型
export interface LoginParams {
    email: string
    password: string
}

export interface LoginResponse {
    token: string
}
```

- src/api/post.ts

```js
import request from '@/utils/request'
import type { Post, PostParams } from '@/types/post'

export const getPosts = () => request.get('/api/posts')
export const createPost = (data: PostParams) => request.post('/api/posts', data)
export const updatePost = (id: number, data: PostParams) => request.put(`/api/posts/${id}`, data)
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

export interface PostParams {
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

router.beforeEach(to => {
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
