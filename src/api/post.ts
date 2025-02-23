import request from '@/utils/request'
import type { Post, PostParams } from '@/types/post'

export const getPosts = () => request.get('/api/posts')
export const createPost = (data: PostParams) => request.post('/api/posts', data)
export const updatePost = (id: number, data: PostParams) => request.put(`/api/posts/${id}`, data)
export const deletePost = (id: number) => request.delete(`/api/posts/${id}`)

// 导出类型给其他组件使用
export type { Post }
