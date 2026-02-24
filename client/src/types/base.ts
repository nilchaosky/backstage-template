export interface BaseResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PaginationSearch<T = unknown>  {
  current: number
  size: number
  input?: T
}

export interface PaginationResult<T = unknown>  {
  current: number
  size: number
  total: number
  records: T[]
  hasMore: boolean
}

export type PageResponse<T = unknown> = PaginationResult<T>

export interface SelectSearch {
  current: number
  size: number
  keyword: string
}
