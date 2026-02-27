/**
 * 大屏数据服务
 * 提供 P0/P1/P2/P3 视图的数据接口
 */

import { http } from '../request.js';

// ============================================
// P0 - 宏观溯源视图
// ============================================

/**
 * 获取球迷迁徙数据
 * @returns {Promise<MigrationData>}
 */
export const fetchP0MigrationData = () => {
  return Promise.resolve({
    national: [
      { from: '上海', to: '南京', value: 15200 },
      { from: '杭州', to: '南京', value: 9100 },
      { from: '合肥', to: '南京', value: 7800 },
      { from: '北京', to: '南京', value: 6500 },
      { from: '深圳', to: '南京', value: 4800 },
      { from: '武汉', to: '南京', value: 4200 },
      { from: '成都', to: '南京', value: 3600 },
      { from: '西安', to: '南京', value: 3100 },
    ],
    jiangsu: [
      { from: '苏州', to: '南京', value: 12400 },
      { from: '无锡', to: '南京', value: 8900 },
      { from: '常州', to: '南京', value: 7200 },
      { from: '南通', to: '南京', value: 5800 },
      { from: '徐州', to: '南京', value: 4200 },
      { from: '扬州', to: '南京', value: 3800 },
      { from: '盐城', to: '南京', value: 2900 },
      { from: '泰州', to: '南京', value: 2500 },
    ],
  });
};

/**
 * 获取文旅引流指数
 * @returns {Promise<TourismIndex>}
 */
export const fetchP0TourismIndex = () => {
  return Promise.resolve({
    current: 35241,
    unit: '人',
    growth: '+120%',
    baseline: 16000,
    updateTime: new Date().toISOString(),
  });
};

/**
 * 获取交通枢纽压力数据
 * @returns {Promise<TransportData[]>}
 */
export const fetchP0TransportData = () => {
  return Promise.resolve([
    { name: '奥体地铁站', type: 'metro', pressure: 2.65, today: '8.5万', normal: '3.2万', status: 'high' },
    { name: '南京南站', type: 'railway', pressure: 1.56, today: '12.5万', normal: '8万', status: 'medium' },
    { name: '南京站', type: 'railway', pressure: 1.51, today: '6.8万', normal: '4.5万', status: 'medium' },
    { name: '禄口机场', type: 'airport', pressure: 1.50, today: '5.2万', normal: '3.5万', status: 'medium' },
  ]);
};

/**
 * 获取文旅分析数据
 * @returns {Promise<TourismAnalysis>}
 */
export const fetchP0TourismAnalysis = () => {
  return Promise.resolve({
    totalVisitors: '8.6万',
    avgStayDuration: 26.5,
    hotSpots: [
      { name: '夫子庙秦淮河', visitors: '2.9万', growth: '+156%', rank: 1 },
      { name: '中山陵景区', visitors: '2.1万', growth: '+89%', rank: 2 },
      { name: '新街口商圈', visitors: '1.9万', growth: '+67%', rank: 3 },
      { name: '老门东', visitors: '1.6万', growth: '+134%', rank: 4 },
      { name: '总统府', visitors: '1.3万', growth: '+78%', rank: 5 },
    ],
  });
};

// ============================================
// P1 - 全局防御视图
// ============================================

/**
 * 获取 P1 全局态势数据
 * @returns {Promise<P1GlobalData>}
 */
