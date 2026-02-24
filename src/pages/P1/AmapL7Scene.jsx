import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import AMapLoader from '@amap/amap-jsapi-loader';
import { Scene, GaodeMap, PointLayer, LineLayer, PolygonLayer } from '@antv/l7';
import { Loader2, AlertCircle, MapPin } from 'lucide-react';

// 高德地图配置
const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || '';
const AMAP_SECURITY_CODE = import.meta.env.VITE_AMAP_SECURITY_CODE || '';
const CENTER_COORDINATES = [118.7265, 32.0087];

// 5G-A 基站点位
const BASE_STATIONS = [
  { id: 'site_001', name: '奥体主站', lng: 118.7265, lat: 32.0087, type: 'main' },
  { id: 'site_002', name: '奥体东站', lng: 118.7320, lat: 32.0095, type: 'sub' },
  { id: 'site_003', name: '奥体西站', lng: 118.7210, lat: 32.0090, type: 'sub' },
  { id: 'site_004', name: '奥体南站', lng: 118.7270, lat: 32.0030, type: 'sub' },
  { id: 'site_005', name: '奥体北站', lng: 118.7260, lat: 32.0140, type: 'sub' },
  { id: 'site_006', name: '元通站', lng: 118.7350, lat: 32.0050, type: 'sub' },
  { id: 'site_007', name: '梦都大街站', lng: 118.7180, lat: 32.0150, type: 'sub' },
  { id: 'site_008', name: '河西中央公园站', lng: 118.7400, lat: 32.0120, type: 'sub' },
];

// 智能板位置
const BOARD_LOCATIONS = [
  { id: 'board_001', name: '智能板-A', lng: 118.7245, lat: 32.0080 },
  { id: 'board_002', name: '智能板-B', lng: 118.7285, lat: 32.0095 },
  { id: 'board_003', name: '智能板-C', lng: 118.7260, lat: 32.0065 },
  { id: 'board_004', name: '智能板-D', lng: 118.7310, lat: 32.0075 },
  { id: 'board_005', name: '智能板-E', lng: 118.7230, lat: 32.0110 },
  { id: 'board_006', name: '智能板-F', lng: 118.7355, lat: 32.0105 },
];

// 应急车位置
const EMERGENCY_VEHICLES = [
  { id: 'car_001', name: '应急通信车-1', lng: 118.7200, lat: 32.0100 },
  { id: 'car_002', name: '应急通信车-2', lng: 118.7330, lat: 32.0060 },
];

