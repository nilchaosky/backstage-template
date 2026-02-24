export interface LoginResponse {
  token: string
  refresh_token: string
  id: string
}

export interface User {
  id: string
  phone: string
  username: string
  role_id: string
  role_code: string
  permission: string[]
  status: number
  created_at: string
}

export interface Role {
  id: string
  title: string
  code: string
  status?: number
  created_at?: string
}
