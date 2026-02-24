import { useState } from 'react'
import { Button, Popconfirm, App } from 'antd'
import { deleteRole } from '@/api/role'

const { useApp } = App

interface DeleteRoleProps {
  id: string
  onRefresh?: () => void
  onRemoveFromSelection?: (id: string) => void
}

function DeleteRole({ id, onRefresh, onRemoveFromSelection }: DeleteRoleProps) {
  const [loading, setLoading] = useState(false)
  const { message: messageApi } = useApp()

  // 确认删除
  const handleConfirm = async () => {
    try {
      setLoading(true)
      await deleteRole(id)

      messageApi.success('删除成功')
      onRemoveFromSelection?.(id)
      onRefresh?.()
    } catch (error) {
      messageApi.error('删除失败')
      console.error('删除失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Popconfirm
      title="确认删除"
      description="确定要删除吗？"
      onConfirm={() => {
        void handleConfirm()
      }}
      okText="确定"
      cancelText="取消"
      okType="danger"
      okButtonProps={{ loading }}
    >
      <Button type="link" danger>
        删除
      </Button>
    </Popconfirm>
  )
}

export default DeleteRole
