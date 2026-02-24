import { useCallback } from 'react'
import { App } from 'antd'
import type { DataTableResponse } from '@/components/DataTable/types'
import type { Role } from '@/types/response'
import type { GetRoleListPageRequest } from '@/types/request'
import { useColumns } from './Columns'
import CreateRoleForm from './components/Create'
import DataTable from '@/components/DataTable'
import { roleSearchSchema } from './searchSchema'
import { useDataTable } from '@/hooks/useDataTable'
import { getRoleListPage, batchDeleteRole } from '@/api/role'

// 搜索参数类型
interface SearchInput {
  title?: string
  code?: string
  status?: number
}

function RoleManagement() {
  const { message: messageApi } = App.useApp()
  const {
    selectedRowKeys,
    dataTableRef,
    handleSelectionChange,
    clearSelection,
    removeFromSelection,
    refresh,
  } = useDataTable()

  // 批量删除处理函数
  const handleBatchDelete = useCallback(async () => {
    if (selectedRowKeys.length === 0) {
      messageApi.warning('请选择要删除的角色')
      return
    }

    try {
      await batchDeleteRole({ ids: selectedRowKeys.map(String) })
      messageApi.success(`成功删除 ${selectedRowKeys.length} 个角色`)
      clearSelection()
      refresh()
    } catch (error) {
      messageApi.error('批量删除失败')
      console.error('批量删除失败:', error)
    }
  }, [selectedRowKeys, messageApi, clearSelection, refresh])

  const useColumnsHook = () => {
    return useColumns({
      onRefresh: refresh,
      onRemoveFromSelection: removeFromSelection,
    })
  }

  // 数据请求函数
  const fetchData = async (
    page: number,
    size: number,
    input?: SearchInput
  ): Promise<DataTableResponse<Role>> => {
    const request: GetRoleListPageRequest = {
      current: page,
      size,
      input: input
        ? {
            title: input.title,
            code: input.code,
            status: input.status,
          }
        : undefined,
    }

    const data = await getRoleListPage(request)
    return {
      code: 0,
      message: 'success',
      data: {
        records: data.records,
        total: data.total,
      },
    }
  }

  return (
    <DataTable<Role, SearchInput>
      ref={dataTableRef}
      searchSchema={roleSearchSchema}
      useColumnsHook={useColumnsHook}
      fetchData={fetchData}
      rowKey="id"
      createModalContent={(props) => <CreateRoleForm {...props} />}
      createModalProps={{
        title: '新增角色',
        width: 600,
        centered: true,
      }}
      rowSelection={true}
      selectedRowKeys={selectedRowKeys}
      onSelectionChange={handleSelectionChange}
      showBatchDelete={true}
      onBatchDelete={handleBatchDelete}
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
      }}
    />
  )
}

export default RoleManagement
