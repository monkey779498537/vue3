import request from '@/utils/request'
import type { Post } from '@/types/post'

export const getPosts = () => request.get('/api/posts')
export const createPost = (data: any) => request.post('/api/posts', data)
export const updatePost = (id: number, data: any) => request.put(`/api/posts/${id}`, data)
export const deletePost = (id: number) => request.delete(`/api/posts/${id}`)

// 导出类型给其他组件使用
export type { Post }