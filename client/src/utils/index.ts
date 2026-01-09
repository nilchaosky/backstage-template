// 工具函数

/**
 * 清除字符串中的所有空格
 * @param value 输入值
 * @returns 清除空格后的字符串
 */
export const trimAllSpaces = (value: string | undefined | null): string => {
  if (value == null) {
    return ''
  }
  return String(value).replace(/\s+/g, '')
}
