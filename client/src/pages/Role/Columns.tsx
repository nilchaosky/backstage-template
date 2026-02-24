import { useMemo } from 'react'
import { Tag, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Role } from '@/types/response'
import DeleteRole from './components/Delete'

interface UseColumnsParams {
  onRefresh?: () => void
  onRemoveFromSelection?: (id: string) => void
}

export const useColumns = ({ onRefresh, onRemoveFromSelection }: UseColumnsParams) => {
  const columns = useMemo<ColumnsType<Role>>(
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
        title: '角色名称',
        dataIndex: 'title',
        key: 'title',
        align: 'center',
        width: 150,
      },
      {
        title: '角色代码',
        dataIndex: 'code',
        key: 'code',
        align: 'center',
        width: 150,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 100,
        render: (status: number) => {
          return (
            <Tag color={status === 1 ? 'success' : 'default'}>
              {status === 1 ? '启用' : '禁用'}
            </Tag>
          )
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'center',
        width: 180,
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        width: 100,
        fixed: 'right',
        render: (_: unknown, record: Role) => (
          <Space size="small">
            <DeleteRole
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