// 生成带时间戳的人流动线数据
const generateFlowData = () => {
  const flows = [];
  const timeSlots = [
    '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45',
    '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45',
    '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00'
  ];
  
  // 起点：元通枢纽 -> 奥体南门 (进场)
  for (let i = 0; i < 12; i++) {
    flows.push({
      id: `yuan tong-south-${i}`,
      time: timeSlots[i],
      path: [
        [118.7350, 32.0050], // 元通站
        [118.7330, 32.0055],
        [118.7310, 32.0060],
        [118.7290, 32.0065],
        [118.7270, 32.0070],
        [118.7265, 32.0087], // 奥体主站
      ],
      volume: 30 + Math.random() * 40 + i * 8,
      type: 'enter',
    });
  }
  
  // 起点：华采天地 -> 奥体东门 (进场)
  for (let i = 0; i < 12; i++) {
    flows.push({
      id: `huacai-east-${i}`,
      time: timeSlots[i],
      path: [
        [118.7340, 32.0035], // 华采天地
        [118.7345, 32.0045],
        [118.7335, 32.0055],
        [118.7325, 32.0065],
        [118.7315, 32.0075],
        [118.7300, 32.0085],
        [118.7265, 32.0087], // 奥体主站
      ],
      volume: 40 + Math.random() * 50 + i * 10,
      type: 'enter',
    });
  }
  
  // 起点：梦都大街站 -> 奥体西门 (进场)
  for (let i = 0; i < 12; i++) {
    flows.push({
      id: `mengdu-west-${i}`,
      time: timeSlots[i],
      path: [
        [118.7180, 32.0150], // 梦都大街站
        [118.7190, 32.0140],
        [118.7200, 32.0130],
        [118.7210, 32.0120],
        [118.7220, 32.0110],
        [118.7230, 32.0100],
        [118.7240, 32.0090],
        [118.7265, 32.0087], // 奥体主站
      ],
      volume: 25 + Math.random() * 35 + i * 6,
      type: 'enter',
    });
  }
  
  // 起点：河西中央公园 -> 奥体北门 (进场)
  for (let i = 0; i < 12; i++) {
    flows.push({
      id: `hexi-north-${i}`,
      time: timeSlots[i],
      path: [
        [118.7400, 32.0120], // 河西中央公园
        [118.7380, 32.0125],
        [118.7360, 32.0130],
        [118.7340, 32.0135],
        [118.7320, 32.0140],
        [118.7280, 32.0130],
        [118.7265, 32.0110],
        [118.7265, 32.0087], // 奥体主站
      ],
      volume: 35 + Math.random() * 45 + i * 8,
      type: 'enter',
    });
  }
  
  // 散场阶段：奥体 -> 各出口 (21:30 后开始)
  for (let i = 18; i < 25; i++) {
    // 奥体 -> 元通 (散场)
    flows.push({
      id: `exit-yuantong-${i}`,
      time: timeSlots[i],
      path: [
        [118.7265, 32.0087], // 奥体主站
        [118.7275, 32.0075],
        [118.7295, 32.0065],
        [118.7315, 32.0055],
        [118.7335, 32.0050],
        [118.7350, 32.0050], // 元通站
      ],
      volume: 60 + Math.random() * 80 + (i - 18) * 15,
      type: 'exit',
    });
    
    // 奥体 -> 华采 (散场)
    flows.push({
      id: `exit-huacai-${i}`,
      time: timeSlots[i],
      path: [
        [118.7265, 32.0087], // 奥体主站
        [118.7280, 32.0075],
        [118.7300, 32.0065],
        [118.7320, 32.0055],
        [118.7340, 32.0045],
        [118.7340, 32.0035], // 华采天地
      ],
      volume: 55 + Math.random() * 70 + (i - 18) * 12,
      type: 'exit',
    });
    
    // 奥体 -> 梦都大街 (散场)
    flows.push({
      id: `exit-mengdu-${i}`,
      time: timeSlots[i],
      path: [
        [118.7265, 32.0087], // 奥体主站
        [118.7250, 32.0095],
        [118.7240, 32.0105],
        [118.7230, 32.0115],
        [118.7210, 32.0125],
        [118.7190, 32.0135],
        [118.7180, 32.0150], // 梦都大街
      ],
      volume: 45 + Math.random() * 60 + (i - 18) * 10,
      type: 'exit',
    });
  }
  
  return flows;
};

const FLOW_DATA = generateFlowData();

// 高保真科技图标定义
// 5G-A 科技基站塔图标 (青色)
const STATION_ICON_SVG = `data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L10 8H14L12 2Z" fill="%2300F0FF"/><path d="M11 9H13V22H11V9Z" fill="%2300F0FF" fill-opacity="0.8"/><path d="M8 12H16" stroke="%2300F0FF" stroke-width="2"/><path d="M6 16H18" stroke="%2300F0FF" stroke-width="2"/><circle cx="12" cy="2" r="2" fill="%23FFFFFF"/></svg>`;

// 主站金色图标
const MAIN_STATION_ICON_SVG = `data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L10 8H14L12 2Z" fill="%23FFD700"/><path d="M11 9H13V22H11V9Z" fill="%23FFD700" fill-opacity="0.8"/><path d="M8 12H16" stroke="%23FFD700" stroke-width="2"/><path d="M6 16H18" stroke="%23FFD700" stroke-width="2"/><circle cx="12" cy="2" r="2" fill="%23FFFFFF"/></svg>`;

// 应急通信车图标 (金色)
const CAR_ICON_SVG = `data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 10H17V17H3V10Z" fill="%23FFD700" fill-opacity="0.9"/><path d="M17 12H21V17H17V12Z" fill="%23FFD700" fill-opacity="0.7"/><circle cx="7" cy="18" r="2" fill="%23FFFFFF"/><circle cx="15" cy="18" r="2" fill="%23FFFFFF"/><path d="M5 10L8 5H12L15 10" stroke="%23FFD700" stroke-width="2"/><circle cx="10" cy="4" r="1.5" fill="%23FF3333"/></svg>`;

