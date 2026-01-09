import type { BaseResponse } from '@/types/index'
import type { User } from '@/types/response'
import type { ChangePasswordRequest } from '@/types/request'
import apiClient from './index'

/**
 * 获取当前用户信息
 * @returns 当前用户信息
 */
export const getCurrentUser = async (): Promise<BaseResponse<User>> => {
  const response = await apiClient.get<BaseResponse<User>>('/user/current')
  return response.data
}

/**
 * 修改密码
 * @param data 密码数据
 * @returns 修改结果
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<BaseResponse<null>> => {
  const response = await apiClient.put<BaseResponse<null>>('/user/password', data)
  return response.data
}
