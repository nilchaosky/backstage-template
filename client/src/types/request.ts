export interface LoginRequest {
  username: string
  password: string
}

export interface ChangePasswordRequest {
  old_password: string
  new_password: string
}

export interface GetUserListPageRequest {
  current: number
  size: number
  input?: {
    username?: string
    status?: number
  }
}

export interface CreateUserRequest {
  phone?: string
  username: string
  password: string
  role_id: string
}

export interface UpdateUserRequest {
  id: string
  phone?: string
  username: string
  role_id: string
}

export interface BatchDeleteUserRequest {
  ids: string[]
}

export interface GetRoleListPageRequest {
  current: number
  size: number
  input?: {
    title?: string
    code?: string
    status?: number
  }
}

export interface CreateRoleRequest {
  title: string
  code: string
}

export interface BatchDeleteRoleRequest {
  ids: string[]
}

export interface GetRoleSelectPageRequest {
  current: number
  size: number
  keyword?: string
}