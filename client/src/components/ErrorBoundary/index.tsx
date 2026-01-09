import { Component, type ReactNode } from 'react'
import { Result, Button, theme } from 'antd'

const { useToken } = theme

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: unknown
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error }
  }

  override componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <ErrorBoundaryContent onReset={this.handleReset} />
    }

    return this.props.children
  }
}

function ErrorBoundaryContent({ onReset }: { onReset: () => void }) {
  const { token } = useToken()

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: token.colorBgLayout,
      }}
    >
      <Result
        status="500"
        title="500"
        subTitle="抱歉，页面出现了错误。"
        extra={
          <Button type="primary" onClick={onReset}>
            重试
          </Button>
        }
      />
    </div>
  )
}

export default ErrorBoundary
