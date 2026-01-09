import { useState } from 'react'
import { Form, Input, Button, App, Space, theme, Select } from 'antd'
import { trimAllSpaces } from '@/utils'

const { useApp } = App
const { useToken } = theme

interface CreateTemplateFormProps {
  onClose?: () => void
  onSuccess?: () => void
}

function CreateTemplateForm({ onClose, onSuccess }: CreateTemplateFormProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { message: messageApi } = useApp()
  const { token } = useToken()

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      setLoading(true)
      
      // 模拟创建请求
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      messageApi.success('创建模板成功')
      form.resetFields()
      onSuccess?.()
      onClose?.()
    } catch (error) {
      if (error && typeof error === 'object' && 'errorFields' in error) {
        // 表单验证错误，不需要处理
        return
      }
      messageApi.error('创建模板失败')
      console.error('创建模板失败:', error)
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
          label="模板名称"
          name="name"
          normalize={trimAllSpaces}
          rules={[
            { required: true, message: '请输入模板名称' },
            { max: 50, message: '模板名称不能超过50个字符' },
          ]}
        >
          <Input placeholder="请输入模板名称" maxLength={50} />
        </Form.Item>

        <Form.Item
          label="类型"
          name="type"
          rules={[
            { required: true, message: '请选择类型' },
          ]}
        >
          <Select
            placeholder="请选择类型"
            options={[
              { label: '基础型', value: '基础型' },
              { label: '高级型', value: '高级型' },
              { label: '统计型', value: '统计型' },
              { label: '表单型', value: '表单型' },
              { label: '树形型', value: '树形型' },
              { label: '卡片型', value: '卡片型' },
              { label: '响应式', value: '响应式' },
              { label: '可编辑型', value: '可编辑型' },
            ]}
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="状态"
          name="status"
          rules={[
            { required: true, message: '请选择状态' },
          ]}
        >
          <Select
            placeholder="请选择状态"
            options={[
              { label: '启用', value: 'active' },
              { label: '禁用', value: 'inactive' },
            ]}
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="描述"
          name="description"
          rules={[
            { max: 200, message: '描述不能超过200个字符' },
          ]}
        >
          <Input.TextArea
            placeholder="请输入描述"
            rows={4}
            maxLength={200}
            showCount
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

export default CreateTemplateForm
