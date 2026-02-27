# 苏超智能化指挥中心

江苏超级联赛智能化指挥中心 - 数据可视化大屏应用。

![版本](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-19-61DAFB)
![Vite](https://img.shields.io/badge/Vite-7-646CFF)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC)

## 📸 项目预览

本项目是一个基于 React + Vite 的数据可视化大屏应用，用于江苏超级联赛（足球）的智能化指挥调度。

### 四大核心视图

| 视图 | 功能描述 | 技术亮点 |
|------|----------|----------|
| **P0 宏观溯源** | 全国/江苏省球迷迁徙态势感知 | ECharts 迁徙地图、热力图 |
| **P1 全局防御** | 5G-A 基站网络态势实时监控 | AntV L7 3D 地图、四色防御圈 |
| **P2 场内微观** | 场馆内部微观监控 | 用户分层金字塔、智能体评估 |
| **P3 评估闭环** | 赛后评估与复盘 | 全息战报、VIP 体验对比 |

## 🚀 一键启动指南

### 前置要求

- **Node.js**: >= 18.0.0 ([下载安装](https://nodejs.org/))
- **npm**: >= 9.0.0 (随 Node.js 自动安装)

> 验证安装：打开终端运行 `node -v` 和 `npm -v`，能看到版本号即表示安装成功。

### 第一步：解压项目

将 `suchao-app.zip` 解压到你电脑的任意位置，例如 `D:\projects\suchao-app`

### 第二步：安装依赖

```bash
# 进入项目目录
cd suchao-app

# 安装所有依赖（国内用户可使用 npm install --registry=https://registry.npmmirror.com）
npm install
```

> 💡 安装过程大约需要 1-3 分钟，取决于网络速度。

### 第三步：配置环境变量

```bash
# 复制示例配置文件
cp .env.example .env

# Windows 用户请使用以下命令：
copy .env.example .env
```

然后编辑 `.env` 文件，填入你的高德地图 API Key：

```env
VITE_AMAP_KEY=your_amap_key_here
VITE_AMAP_SECURITY_CODE=your_amap_security_code_here
```

> 🔑 **如何获取高德地图 Key？**
> 1. 访问 [高德地图开发者控制台](https://console.amap.com)
> 2. 注册/登录账号
> 3. 创建新应用，选择「Web 端 (JS API)」
> 4. 复制 Key 和安全密钥到 `.env` 文件

### 第四步：启动项目

```bash
npm run dev
```

看到以下提示即表示启动成功：

```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
  ➜  press h + enter to show help
```

现在打开浏览器访问 **http://localhost:3000** 即可使用！

### 第五步：切换视图

应用默认打开 P0 宏观溯源视图，点击顶部导航栏可切换：

- **宏观溯源** - 球迷迁徙态势
- **全局态势** - 5G-A 网络监控
- **场内微观** - 场馆内部监控
- **评估闭环** - 赛后评估报告

## 📦 构建生产版本

```bash
# 构建生产环境代码
npm run build

# 预览生产构建
npm run preview
```

构建后的文件位于 `dist/` 目录，可直接部署到 Vercel、Netlify 等平台。

## 🏗️ 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| **框架** | React | 19.x |
| **路由** | React Router | 7.x |
| **构建工具** | Vite | 7.x |
| **样式** | Tailwind CSS | 4.x |
| **动效** | Framer Motion | 12.x |
| **地图** | 高德 JS API + AntV L7 | 2.x |
| **图表** | ECharts | 6.x |
| **图标** | Lucide React | 0.x |

## 📁 项目结构

```
suchao-app/
├── public/                     # 静态资源
│   ├── china.json             # 中国地图 GeoJSON
│   ├── jiangsu.json           # 江苏地图 GeoJSON
│   ├── stadium-bg.jpg         # 场馆背景图
│   └── city_night_top_view.jpg # 城市夜景图
├── src/
│   ├── components/            # 全局组件
│   │   ├── Header.jsx         # 顶部导航
│   │   ├── TimelineV3.jsx     # 底部时间轴
│   │   ├── MacroMigrationMap.jsx  # P0 迁徙地图
│   │   └── CyberBorder.jsx    # 赛博边框效果
│   ├── pages/                 # 页面组件
│   │   ├── P1/               # 全局防御视图
│   │   │   ├── AmapL7Scene.jsx
│   │   │   ├── LeftPanelP1.jsx
│   │   │   └── RightPanelP1.jsx
│   │   ├── P2/               # 场内微观视图
│   │   │   ├── VenueMicro.jsx
│   │   │   ├── LeftPanelP2.jsx
│   │   │   ├── RightPanelP2.jsx
│   │   │   └── components/   # P2 子组件
│   │   └── P3/               # 评估闭环视图
│   │       ├── EvaluationView.jsx
│   │       ├── components/   # P3 子组件
│   │       └── ...
│   ├── styles/               # 全局样式
│   │   ├── index.css
│   │   └── App.css
│   ├── config/               # 配置文件
│   │   ├── amap.config.js
│   │   └── map.config.js
│   ├── App.jsx              # 根组件
│   └── main.jsx             # 入口文件
├── .env.example             # 环境变量示例
├── .env                     # 环境变量（需自行创建）
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md                # 本文件
```

## 🌐 路由说明

| 路径 | 视图 | 描述 |
|------|------|------|
| `/` 或 `/p0` | 宏观溯源 | 默认视图，球迷迁徙态势感知 |
| `/p1` | 全局态势 | 5G-A 基站网络态势监控 |
| `/p2` | 场内微观 | 场馆内部微观监控与智能体 |
| `/p3` | 评估闭环 | 赛后评估总结与复盘 |

## ⚙️ 环境变量

| 变量名 | 必填 | 描述 |
|--------|------|------|
| `VITE_AMAP_KEY` | ✅ | 高德地图 API Key |
| `VITE_AMAP_SECURITY_CODE` | ✅ | 高德地图安全密钥 |
| `VITE_APP_TITLE` | ❌ | 应用标题（默认：苏超智能化指挥中心） |
| `VITE_APP_VERSION` | ❌ | 应用版本 |

## 🛠️ 常见问题

### Q1: npm install 安装失败？

**A**: 项目已配置 `.npmrc` 使用 `legacy-peer-deps`，如果仍失败，尝试：
```bash
npm install --legacy-peer-deps
```

### Q2: 地图显示黑屏/空白？

**A**: 请检查：
1. `.env` 文件是否正确配置高德地图 Key
2. 浏览器控制台是否有 CORS 错误
3. 高德 Key 的「Web 端 (JS API)」服务是否已开启

### Q3: 如何修改端口号？

**A**: 修改 `vite.config.js`：
```javascript
export default defineConfig({
  server: {
    port: 3000,  // 修改此处
  },
})
```

### Q4: 项目支持手机访问吗？

**A**: 本项目为大屏设计，建议 1920x1080 分辨率使用。移动端仅支持基础浏览。

## 🔒 安全注意事项

⚠️ **重要**: 永远不要将 `.env` 文件提交到代码仓库！

- 所有敏感配置（API Key）使用环境变量
- `.env` 已添加到 `.gitignore`
- 生产环境使用 CI/CD 注入环境变量

## 📄 许可证

私有项目 - 江苏超级联赛组委会

## 🤝 技术支持

如有问题，请联系项目维护团队。

## 📡 后端接口对接规范

本文档为后端开发人员提供数据接口设计规范，确保前后端数据结构一致。

### API 基础信息

| 项目 | 值 |
|------|-----|
| Base URL | `/api/v1` |
| Content-Type | `application/json` |
| 认证方式 | Bearer Token |
| 时间格式 | ISO 8601 |

### 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": { /* 业务数据 */ },
  "requestId": "req_123456789",
  "timestamp": 1714531200000
}
```

### 接口清单

#### P0 - 宏观溯源

| 接口 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 迁徙数据 | GET | `/p0/migration` | 球迷来源地迁徙数据 |
| 文旅指数 | GET | `/p0/tourism-index` | 城市文旅引流指数 |
| 交通压力 | GET | `/p0/transport-pressure` | 交通枢纽压力监测 |
| 文旅分析 | GET | `/p0/tourism-analysis` | 文旅大数据分析 |

#### P1 - 全局态势

| 接口 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 全局数据 | GET | `/p1/global` | 5G-A资源、PRB负荷、基站点位等 |
| KQI指标 | GET | `/p1/kqi` | 关键性能指标 |
| 人流动线 | GET | `/p1/flow?time={HH:mm}` | 人流动线数据（时间敏感） |
| 运维日志 | GET | `/p1/op-logs` | CoPilot智能运维日志 |

#### P2 - 场内微观

| 接口 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 场馆数据 | GET | `/p2/venue` | 场馆概况、用户分层、终端分析等 |

#### P3 - 评估闭环

| 接口 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 评估数据 | GET | `/p3/evaluation` | 比赛信息、核心指标、智能体贡献等 |

#### 公共接口

| 接口 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 告警列表 | GET | `/alerts` | 实时告警列表 |
| 时间轴数据 | GET | `/timeline` | 时间轴指标数据 |

### 关键数据结构说明

#### 1. 迁徙数据 (Migration)

```typescript
interface MigrationItem {
  from: string;      // 出发地城市名
  to: string;        // 目的地（固定为"南京"）
  value: number;     // 人数
}

// 接口返回
{
  national: MigrationItem[];  // 全国迁徙 TOP8
  jiangsu: MigrationItem[];   // 省内迁徙 TOP8
}
```

**后端要求**：
- 数据来源于信令/计费系统的用户位置分析
- 实时计算或准实时（T+5分钟）
- 按人数降序排列

#### 2. 基站点位 (BaseStation)

```typescript
interface BaseStation {
  id: string;           // 站点唯一ID
  name: string;         // 站点名称
  lng: number;          // 经度
  lat: number;          // 纬度
  type: 'main' | 'sub'; // 主站/子站
  status: 'online' | 'offline' | 'warning';
  height?: number;      // 3D地图显示高度（米）
  metrics?: {
    rsrp?: number;      // 参考信号接收功率
    sinr?: number;      // 信干噪比
    load?: number;      // 负载率
  };
}
```

**后端要求**：
- 对接网管系统获取基站状态
- 主站为奥体中心宏站，子站为周边微站
- 实时更新（30秒以内）

#### 3. KQI 指标 (KQI)

```typescript
interface KQIItem {
  label: string;        // 指标名称
  value: string;        // 当前值（格式化字符串）
  unit: string;         // 单位
  trend: string;        // 变化趋势，如 "+12%" / "-5%"
  trendData: number[];  // 趋势图数据（最近7-15个点）
  isHigherBetter: boolean; // 用于UI颜色判断
}
```

**后端要求**：
- 流量/话务量：从话单系统聚合
- 时延/吞吐：从 DPI 或探针系统获取
- trendData 建议提供过去1-2小时的数据点

#### 4. 实时告警 (Alert)

```typescript
interface Alert {
  id: number;
  level: 'high' | 'medium' | 'low' | 'info';
  title: string;        // 告警标题
  time: string;         // 相对时间（如"2分钟前"）
  timestamp: number;    // 绝对时间戳
  area: string;         // 影响区域
  detail: string;       // 详细描述
  read?: boolean;       // 是否已读
}
```

**后端要求**：
- 对接故障管理系统或告警平台
- 支持 WebSocket 实时推送
- 支持告警生命周期管理（产生、恢复、清除）

### WebSocket 实时通信

#### 连接地址
```
ws://api.example.com/ws/alerts?token={JWT_TOKEN}
```

#### 消息类型

| 类型 | 方向 | 说明 |
|------|------|------|
| `SUBSCRIBE` | C→S | 订阅频道 |
| `ALERT` | S→C | 新告警推送 |
| `ALERT_UPDATE` | S→C | 告警更新 |
| `ALERT_CLEAR` | S→C | 告警清除 |
| `METRICS_UPDATE` | S→C | 指标更新 |
| `PING/PONG` | 双向 | 心跳保活 |

#### 订阅消息示例
```json
{
  "type": "SUBSCRIBE",
  "channels": ["alerts", "metrics"]
}
```

#### 告警推送示例
```json
{
  "type": "ALERT",
  "payload": {
    "id": 123,
    "level": "high",
    "title": "北广场拥塞指数上升",
    "area": "北广场",
    "detail": "人流量超过阈值85%",
    "timestamp": 1714531200000
  },
  "timestamp": 1714531200000
}
```

### 性能要求

| 指标 | 要求 |
|------|------|
| 接口响应时间 | < 500ms (P95) |
| WebSocket延迟 | < 100ms |
| 数据新鲜度 | 告警 < 3s, 指标 < 30s |
| 并发支持 | 支持 50+ 大屏同时在线 |

### 数据类型定义文件

详细的数据类型定义请参考：
- `src/types/dashboard.types.js` - JSDoc 类型定义
- `src/api/services/dashboard.js` - Mock 数据结构参考

---

** Made with ❤️ by 江苏超级联赛技术团队 **
