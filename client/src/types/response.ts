export interface LoginResponse {
  token: string
  refresh_token: string
  id: string
}

export interface User {
  id: string
  username: string
  role_id?: string
  role_code?: string
  status?: number
  created_at?: string
}