export const fetchP1GlobalData = () => {
  return Promise.resolve({
    // 5G-A 资源概况
    resources: {
      stations: { total: 48, online: 48, offline: 0 },
      smartBoards: { total: 6, online: 6, offline: 0 },
      carriers3CC: { total: 48, active: 48 },
      emergencyCars: { total: 2, deployed: 2 },
    },
    // PRB 负荷
    prbLoad: {
      current: 42,
      history: [35, 38, 42, 45, 48, 52, 49, 46, 44, 42, 40, 38, 42, 45, 43],
      threshold: 70,
      status: 'normal', // normal, warning, danger
    },
    // 基站点位
    baseStations: [
      { id: 'site_001', name: '奥体主站', lng: 118.7265, lat: 32.0087, type: 'main', status: 'online' },
      { id: 'site_002', name: '奥体东站', lng: 118.7320, lat: 32.0095, type: 'sub', status: 'online' },
      { id: 'site_003', name: '奥体西站', lng: 118.7210, lat: 32.0090, type: 'sub', status: 'online' },
      { id: 'site_004', name: '奥体南站', lng: 118.7270, lat: 32.0030, type: 'sub', status: 'online' },
      { id: 'site_005', name: '奥体北站', lng: 118.7260, lat: 32.0140, type: 'sub', status: 'online' },
      { id: 'site_006', name: '元通站', lng: 118.7350, lat: 32.0050, type: 'sub', status: 'online' },
      { id: 'site_007', name: '梦都大街站', lng: 118.7180, lat: 32.0150, type: 'sub', status: 'online' },
      { id: 'site_008', name: '河西中央公园站', lng: 118.7400, lat: 32.0120, type: 'sub', status: 'online' },
    ],
    // 智能板位置
    boardLocations: [
      { id: 'board_001', name: '智能板-A', lng: 118.7245, lat: 32.0080, status: 'online' },
      { id: 'board_002', name: '智能板-B', lng: 118.7285, lat: 32.0095, status: 'online' },
      { id: 'board_003', name: '智能板-C', lng: 118.7260, lat: 32.0065, status: 'online' },
      { id: 'board_004', name: '智能板-D', lng: 118.7310, lat: 32.0075, status: 'online' },
      { id: 'board_005', name: '智能板-E', lng: 118.7230, lat: 32.0110, status: 'online' },
      { id: 'board_006', name: '智能板-F', lng: 118.7355, lat: 32.0105, status: 'online' },
    ],
    // 应急车位置
    emergencyVehicles: [
      { id: 'car_001', name: '应急通信车-1', lng: 118.7200, lat: 32.0100, status: 'standby' },
      { id: 'car_002', name: '应急通信车-2', lng: 118.7330, lat: 32.0060, status: 'standby' },
    ],
    // 监控区域
    defenseZones: [
      { id: 'zone_001', name: '主体育场', type: 'core', height: 80, color: 'rgba(0, 240, 255, 0.35)' },
      { id: 'zone_002', name: '华采天地', type: 'commercial', height: 70, color: 'rgba(204, 0, 255, 0.35)' },
      { id: 'zone_003', name: '元通枢纽', type: 'transit', height: 55, color: 'rgba(255, 165, 0, 0.4)' },
      { id: 'zone_004', name: '北门安检口', type: 'checkpoint', height: 40, color: 'rgba(255, 51, 51, 0.4)' },
    ],
    updateTime: new Date().toISOString(),
  });
};

/**
 * 获取 KQI 关键性能指标
 * @returns {Promise<KQIData[]>}
 */
export const fetchP1KQI = () => {
  return Promise.resolve([
    { 
      label: '总流量', 
      value: '8,420', 
      unit: 'GB', 
      trend: '+12%', 
      trendData: [6500, 7200, 6800, 7500, 8200, 7900, 8420],
      isHigherBetter: true,
    },
    { 
      label: '语音话务量', 
      value: '420', 
      unit: 'Erl', 
      trend: '+5%', 
      trendData: [380, 390, 400, 395, 410, 415, 420],
      isHigherBetter: true,
    },
    { 
      label: '平均吞吐', 
      value: '520', 
      unit: 'Mbps', 
      trend: '-2%', 
      trendData: [480, 510, 530, 545, 535, 528, 520],
      isHigherBetter: true,
    },
    { 
      label: '时延', 
      value: '12', 
      unit: 'ms', 
      trend: '-8%', 
      trendData: [18, 16, 15, 14, 13, 12.5, 12],
      isHigherBetter: false,
    },
  ]);
};

/**
 * 获取人流动线数据
 * @param {string} currentTime - 当前时间 (HH:mm)
 * @returns {Promise<FlowData[]>}
 */
