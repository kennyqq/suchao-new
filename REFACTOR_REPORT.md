# suchao-app 架构重构报告

## 重构目标
将项目从静态数据展示升级为生产级监控大屏，为真实后端数据对接做好准备。

## 重构内容

### 1. API 服务层 ✅

#### 新增文件
- `src/api/request.js` - Axios 封装
- `src/api/services/dashboard.js` - 大屏数据服务
- `src/api/index.js` - API 统一导出

#### 功能特性
- **请求拦截器**: Token 自动注入、请求 ID 生成、请求时间戳
- **响应拦截器**: 统一错误处理、Token 过期处理、业务状态码解析
- **Mock 接口**: 所有静态数据已提炼为异步模拟接口

#### 接口清单
| 接口 | 描述 |
|------|------|
| `fetchP0MigrationData()` | P0 迁徙数据 |
| `fetchP0TourismIndex()` | 文旅指数 |
| `fetchP0TransportData()` | 交通压力 |
| `fetchP0TourismAnalysis()` | 文旅分析 |
| `fetchP1GlobalData()` | P1 全局态势 |
| `fetchP1KQI()` | KQI 指标 |
| `fetchP1FlowData(time)` | 人流动线（时间敏感） |
| `fetchP1OpLogs()` | 运维日志 |
| `fetchP2VenueData()` | P2 场馆数据 |
| `fetchP3EvaluationData()` | P3 评估数据 |
| `fetchAlerts()` | 告警列表 |
| `fetchTimelineData()` | 时间轴数据 |

### 2. 状态管理 (Zustand) ✅

#### 新增文件
- `src/store/useDashboardStore.js` - Dashboard 全局状态

#### 管理的状态
```javascript
{
  currentView,        // 当前视图: 'p0' | 'p1' | 'p2' | 'p3'
  currentTime,        // 当前时间轴时间
  isTimelinePlaying,  // 播放状态
  selectedMetric,     // 选中指标
  loading,            // 各视图加载状态
  errors,             // 错误状态
  p0Data,             // P0 数据缓存
  p1Data,             // P1 数据缓存
  p2Data,             // P2 数据缓存
  p3Data,             // P3 数据缓存
  activeAlerts,       // 告警列表
  unreadAlertCount,   // 未读告警数
  timelineData,       // 时间轴数据
}
```

#### 核心 Actions
- `setCurrentView()` - 切换视图
- `setCurrentTime()` - 更新时间
- `fetchP0Data()` - 获取 P0 数据
- `fetchP1Data()` - 获取 P1 数据
- `fetchP2Data()` - 获取 P2 数据
- `fetchP3Data()` - 获取 P3 数据
- `addRealtimeAlert()` - 添加实时告警
- `initDashboard()` - 初始化所有数据

### 3. 数据协议 (TypeScript/JSDoc) ✅

#### 新增文件
- `src/types/dashboard.types.js` - 完整类型定义

#### 定义的类型
- `MigrationData` - 迁徙数据
- `TourismIndex` - 文旅指数
- `P1GlobalData` - P1 全局态势
- `BaseStation` - 基站点位
- `FlowData` - 人流动线
- `KQIItem` - KQI 指标
- `P2ViewData` - P2 视图数据
- `P3ViewData` - P3 视图数据
- `Alert` - 告警项
- `WSMessage` - WebSocket 消息

### 4. WebSocket 实时通信 ✅

#### 新增文件
- `src/hooks/useWebSocket.js` - WebSocket Hook
- `src/hooks/index.js` - Hooks 统一导出

#### 功能特性
- 自动连接/断开
- 心跳保活机制
- 自动重连（最多5次）
- 消息类型解析（ALERT/ALERT_UPDATE/METRICS_UPDATE）
- 与 Store 集成，自动更新告警列表

#### 使用方式
```javascript
import { useRealtimeAlerts } from './hooks/useWebSocket';

function AlertPanel() {
  const { isConnected } = useRealtimeAlerts({
    url: 'wss://api.example.com/ws/alerts'
  });
  
  const alerts = useDashboardStore(state => state.activeAlerts);
  
  return <div>{alerts.length} 条告警</div>;
}
```

### 5. 接口文档更新 ✅

#### 更新文件
- `README.md` - 新增《后端接口对接规范》章节

#### 文档内容
- API 基础信息（Base URL、认证方式）
- 统一响应格式
- 接口清单（P0/P1/P2/P3/公共接口）
- 关键数据结构说明
- WebSocket 通信协议
- 性能要求

## 安装的新依赖

```bash
npm install zustand axios --save
```

| 包 | 版本 | 用途 |
|---|------|------|
| zustand | latest | 状态管理 |
| axios | latest | HTTP 客户端 |

## 项目结构变更

```
src/
├── api/                    # 新增: API 服务层
│   ├── index.js           # API 统一导出
│   ├── request.js         # Axios 封装
│   └── services/
│       └── dashboard.js   # 大屏数据服务
├── hooks/                  # 新增: 自定义 Hooks
│   ├── index.js           # Hooks 统一导出
│   └── useWebSocket.js    # WebSocket Hook
├── store/                  # 新增: 状态管理
│   └── useDashboardStore.js
├── types/                  # 新增: 类型定义
│   └── dashboard.types.js
├── ...existing files
```

## 后续开发建议

### 1. 组件集成 Store
建议将现有组件从 Props 传递改为使用 Store：

```javascript
// 改造前
function LeftPanelP1({ currentTime }) {
  // 使用 props
}

// 改造后
function LeftPanelP1() {
  const currentTime = useDashboardStore(state => state.currentTime);
  const p1Data = useDashboardStore(state => state.p1Data.global);
  // 自动响应状态变化
}
```

### 2. 接入真实 API
修改 `src/api/request.js` 中的 `API_BASE_URL`：

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com/api/v1';
```

修改 `.env`：
```env
VITE_API_BASE_URL=https://api.example.com/api/v1
VITE_WS_URL=wss://api.example.com/ws/alerts
```

### 3. 删除 Mock 数据
当后端接口就绪后，删除 `dashboard.js` 中的 `Promise.resolve(mockData)`，替换为真实的 HTTP 请求：

```javascript
// 改造前
export const fetchP1GlobalData = () => {
  return Promise.resolve(mockData);
};

// 改造后
export const fetchP1GlobalData = () => {
  return http.get('/p1/global');
};
```

## 构建验证

```bash
npm run build
```

✅ 构建成功，无语法错误

---

**重构完成时间**: 2026-02-27
**重构版本**: v1.1.0-architecture
