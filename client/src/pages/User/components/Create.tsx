import { useState } from 'react'
import { Form, Input, Button, App, Space, theme } from 'antd'
import { trimAllSpaces } from '@/utils'
import { createUser } from '@/api/user'
import { getRoleSelectPage } from '@/api/role'
import PaginatedSelect from '@/components/PaginatedSelect'

const { useApp } = App
const { useToken } = theme

interface CreateUserFormProps {
  onClose?: () => void
  onSuccess?: () => void
}

function CreateUserForm({ onClose, onSuccess }: CreateUserFormProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { message: messageApi } = useApp()
  const { token } = useToken()

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      setLoading(true)

      const values = form.getFieldsValue()
      await createUser({
        phone: values.phone,
        username: values.username,
        password: values.password,
        role_id: values.role_id,
      })

      messageApi.success('创建用户成功')
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
          label="手机号"
          name="phone"
          rules={[
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
          ]}
        >
          <Input placeholder="请输入手机号" maxLength={11} />
        </Form.Item>

        <Form.Item
          label="用户名"
          name="username"
          normalize={trimAllSpaces}
          rules={[
            { required: true, message: '请输入用户名' },
            { max: 20, message: '用户名不能超过20个字符' },
          ]}
        >
          <Input placeholder="请输入用户名" maxLength={20} />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少6个字符' },
          ]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>

        <Form.Item
          label="角色"
          name="role_id"
          rules={[
            { required: true, message: '请选择角色' },
          ]}
        >
          <PaginatedSelect
            placeholder="请选择角色"
            request={async (page, pageSize, keyword) => {
              const data = await getRoleSelectPage({
                current: page,
                size: pageSize,
                keyword: keyword || undefined,
              })
              return {
                records: data.records.map((role) => ({
                  label: role.title,
                  value: role.id,
                })),
                total: data.total,
                hasMore: data.hasMore,
              }
            }}
            allowClear
          />
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

export default CreateUserForm
