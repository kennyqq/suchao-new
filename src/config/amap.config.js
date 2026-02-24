/**
 * 高德地图配置文件
 * 
 * 环境变量:
 * - VITE_AMAP_KEY: 高德地图 API Key
 * - VITE_AMAP_SECURITY_CODE: 高德地图安全密钥
 * 
 * 获取方式: https://console.amap.com
 */

export const AMAP_CONFIG = {
  key: import.meta.env.VITE_AMAP_KEY || '',
  securityCode: import.meta.env.VITE_AMAP_SECURITY_CODE || '',
  version: '2.0',
  plugins: ['AMap.Map'],
};

export const AMAP_CENTER = {
  // 南京奥体中心坐标
  coordinates: [118.7265, 32.0087],
  zoom: 15.5,
  pitch: 55,
};

export const BASE_STATIONS = [
  { id: 'site_001', name: '奥体主站', lng: 118.7265, lat: 32.0087, type: 'main', height: 80 },
  { id: 'site_002', name: '奥体东站', lng: 118.7320, lat: 32.0095, type: 'sub', height: 50 },
  { id: 'site_003', name: '奥体西站', lng: 118.7210, lat: 32.0090, type: 'sub', height: 50 },
  { id: 'site_004', name: '奥体南站', lng: 118.7270, lat: 32.0030, type: 'sub', height: 50 },
  { id: 'site_005', name: '奥体北站', lng: 118.7260, lat: 32.0140, type: 'sub', height: 50 },
  { id: 'site_006', name: '元通站', lng: 118.7350, lat: 32.0050, type: 'sub', height: 45 },
  { id: 'site_007', name: '梦都大街站', lng: 118.7180, lat: 32.0150, type: 'sub', height: 45 },
  { id: 'site_008', name: '河西中央公园站', lng: 118.7400, lat: 32.0120, type: 'sub', height: 45 },
];

export const RISK_AREAS = [
  {
    id: 'risk_001',
    name: '北广场高密区',
    coordinates: [
      [118.7240, 32.0120],
      [118.7280, 32.0120],
      [118.7285, 32.0145],
      [118.7245, 32.0145],
      [118.7240, 32.0120],
    ],
  },
  {
    id: 'risk_002',
    name: '主入口拥堵区',
    coordinates: [
      [118.7250, 32.0060],
      [118.7280, 32.0060],
      [118.7280, 32.0080],
      [118.7250, 32.0080],
      [118.7250, 32.0060],
    ],
  },
];