export const fetchP1FlowData = (currentTime = '20:00') => {
  // 模拟根据时间返回不同的人流数据
  const timeSlot = parseInt(currentTime.split(':')[0]);
  const isExitPhase = timeSlot >= 21;

  const flows = [];
  
  // 进场人流 (17:00 - 20:00)
  if (!isExitPhase) {
    flows.push(
      { id: 'flow_001', from: '元通枢纽', to: '奥体', volume: 30 + Math.random() * 40, type: 'enter', path: [[118.7350, 32.0050], [118.7330, 32.0055], [118.7310, 32.0060], [118.7290, 32.0065], [118.7270, 32.0070], [118.7265, 32.0087]] },
      { id: 'flow_002', from: '华采天地', to: '奥体', volume: 40 + Math.random() * 50, type: 'enter', path: [[118.7340, 32.0035], [118.7345, 32.0045], [118.7335, 32.0055], [118.7325, 32.0065], [118.7315, 32.0075], [118.7300, 32.0085], [118.7265, 32.0087]] },
      { id: 'flow_003', from: '梦都大街', to: '奥体', volume: 25 + Math.random() * 35, type: 'enter', path: [[118.7180, 32.0150], [118.7190, 32.0140], [118.7200, 32.0130], [118.7210, 32.0120], [118.7220, 32.0110], [118.7230, 32.0100], [118.7240, 32.0090], [118.7265, 32.0087]] },
    );
  }
  
  // 散场人流 (21:00 - 23:00)
  if (isExitPhase) {
    flows.push(
      { id: 'flow_004', from: '奥体', to: '元通枢纽', volume: 60 + Math.random() * 80, type: 'exit', path: [[118.7265, 32.0087], [118.7275, 32.0075], [118.7295, 32.0065], [118.7315, 32.0055], [118.7335, 32.0050], [118.7350, 32.0050]] },
      { id: 'flow_005', from: '奥体', to: '华采天地', volume: 55 + Math.random() * 70, type: 'exit', path: [[118.7265, 32.0087], [118.7280, 32.0075], [118.7300, 32.0065], [118.7320, 32.0055], [118.7340, 32.0045], [118.7340, 32.0035]] },
      { id: 'flow_006', from: '奥体', to: '梦都大街', volume: 45 + Math.random() * 60, type: 'exit', path: [[118.7265, 32.0087], [118.7250, 32.0095], [118.7240, 32.0105], [118.7230, 32.0115], [118.7210, 32.0125], [118.7190, 32.0135], [118.7180, 32.0150]] },
    );
  }

  return Promise.resolve(flows);
};

/**
 * 获取智能运维日志
 * @returns {Promise<Oplog[]>}
 */
export const fetchP1OpLogs = () => {
  return Promise.resolve([
    { time: '19:42:19', type: 'success', content: '切换已恢复 时延+3ms' },
    { time: '19:42:25', type: 'info', content: '流量模式分析中...' },
    { time: '19:42:26', type: 'warn', content: '北广场拥塞指数上升' },
    { time: '19:42:27', type: 'ai', content: '预测性负载均衡启动' },
    { time: '19:42:28', type: 'ai', content: '激活应急波束' },
    { time: '19:42:29', type: 'success', content: '负载已分配 QoS稳定' },
    { time: '19:42:33', type: 'info', content: '小区04 PRB负载激增' },
    { time: '19:42:34', type: 'alert', content: '检测到光纤衰耗(eOTDR)' },
    { time: '19:42:36', type: 'success', content: '自愈运行中 场景: 1/3' },
    { time: '19:42:38', type: 'ai', content: '智能板协同调度完成' },
    { time: '19:42:40', type: 'info', content: '5G-A 载波聚合正常' },
    { time: '19:42:42', type: 'warn', content: '元通站流量预警' },
  ]);
};

// ============================================
// P2 - 场内微观视图
// ============================================

/**
 * 获取 P2 场内微观数据
 * @returns {Promise<P2VenueData>}
 */
