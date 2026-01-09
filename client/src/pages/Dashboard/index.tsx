import { Result, Typography } from 'antd'
import { ToolOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

function Dashboard() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100%',
      padding: '40px 20px'
    }}>
      <Result
        icon={<ToolOutlined style={{ fontSize: 72, color: '#1890ff' }} />}
        title={
          <Title level={2} style={{ marginTop: 16 }}>
            仪表盘
          </Title>
        }
        subTitle={
          <Paragraph style={{ fontSize: 16, color: '#666' }}>
            内容正在开发中，敬请期待...
          </Paragraph>
        }
      />
    </div>
  )
}

export default Dashboard
