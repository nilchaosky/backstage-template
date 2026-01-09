import { useState, useEffect, useRef, useCallback } from 'react'
import { Select, Spin, Empty } from 'antd'
import type { SelectProps } from 'antd'
import { useDebounceSearch } from '@/hooks'
import InfiniteScrollList from './InfiniteScrollList'

export interface PaginatedSelectOption {
  label: string
  value: string | number
  disabled?: boolean
  [key: string]: unknown
}

interface PaginatedSelectProps extends Omit<SelectProps, 'options' | 'loading' | 'onPopupScroll' | 'popupRender' | 'showSearch' | 'onSearch' | 'filterOption'> {
  // 数据请求函数
  request: (page: number, pageSize: number, searchValue: string) => Promise<{
    records: PaginatedSelectOption[]
    total: number
    hasMore: boolean
  }>
  // 每页大小
  pageSize?: number
  // 防抖延迟（毫秒）
  debounceWait?: number
  // 空状态提示
  emptyText?: string
}

function PaginatedSelectComponent({
  request,
  pageSize = 20,
  debounceWait = 500,
  emptyText = '暂无数据',
  ...selectProps
}: PaginatedSelectProps) {
  const [options, setOptions] = useState<PaginatedSelectOption[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const { setSearchValue, debouncedSearchValue } = useDebounceSearch('', debounceWait)
  const loadingRef = useRef(false)

  // 加载数据
  const fetchData = useCallback(
    async (currentPage: number, currentSearchValue: string, reset = false) => {
      if (loadingRef.current) return

      loadingRef.current = true
      setLoading(true)

      try {
        const result = await request(currentPage, pageSize, currentSearchValue)

        if (reset) {
          setOptions(result.records)
        } else {
          setOptions((prev) => [...prev, ...result.records])
        }

        setHasMore(result.hasMore)
        setPage(currentPage)
      } catch (error) {
        console.error('加载数据失败:', error)
      } finally {
        setLoading(false)
        loadingRef.current = false
      }
    },
    [request, pageSize]
  )

  // 处理搜索输入（使用 showSearch 对象形式的 onSearch）
  const handleSearch = useCallback((value: string) => {
    setSearchValue(value)
  }, [setSearchValue])

  // 搜索值变化时重置并重新加载（包括初始加载）
  useEffect(() => {
    setOptions([])
    setPage(1)
    setHasMore(true)
    loadingRef.current = false
    void fetchData(1, debouncedSearchValue, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchValue])

  // 处理下拉框滚动
  const handlePopupScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { target } = e
      if (!target || loading || !hasMore) return

      const element = target as HTMLElement
      const { scrollTop, scrollHeight, clientHeight } = element

      // 距离底部 50px 时加载
      if (scrollHeight - scrollTop - clientHeight < 50) {
        void fetchData(page + 1, debouncedSearchValue, false)
      }
    },
    [loading, hasMore, page, debouncedSearchValue, fetchData]
  )

  return (
    <Select
      {...selectProps}
      showSearch
      onSearch={handleSearch}
      filterOption={false}
      loading={loading}
      options={options}
      onPopupScroll={handlePopupScroll}
      popupRender={(menu) => (
        <>
          {menu}
          {loading && options.length === 0 && (
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <Spin size="small" />
            </div>
          )}
          {!loading && options.length === 0 && (
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <Empty description={emptyText} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          )}
          {hasMore && options.length > 0 && (
            <div style={{ textAlign: 'center', padding: '8px', color: '#999', fontSize: '12px' }}>
              {loading ? '加载中...' : '滚动加载更多'}
            </div>
          )}
          {!hasMore && options.length > 0 && (
            <div style={{ textAlign: 'center', padding: '8px', color: '#999', fontSize: '12px' }}>
              没有更多数据了
            </div>
          )}
        </>
      )}
    />
  )
}

// 将 InfiniteScrollList 作为 PaginatedSelect 的静态属性
const PaginatedSelect = PaginatedSelectComponent as typeof PaginatedSelectComponent & {
  InfiniteScrollList: typeof InfiniteScrollList
}

PaginatedSelect.InfiniteScrollList = InfiniteScrollList

export default PaginatedSelect
