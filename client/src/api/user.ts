import type { PageResponse } from '@/types'
import type { User } from '@/types/response'
import type {
  ChangePasswordRequest,
  GetUserListPageRequest,
  CreateUserRequest,
  UpdateUserRequest,
  BatchDeleteUserRequest,
} from '@/types/request'
import apiClient from './index'

/**
 * 获取当前用户信息
 * @returns 当前用户信息（已处理 BaseResponse，直接返回 data）
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/user/current')
  return response.data
}

/**
 * 根据ID获取用户
 * @param id 用户ID
 * @returns 用户信息（已处理 BaseResponse，直接返回 data）
 */
export const getUserById = async (id: string): Promise<User> => {
  const response = await apiClient.get<User>('/user', { params: { id } })
  return response.data
}

/**
 * 分页获取用户列表
 * @param data 分页请求数据
 * @returns 用户列表（已处理 BaseResponse，直接返回 data）
 */
export const getUserListPage = async (
  data: GetUserListPageRequest
): Promise<PageResponse<User>> => {
  const response = await apiClient.post<PageResponse<User>>('/user/list/page', data)
  return response.data
}

/**
 * 创建用户
 * @param data 用户数据
 * @returns 创建结果（已处理 BaseResponse）
 */
export const createUser = async (data: CreateUserRequest): Promise<void> => {
  await apiClient.post<null>('/user', data)
}

/**
 * 更新用户
 * @param data 用户数据
 * @returns 更新结果（已处理 BaseResponse）
 */
export const updateUser = async (data: UpdateUserRequest): Promise<void> => {
  await apiClient.put<null>('/user', data)
}

/**
 * 删除用户
 * @param id 用户ID
 * @returns 删除结果（已处理 BaseResponse）
 */
export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete<null>('/user', { params: { id } })
}

/**
 * 批量删除用户
 * @param data 用户ID列表
 * @returns 删除结果（已处理 BaseResponse，直接返回 data）
 */
export const batchDeleteUser = async (
  data: BatchDeleteUserRequest
): Promise<number> => {
  const response = await apiClient.delete<number>('/user/batch', { data })
  return response.data
}

/**
 * 修改密码
 * @param data 密码数据
 * @returns 修改结果（已处理 BaseResponse）
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  await apiClient.put<null>('/user/password', data)
}
