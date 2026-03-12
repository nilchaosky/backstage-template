import { useState } from 'react'
import { Button, Modal, Form, Input, App, theme } from 'antd'
import { trimAllSpaces } from '@/utils'
import { getUserById, updateUser } from '@/api/user'
import { getRoleSelectPage } from '@/api/role'
import PaginatedSelect from '@/components/PaginatedSelect'

const { useApp } = App
const { useToken } = theme

interface UpdateUserProps {
  id: string
  username: string
  onRefresh?: () => void
}

function UpdateUser({ id, onRefresh }: UpdateUserProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [fetching, setFetching] = useState(false)
  const { message: messageApi } = useApp()
  const { token } = useToken()

  // 打开弹窗时获取用户详情
  const handleOpen = async () => {
    setOpen(true)
    setFetching(true)
    try {
      const user = await getUserById(id)
      if (user) {
        form.setFieldsValue({
          phone: user.phone,
          username: user.username,
          role_id: user.role_id,
        })
      }
    } catch (error) {
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

      const values = form.getFieldsValue()
      await updateUser({
        id,
        phone: values.phone,
        username: values.username,
        role_id: values.role_id,
      })

      messageApi.success('更新用户成功')
      form.resetFields()
      onRefresh?.()
      handleClose()
    } catch (error) {
      if (error && typeof error === 'object' && 'errorFields' in error) {
        return
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        type="link"
        onClick={() => {
          void handleOpen()
        }}
      >
        编辑
      </Button>
      <Modal
        title="编辑用户"
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
              label="手机号"
              name="phone"
              rules={[
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
              ]}
            >
              <Input placeholder="请输入手机号" maxLength={11} disabled={fetching} />
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
              <Input placeholder="请输入用户名" maxLength={20} disabled={fetching} />
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
                disabled={fetching}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  )
}

export default UpdateUser
