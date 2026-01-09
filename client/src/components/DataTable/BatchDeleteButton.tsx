import { Button, Popconfirm } from 'antd'

interface BatchDeleteButtonProps {
  /** 选中的数量 */
  selectedCount: number
  /** 确认删除的回调 */
  onConfirm: () => void | Promise<void>
}

/**
 * 批量删除按钮组件
 * 用于 DataTable 的批量删除功能
 */
export function BatchDeleteButton({
  selectedCount,
  onConfirm,
}: BatchDeleteButtonProps) {
  return (
    <Popconfirm
      title="确认批量删除"
      description={`确定要删除选中的 ${selectedCount} 项吗？`}
      onConfirm={() => {
        void Promise.resolve(onConfirm())
      }}
      okText="确定"
      cancelText="取消"
      okType="danger"
    >
      <Button type="link" danger>
        批量删除
      </Button>
    </Popconfirm>
  )
}
