import type { SearchSchema } from '@/components/DataTable'

// 用户搜索表单 schema
export const userSearchSchema: SearchSchema = {
  type: 'object',
  properties: {
    username: {
      title: '用户名',
      type: 'string',
      placeholder: '请输入用户名',
      widget: 'input',
      props: {
        allowClear: true,
      },
    },
    status: {
      title: '状态',
      type: 'number',
      widget: 'select',
      enum: [0, 1],
      enumNames: ['禁用', '启用'],
      placeholder: '请选择状态',
      props: {
        allowClear: true,
      },
    },
  },
  displayType: 'row',
  labelWidth: 80,
}
