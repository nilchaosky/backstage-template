import { useMatches, type UIMatch } from 'react-router-dom'
import { APP_NAME } from '@/constants'

// 面包屑生成函数
function generateBreadcrumbItems(matches: UIMatch[]) {
  const items: Array<{ title: string }> = []

  matches.forEach((match) => {
    const handle = match.handle as { breadcrumb?: string | string[] } | undefined
    if (handle?.breadcrumb) {
      if (typeof handle.breadcrumb === 'string') {
        items.push({ title: handle.breadcrumb })
      } else if (Array.isArray(handle.breadcrumb)) {
        handle.breadcrumb.forEach((title) => {
          items.push({ title })
        })
      }
    }
  })

  return items.length > 0 ? items : [{ title: APP_NAME }]
}

// 面包屑 Hook
export function useBreadcrumb() {
  const matches = useMatches()
  return generateBreadcrumbItems(matches)
}
