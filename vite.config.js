import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    // ============================================
    // Vite 反向代理配置
    // 将 /api 请求转发到 BFF 服务 (localhost:3001)
    // ============================================
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        // pathRewrite 在 Vite 中不需要，直接转发 /api 路径
        configure: (proxy, options) => {
          // 可选：添加代理日志
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'echarts-vendor': ['echarts', 'echarts-for-react'],
          'map-vendor': ['@antv/l7', '@antv/l7-maps', '@amap/amap-jsapi-loader']
        }
      }
    }
  }
})