export const fetchP2VenueData = () => {
  return Promise.resolve({
    // 场馆概况
    overview: {
      totalCapacity: 49700,
      currentAttendance: 49700,
      vipCount: 1700,
      networkStatus: 'excellent', // excellent, good, normal, poor
    },
    // 用户分层
    userLayers: [
      { label: '场馆包用户', value: 200, color: '#FFD700', percentage: 0.4 },
      { label: '全球通金卡', value: 1500, color: '#C0C0C0', percentage: 3.0 },
      { label: '普通用户', value: 48000, color: '#00F0FF', percentage: 96.6 },
    ],
    // 放号评估
    capacityAssessment: {
      currentUsage: 60,
      predictedPeak: 65,
      status: 'green', // green, yellow, red
      prediction: [58, 59, 60, 60, 61, 62, 63, 65],
    },
    // 终端分析
    terminalAnalysis: {
      ueLogoSupportRate: 60,
      topTerminals: [
        { rank: 1, brand: '华为', model: 'Mate 60 Pro', users: 12500, is5GA: false },
        { rank: 2, brand: '苹果', model: 'iPhone 15 Pro', users: 11200, is5GA: true },
        { rank: 3, brand: '小米', model: '14 Pro', users: 8900, is5GA: true },
        { rank: 4, brand: '荣耀', model: 'Magic 6', users: 7600, is5GA: true },
        { rank: 5, brand: 'vivo', model: 'X100 Pro', users: 6200, is5GA: true },
      ],
    },
    // 体验对比
    experienceCompare: {
      vip: { download: 850, upload: 120, videoHd: 99, liveHd: 100, latency: 18 },
      normal: { download: 60, upload: 20, videoHd: 85, liveHd: 90, latency: 35 },
    },
    // App KQI
    appKQI: [
      { name: '微信消息', metric: '20ms', label: '时延', status: 'good', icon: '💬' },
      { name: '抖音播放', metric: '高清', label: '画质', status: 'good', icon: '📱' },
      { name: '网页首屏', metric: '优', label: '体验', status: 'good', icon: '🌐' },
      { name: '扫码支付', metric: '99.99%', label: '成功', status: 'good', icon: '💳' },
    ],
    // 区域热点
    hotspots: [
      { id: 'zone_f', name: '南看台 F区', position: { top: '38%', left: '35%' }, color: 'red', isAlert: true },
      { id: 'zone_vip', name: '西看台 VIP', position: { top: '50%', left: '18%' }, color: 'cyan', isAlert: false },
      { id: 'zone_a', name: '东看台 A区', position: { top: '48%', left: '82%' }, color: 'cyan', isAlert: false },
      { id: 'staff_001', name: '保障专员：张三', position: { top: '42%', left: '68%' }, color: 'green', isAlert: false, hasVideo: true },
    ],
    updateTime: new Date().toISOString(),
  });
};

// ============================================
// P3 - 评估闭环视图
// ============================================

/**
 * 获取 P3 评估数据
 * @returns {Promise<P3EvaluationData>}
 */
export const fetchP3EvaluationData = () => {
  return Promise.resolve({
    // 比赛信息
    match: {
      date: '5月2日',
      home: '南京',
      away: '常州',
      score: '2:1',
      venue: '南京奥体中心',
    },
    // 核心数据
    coreMetrics: {
      peakAttendance: 65328,
      peakTraffic: 15.8,
      packages5GA: 850,
    },
    // VIP用户
    vipMetrics: {
      diamondUsers: 3241,
      packagesSold: 850,
    },
    // 上行流量趋势
    uplinkTrend: [
      { time: '19:00', value: 1.2 },
      { time: '19:15', value: 1.5 },
      { time: '19:30', value: 2.1 },
      { time: '19:45', value: 2.8 },
      { time: '20:00', value: 3.2 },
      { time: '20:15', value: 3.5 },
      { time: '20:30', value: 3.8 },
      { time: '20:45', value: 4.2, isPeak: true },
      { time: '21:00', value: 3.9 },
      { time: '21:15', value: 3.4 },
      { time: '21:30', value: 2.8 },
      { time: '21:45', value: 2.2 },
      { time: '22:00', value: 1.8 },
    ],
    // 智能体贡献
    agentContributions: [
      { label: '智能体自动优化', value: '156 次', desc: '参数自适应调整', trend: '+12% 效率提升', type: 'optimization' },
      { label: '潜在隐患拦截', value: '23 起', desc: '拥塞风险预警', trend: '0 故障发生', type: 'prevention' },
      { label: 'VIP感知保障', value: '100%', desc: '钻白卡用户零投诉', trend: '满意度 4.9/5', type: 'vip' },
      { label: '资源智能调度', value: '4.2x', desc: '动态负载均衡', trend: '峰值承载提升', type: 'resource' },
    ],
    // 优化建议
    suggestions: [
      { id: 1, title: '南看台F区扩容', desc: '建议增加2个4T4R小区', priority: 'high' },
      { id: 2, title: 'VIP专席保障优化', desc: '下一场提前15分钟预激活', priority: 'medium' },
      { id: 3, title: '上行干扰排查', desc: '西区存在外部干扰源', priority: 'medium' },
    ],
    // 保障评级
    assuranceLevel: 'S',
    updateTime: new Date().toISOString(),
  });
};

