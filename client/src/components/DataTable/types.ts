import type { ColumnsType } from 'antd/es/table'
import type { TableRowSelection } from 'antd/es/table/interface'
import type { ReactNode, Key } from 'react'

// Schema 属性定义
export interface SchemaProperty {
  title: string
  type: string
  placeholder?: string
  widget?: string
  props?: Record<string, unknown>
  enum?: unknown[]
  enumNames?: string[]
  default?: unknown
  [key: string]: unknown
}

// TableRender 的 search schema 类型
export interface SearchSchema {
  type: string
  properties: Record<string, SchemaProperty>
  displayType?: string
  labelWidth?: number
  [key: string]: unknown
}

// 数据请求响应类型
export interface DataTableResponse<T> {
  code: number
  message?: string
  data: {
    records: T[]
    total: number
  }
}

// 数据请求函数类型
export type FetchDataFunction<T, S = unknown> = (
  page: number,
  size: number,
  input?: S
) => Promise<DataTableResponse<T>>

// 列配置 hook 返回类型
export interface ColumnsHookResult<T> {
  columns: ColumnsType<T>
}

// DataTable Props 类型
export interface DataTableProps<T, S = unknown> {
  // 搜索配置：使用 TableRender 的 search schema
  searchSchema?: SearchSchema
  // 列配置 hook，返回 { columns }
  useColumnsHook: () => ColumnsHookResult<T>
  // 数据请求函数
  fetchData: FetchDataFunction<T, S>
  // 行键
  rowKey: string | ((record: T) => string)
  // 新增对话框内容，可以是 ReactNode 或者接收关闭回调的函数
  createModalContent?: ReactNode | ((props: { onClose: () => void; onSuccess?: () => void }) => ReactNode)
  // 新增对话框配置
  createModalProps?: {
    title?: string
    width?: number
    [key: string]: unknown
  }
  // 自定义分页配置
  pagination?: {
    showSizeChanger?: boolean
    showQuickJumper?: boolean
    showTotal?: (total: number) => string
    defaultPageSize?: number
  }
  // 行选择配置，可以是 boolean 或 TableRowSelection 对象
  rowSelection?: boolean | TableRowSelection<T>
  // 受控的选中行keys（可选，如果提供则组件为受控模式）
  selectedRowKeys?: Key[]
  // 选中行变化回调
  onSelectionChange?: (selectedRowKeys: Key[]) => void
  // 批量操作按钮列表，显示在"已选择多少项"后面
  batchActions?: ReactNode[]
  // 是否显示批量删除按钮
  showBatchDelete?: boolean
  // 批量删除回调
  onBatchDelete?: (selectedRowKeys: Key[]) => void | Promise<void>
}

// DataTable Ref 类型
export interface DataTableRef {
  // 刷新数据
  refresh: () => void
}
