// eslint.config.js

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
