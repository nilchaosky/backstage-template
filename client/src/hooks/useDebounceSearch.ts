import { useState } from 'react'
import { useDebounce } from 'ahooks'

/**
 * 防抖搜索 Hook
 * 用于搜索输入框的防抖处理
 */
export function useDebounceSearch(initialValue = '', wait = 500) {
  const [searchValue, setSearchValue] = useState(initialValue)
  const debouncedSearchValue = useDebounce(searchValue, { wait })

  return {
    searchValue,
    setSearchValue,
    debouncedSearchValue,
  }
}
