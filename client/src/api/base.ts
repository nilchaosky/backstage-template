import type { LoginRequest } from '@/types/request'
import type { BaseResponse } from '@/types/index'
import type { LoginResponse } from '@/types/response'
import apiClient from './index'

/**
 * 用户登录
 * @param data 登录请求数据
 * @returns 登录响应数据
 */
export const login = async (data: LoginRequest): Promise<BaseResponse<LoginResponse>> => {
  const response = await apiClient.post<BaseResponse<LoginResponse>>('/login', data)
  return response.data
}

/**
 * 用户退出登录
 * @returns 退出登录响应数据
 */
export const logout = async (): Promise<BaseResponse<null>> => {
  const response = await apiClient.get<BaseResponse<null>>('/logout')
  return response.data
}
