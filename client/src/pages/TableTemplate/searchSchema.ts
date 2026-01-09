import type { SearchSchema } from '@/components/DataTable'

// 表格模板搜索表单 schema
export const tableTemplateSearchSchema: SearchSchema = {
  type: 'object',
  properties: {
    name: {
      title: '模板名称',
      type: 'string',
      placeholder: '请输入模板名称',
      widget: 'input',
      props: {
        allowClear: true,
      },
    },
    type: {
      title: '类型',
      type: 'string',
      widget: 'select',
      enum: ['基础型', '高级型', '统计型', '表单型', '树形型', '卡片型', '响应式', '可编辑型'],
      enumNames: ['基础型', '高级型', '统计型', '表单型', '树形型', '卡片型', '响应式', '可编辑型'],
      placeholder: '请选择类型',
      props: {
        allowClear: true,
      },
    },
    status: {
      title: '状态',
      type: 'string',
      widget: 'select',
      enum: ['active', 'inactive'],
      enumNames: ['启用', '禁用'],
      placeholder: '请选择状态',
      props: {
        allowClear: true,
      },
    },
  },
  displayType: 'row',
  labelWidth: 80,
}
