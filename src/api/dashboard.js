/**
 * 大屏 Dashboard API 接口层
 * 统一封装所有数据请求，提供统一的错误处理和类型定义
 */

import { request } from '../utils/request.js';

// ============================================
// 网络资源 API
// ============================================

/**
 * 获取人流热力数据
 * @param {string} time - 可选的时间参数，格式 HH:mm
 * @returns {Promise<Array>} 人流热力数据
 */
export const fetchFlowData = async (time) => {
  try {
    const response = await request(`/v1/network/flow${time ? `?time=${time}` : ''}`);
    return response.data || [];
  } catch (error) {
    console.error('fetchFlowData error:', error);
    throw error;
  }
};

/**
 * 获取监控区域数据
 * @param {string} type - 区域类型: 'defense' | 'venue'
 * @returns {Promise<Object>} 区域数据
 */
export const fetchZoneData = async (type = 'defense') => {
  try {
    const response = await request(`/v1/venue/zones?type=${type}`);
    return response.data || { defenseZones: [], venueZones: [] };
  } catch (error) {
    console.error('fetchZoneData error:', error);
    throw error;
  }
};

/**
 * 获取网络资源概览
 * @returns {Promise<Object>} 网络资源数据
 */
export const fetchNetworkResources = async () => {
  try {
    const response = await request('/v1/network/resources');
    return response.data || {};
  } catch (error) {
    console.error('fetchNetworkResources error:', error);
    throw error;
  }
};

/**
 * 获取KQI指标
 * @returns {Promise<Array>} KQI指标数组
 */
export const fetchKqi = async () => {
  try {
    const response = await request('/v1/network/kqi');
    return response.data || [];
  } catch (error) {
    console.error('fetchKqi error:', error);
    throw error;
  }
};

/**
 * 获取基站点位
 * @returns {Promise<Array>} 基站数组
 */
export const fetchBaseStations = async () => {
  try {
    const response = await request('/v1/network/stations');
    return response.data || [];
  } catch (error) {
    console.error('fetchBaseStations error:', error);
    throw error;
  }
};

// ============================================
// 告警与事件 API
// ============================================

/**
 * 获取活动告警
 * @param {Object} options - 查询选项
 * @param {string} options.level - 告警级别: 'high' | 'medium' | 'low' | 'info'
 * @returns {Promise<Array>} 告警列表
 */
export const fetchActiveAlarms = async ({ level } = {}) => {
  try {
    const response = await request(`/v1/alarms/active${level ? `?level=${level}` : ''}`);
    return response.data || [];
  } catch (error) {
    console.error('fetchActiveAlarms error:', error);
    throw error;
  }
};

// ============================================
// 保障评估 API
// ============================================

/**
 * 获取S级保障战报
 * @returns {Promise<Object>} 战报数据
 */
export const fetchEvaluationReport = async () => {
  try {
    const response = await request('/v1/evaluation/report');
    return response.data || {};
  } catch (error) {
    console.error('fetchEvaluationReport error:', error);
    throw error;
  }
};

/**
 * 获取时间轴数据
 * @returns {Promise<Object>} 时间轴数据
 */
export const fetchTimeline = async () => {
  try {
    const response = await request('/v1/timeline');
    return response.data || {};
  } catch (error) {
    console.error('fetchTimeline error:', error);
    throw error;
  }
};

// ============================================
// 实时数据订阅 (WebSocket 备选)
// ============================================

/**
 * 订阅实时告警流
 * @param {Function} onData - 数据回调
 * @param {Function} onError - 错误回调
 * @returns {WebSocket} WebSocket实例
 */
export const subscribeAlarms = (onData, onError) => {
  const wsUrl = `ws://${window.location.hostname}:3001/ws/alarms`;
  
  const ws = new WebSocket(wsUrl);
  
  ws.onopen = () => {
    console.log('WebSocket connected for alarms');
  };
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onData(data);
    } catch (err) {
      console.error('WebSocket message parse error:', err);
    }
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    if (onError) onError(error);
  };
  
  ws.onclose = () => {
    console.log('WebSocket closed');
  };
  
  return ws;
};

// ============================================
// 批量数据获取 (用于Dashboard初始化)
// ============================================

/**
 * 批量获取P1全局守护视图所需数据
 * @returns {Promise<Object>} 所有P1数据
 */
export const fetchP1DashboardData = async () => {
  try {
    const [flow, zones, stations, alarms, resources, kqi] = await Promise.allSettled([
      fetchFlowData(),
      fetchZoneData('defense'),
      fetchBaseStations(),
      fetchActiveAlarms(),
      fetchNetworkResources(),
      fetchKqi()
    ]);

    return {
      flowData: flow.status === 'fulfilled' ? flow.value : [],
      zoneData: zones.status === 'fulfilled' ? zones.value : { defenseZones: [], venueZones: [] },
      stations: stations.status === 'fulfilled' ? stations.value : [],
      alarms: alarms.status === 'fulfilled' ? alarms.value : [],
      resources: resources.status === 'fulfilled' ? resources.value : {},
      kqi: kqi.status === 'fulfilled' ? kqi.value : []
    };
  } catch (error) {
    console.error('fetchP1DashboardData error:', error);
    throw error;
  }
};

/**
 * 批量获取P3评价视图所需数据
 * @returns {Promise<Object>} 所有P3数据
 */
export const fetchP3DashboardData = async () => {
  try {
    const [report, timeline] = await Promise.allSettled([
      fetchEvaluationReport(),
      fetchTimeline()
    ]);

    return {
      report: report.status === 'fulfilled' ? report.value : {},
      timeline: timeline.status === 'fulfilled' ? timeline.value : {}
    };
  } catch (error) {
    console.error('fetchP3DashboardData error:', error);
    throw error;
  }
};
