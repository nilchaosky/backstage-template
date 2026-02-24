import type { SearchSchema } from '@/components/DataTable'

// 角色搜索表单 schema
export const roleSearchSchema: SearchSchema = {
  type: 'object',
  properties: {
    title: {
      title: '角色名称',
      type: 'string',
      placeholder: '请输入角色名称',
      widget: 'input',
      props: {
        allowClear: true,
      },
    },
    code: {
      title: '角色代码',
      type: 'string',
      placeholder: '请输入角色代码',
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
