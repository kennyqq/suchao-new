/**
 * suchao-app BFF (Backend for Frontend) 服务
 * 为前端大屏提供数据聚合和清洗服务
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// 中间件配置
// ============================================

// CORS 配置
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// JSON 解析
app.use(express.json());

// 请求日志
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ============================================
// Mock 数据源
// ============================================

// 人流动线数据
const mockFlowData = [
  { id: 'flow_001', from: '元通枢纽', to: '奥体', volume: 65, type: 'enter', path: [[118.7350, 32.0050], [118.7330, 32.0055], [118.7310, 32.0060], [118.7290, 32.0065], [118.7270, 32.0070], [118.7265, 32.0087]], time: '18:00' },
  { id: 'flow_002', from: '华采天地', to: '奥体', volume: 78, type: 'enter', path: [[118.7340, 32.0035], [118.7345, 32.0045], [118.7335, 32.0055], [118.7325, 32.0065], [118.7315, 32.0075], [118.7300, 32.0085], [118.7265, 32.0087]], time: '18:15' },
  { id: 'flow_003', from: '梦都大街', to: '奥体', volume: 52, type: 'enter', path: [[118.7180, 32.0150], [118.7190, 32.0140], [118.7200, 32.0130], [118.7210, 32.0120], [118.7220, 32.0110], [118.7230, 32.0100], [118.7240, 32.0090], [118.7265, 32.0087]], time: '18:30' },
  { id: 'flow_004', from: '奥体', to: '元通枢纽', volume: 120, type: 'exit', path: [[118.7265, 32.0087], [118.7275, 32.0075], [118.7295, 32.0065], [118.7315, 32.0055], [118.7335, 32.0050], [118.7350, 32.0050]], time: '21:30' },
  { id: 'flow_005', from: '奥体', to: '华采天地', volume: 95, type: 'exit', path: [[118.7265, 32.0087], [118.7280, 32.0075], [118.7300, 32.0065], [118.7320, 32.0055], [118.7340, 32.0045], [118.7340, 32.0035]], time: '21:45' },
  { id: 'flow_006', from: '奥体', to: '梦都大街', volume: 82, type: 'exit', path: [[118.7265, 32.0087], [118.7250, 32.0095], [118.7240, 32.0105], [118.7230, 32.0115], [118.7210, 32.0125], [118.7190, 32.0135], [118.7180, 32.0150]], time: '22:00' },
];

// 监控区域数据
const zoneData = {
  defenseZones: [
    { id: 'zone_001', name: '主体育场', type: 'core', height: 80, color: 'rgba(0, 240, 255, 0.35)', coordinates: [[118.723, 32.011], [118.730, 32.011], [118.730, 32.006], [118.723, 32.006]] },
    { id: 'zone_002', name: '华采天地', type: 'commercial', height: 70, color: 'rgba(204, 0, 255, 0.35)', coordinates: [[118.732, 32.005], [118.736, 32.005], [118.736, 32.002], [118.732, 32.002]] },
    { id: 'zone_003', name: '元通枢纽', type: 'transit', height: 55, color: 'rgba(255, 165, 0, 0.4)', coordinates: [[118.728, 32.001], [118.731, 32.001], [118.731, 31.998], [118.728, 31.998]] },
    { id: 'zone_004', name: '北门安检口', type: 'checkpoint', height: 40, color: 'rgba(255, 51, 51, 0.4)', coordinates: [[118.725, 32.013], [118.728, 32.013], [118.728, 32.012], [118.725, 32.012]] }
  ],
  venueZones: [
    { id: 'zone_f', name: '南看台 F区', position: { top: '38%', left: '35%' }, color: 'red', isAlert: true, currentLoad: 2000, capacity: 2500 },
    { id: 'zone_vip', name: '西看台 VIP', position: { top: '50%', left: '18%' }, color: 'cyan', isAlert: false, currentLoad: 1700, capacity: 2000 },
    { id: 'zone_a', name: '东看台 A区', position: { top: '48%', left: '82%' }, color: 'cyan', isAlert: false, currentLoad: 8500, capacity: 10000 },
    { id: 'zone_b', name: '北看台 B区', position: { top: '25%', left: '50%' }, color: 'cyan', isAlert: false, currentLoad: 7200, capacity: 9000 }
  ]
};

// S级保障战报数据
const evaluationReport = {
  match: { date: '5月2日', home: '南京', away: '常州', score: '2:1', venue: '南京奥体中心' },
  coreMetrics: {
    peakAttendance: { value: 65328, unit: '人', label: '奥体球迷峰值' },
    peakTraffic: { value: 15.8, unit: 'TB', label: '峰值话务量' },
    packages5GA: { value: 850, unit: '份', label: '5G-A 场馆包销量' }
  },
  vipMetrics: { diamondUsers: 3241, packagesSold: 850 },
  uplinkTrend: [
    { time: '19:00', value: 1.2 }, { time: '19:15', value: 1.5 }, { time: '19:30', value: 2.1 },
    { time: '19:45', value: 2.8 }, { time: '20:00', value: 3.2 }, { time: '20:15', value: 3.5 },
    { time: '20:30', value: 3.8 }, { time: '20:45', value: 4.2, isPeak: true },
    { time: '21:00', value: 3.9 }, { time: '21:15', value: 3.4 }, { time: '21:30', value: 2.8 },
    { time: '21:45', value: 2.2 }, { time: '22:00', value: 1.8 }
  ],
  agentContributions: [
    { label: '智能体自动优化', value: '156 次', desc: '参数自适应调整', trend: '+12% 效率提升', type: 'optimization', icon: 'Bot' },
    { label: '潜在隐患拦截', value: '23 起', desc: '拥塞风险预警', trend: '0 故障发生', type: 'prevention', icon: 'Shield' },
    { label: 'VIP感知保障', value: '100%', desc: '钻白卡用户零投诉', trend: '满意度 4.9/5', type: 'vip', icon: 'Activity' },
    { label: '资源智能调度', value: '4.2x', desc: '动态负载均衡', trend: '峰值承载提升', type: 'resource', icon: 'Zap' }
  ],
  suggestions: [
    { id: 1, title: '南看台F区扩容', desc: '建议增加2个4T4R小区', priority: 'high' },
    { id: 2, title: 'VIP专席保障优化', desc: '下一场提前15分钟预激活', priority: 'medium' },
    { id: 3, title: '上行干扰排查', desc: '西区存在外部干扰源', priority: 'medium' }
  ],
  assuranceLevel: 'S'
};

// 告警数据
const activeAlarms = [
  { id: 1, level: 'high', title: '北广场拥塞指数上升', time: '2分钟前', timestamp: Date.now() - 120000, area: '北广场', detail: '人流量超过阈值85%' },
  { id: 2, level: 'high', title: '主入口基站负载过高', time: '3分钟前', timestamp: Date.now() - 180000, area: '主入口', detail: 'PRB利用率达到92%' },
  { id: 3, level: 'medium', title: '元通站流量预警', time: '5分钟前', timestamp: Date.now() - 300000, area: '元通站', detail: '上行流量突增45%' },
  { id: 4, level: 'medium', title: '应急车通信延迟', time: '7分钟前', timestamp: Date.now() - 420000, area: '应急车-1', detail: '延迟达到120ms' },
  { id: 5, level: 'low', title: '小区04 PRB负载波动', time: '8分钟前', timestamp: Date.now() - 480000, area: '小区04', detail: '周期性波动 detected' },
  { id: 6, level: 'info', title: 'AI预测模型更新完成', time: '15分钟前', timestamp: Date.now() - 900000, area: '系统', detail: '模型版本 v2.3.1' }
];

// 网络资源数据
const networkResources = {
  stations: { total: 48, online: 48, offline: 0 },
  smartBoards: { total: 6, online: 6, offline: 0 },
  carriers3CC: { total: 48, active: 48 },
  emergencyCars: { total: 2, deployed: 2 },
  prbLoad: { current: 42, history: [35, 38, 42, 45, 48, 52, 49, 46, 44, 42, 40, 38, 42, 45, 43], threshold: 70, status: 'normal' }
};

// KQI 数据
const kqiData = [
  { label: '总流量', value: '8,420', unit: 'GB', trend: '+12%', trendData: [6500, 7200, 6800, 7500, 8200, 7900, 8420], isHigherBetter: true },
  { label: '语音话务量', value: '420', unit: 'Erl', trend: '+5%', trendData: [380, 390, 400, 395, 410, 415, 420], isHigherBetter: true },
  { label: '平均吞吐', value: '520', unit: 'Mbps', trend: '-2%', trendData: [480, 510, 530, 545, 535, 528, 520], isHigherBetter: true },
  { label: '时延', value: '12', unit: 'ms', trend: '-8%', trendData: [18, 16, 15, 14, 13, 12.5, 12], isHigherBetter: false }
];

// 基站数据
const baseStations = [
  { id: 'site_001', name: '奥体主站', lng: 118.7265, lat: 32.0087, type: 'main', status: 'online', height: 80 },
  { id: 'site_002', name: '奥体东站', lng: 118.7320, lat: 32.0095, type: 'sub', status: 'online', height: 50 },
  { id: 'site_003', name: '奥体西站', lng: 118.7210, lat: 32.0090, type: 'sub', status: 'online', height: 50 },
  { id: 'site_004', name: '奥体南站', lng: 118.7270, lat: 32.0030, type: 'sub', status: 'online', height: 50 },
  { id: 'site_005', name: '奥体北站', lng: 118.7260, lat: 32.0140, type: 'sub', status: 'online', height: 50 },
  { id: 'site_006', name: '元通站', lng: 118.7350, lat: 32.0050, type: 'sub', status: 'online', height: 45 },
  { id: 'site_007', name: '梦都大街站', lng: 118.7180, lat: 32.0150, type: 'sub', status: 'online', height: 45 },
  { id: 'site_008', name: '河西中央公园站', lng: 118.7400, lat: 32.0120, type: 'sub', status: 'online', height: 45 }
];

// 时间轴数据
const timelineData = {
  timeSlots: ['17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00'],
  metrics: {
    crowd: [2.1, 2.3, 2.8, 3.5, 4.2, 5.1, 6.2, 7.1, 7.8, 8.2, 8.5, 8.8, 9.1, 9.3, 9.0, 8.5, 7.8, 6.5, 5.2, 4.1, 3.2, 2.5, 1.8, 1.2, 0.8],
    traffic: [0.8, 0.9, 1.1, 1.4, 1.8, 2.2, 2.8, 3.5, 4.2, 5.1, 6.2, 7.5, 8.8, 9.5, 9.2, 8.5, 7.2, 5.8, 4.5, 3.2, 2.1, 1.5, 1.0, 0.6, 0.3],
    fiveGA: [1.2, 1.4, 1.8, 2.5, 3.2, 4.1, 5.2, 6.5, 7.8, 9.2, 10.5, 11.8, 12.5, 12.2, 11.5, 10.2, 8.5, 6.8, 5.2, 3.8, 2.5, 1.8, 1.2, 0.8, 0.4]
  }
};

// ============================================
// API 路由 - 简化版本，确保稳定
// ============================================

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      service: 'suchao-bff',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: Date.now()
    }
  });
});

// 1. 人流动线
app.get('/api/v1/network/flow', (req, res) => {
  try {
    const { time } = req.query;
    let data = mockFlowData;
    
    if (time) {
      const hour = parseInt(time.split(':')[0]);
      const isExitPhase = hour >= 21;
      data = mockFlowData.filter(item => isExitPhase ? item.type === 'exit' : item.type === 'enter');
    }
    
    res.json({ code: 200, message: 'success', data, timestamp: Date.now() });
  } catch (err) {
    console.error('Flow API error:', err);
    res.status(500).json({ code: 500, message: err.message, data: [], timestamp: Date.now() });
  }
});

// 2. 监控区域
app.get('/api/v1/venue/zones', (req, res) => {
  try {
    const { type } = req.query;
    let data = zoneData;
    
    if (type === 'defense') {
      data = { defenseZones: zoneData.defenseZones };
    } else if (type === 'venue') {
      data = { venueZones: zoneData.venueZones };
    }
    
    res.json({ code: 200, message: 'success', data, timestamp: Date.now() });
  } catch (err) {
    console.error('Zones API error:', err);
    res.status(500).json({ code: 500, message: err.message, data: zoneData, timestamp: Date.now() });
  }
});

// 3. S级战报
app.get('/api/v1/evaluation/report', (req, res) => {
  try {
    res.json({ code: 200, message: 'success', data: evaluationReport, timestamp: Date.now() });
  } catch (err) {
    console.error('Report API error:', err);
    res.status(500).json({ code: 500, message: err.message, data: evaluationReport, timestamp: Date.now() });
  }
});

// 4. 告警列表
app.get('/api/v1/alarms/active', (req, res) => {
  try {
    const { level } = req.query;
    let data = activeAlarms;
    
    if (level) {
      data = activeAlarms.filter(item => item.level === level);
    }
    
    res.json({ 
      code: 200, 
      message: 'success', 
      data,
      meta: {
        total: data.length,
        highPriority: data.filter(i => i.level === 'high').length
      },
      timestamp: Date.now() 
    });
  } catch (err) {
    console.error('Alarms API error:', err);
    res.status(500).json({ code: 500, message: err.message, data: activeAlarms, timestamp: Date.now() });
  }
});

// 额外接口：网络资源
app.get('/api/v1/network/resources', (req, res) => {
  try {
    res.json({ code: 200, message: 'success', data: networkResources, timestamp: Date.now() });
  } catch (err) {
    console.error('Resources API error:', err);
    res.status(500).json({ code: 500, message: err.message, data: networkResources, timestamp: Date.now() });
  }
});

// 额外接口：KQI
app.get('/api/v1/network/kqi', (req, res) => {
  try {
    res.json({ code: 200, message: 'success', data: kqiData, timestamp: Date.now() });
  } catch (err) {
    console.error('KQI API error:', err);
    res.status(500).json({ code: 500, message: err.message, data: kqiData, timestamp: Date.now() });
  }
});

// 额外接口：基站
app.get('/api/v1/network/stations', (req, res) => {
  try {
    res.json({ code: 200, message: 'success', data: baseStations, timestamp: Date.now() });
  } catch (err) {
    console.error('Stations API error:', err);
    res.status(500).json({ code: 500, message: err.message, data: baseStations, timestamp: Date.now() });
  }
});

// 额外接口：时间轴
app.get('/api/v1/timeline', (req, res) => {
  try {
    res.json({ code: 200, message: 'success', data: timelineData, timestamp: Date.now() });
  } catch (err) {
    console.error('Timeline API error:', err);
    res.status(500).json({ code: 500, message: err.message, data: timelineData, timestamp: Date.now() });
  }
});

// ============================================
// 错误处理
// ============================================

app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: `Route not found: ${req.method} ${req.url}`,
    data: null,
    timestamp: Date.now()
  });
});

app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    code: 500,
    message: 'Internal server error: ' + err.message,
    data: null,
    timestamp: Date.now()
  });
});

// ============================================
// 启动服务
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║           suchao-app BFF Service                       ║
╠════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:${PORT}            ║
║  Environment: ${process.env.NODE_ENV || 'development'}  ║
╚════════════════════════════════════════════════════════╝

Available Endpoints:
  GET /api/health                    - 健康检查
  GET /api/v1/network/flow           - 人流动线数据
  GET /api/v1/network/resources      - 网络资源
  GET /api/v1/network/kqi            - KQI指标
  GET /api/v1/network/stations       - 基站点位
  GET /api/v1/venue/zones            - 监控区域/看台
  GET /api/v1/evaluation/report      - S级保障战报
  GET /api/v1/alarms/active          - 实时告警
  GET /api/v1/timeline               - 时间轴数据
  `);
});
