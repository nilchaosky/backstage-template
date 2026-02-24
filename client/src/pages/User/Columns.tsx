import { useMemo } from 'react'
import { Tag, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { User } from '@/types/response'
import UpdateUser from './components/Update'
import DeleteUser from './components/Delete'

interface UseColumnsParams {
  onRefresh?: () => void
  onRemoveFromSelection?: (id: string) => void
}

export const useColumns = ({ onRefresh, onRemoveFromSelection }: UseColumnsParams) => {
  const columns = useMemo<ColumnsType<User>>(
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
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        align: 'center',
        width: 150,
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
        align: 'center',
        width: 130,
      },
      {
        title: '角色代码',
        dataIndex: 'role_code',
        key: 'role_code',
        align: 'center',
        width: 120,
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
        width: 150,
        fixed: 'right',
        render: (_: unknown, record: User) => (
          <Space size="small">
            <UpdateUser id={record.id} username={record.username} onRefresh={onRefresh} />
            <DeleteUser
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
