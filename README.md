# 苏超智能化指挥中心

江苏超级联赛智能化指挥中心 - 数据可视化大屏应用。

## 项目概述

本项目是一个基于 React + Vite 的数据可视化大屏应用，用于江苏超级联赛（足球）的智能化指挥调度。包含三个主要视图：

- **P0 宏观溯源**: 全国/江苏省球迷迁徙态势感知
- **P1 全局防御**: 5G-A 基站网络态势实时监控
- **P2 场内微观**: 场馆内部微观监控
- **P3 评估闭环**: 赛后评估与复盘

## 技术栈

- **框架**: React 19 + React Router 7
- **构建工具**: Vite 7
- **样式**: Tailwind CSS 4
- **动效**: Framer Motion
- **地图**: 高德地图 JS API + AntV L7
- **图表**: ECharts 6
- **图标**: Lucide React

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 配置环境变量

```bash
# 复制示例环境变量文件
cp .env.example .env

# 编辑 .env 文件，填入你的高德地图 API Key
VITE_AMAP_KEY=your_amap_key_here
VITE_AMAP_SECURITY_CODE=your_amap_security_code_here
```

> 获取高德地图 Key: https://console.amap.com

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 项目结构

```
suchao-app/
├── src/
│   ├── components/          # 全局组件
│   │   ├── CyberBorder.jsx
│   │   ├── Header.jsx
│   │   ├── LeftPanel.jsx
│   │   ├── RightPanel.jsx
│   │   ├── MacroMigrationMap.jsx
│   │   ├── MigrationMap.jsx
│   │   ├── TimelineUnified.jsx
│   │   ├── TimelineV2.jsx
│   │   └── TimelineV3.jsx
│   ├── pages/               # 页面组件
│   │   ├── P1/             # 全局防御视图
│   │   ├── P2/             # 场内微观视图
│   │   └── P3/             # 评估闭环视图
│   ├── styles/             # 样式文件
│   │   ├── index.css
│   │   └── App.css
│   ├── config/             # 配置文件
│   │   ├── amap.config.js
│   │   ├── map.config.js
│   │   └── timeline.config.js
│   ├── hooks/              # 自定义 Hooks
│   ├── utils/              # 工具函数
│   ├── App.jsx
│   └── main.jsx
├── public/                 # 静态资源
├── docs/                   # 文档
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── eslint.config.js
└── postcss.config.js
```

## 路由说明

| 路径 | 视图 | 描述 |
|------|------|------|
| `/` | P0 宏观溯源 | 默认视图，球迷迁徙地图 |
| `/p0` | P0 宏观溯源 | 同上 |
| `/p1` | P1 全局防御 | 5G-A 基站网络态势 |
| `/p2` | P2 场内微观 | 场馆微观监控 |
| `/p3` | P3 评估闭环 | 赛后评估 |

## 环境变量

| 变量名 | 必填 | 描述 |
|--------|------|------|
| `VITE_AMAP_KEY` | 是 | 高德地图 API Key |
| `VITE_AMAP_SECURITY_CODE` | 是 | 高德地图安全密钥 |
| `VITE_APP_TITLE` | 否 | 应用标题 |
| `VITE_APP_VERSION` | 否 | 应用版本 |

## 开发规范

### 命名规范

- **组件**: PascalCase (如 `MacroMigrationMap.jsx`)
- **函数/变量**: camelCase (如 `handleClick`)
- **常量**: UPPER_SNAKE_CASE (如 `TIME_SLOTS`)
- **配置文件**: kebab-case (如 `amap.config.js`)

### 代码规范

- 使用 ESLint 进行代码检查
- 禁用 console.log (保留 console.error 用于错误处理)
- 组件函数长度建议不超过 50 行
- 复杂逻辑抽取为自定义 Hooks

## 安全注意事项

⚠️ **重要**: 永远不要将 API Key 提交到代码仓库！

- 所有敏感配置使用环境变量
- .env 文件已添加到 .gitignore
- 生产环境使用 CI/CD 注入环境变量

## 许可证

私有项目 - 江苏超级联赛组委会

## 重构说明

本项目是从 `super-league-command` 重构而来，主要改进：

1. 提取硬编码配置到独立配置文件
2. 使用环境变量管理敏感信息
3. 移除所有 console.log 调试语句
4. 标准化项目结构
5. 优化 ESLint 配置

详见 `REFACTOR_REPORT.md`
