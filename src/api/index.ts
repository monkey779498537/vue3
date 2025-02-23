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
