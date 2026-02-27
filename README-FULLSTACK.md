# suchao-app 全栈工程文档

本项目已改造为 **Frontend + BFF (Backend for Frontend)** 全栈架构，前端基于 React + Vite，后端基于 Express Node.js。

## 🏗️ 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                      suchao-app                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐         ┌──────────────────────────────┐   │
│  │  Frontend   │         │         BFF Layer            │   │
│  │  (React)    │◄───────►│      (Express.js)            │   │
│  │  :3000      │  Proxy  │      :3001                   │   │
│  └─────────────┘         └──────────────────────────────┘   │
│         ▲                           │                       │
│         │                           ▼                       │
│    Vite Dev                    Mock Data                    │
│    Server                      (可替换为真实数据源)         │
└─────────────────────────────────────────────────────────────┘
```

## 📁 项目结构

```
suchao-app/
├── server/                      # BFF 后端服务
│   └── index.js                # Express 入口，API 路由定义
├── src/
│   ├── api/
│   │   ├── dashboard.js        # Dashboard API 接口封装
│   │   └── index.js            # API 统一导出
│   ├── utils/
│   │   └── request.js          # fetch 请求封装
│   ├── pages/
│   │   ├── P1/
│   │   │   ├── AmapL7Scene.jsx      # 已接入 API
│   │   │   └── RightPanelP1.jsx     # 已接入 API
│   │   └── P3/
│   │       ├── EvaluationView.jsx   # 已接入 API
│   │       └── components/          # 子组件已适配
│   └── ...existing files
├── vite.config.js              # 已配置反向代理
└── package.json                # 已添加全栈启动脚本
```

## 🚀 快速启动

### 一键启动前后端（推荐）

```bash
npm run dev
```

这将同时启动：
- BFF 后端服务: http://localhost:3001
- 前端开发服务器: http://localhost:3000

### 单独启动

```bash
# 仅启动前端
npm run dev:frontend

# 仅启动后端
npm run server
```

## 🔌 API 接口列表

### BFF 服务端口: 3001

| 接口 | 方法 | 描述 | 前端调用方法 |
|------|------|------|-------------|
| `/api/health` | GET | 健康检查 | `checkHealth()` |
| `/api/v1/network/flow` | GET | 人流动线数据 | `fetchFlowData(time)` |
| `/api/v1/network/resources` | GET | 5G-A 网络资源 | `fetchNetworkResources()` |
| `/api/v1/network/kqi` | GET | KQI 指标 | `fetchKQI()` |
| `/api/v1/network/stations` | GET | 基站点位 | `fetchBaseStations()` |
| `/api/v1/venue/zones` | GET | 监控区域/看台 | `fetchZoneData(type)` |
| `/api/v1/evaluation/report` | GET | S级保障战报 | `fetchEvaluationReport()` |
| `/api/v1/alarms/active` | GET | 实时告警 | `fetchActiveAlarms()` |
| `/api/v1/timeline` | GET | 时间轴数据 | `fetchTimelineData()` |

### 接口响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": { /* 业务数据 */ },
  "timestamp": 1714531200000
}
```

## 🔄 前端改造详情

### 1. P1 全局态势 (AmapL7Scene.jsx)

**改造前**: 使用硬编码的 `FLOW_DATA`, `BASE_STATIONS`, `zoneData`

**改造后**: 
```javascript
// 从 BFF 获取动态数据
const [flowData, setFlowData] = useState([]);
const [zoneData, setZoneData] = useState(null);
const [baseStations, setBaseStations] = useState([]);

useEffect(() => {
  const loadData = async () => {
    const [flow, zones, stations] = await Promise.all([
      fetchFlowData(currentTime),
      fetchZoneData('defense'),
      fetchBaseStations()
    ]);
    // 更新状态，地图自动重绘
  };
  loadData();
}, [currentTime]);
```

### 2. P1 右侧面板 (RightPanelP1.jsx)

**改造前**: 静态 `ALERT_DATA`

**改造后**:
```javascript
const [alerts, setAlerts] = useState([]);

useEffect(() => {
  fetchActiveAlarms().then(setAlerts);
  // 每30秒自动刷新
  const interval = setInterval(() => {
    fetchActiveAlarms().then(setAlerts);
  }, 30000);
}, []);
```

### 3. P3 评估闭环 (EvaluationView.jsx)

**改造前**: 静态战报数据

**改造后**:
```javascript
const [reportData, setReportData] = useState(null);

useEffect(() => {
  fetchEvaluationReport().then(data => {
    setReportData(data);
  });
}, []);
```

## ⚙️ 配置说明

### Vite 反向代理 (vite.config.js)

```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    }
  }
}
```

前端代码中请求 `/api/xxx` 会被自动代理到 BFF 服务。

### 前端请求封装 (src/utils/request.js)

- 基础 URL: `/api`
- 超时时间: 30秒
- 统一错误处理
- 自动 JSON 解析

### BFF 数据源 (server/index.js)

当前使用 Mock 数据，可轻松替换为真实数据源：

```javascript
// 示例：接入真实网管 API
const fetchRealStations = async () => {
  const response = await axios.get('http://nms.api.com/stations');
  return response.data;
};

app.get('/api/v1/network/stations', async (req, res) => {
  const data = await fetchRealStations();
  res.json({ code: 200, data });
});
```

## 📝 环境变量

创建 `.env` 文件：

```env
# 高德地图配置（前端必需）
VITE_AMAP_KEY=your_amap_key_here
VITE_AMAP_SECURITY_CODE=your_amap_security_code_here

# BFF 服务端口（后端可选，默认 3001）
PORT=3001
```

## 🧪 验证测试

### 测试 BFF 接口

```bash
# 健康检查
curl http://localhost:3001/api/health

# 获取告警数据
curl http://localhost:3001/api/v1/alarms/active

# 获取评估报告
curl http://localhost:3001/api/v1/evaluation/report
```

### 测试前端代理

```bash
# 启动服务后访问
open http://localhost:3000

# 切换 P1/P2/P3 视图，观察网络面板中的 API 请求
```

## 🛠️ 后续扩展

### 接入真实数据源

1. **网管系统**: 替换 `server/index.js` 中的基站、告警 Mock 数据
2. **信令平台**: 替换人流动线、用户画像数据
3. **计费系统**: 替换 5G-A 套餐销量数据

### 添加数据库

```javascript
// 示例：添加 MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/suchao');

const AlarmSchema = new mongoose.Schema({
  level: String,
  title: String,
  timestamp: Date,
  // ...
});
```

### WebSocket 实时推送

BFF 层已预留 WebSocket 扩展点，可添加 Socket.io：

```javascript
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  // 推送实时告警
  setInterval(() => {
    socket.emit('alarm', generateNewAlarm());
  }, 5000);
});
```

## 📊 性能优化建议

1. **数据缓存**: BFF 层添加 Redis 缓存热点数据
2. **分页加载**: 告警列表支持分页，避免一次性加载过多
3. **增量更新**: 时间轴数据使用增量更新而非全量刷新
4. **压缩传输**: 启用 gzip 压缩 API 响应

---

**改造完成时间**: 2026-02-27  
**版本**: v2.0.0-fullstack
