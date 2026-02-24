import type { LoginRequest } from '@/types/request'
import type { LoginResponse } from '@/types/response'
import apiClient from './index'

/**
 * 用户登录
 * @param data 登录请求数据
 * @returns 登录响应数据（已处理 BaseResponse，直接返回 data）
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/login', data)
  // 响应拦截器已经处理了 BaseResponse，直接返回 data
  return response.data
}

/**
 * 用户退出登录
 * @returns 退出登录响应数据（已处理 BaseResponse）
 */
export const logout = async (): Promise<void> => {
  await apiClient.get<null>('/logout')
  // 响应拦截器已经处理了错误情况，成功时不需要返回值
}
