import { useCallback } from 'react'
import { App } from 'antd'
import type { DataTableResponse } from '@/components/DataTable/types'
import type { User } from '@/types/response'
import type { GetUserListPageRequest } from '@/types/request'
import { useColumns } from './Columns'
import CreateUserForm from './components/Create'
import DataTable from '@/components/DataTable'
import { userSearchSchema } from './searchSchema'
import { useDataTable } from '@/hooks/useDataTable'
import { getUserListPage, batchDeleteUser } from '@/api/user'

// 搜索参数类型
interface SearchInput {
  username?: string
  status?: number
}

function UserManagement() {
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
      messageApi.warning('请选择要删除的用户')
      return
    }

    try {
      await batchDeleteUser({ ids: selectedRowKeys.map(String) })
      messageApi.success(`成功删除 ${selectedRowKeys.length} 个用户`)
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
  ): Promise<DataTableResponse<User>> => {
    const request: GetUserListPageRequest = {
      current: page,
      size,
      input: input
        ? {
            username: input.username,
            status: input.status,
          }
        : undefined,
    }

    const data = await getUserListPage(request)
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
    <DataTable<User, SearchInput>
      ref={dataTableRef}
      searchSchema={userSearchSchema}
      useColumnsHook={useColumnsHook}
      fetchData={fetchData}
      rowKey="id"
      createModalContent={(props) => <CreateUserForm {...props} />}
      createModalProps={{
        title: '新增用户',
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

export default UserManagement
