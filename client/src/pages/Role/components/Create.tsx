import { useState } from 'react'
import { Form, Input, Button, App, Space, theme } from 'antd'
import { trimAllSpaces } from '@/utils'
import { createRole } from '@/api/role'

const { useApp } = App
const { useToken } = theme

interface CreateRoleFormProps {
  onClose?: () => void
  onSuccess?: () => void
}

function CreateRoleForm({ onClose, onSuccess }: CreateRoleFormProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { message: messageApi } = useApp()
  const { token } = useToken()

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      setLoading(true)

      const values = form.getFieldsValue()
      await createRole({
        title: values.title,
        code: values.code.toUpperCase(),
      })

      messageApi.success('创建角色成功')
      form.resetFields()
      onSuccess?.()
      onClose?.()
    } catch (error) {
      if (error && typeof error === 'object' && 'errorFields' in error) {
        return
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: `${token.paddingMD}px 0` }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={() => {
          void handleSubmit()
        }}
        requiredMark={false}
      >
        <Form.Item
          label="角色名称"
          name="title"
          normalize={trimAllSpaces}
          rules={[
            { required: true, message: '请输入角色名称' },
            { max: 20, message: '角色名称不能超过20个字符' },
          ]}
        >
          <Input placeholder="请输入角色名称" maxLength={20} />
        </Form.Item>

        <Form.Item
          label="角色代码"
          name="code"
          normalize={(value) => (value ? value.toUpperCase().replace(/[^A-Z_]/g, '') : '')}
          rules={[
            { required: true, message: '请输入角色代码' },
            { max: 20, message: '角色代码不能超过20个字符' },
            { pattern: /^[A-Z_]+$/, message: '角色代码只能包含大写字母和下划线' },
          ]}
        >
          <Input placeholder="请输入角色代码（大写字母和下划线）" maxLength={20} />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: token.marginLG }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            {onClose && (
              <Button onClick={onClose}>
                取消
              </Button>
            )}
            <Button type="primary" htmlType="submit" loading={loading}>
              确定
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreateRoleForm
