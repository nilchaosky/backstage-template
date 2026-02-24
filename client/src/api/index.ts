import axios from 'axios'
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'
import type { BaseResponse } from '@/types/index'
import { useAuthStore } from '@/store/authStore'

// API 基础 URL
const API_BASE_URL = `${import.meta.env['VITE_API_BASE_URL'] ?? 'http://localhost:8080'}/v1`

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从状态管理获取 token 并添加到请求头
    const { token } = useAuthStore.getState()
    if (token !== null && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, status } = response
    
    // 处理 400 状态码的参数校验错误（服务器返回纯文本）
    if (status === 400 && typeof data === 'string') {
      message.error(data)
      return Promise.reject(new Error(data))
    }
    
    // 处理 JSON 响应
    if (typeof data === 'object' && data !== null && 'code' in data) {
      const responseData = data as BaseResponse
      
      // 检查业务状态码（0 或 200 表示成功）
      if (responseData.code === 0 || responseData.code === 200) {
        // 直接返回 data 部分，替换 response.data
        return { ...response, data: responseData.data }
      }
      
      // 业务错误，显示错误信息并抛出
      const errorMessage = responseData.message ?? '请求失败'
      message.error(errorMessage)
      return Promise.reject(new Error(errorMessage))
    }
    
    // 其他类型的响应直接返回
    return response
  },
  (error: AxiosError) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { status, data } = error.response
      
      // 401 未授权，清除 token 并跳转登录页
      if (status === 401) {
        useAuthStore.getState().clearToken()
        const errorMessage = typeof data === 'string' ? data : '登录已过期，请重新登录'
       
        // 避免重复跳转
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
          message.error(errorMessage)
        }
        return Promise.reject(new Error(errorMessage))
      }
      
      // 400 参数校验错误（可能是纯文本）
      if (status === 400) {
        const errorMessage = typeof data === 'string' ? data : (data as BaseResponse).message ?? '参数错误'
        message.error(errorMessage)
        return Promise.reject(new Error(errorMessage))
      }
      
      // 其他 HTTP 错误
      const errorData = data as BaseResponse | string
      const errorMessage = typeof errorData === 'string' 
        ? errorData 
        : (errorData as BaseResponse).message ?? `请求失败: ${status}`
      message.error(errorMessage)
      return Promise.reject(new Error(errorMessage))
    }
    
    // 网络错误或其他错误
    if (error.request) {
      message.error('网络错误，请检查网络连接')
      return Promise.reject(new Error('网络错误'))
    }
    
    // 请求配置错误
    if (error.message) {
      message.error(error.message)
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
