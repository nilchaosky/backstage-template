import { useState } from 'react'
import { Button, Modal, Form, Input, App, theme, Select } from 'antd'
import { trimAllSpaces } from '@/utils'

const { useApp } = App
const { useToken } = theme

interface UpdateTemplateProps {
  id: string
  name: string
  onRefresh?: () => void
}

function UpdateTemplate({ name, onRefresh }: UpdateTemplateProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [fetching, setFetching] = useState(false)
  const { message: messageApi } = useApp()
  const { token } = useToken()

  // 打开弹窗时获取模板详情（这里使用写死的数据）
  const handleOpen = async () => {
    setOpen(true)
    setFetching(true)
    try {
      // 模拟获取数据
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      // 这里应该从 API 获取，但因为是示例，使用写死的数据
      form.setFieldsValue({
        name,
        type: '基础型',
        status: 'active',
        description: '模板描述信息',
      })
    } catch (error) {
      messageApi.error('获取模板信息失败')
      console.error('获取模板信息失败:', error)
    } finally {
      setFetching(false)
    }
  }

  // 关闭弹窗
  const handleClose = () => {
    setOpen(false)
    form.resetFields()
  }

  // 提交表单
  const handleSubmit = async () => {
    try {
      await form.validateFields()
      setLoading(true)
      
      // 模拟更新请求
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      messageApi.success('更新模板成功')
      form.resetFields()
      onRefresh?.()
      handleClose()
    } catch (error) {
      if (error && typeof error === 'object' && 'errorFields' in error) {
        // 表单验证错误，不需要处理
        return
      }
      messageApi.error('更新模板失败')
      console.error('更新模板失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button type="link" onClick={() => {
        void handleOpen()
      }}>
        编辑
      </Button>
      <Modal
        title="编辑模板"
        open={open}
        onCancel={handleClose}
        onOk={() => {
          void handleSubmit()
        }}
        confirmLoading={loading}
        width={600}
        centered
      >
        <div style={{ padding: `${token.paddingMD}px 0` }}>
          <Form
            form={form}
            layout="vertical"
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
              <Input placeholder="请输入模板名称" maxLength={50} disabled={fetching} />
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
                disabled={fetching}
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
                disabled={fetching}
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
                disabled={fetching}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  )
}

export default UpdateTemplate
