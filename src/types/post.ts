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
