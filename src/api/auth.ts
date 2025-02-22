import request from '@/utils/request'

export const login = (data: { email: string; password: string }) => request.post('/reqres/login', data)