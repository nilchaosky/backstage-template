import { useState } from 'react'
import { Modal, Form, Input, message } from 'antd'
import { changePassword } from '@/api/user'
import type { ChangePasswordRequest } from '@/types/request'

interface ChangePasswordProps {
  open: boolean
  onClose: () => void
}

function ChangePassword({ open, onClose }: ChangePasswordProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields() as {
        oldPassword: string
        newPassword: string
        confirmPassword?: string
      }
      setLoading(true)

      const request: ChangePasswordRequest = {
        old_password: values.oldPassword,
        new_password: values.newPassword,
      }

      await changePassword(request)
      message.success('密码修改成功')
      form.resetFields()
      onClose()
    } catch (error) {
      if (error && typeof error === 'object' && 'errorFields' in error) {
        // 表单验证错误，不需要处理
        return
      }
      message.error('密码修改失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title="修改密码"
      open={open}
      onOk={() => {
        void handleSubmit()
      }}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="确定"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="oldPassword"
          label="旧密码"
          rules={[
            { required: true, message: '请输入旧密码' },
          ]}
        >
          <Input.Password placeholder="请输入旧密码" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码长度不能少于6位' },
          ]}
        >
          <Input.Password placeholder="请输入新密码（至少6位）" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="确认新密码"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '请确认新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('两次输入的密码不一致'))
              },
            }),
          ]}
        >
          <Input.Password placeholder="请再次输入新密码" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ChangePassword