const BOARD_ICON_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect x="8" y="8" width="16" height="16" rx="2" fill="#00F0FF" opacity="0.8"/>
  <circle cx="16" cy="16" r="3" fill="#00F0FF"/>
</svg>
`)}`;

export default function AmapL7Scene({ onStationClick, currentTime = '20:00' }) {
  const sceneRef = useRef(null);
  const flowLayerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadStatus, setLoadStatus] = useState('准备中...');
  const [mapReady, setMapReady] = useState(false);

  // 初始化地图
  useEffect(() => {
    let isMounted = true;
    let scene = null;

    const initMap = async () => {
      try {
        setLoading(true);
        setError(null);

        setLoadStatus('配置安全密钥...');
        if (typeof window !== 'undefined') {
          window._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY_CODE };
        }

        setLoadStatus('加载高德地图...');
        await AMapLoader.load({
          key: AMAP_KEY,
          version: '2.0',
          plugins: ['AMap.Map'],
        });

        if (!isMounted) return;

        setLoadStatus('初始化场景...');
        const container = document.getElementById('map-container');
        if (!container) throw new Error('地图容器未找到');

        scene = new Scene({
          id: 'map-container',
          map: new GaodeMap({
            pitch: 60,
            zoom: 15.5,
            center: CENTER_COORDINATES,
            viewMode: '3D',
            style: 'amap://styles/darkblue',
            features: ['bg', 'road', 'building'],
          }),
        });

        // 设置深色背景
        scene.setBgColor('#0B1A2A');

        sceneRef.current = scene;

        scene.on('loaded', () => {
          if (!isMounted) return;
          setMapReady(true);
          setLoading(false);
          addLayers(scene);
        });

        scene.on('error', (err) => {
          if (isMounted) {
            setError(`地图加载失败: ${err.message || '未知错误'}`);
            setLoading(false);
          }
        });

      } catch (err) {
        if (isMounted) {
          setError(err.message || '地图初始化失败');
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(() => initMap(), 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (scene) scene.destroy();
    };
  }, []);

  // 监听时间变化，更新人流动画
  useEffect(() => {
    if (flowLayerRef.current && mapReady) {
      // 过滤当前时间点前后15分钟的流动数据
      const activeFlows = FLOW_DATA.filter(item => {
        const itemMinutes = parseInt(item.time.split(':')[0]) * 60 + parseInt(item.time.split(':')[1]);
        const currentMinutes = parseInt(currentTime.split(':')[0]) * 60 + parseInt(currentTime.split(':')[1]);
        const diff = Math.abs(itemMinutes - currentMinutes);
        return diff <= 15; // 显示前后15分钟内的流动
      });
      
      flowLayerRef.current.setData(activeFlows);
    }
  }, [currentTime, mapReady]);

  // 添加图层
  const addLayers = async (scene) => {
    try {
      const mainStation = BASE_STATIONS.find(s => s.type === 'main');
      const subStations = BASE_STATIONS.filter(s => s.type === 'sub');

      // 注册图标
      await scene.addImage('station-icon', STATION_ICON_SVG);
      await scene.addImage('main-station-icon', MAIN_STATION_ICON_SVG);
      await scene.addImage('car-icon', CAR_ICON_SVG);
      await scene.addImage('board-icon', BOARD_ICON_SVG);

      // 1. 人流动线图层 - 最先添加作为底层
      const flowLayer = new LineLayer({ 
        name: 'flow-lines',
        blend: 'normal',
        zIndex: 1,
      })
        .source([], {
          parser: { type: 'json', coordinates: 'path' }
        })
        .size('volume', [2, 6])
        .shape('line')
        .color('type', (type) => {
          return type === 'exit' 
            ? 'rgba(255, 100, 50, 0.85)'  // 散场橙红色
            : 'rgba(0, 240, 255, 0.85)';   // 进场青色
        })
        .animate({
          enable: true,
          interval: 0.1,
          trailLength: 0.5,
          duration: 1.5,
        })
        .style({
          opacity: 0.9,
          lineType: 'solid',
        });
      
      scene.addLayer(flowLayer);
      flowLayerRef.current = flowLayer;

      // 初始加载当前时间的流动数据
      const initialFlows = FLOW_DATA.filter(item => {
        const itemMinutes = parseInt(item.time.split(':')[0]) * 60 + parseInt(item.time.split(':')[1]);
        const currentMinutes = parseInt(currentTime.split(':')[0]) * 60 + parseInt(currentTime.split(':')[1]);
        const diff = Math.abs(itemMinutes - currentMinutes);
        return diff <= 15;
      });
      flowLayer.setData(initialFlows);

      // 2. 四大监控防线区域 - 3D 拔高立体色块
      const zoneData = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { name: '主体育场', type: 'core', height: 80, color: 'rgba(0, 240, 255, 0.35)' },
            geometry: { type: 'Polygon', coordinates: [[[118.723, 32.011], [118.730, 32.011], [118.730, 32.006], [118.723, 32.006], [118.723, 32.011]]] }
          },
          {
            type: 'Feature',
            properties: { name: '华采天地', type: 'commercial', height: 70, color: 'rgba(204, 0, 255, 0.35)' },
            geometry: { type: 'Polygon', coordinates: [[[118.732, 32.005], [118.736, 32.005], [118.736, 32.002], [118.732, 32.002], [118.732, 32.005]]] }
          },
          {
            type: 'Feature',
            properties: { name: '元通枢纽', type: 'transit', height: 55, color: 'rgba(255, 165, 0, 0.4)' },
            geometry: { type: 'Polygon', coordinates: [[[118.728, 32.001], [118.731, 32.001], [118.731, 31.998], [118.728, 31.998], [118.728, 32.001]]] }
          },
          {
            type: 'Feature',
            properties: { name: '北门安检口', type: 'checkpoint', height: 40, color: 'rgba(255, 51, 51, 0.4)' },
            geometry: { type: 'Polygon', coordinates: [[[118.725, 32.013], [118.728, 32.013], [118.728, 32.012], [118.725, 32.012], [118.725, 32.013]]] }
          }
        ]
      };

      // 3D 立体防线色块 - 全息玻璃盒子效果
      const zoneLayer = new PolygonLayer({ name: 'defense-zones', zIndex: 2 })
        .source(zoneData)
        .color('color')
        .shape('extrude')
        .size('height')
        .style({ opacity: 0.6, pickLight: true })
        .animate({ enable: true, speed: 0.5, rings: 2 });
      scene.addLayer(zoneLayer);

      // 3. 基站和图标图层 - 高保真科技图标
      // 主站 - 金色涟漪底座 + 科技塔图标
      const mainBaseLayer = new PointLayer({ name: 'main-base', zIndex: 3 })
        .source([mainStation], { parser: { type: 'json', x: 'lng', y: 'lat' } })
        .shape('circle')
        .color('#FFD700')
        .size(45)
        .style({ opacity: 0.3 })
        .animate({ enable: true, speed: 0.02, rings: 2 });
      scene.addLayer(mainBaseLayer);

      const mainIconLayer = new PointLayer({ name: 'main-icon', zIndex: 4 })
        .source([mainStation], { parser: { type: 'json', x: 'lng', y: 'lat' } })
        .shape('main-station-icon')
        .size(35)
        .style({ opacity: 1, offsets: [0, 15] });
      scene.addLayer(mainIconLayer);

      // 子站 - 青色涟漪底座 + 科技塔图标
      const subBaseLayer = new PointLayer({ name: 'sub-base', zIndex: 3 })
        .source(subStations, { parser: { type: 'json', x: 'lng', y: 'lat' } })
        .shape('circle')
        .color('#00F0FF')
        .size(35)
        .style({ opacity: 0.25 })
        .animate({ enable: true, speed: 0.025, rings: 2 });
      scene.addLayer(subBaseLayer);

      const subIconLayer = new PointLayer({ name: 'sub-icon', zIndex: 4 })
        .source(subStations, { parser: { type: 'json', x: 'lng', y: 'lat' } })
        .shape('station-icon')
        .size(35)
        .style({ opacity: 1, offsets: [0, 15] });
      scene.addLayer(subIconLayer);

      // 智能板
      const boardBaseLayer = new PointLayer({ name: 'board-base', zIndex: 3 })
        .source(BOARD_LOCATIONS, { parser: { type: 'json', x: 'lng', y: 'lat' } })
        .shape('circle')
        .color('#00F0FF')
        .size(25)
        .style({ opacity: 0.2 })
        .animate({ enable: true, speed: 0.03, rings: 2 });
      scene.addLayer(boardBaseLayer);

      const boardIconLayer = new PointLayer({ name: 'board-icon', zIndex: 4 })
        .source(BOARD_LOCATIONS, { parser: { type: 'json', x: 'lng', y: 'lat' } })
        .shape('board-icon')
        .size(22)
        .style({ opacity: 0.9, offsets: [0, 18] });
      scene.addLayer(boardIconLayer);

      // 应急车 - 金色涟漪底座 + 高保真通信车图标
      const carBaseLayer = new PointLayer({ name: 'car-base', zIndex: 3 })
        .source(EMERGENCY_VEHICLES, { parser: { type: 'json', x: 'lng', y: 'lat' } })
        .shape('circle')
        .color('#FFD700')
        .size(40)
        .style({ opacity: 0.25 })
        .animate({ enable: true, speed: 0.035, rings: 2 });
      scene.addLayer(carBaseLayer);

      const carIconLayer = new PointLayer({ name: 'car-icon', zIndex: 4 })
        .source(EMERGENCY_VEHICLES, { parser: { type: 'json', x: 'lng', y: 'lat' } })
        .shape('car-icon')
        .size(35)
        .style({ opacity: 1, offsets: [0, 15] });
      scene.addLayer(carIconLayer);

      // 点击事件
      subIconLayer.on('click', (e) => {
        if (e.feature && onStationClick) {
          const station = BASE_STATIONS.find(s => s.id === e.feature.id);
          if (station) onStationClick(station);
        }
      });

      mainIconLayer.on('click', () => {
        if (onStationClick) onStationClick(mainStation);
      });

    } catch (err) {
      // Error handling
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0B1A2A]">
      <div id="map-container" className="absolute inset-0 w-full h-full z-0" />

      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-cyber-bg/80 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <Loader2 className="w-12 h-12 text-cyber-cyan animate-spin mx-auto mb-4" />
            <div className="text-cyber-cyan text-lg font-din mb-2">加载 3D 地图引擎...</div>
            <div className="text-white/50 text-sm">{loadStatus}</div>
          </motion.div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-cyber-bg/90">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-lg p-6">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <div className="text-red-400 text-xl font-bold mb-3">地图加载失败</div>
            <div className="text-white/70 text-sm mb-4">{error}</div>
          </motion.div>
        </div>
      )}

      {!loading && !error && mapReady && (
        <>
          <motion.div 
            initial={{ x: 20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ delay: 0.5 }}
            className="absolute top-4 right-4 z-10 glass-panel rounded-lg p-3 border border-cyber-cyan/30 max-w-[160px]"
          >
            <div className="text-cyber-cyan text-xs font-medium mb-2 flex items-center gap-2">
              <MapPin className="w-3 h-3" /> 图例
            </div>
            <div className="space-y-1.5 text-[10px] text-white/70">
              <div className="font-medium text-white/90 mb-1 border-b border-white/10 pb-1">人流动线</div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-[rgba(0,240,255,0.85)]" />
                <span>进场人流</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-[rgba(255,100,50,0.85)]" />
                <span>散场人流</span>
              </div>
              
              <div className="font-medium text-white/90 mt-2 mb-1 border-b border-white/10 pb-1">监控区域</div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[rgba(0,240,255,0.25)] border border-[#00F0FF]" />
                <span>S级主场馆</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[rgba(255,165,0,0.3)] border border-[#FFA500]" />
                <span>元通枢纽</span>
              </div>
              
              <div className="font-medium text-white/90 mt-2 mb-1 border-b border-white/10 pb-1">网络资源</div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#00F0FF]" />
                <span>5G站点</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-2 bg-[#FFD700]" />
                <span>应急车</span>
              </div>
            </div>
          </motion.div>

          {/* 时间指示器 */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.6 }}
            className="absolute top-4 left-4 z-10 glass-panel rounded-lg px-4 py-2 border border-cyber-cyan/30"
          >
            <div className="text-[10px] text-white/50">当前时空切片</div>
            <div className="text-xl font-din text-cyber-cyan">{currentTime}</div>
          </motion.div>
        </>
      )}
    </div>
  );
}
