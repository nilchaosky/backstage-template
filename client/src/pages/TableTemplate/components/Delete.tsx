import { useState } from 'react'
import { Button, Popconfirm, App } from 'antd'

const { useApp } = App

interface DeleteTemplateProps {
  id: string
  onRefresh?: () => void
  onRemoveFromSelection?: (id: string) => void
}

function DeleteTemplate({ id, onRefresh, onRemoveFromSelection }: DeleteTemplateProps) {
  const [loading, setLoading] = useState(false)
  const { message: messageApi } = useApp()

  // 确认删除
  const handleConfirm = async () => {
    try {
      setLoading(true)
      // 模拟删除请求
      await new Promise((resolve) => setTimeout(resolve, 500))
      
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

export default DeleteTemplate
