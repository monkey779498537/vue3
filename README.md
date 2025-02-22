
创建vite脚手架
npm create vite@latest

初始化
npm i

安装核心依赖
npm install vue-router@4 pinia axios
npm install element-plus @element-plus/icons-vue
npm install eslint prettier eslint-plugin-vue -D

设计目录结构
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