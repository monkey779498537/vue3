import request from '@/utils/request'
import type { LoginParams, LoginResponse } from '@/types/auth'

export const login = (data: LoginParams) => request.post<LoginResponse>('/reqres/login', data)
