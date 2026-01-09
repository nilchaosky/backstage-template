import { useState, useCallback, useRef } from 'react'
import type { Key } from 'react'
import type { DataTableRef } from '@/components/DataTable'

/**
 * 通用的 DataTable Hook，用于处理表格的通用逻辑
 * 提供选中状态管理、刷新等基础功能
 */
export function useDataTable() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
  const dataTableRef = useRef<DataTableRef>(null)

  // 处理行选择变化
  const handleSelectionChange = useCallback((keys: Key[]) => {
    setSelectedRowKeys(keys)
  }, [])

  // 清空选中状态
  const clearSelection = useCallback(() => {
    setSelectedRowKeys([])
  }, [])

  // 从选中列表中移除指定的ID
  const removeFromSelection = useCallback((id: Key) => {
    setSelectedRowKeys((prev) => prev.filter((key) => key !== id))
  }, [])

  // 刷新表格数据
  const refresh = useCallback(() => {
    dataTableRef.current?.refresh()
  }, [])

  return {
    selectedRowKeys,
    setSelectedRowKeys,
    dataTableRef,
    handleSelectionChange,
    clearSelection,
    removeFromSelection,
    refresh,
  }
}
