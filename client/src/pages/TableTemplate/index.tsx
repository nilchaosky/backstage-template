import { useCallback } from 'react'
import { App } from 'antd'
import type { DataTableResponse } from '@/components/DataTable/types'
import { useColumns } from './Columns'
import type { TemplateItem } from './Columns'
import CreateTemplateForm from './components/Create'
import DataTable from '@/components/DataTable'
import { tableTemplateSearchSchema } from './searchSchema'
import { useDataTable } from '@/hooks/useDataTable'

// 搜索参数类型
interface SearchInput {
  name?: string
  type?: string
  status?: string
}

// 写死的数据
const mockData: TemplateItem[] = [
  {
    id: '1',
    name: '基础表格模板',
    type: '基础型',
    status: 'active',
    description: '适用于简单的数据展示场景',
    createTime: '2024-01-15 10:30:00',
    updateTime: '2024-01-20 14:20:00',
  },
  {
    id: '2',
    name: '高级表格模板',
    type: '高级型',
    status: 'active',
    description: '支持复杂的数据操作和自定义功能',
    createTime: '2024-01-16 09:15:00',
    updateTime: '2024-01-22 16:45:00',
  },
  {
    id: '3',
    name: '统计表格模板',
    type: '统计型',
    status: 'inactive',
    description: '用于数据统计和分析展示',
    createTime: '2024-01-17 11:00:00',
    updateTime: '2024-01-18 10:30:00',
  },
  {
    id: '4',
    name: '表单表格模板',
    type: '表单型',
    status: 'active',
    description: '结合表单功能的表格模板',
    createTime: '2024-01-18 14:20:00',
    updateTime: '2024-01-25 09:10:00',
  },
  {
    id: '5',
    name: '树形表格模板',
    type: '树形型',
    status: 'active',
    description: '支持树形结构的数据展示',
    createTime: '2024-01-19 16:00:00',
    updateTime: '2024-01-26 11:30:00',
  },
  {
    id: '6',
    name: '卡片表格模板',
    type: '卡片型',
    status: 'inactive',
    description: '以卡片形式展示的表格模板',
    createTime: '2024-01-20 08:45:00',
    updateTime: '2024-01-21 15:20:00',
  },
  {
    id: '7',
    name: '响应式表格模板',
    type: '响应式',
    status: 'active',
    description: '适配不同屏幕尺寸的响应式表格',
    createTime: '2024-01-21 10:15:00',
    updateTime: '2024-01-27 13:40:00',
  },
  {
    id: '8',
    name: '可编辑表格模板',
    type: '可编辑型',
    status: 'active',
    description: '支持行内编辑的表格模板',
    createTime: '2024-01-22 13:30:00',
    updateTime: '2024-01-28 10:00:00',
  },
]

function TableTemplate() {
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
      messageApi.warning('请选择要删除的模板')
      return
    }

    try {
      // 模拟批量删除请求
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      messageApi.success(`成功删除 ${selectedRowKeys.length} 个模板`)
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

  // 数据请求函数（写死数据，不做 mock）
  const fetchData = async (
    page: number,
    size: number,
    input?: SearchInput
  ): Promise<DataTableResponse<TemplateItem>> => {
    // 模拟延迟
    await new Promise((resolve) => setTimeout(resolve, 300))

    // 过滤数据
    let filteredData = [...mockData]
    if (input) {
      if (input.name) {
        filteredData = filteredData.filter((item) =>
          item.name.includes(input.name as string)
        )
      }
      if (input.type) {
        filteredData = filteredData.filter((item) => item.type === input.type)
      }
      if (input.status) {
        filteredData = filteredData.filter((item) => item.status === input.status)
      }
    }

    // 分页处理
    const start = (page - 1) * size
    const end = start + size
    const records = filteredData.slice(start, end)
    const total = filteredData.length

    return {
      code: 200,
      message: '获取成功',
      data: {
        records,
        total,
      },
    }
  }

  return (
    <DataTable<TemplateItem, SearchInput>
      ref={dataTableRef}
      searchSchema={tableTemplateSearchSchema}
      useColumnsHook={useColumnsHook}
      fetchData={fetchData}
      rowKey="id"
      createModalContent={(props) => <CreateTemplateForm {...props} />}
      createModalProps={{
        title: '新增模板',
        width: 600,
        centered: true,
      }}
      rowSelection={true}
      selectedRowKeys={selectedRowKeys}
      onSelectionChange={handleSelectionChange}
      showBatchDelete={true}
      onBatchDelete={handleBatchDelete}
      pagination={{
        defaultPageSize: 5,
        showSizeChanger: true,
        showQuickJumper: true,
      }}
    />
  )
}

export default TableTemplate