// ============================================
// 实时告警 - WebSocket 预留
// ============================================

/**
 * 获取告警列表（初始加载）
 * @returns {Promise<Alert[]>}
 */
export const fetchAlerts = () => {
  return Promise.resolve([
    { id: 1, level: 'high', title: '北广场拥塞指数上升', time: '2分钟前', area: '北广场', detail: '人流量超过阈值85%', timestamp: Date.now() - 120000 },
    { id: 2, level: 'high', title: '主入口基站负载过高', time: '3分钟前', area: '主入口', detail: 'PRB利用率达到92%', timestamp: Date.now() - 180000 },
    { id: 3, level: 'medium', title: '元通站流量预警', time: '5分钟前', area: '元通站', detail: '上行流量突增45%', timestamp: Date.now() - 300000 },
    { id: 4, level: 'medium', title: '应急车通信延迟', time: '7分钟前', area: '应急车-1', detail: '延迟达到120ms', timestamp: Date.now() - 420000 },
    { id: 5, level: 'low', title: '小区04 PRB负载波动', time: '8分钟前', area: '小区04', detail: '周期性波动 detected', timestamp: Date.now() - 480000 },
    { id: 6, level: 'low', title: '3CC载波切换频繁', time: '10分钟前', area: '全网', detail: '5分钟内切换12次', timestamp: Date.now() - 600000 },
    { id: 7, level: 'info', title: '3CC载波聚合正常', time: '12分钟前', area: '全网', detail: '载波聚合效率98%', timestamp: Date.now() - 720000 },
    { id: 8, level: 'info', title: 'AI预测模型更新完成', time: '15分钟前', area: '系统', detail: '模型版本 v2.3.1', timestamp: Date.now() - 900000 },
  ]);
};

/**
 * 时间轴数据
 * @returns {Promise<TimeSlotData>}
 */
export const fetchTimelineData = () => {
  return Promise.resolve({
    timeSlots: [
      '17:00', '17:15', '17:30', '17:45',
      '18:00', '18:15', '18:30', '18:45',
      '19:00', '19:15', '19:30', '19:45',
      '20:00', '20:15', '20:30', '20:45',
      '21:00', '21:15', '21:30', '21:45',
      '22:00', '22:15', '22:30', '22:45', '23:00'
    ],
    metrics: {
      crowd: [2.1, 2.3, 2.8, 3.5, 4.2, 5.1, 6.2, 7.1, 7.8, 8.2, 8.5, 8.8, 9.1, 9.3, 9.0, 8.5, 7.8, 6.5, 5.2, 4.1, 3.2, 2.5, 1.8, 1.2, 0.8],
      traffic: [0.8, 0.9, 1.1, 1.4, 1.8, 2.2, 2.8, 3.5, 4.2, 5.1, 6.2, 7.5, 8.8, 9.5, 9.2, 8.5, 7.2, 5.8, 4.5, 3.2, 2.1, 1.5, 1.0, 0.6, 0.3],
      fiveGA: [1.2, 1.4, 1.8, 2.5, 3.2, 4.1, 5.2, 6.5, 7.8, 9.2, 10.5, 11.8, 12.5, 12.2, 11.5, 10.2, 8.5, 6.8, 5.2, 3.8, 2.5, 1.8, 1.2, 0.8, 0.4],
    },
  });
};
