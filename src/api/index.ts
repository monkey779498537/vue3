import { login } from './auth'
// 导出 post中的所有方法
import * as post from './post'

// index只给一个出口
// 注意 这里是 默认导出 所以这里使用的时候不能直接解构
export default {
    login,
    ...post
}