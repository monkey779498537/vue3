import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

// 自定义 Axios 返回类型：拦截器处理后直接返回数据 T，而非 AxiosResponse<T>
interface CustomAxiosInstance extends AxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  // 其他方法同理（post、put 等）
}

const service: CustomAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
}) as CustomAxiosInstance // 类型断言是关键！

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