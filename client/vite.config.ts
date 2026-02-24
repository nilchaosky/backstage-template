import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Fast Refresh 默认启用，无需配置
      // 开发时使用 babel 进行转换以提升性能
      babel: {
        plugins: [],
        compact: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // 优化依赖解析
    dedupe: ['react', 'react-dom'],
  },
  // 开发服务器配置
  server: {
    // 预热常用文件以提升启动速度
    warmup: {
      clientFiles: ['./src/main.tsx', './src/App.tsx', './src/router/index.tsx'],
    },
    // 优化 HMR
    hmr: {
      overlay: true,
    },
  },
  // 构建优化
  build: {
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 生成 source map（生产环境可设为 false 以减小体积）
    sourcemap: false,
    // 压缩配置
    minify: 'esbuild', // 使用 esbuild 压缩，速度更快
    // 代码分割配置
    rollupOptions: {
      output: {
        // 手动分包策略
        manualChunks: (id) => {
          // node_modules 中的包单独打包
          if (id.includes('node_modules')) {
            // React 核心库
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'react-core'
            }
            // React Router
            if (id.includes('react-router')) {
              return 'react-router'
            }
            // Ant Design 相关（合并 antd 和图标）
            if (id.includes('antd/') || id.includes('@ant-design/icons')) {
              return 'antd'
            }
            // 工具库
            if (id.includes('zustand') || id.includes('ahooks') || id.includes('axios')) {
              return 'utils'
            }
            // Table Render
            if (id.includes('table-render')) {
              return 'table-render'
            }
            // 其他第三方库：尝试识别较大的依赖并单独打包
            // 常见的较大依赖库
            const largeDeps = ['lodash', 'moment', 'dayjs', 'date-fns', 'ramda']
            for (const dep of largeDeps) {
              if (id.includes(dep)) {
                return `vendor-${dep}`
              }
            }
            // 其他第三方库合并打包
            return 'vendor'
          }
          // 非 node_modules 的代码不进行手动分包
          return undefined
        },
        // 优化 chunk 文件命名
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `img/[name]-[hash][extname]`
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
      },
    },
    // 块大小警告限制（KB）- 核心库（antd、vendor）确实较大，这是正常的
    chunkSizeWarningLimit: 1000,
    // 禁用 gzip 压缩报告（可提升构建速度）
    reportCompressedSize: false,
  },
  // 依赖优化配置
  optimizeDeps: {
    // 预构建的依赖
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'antd',
      '@ant-design/icons',
      'axios',
      'zustand',
      'table-render',
      'ahooks',
    ],
    // 排除预构建的依赖
    exclude: [],
    // 强制预构建（开发时）
    force: false,
  },
  // CSS 配置
  css: {
    // 开发时启用 source map
    devSourcemap: true,
    // 构建时压缩
    postcss: {
      plugins: [],
    },
  },
  // 性能优化
  esbuild: {
    // 生产环境移除 console 和 debugger
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    // 启用 tree shaking
    treeShaking: true,
  },
})
