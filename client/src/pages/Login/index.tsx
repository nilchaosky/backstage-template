import { Typography, theme } from 'antd'
import { APP_NAME } from '@/constants'

const { Title } = Typography
const { useToken } = theme

function Login() {
  const { token } = useToken()

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* 左侧表单区域 - 30% */}
      <div
        style={{
          width: '30%',
          minWidth: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: token.paddingXL * 2,
          background: `linear-gradient(135deg, ${token.colorPrimaryBg} 0%, ${token.colorBgContainer} 50%, ${token.colorPrimaryBg} 100%)`,
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <Title level={2} style={{ marginBottom: token.marginXS }}>
            {APP_NAME}
          </Title>
          <Typography.Text type="secondary" style={{ fontSize: token.fontSizeLG, display: 'block', marginBottom: token.marginXL }}>
            欢迎登录，请输入您的账户信息
          </Typography.Text>
          
          {/* 开发中提示 */}
          <div
            style={{
              padding: token.paddingXL * 2,
              background: token.colorBgContainer,
              borderRadius: token.borderRadiusLG,
              boxShadow: token.boxShadow,
            }}
          >
            <Title level={3} style={{ color: token.colorWarning, marginBottom: token.marginMD }}>
              功能开发中
            </Title>
            <Typography.Text type="secondary" style={{ fontSize: token.fontSize }}>
              登录功能正在开发中，敬请期待...
            </Typography.Text>
          </div>
        </div>
      </div>

      {/* 右侧艺术图区域 - 70% */}
      <div
        style={{
          width: '70%',
          position: 'relative',
          background: `linear-gradient(135deg, ${token.colorPrimary}15 0%, ${token.colorPrimary}05 50%, ${token.colorPrimary}10 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 渐变遮罩层，增强视觉效果 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${token.colorPrimary}15 0%, transparent 50%, ${token.colorPrimary}10 100%)`,
          }}
        />
      </div>
    </div>
  )
}

export default Login
