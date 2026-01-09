import { useMemo } from 'react'
import { Tag, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import UpdateTemplate from './components/Update'
import DeleteTemplate from './components/Delete'

// 定义数据类型
export interface TemplateItem {
  id: string
  name: string
  type: string
  status: 'active' | 'inactive'
  description: string
  createTime: string
  updateTime: string
}

interface UseColumnsParams {
  onRefresh?: () => void
  onRemoveFromSelection?: (id: string) => void
}

export const useColumns = ({ onRefresh, onRemoveFromSelection }: UseColumnsParams) => {
  const columns = useMemo<ColumnsType<TemplateItem>>(
    () => [
      {
        title: '序号',
        key: 'index',
        align: 'center',
        width: 80,
        render: (_: unknown, __: unknown, index: number) => {
          return index + 1
        },
      },
      {
        title: '模板名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 180,
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        width: 120,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 100,
        render: (status: string) => {
          return (
            <Tag color={status === 'active' ? 'success' : 'default'}>
              {status === 'active' ? '启用' : '禁用'}
            </Tag>
          )
        },
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        width: 180,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        align: 'center',
        width: 180,
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        width: 150,
        fixed: 'right',
        render: (_: unknown, record: TemplateItem) => (
          <Space size="small">
            <UpdateTemplate id={record.id} name={record.name} onRefresh={onRefresh} />
            <DeleteTemplate
              id={record.id}
              onRefresh={onRefresh}
              onRemoveFromSelection={onRemoveFromSelection}
            />
          </Space>
        ),
      },
    ],
    [onRefresh, onRemoveFromSelection]
  )

  return { columns }
}
