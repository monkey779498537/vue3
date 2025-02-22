import { login } from './auth'
// 导出 post中的所有方法
import * as post from './post'

// index只给一个出口
export default {
    login,
    ...post
}