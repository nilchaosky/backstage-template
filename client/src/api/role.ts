import type { PageResponse } from '@/types'
import type { Role } from '@/types/response'
import type {
  GetRoleListPageRequest,
  CreateRoleRequest,
  BatchDeleteRoleRequest,
  GetRoleSelectPageRequest,
} from '@/types/request'
import apiClient from './index'

/**
 * 根据ID获取角色
 * @param id 角色ID
 * @returns 角色信息（已处理 BaseResponse，直接返回 data）
 */
export const getRoleById = async (id: string): Promise<Role> => {
  const response = await apiClient.get<Role>('/role', { params: { id } })
  return response.data
}

/**
 * 分页获取角色列表
 * @param data 分页请求数据
 * @returns 角色列表（已处理 BaseResponse，直接返回 data）
 */
export const getRoleListPage = async (
  data: GetRoleListPageRequest
): Promise<PageResponse<Role>> => {
  const response = await apiClient.post<PageResponse<Role>>('/role/list/page', data)
  return response.data
}

/**
 * 分页获取角色选择器列表
 * @param data 分页请求数据
 * @returns 角色列表（已处理 BaseResponse，直接返回 data）
 */
export const getRoleSelectPage = async (
  data: GetRoleSelectPageRequest
): Promise<PageResponse<Role>> => {
  const response = await apiClient.post<PageResponse<Role>>('/role/select/page', data)
  return response.data
}

/**
 * 创建角色
 * @param data 角色数据
 * @returns 创建结果（已处理 BaseResponse）
 */
export const createRole = async (data: CreateRoleRequest): Promise<void> => {
  await apiClient.post<null>('/role', data)
}

/**
 * 删除角色
 * @param id 角色ID
 * @returns 删除结果（已处理 BaseResponse）
 */
export const deleteRole = async (id: string): Promise<void> => {
  await apiClient.delete<null>('/role', { params: { id } })
}

/**
 * 批量删除角色
 * @param data 角色ID列表
 * @returns 删除结果（已处理 BaseResponse，直接返回 data）
 */
export const batchDeleteRole = async (
  data: BatchDeleteRoleRequest
): Promise<number> => {
  const response = await apiClient.delete<number>('/role/batch', { data })
  return response.data
}
