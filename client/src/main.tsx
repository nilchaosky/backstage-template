import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 注意：暂时移除了 StrictMode 以避免第三方库（table-render/antd）的 findDOMNode 警告
// 这是第三方库内部使用了已弃用的 API，不影响应用功能
// 如果库更新后修复了这个问题，可以重新启用 StrictMode
const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(<App />)
} else {
  throw new Error('Root element not found')
}
