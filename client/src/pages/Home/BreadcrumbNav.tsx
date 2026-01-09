import { Breadcrumb, theme } from 'antd'
import { useBreadcrumb } from '@/hooks'

const { useToken } = theme

function BreadcrumbNav() {
  const { token } = useToken()
  const breadcrumbItems = useBreadcrumb()

  return (
    <div
      style={{
        padding: `${token.padding}px ${token.paddingLG}px`,
        backgroundColor: token.colorBgContainer,
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        display: 'flex',
        alignItems: 'center',
        minHeight: 48,
      }}
    >
      <Breadcrumb
        items={breadcrumbItems}
        style={{
          fontSize: token.fontSize,
          lineHeight: '1.5',
        }}
      />
    </div>
  )
}

export default BreadcrumbNav
