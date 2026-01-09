import { useState, useCallback, useRef, forwardRef, useImperativeHandle } from 'react'
import type { Key, Ref, ReactElement, ComponentType } from 'react'
import { Modal, App, Button, Space, theme, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { TableRowSelection } from 'antd/es/table/interface'
import TableRender, { type TableContext, type ProColumnsType, type SearchProps } from 'table-render'
import './index.css'
import type { DataTableProps, DataTableRef, SearchSchema } from './types'
import { BatchDeleteButton } from './BatchDeleteButton'

// 导出类型供外部使用
export type { DataTableProps, DataTableRef, SearchSchema }

function DataTableInner<T, S = unknown>(
  {
    searchSchema,
    useColumnsHook,
    fetchData,
    rowKey,
    createModalContent,
    createModalProps,
    pagination: customPagination = {},
    rowSelection: rowSelectionProp,
    selectedRowKeys: controlledSelectedRowKeys,
    onSelectionChange,
    batchActions,
    showBatchDelete,
    onBatchDelete,
  }: DataTableProps<T, S>,
  ref: Ref<DataTableRef>
) {
  const { message: messageApi } = App.useApp()
  const { token } = theme.useToken()
  const [modalOpen, setModalOpen] = useState(false)
  const [internalSelectedRowKeys, setInternalSelectedRowKeys] = useState<Key[]>([])
  const tableRef = useRef<TableContext | null>(null)

  // 判断是否为受控模式
  const isControlled = controlledSelectedRowKeys !== undefined
  // 使用受控的 selectedRowKeys 或内部的 selectedRowKeys
  const selectedRowKeys = isControlled ? controlledSelectedRowKeys : internalSelectedRowKeys

  // 处理行选择变化
  // 注意：Ant Design 的 TableRowSelection.onChange 需要接收 (keys, rows, info) 三个参数
  // 但我们只对外暴露 keys，所以内部处理时只传递 keys 给外部的 onSelectionChange
  const handleSelectionChange = useCallback(
    (keys: Key[]) => {
      if (!isControlled) {
        setInternalSelectedRowKeys(keys)
      }
      onSelectionChange?.(keys)
    },
    [onSelectionChange, isControlled]
  )

  // 构建 rowSelection 配置
  const getRowSelection = (): TableRowSelection<T> | undefined => {
    if (rowSelectionProp === undefined || rowSelectionProp === false) {
      return undefined
    }

    if (rowSelectionProp === true) {
      // 默认配置
      return {
        selectedRowKeys,
        onChange: handleSelectionChange,
      }
    }

    // 自定义配置，合并 onChange
    const customOnChange = rowSelectionProp.onChange
    return {
      ...rowSelectionProp,
      selectedRowKeys: rowSelectionProp.selectedRowKeys ?? selectedRowKeys,
      onChange: (keys: Key[], rows: T[], info: Parameters<NonNullable<TableRowSelection<T>['onChange']>>[2]) => {
        handleSelectionChange(keys)
        if (customOnChange) {
          customOnChange(keys, rows, info)
        }
      },
    }
  }

  // 暴露刷新方法给父组件
  useImperativeHandle(ref, () => ({
    refresh: () => {
      void tableRef.current?.refresh()
    },
  }), [])

  const { columns } = useColumnsHook()

  // TableRender 的 request 函数
  // 根据官方 API：request 接收 params 对象，包含 current, pageSize 和搜索表单的值
  // 返回 { data, success, total } 格式
  const request = useCallback(async (params: { current: number; pageSize: number; [key: string]: unknown }) => {
    try {
      // 从 params 中提取搜索参数（排除 current 和 pageSize）
      const { current, pageSize, ...searchParams } = params
      
      // 过滤掉空值
      const filteredParams: Record<string, unknown> = {}
      Object.keys(searchParams).forEach(key => {
        const value = searchParams[key]
        if (value !== undefined && value !== null && value !== '') {
          filteredParams[key] = value
        }
      })
      
      const searchInput: S | undefined = Object.keys(filteredParams).length > 0 ? (filteredParams as S) : undefined
      
      const response = await fetchData(current, pageSize, searchInput)
      
      // 检查响应是否成功
      if (response.code === 0 || response.code === 200) {
        return {
          data: response.data.records ?? [],
          total: response.data.total ?? 0,
          success: true,
        }
      }
      // 业务错误
      const errorMessage = response.message ?? '获取数据失败'
      messageApi.error(errorMessage)
      return {
        data: [],
        total: 0,
        success: false,
      }
    } catch (error) {
      // 网络错误或其他异常
      const errorMessage = error instanceof Error ? error.message : '获取数据失败'
      messageApi.error(errorMessage)
      console.error('获取数据失败:', error)
      return {
        data: [],
        total: 0,
        success: false,
      }
    }
  }, [fetchData, messageApi])

  // 构建 TableRender 的 search 配置
  const searchConfig = searchSchema ? {
    schema: searchSchema,
  } : undefined

  // 构建自定义工具栏，包含添加按钮
  // 样式与 TableRender 工具栏中的其他按钮保持一致
  const toolbarRender = (
    <Tooltip title="添加数据">
      <Button
        icon={<PlusOutlined style={{ fontSize: 18, width: 18, height: 18 }} />}
        type="text"
        className="toolbar-btn"
        onClick={() => {
          if (createModalContent) {
            setModalOpen(true)
          } else {
            messageApi.info('该功能暂不支持')
          }
        }}
      />
    </Tooltip>
  )

  // 处理批量删除
  const handleBatchDelete = useCallback(async () => {
    if (onBatchDelete) {
      try {
        await onBatchDelete(selectedRowKeys)
        // 删除成功后清空选中项
        handleSelectionChange([])
        // 刷新表格
        void tableRef.current?.refresh()
      } catch (error) {
        console.error('批量删除失败:', error)
      }
    }
  }, [onBatchDelete, selectedRowKeys, handleSelectionChange])

  // 构建批量删除按钮
  const batchDeleteButton = showBatchDelete && selectedRowKeys.length > 0 ? (
    <BatchDeleteButton
      selectedCount={selectedRowKeys.length}
      onConfirm={handleBatchDelete}
    />
  ) : null

  // 构建 title，包含批量操作区域
  const hasBatchActions = (batchActions?.length ?? 0) > 0 || batchDeleteButton !== null
  const showBatchActions = hasBatchActions && selectedRowKeys.length > 0
  const tableTitle = showBatchActions ? (
    <div style={{ 
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }}>
      <span style={{ color: token.colorText }}>已选择 {selectedRowKeys.length} 项</span>
      <Space size="small">
        {batchDeleteButton}
        {batchActions}
      </Space>
    </div>
  ) : undefined

  return (
    <div>
      <TableRender
        ref={tableRef}
        request={request}
        columns={columns as ProColumnsType<T & object>}
        rowKey={rowKey}
        rowSelection={getRowSelection()}
        title={tableTitle}
        pagination={{
          pageSize: customPagination.defaultPageSize ?? 10,
          showSizeChanger: customPagination.showSizeChanger !== false,
          showQuickJumper: customPagination.showQuickJumper !== false,
          showTotal: customPagination.showTotal ?? ((total: number) => `共 ${total} 条`),
        }}
        search={searchConfig as SearchProps<T & object> | undefined}
        toolbarAction={true}
        toolbarRender={toolbarRender}
        // 其他 TableRender 支持的属性可以在这里添加
        // 例如：size, scroll, bordered, loading 等
      />
      {createModalContent && (
        <Modal
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          footer={null}
          width={600}
          destroyOnClose
          {...(createModalProps || {})}
        >
          {typeof createModalContent === 'function'
            ? createModalContent({
                onClose: () => setModalOpen(false),
                onSuccess: () => {
                  setModalOpen(false)
                  // 刷新表格数据
                  void tableRef.current?.refresh()
                },
              })
            : createModalContent}
        </Modal>
      )}
    </div>
  )
}

const DataTable = forwardRef(DataTableInner) as <T, S = unknown>(
  props: DataTableProps<T, S> & { ref?: Ref<DataTableRef> }
) => ReactElement

// 设置 displayName 用于 React DevTools
if (typeof DataTable !== 'undefined' && 'displayName' in DataTable) {
  (DataTable as ComponentType & { displayName?: string }).displayName = 'DataTable'
}

export default DataTable
