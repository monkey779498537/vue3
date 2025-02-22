import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

// 请求拦截
service.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截
service.interceptors.response.use(
  response => response.data,
  error => {
    // 错误处理增强
    if (error.response?.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
    } else if (error.response?.status === 400) {
      ElMessage({
        showClose: true,
        message: error.response?.data?.error,
        type: 'error',
      })
    }
    return Promise.reject(error)
  }
)

export default service