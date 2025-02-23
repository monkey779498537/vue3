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
