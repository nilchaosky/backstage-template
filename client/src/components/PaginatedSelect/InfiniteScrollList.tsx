import { useState, useEffect, useRef, useCallback } from 'react'
import { List, Spin, Empty, theme } from 'antd'
import type { ReactNode } from 'react'

const { useToken } = theme

interface InfiniteScrollListProps<T> {
  // 数据请求函数
  request: (page: number, pageSize: number, searchValue: string) => Promise<{
    records: T[]
    total: number
    hasMore: boolean
  }>
  // 渲染列表项
  renderItem: (item: T, index: number) => ReactNode
  // 搜索值
  searchValue: string
  // 每页大小
  pageSize?: number
  // 空状态提示
  emptyText?: string
}

function InfiniteScrollList<T extends { id: string | number }>({
  request,
  renderItem,
  searchValue,
  pageSize = 20,
  emptyText = '暂无数据',
}: InfiniteScrollListProps<T>) {
  const { token } = useToken()
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)

  // 加载数据
  const fetchData = useCallback(
    async (currentPage: number, reset = false) => {
      if (loadingRef.current) return

      loadingRef.current = true
      setLoading(true)

      try {
        const result = await request(currentPage, pageSize, searchValue)

        if (reset) {
          setData(result.records)
        } else {
          setData((prev) => [...prev, ...result.records])
        }

        setHasMore(result.hasMore)
        setPage(currentPage)
      } catch (error) {
      } finally {
        setLoading(false)
        loadingRef.current = false
      }
    },
    [request, pageSize, searchValue]
  )

  // 搜索值变化时重置并重新加载
  useEffect(() => {
    setData([])
    setPage(1)
    setHasMore(true)
    loadingRef.current = false
    void fetchData(1, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  // 滚动加载更多
  const handleScroll = useCallback(() => {
    if (!containerRef.current || loading || !hasMore) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    // 距离底部 100px 时加载
    if (scrollHeight - scrollTop - clientHeight < 100) {
      void fetchData(page + 1, false)
    }
  }, [loading, hasMore, page, fetchData])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <div
      ref={containerRef}
      style={{
        height: '100%',
        overflow: 'auto',
      }}
    >
      {data.length === 0 && !loading ? (
        <Empty description={emptyText} />
      ) : (
        <List
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item key={item.id}>
              {renderItem(item, index)}
            </List.Item>
          )}
          footer={
            loading ? (
              <div style={{ textAlign: 'center', padding: token.padding }}>
                <Spin />
              </div>
            ) : hasMore ? (
              <div style={{ textAlign: 'center', padding: token.padding, color: token.colorTextSecondary }}>
                滚动加载更多
              </div>
            ) : data.length > 0 ? (
              <div style={{ textAlign: 'center', padding: token.padding, color: token.colorTextSecondary }}>
                没有更多数据了
              </div>
            ) : null
          }
        />
      )}
    </div>
  )
}

export default InfiniteScrollList
