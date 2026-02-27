import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2, MapPin, X, Activity, Zap, Cpu, Users, Radio } from 'lucide-react';
import { Scene, GaodeMap, PointLayer, HeatmapLayer, PolygonLayer } from '@antv/l7';
import { fetchFlowData, fetchZoneData } from '../../api/dashboard.js';

const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || '';
const AMAP_SECURITY_CODE = import.meta.env.VITE_AMAP_SECURITY_CODE || '';

// ========== 调整后的摄像机视角 ==========
const CAMERA_CONFIG = {
  center: [118.728, 32.005], // 同时包容奥体、华彩中心、地铁站
  zoom: 14.5,
  pitch: 45,
};

// 默认空 GeoJSON
const EMPTY_GEOJSON = { type: 'FeatureCollection', features: [] };

// ========== 苏超专属核心地标数据 ==========
const CUSTOM_LANDMARKS = [
  { name: '南京奥体中心', lng: 118.7265, lat: 32.0087, type: 'main' },
  { name: '奥体东地铁站', lng: 118.7350, lat: 32.0050, type: 'metro' },
  { name: '元通地铁站', lng: 118.7200, lat: 32.0150, type: 'metro' },
  { name: '华彩中心(第二现场)', lng: 118.7400, lat: 32.0120, type: 'secondary' },
];

// ========== 修正后的应急通信车位置 (真实停车场坐标) ==========
const EMERGENCY_VEHICLES = [
  { id: 'EV-001', name: '应急通信车-东', lng: 118.7305, lat: 32.0080, status: 'active' },
  { id: 'EV-002', name: '应急通信车-西', lng: 118.7215, lat: 32.0080, status: 'active' },
];

// ========== 精简为 8 个基站 (真实宏站间距) ==========
function generateBaseStations() {
  const stations = [
    { id: 'BS-001', name: '奥体主站-北', lng: 118.7265, lat: 32.0130, bbuLoad: 65, aauStatus: 'normal', hasSmartBoard: true, users: 2847, prb: 72 },
    { id: 'BS-002', name: '奥体主站-南', lng: 118.7265, lat: 32.0045, bbuLoad: 58, aauStatus: 'normal', hasSmartBoard: true, users: 2156, prb: 65 },
    { id: 'BS-003', name: '奥体主站-东', lng: 118.7320, lat: 32.0087, bbuLoad: 71, aauStatus: 'warning', hasSmartBoard: false, users: 3124, prb: 78 },
    { id: 'BS-004', name: '奥体主站-西', lng: 118.7210, lat: 32.0087, bbuLoad: 45, aauStatus: 'normal', hasSmartBoard: false, users: 1832, prb: 52 },
    { id: 'BS-005', name: '华彩中心站', lng: 118.7400, lat: 32.0120, bbuLoad: 82, aauStatus: 'normal', hasSmartBoard: true, users: 4521, prb: 85 },
    { id: 'BS-006', name: '元通枢纽站', lng: 118.7200, lat: 32.0150, bbuLoad: 55, aauStatus: 'normal', hasSmartBoard: false, users: 1987, prb: 58 },
    { id: 'BS-007', name: '奥体东站', lng: 118.7350, lat: 32.0050, bbuLoad: 68, aauStatus: 'normal', hasSmartBoard: true, users: 2678, prb: 70 },
    { id: 'BS-008', name: '滨江新城站', lng: 118.7150, lat: 32.0020, bbuLoad: 42, aauStatus: 'normal', hasSmartBoard: false, users: 1234, prb: 48 },
  ];
  return stations;
}

// ========== 地面保障人员 ==========
function generateGroundStaff() {
  const staff = [];
  const centerLng = 118.728;
  const centerLat = 32.005;
  
  for (let i = 0; i < 16; i++) {
    const lng = centerLng + (Math.random() - 0.5) * 0.012;
    const lat = centerLat + (Math.random() - 0.5) * 0.012;
    staff.push({
      id: `STAFF-${i + 1}`,
      lng,
      lat,
      role: i < 4 ? '工程师' : '巡检员',
    });
  }
  return staff;
}

// ========== 生成热力图离散点数据 (3D 热力场) ==========
function generateCrowdHeatData(currentTime) {
  const hour = parseInt(currentTime?.split(':')[0] || '20');
  const isPeak = hour >= 19 && hour <= 21;
  const baseMultiplier = isPeak ? 1.5 : 1;
  
  // 在奥体中心及周边生成 400 个离散热力点
  const points = [];
  const hotspots = [
    { lng: 118.7265, lat: 32.0087, intensity: 1.0 }, // 奥体中心
    { lng: 118.7400, lat: 32.0120, intensity: 0.7 }, // 华彩中心
    { lng: 118.7350, lat: 32.0050, intensity: 0.8 }, // 奥体东地铁站
    { lng: 118.7200, lat: 32.0150, intensity: 0.6 }, // 元通地铁站
  ];
  
  // 为每个热点生成密集点群
  hotspots.forEach(hotspot => {
    const pointCount = Math.floor(100 * hotspot.intensity);
    for (let i = 0; i < pointCount; i++) {
      const lng = hotspot.lng + (Math.random() - 0.5) * 0.008;
      const lat = hotspot.lat + (Math.random() - 0.5) * 0.008;
      const count = Math.floor((Math.random() * 80 + 20) * hotspot.intensity * baseMultiplier);
      points.push({ lng, lat, count });
    }
  });
  
  // 补充随机分布的背景人流点
  for (let i = 0; i < 100; i++) {
    const lng = 118.728 + (Math.random() - 0.5) * 0.02;
    const lat = 32.005 + (Math.random() - 0.5) * 0.02;
    const count = Math.floor(Math.random() * 40 * baseMultiplier);
    points.push({ lng, lat, count });
  }
  
  return points;
}

// ========== 全局高德安全配置 ==========
if (typeof window !== 'undefined') {
  window._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY_CODE };
}

// ========== 3D 爆炸图详情面板组件 ==========
function StationDetail3D({ data, onClose }) {
  if (!data) return null;
  
  return (
    <div className="absolute top-16 right-4 z-30 w-80 perspective-[1000px]">
      <div className="glass-panel rounded-xl p-5 border border-cyan-400/40 relative backdrop-blur-xl bg-[#0B1A2A]/90">
        {/* 关闭按钮 */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-4 h-4 text-white/70" />
        </button>
        
        {/* 标题区 */}
        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 flex items-center justify-center border border-cyan-400/30">
            <Radio className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">{data.name}</h3>
            <p className="text-cyan-400/70 text-xs font-mono">{data.id} · 5G-A 宏站</p>
          </div>
        </div>
        
        {/* 核心指标 */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <div className="text-white font-bold text-sm">{data.users?.toLocaleString()}</div>
            <div className="text-white/40 text-[10px]">连接用户</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <Activity className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
            <div className="text-white font-bold text-sm">{data.prb}%</div>
            <div className="text-white/40 text-[10px]">PRB利用率</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <Zap className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <div className="text-white font-bold text-sm">{data.bbuLoad}%</div>
            <div className="text-white/40 text-[10px]">BBU负载</div>
          </div>
        </div>
        
        {/* 3D 爆炸图核心区域 */}
        <div className="relative h-56" style={{ perspective: '1000px' }}>
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg) translateY(-20px)' }}
          >
            {/* 顶层 - AAU 天线层 */}
            <div 
              className="absolute w-24 h-24 rounded-2xl bg-gradient-to-b from-green-500/40 to-green-600/20 border-2 border-green-400/50 flex flex-col items-center justify-center shadow-2xl"
              style={{ 
                transform: 'translateZ(60px) translateY(-40px)',
                boxShadow: '0 0 30px rgba(34, 197, 94, 0.4)',
              }}
            >
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse mb-1" />
              <span className="text-green-300 text-[10px] font-bold">AAU 天线层</span>
              <span className="text-green-400/70 text-[8px]">64T64R 阵列</span>
            </div>
            
            {/* 中层 - 无线智能板/算力层 */}
            <div 
              className="absolute w-28 h-28 rounded-2xl bg-gradient-to-b from-yellow-500/40 to-amber-600/20 border-2 border-yellow-400/50 flex flex-col items-center justify-center"
              style={{ 
                transform: 'translateZ(30px) translateY(-10px)',
                boxShadow: data.hasSmartBoard ? '0 0 40px rgba(251, 191, 36, 0.6)' : 'none',
              }}
            >
              <Cpu className="w-6 h-6 text-yellow-400 mb-1" />
              <span className="text-yellow-300 text-[10px] font-bold">无线智能板</span>
              {data.hasSmartBoard ? (
                <span className="text-amber-300 text-[8px] font-bold animate-pulse">5G-A 已激活</span>
              ) : (
                <span className="text-white/40 text-[8px]">标准模式</span>
              )}
            </div>
            
            {/* 底层 - BBU 基带层 */}
            <div 
              className="absolute w-32 h-32 rounded-2xl bg-gradient-to-b from-blue-500/40 to-cyan-600/20 border-2 border-cyan-400/50 flex flex-col items-center justify-center"
              style={{ 
                transform: 'translateZ(0px) translateY(20px)',
              }}
            >
              <div className="flex items-center gap-1 mb-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>
              <span className="text-cyan-300 text-[10px] font-bold">BBU 基带层</span>
              <span className="text-cyan-400/70 text-[8px]">3CC 载波聚合</span>
              <div className="mt-2 flex gap-1">
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[7px]">n78</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[7px]">n79</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[7px]">n41</span>
              </div>
            </div>
            
            {/* 连接线效果 */}
            <div className="absolute w-0.5 h-20 bg-gradient-to-b from-green-400/50 via-yellow-400/30 to-transparent" style={{ transform: 'translateZ(45px) translateY(-30px)' }} />
            <div className="absolute w-0.5 h-16 bg-gradient-to-b from-yellow-400/50 via-cyan-400/30 to-transparent" style={{ transform: 'translateZ(15px) translateY(5px)' }} />
          </div>
        </div>
        
        {/* 底部状态栏 */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${data.aauStatus === 'normal' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <span className={`text-xs ${data.aauStatus === 'normal' ? 'text-green-400' : 'text-red-400'}`}>
              AAU {data.aauStatus === 'normal' ? '正常运行' : '告警'}
            </span>
          </div>
          <span className="text-white/30 text-xs font-mono">
            {data.lng?.toFixed(4)}, {data.lat?.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AmapL7Scene({ onStationClick, currentTime = '20:00', onAlertsChange }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const isInitializingRef = useRef(false);
  const isDestroyedRef = useRef(false);
  
  const layersRef = useRef({
    heatmap: null,      // 3D 热力图层
    zone: null,
    station: null,      // 基站图层 (zIndex 最高)
    landmark: null,
    vehicle: null,
    staff: null,
    alert: null,        // 告警呼吸灯 (zIndex 最高)
  });
  
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  
  const [zoneData, setZoneData] = useState(null);
  const [stationData] = useState(() => generateBaseStations());
  const [staffData] = useState(() => generateGroundStaff());
  const [crowdHeatData, setCrowdHeatData] = useState(() => generateCrowdHeatData('20:00'));

  // 基于热力图数据生成告警
  const updateAlerts = useCallback((heatPoints) => {
    // 找出高密度区域 (count > 70) 作为告警点
    const highDensityPoints = heatPoints
      .filter(p => p.count > 70)
      .slice(0, 4);
    
    const alerts = highDensityPoints.map((p, idx) => ({
      id: `HEAT-ALERT-${idx}`,
      level: p.count > 85 ? 'high' : 'medium',
      title: `人流密集区域: ${p.count}人`,
      time: '刚刚',
      area: `奥体周边热力点-${idx + 1}`,
    }));
    
    if (onAlertsChange) onAlertsChange(alerts);
  }, [onAlertsChange]);

  useEffect(() => {
    if (isInitializingRef.current || sceneRef.current) {
      console.log('[AmapL7Scene] 拦截重复初始化');
      return;
    }
    
    isInitializingRef.current = true;
    isDestroyedRef.current = false;
    
    const container = containerRef.current;
    if (!container) {
      setError('地图容器未找到');
      setLoading(false);
      isInitializingRef.current = false;
      return;
    }

    if (!AMAP_KEY) {
      setError('高德 Key 未配置');
      setLoading(false);
      isInitializingRef.current = false;
      return;
    }

    let scene = null;
    let isEffectActive = true;

    const initMap = async () => {
      try {
        scene = new Scene({
          id: container,
          map: new GaodeMap({
            ...CAMERA_CONFIG, // 使用调整后的摄像机视角
            viewMode: '3D',
            style: 'amap://styles/darkblue',
            token: AMAP_KEY,
            features: ['bg', 'road', 'building'],
          }),
          logoVisible: false,
        });

        scene.setBgColor('#0B1A2A');
        sceneRef.current = scene;

        // 【安全绑定】确保 scene 存在才绑定事件
        if (!scene) {
          console.error('[AmapL7Scene] Scene 创建失败');
          setError('地图引擎初始化失败');
          setLoading(false);
          isInitializingRef.current = false;
          return;
        }

        scene.on('loaded', async () => {
          // 【双重检查】确保组件仍挂载且未销毁
          if (!isEffectActive || isDestroyedRef.current) {
            console.log('[AmapL7Scene] 组件已卸载，放弃图层初始化');
            if (scene && !scene.destroyed) {
              try { scene.destroy(); } catch (e) {}
            }
            return;
          }
          
          try {
            // 注册图标 (新增 sector-site)
            await Promise.all([
              scene.addImage('comm-vehicle', '/icons/comm-vehicle.svg'),
              scene.addImage('smart-board', '/icons/smart-board.svg'),
            ]).catch(() => console.warn('[AmapL7Scene] 部分图标加载失败'));

            // 1. 2D 热力图层 (贴地模式，修复撕裂问题)
            const heatmapLayer = new HeatmapLayer({ zIndex: 1 })
              .source(crowdHeatData, {
                parser: { type: 'json', x: 'lng', y: 'lat' },
              })
              .shape('heatmap') // 【关键】使用贴地 2D 热力图，避免 3D 撕裂
              .size('count', [0, 1])
              .style({
                intensity: 2, // 稍微降低强度
                radius: 30,   // 加大扩散半径，让热力融合更自然
                opacity: 0.8,
                rampColors: {
                  colors: [
                    'rgba(11, 26, 42, 0)', // 0% 透明
                    '#0891b2',             // 20% 赛博青
                    '#10b981',             // 40% 翠绿
                    '#fbbf24',             // 70% 警告黄
                    '#ef4444'              // 100% 拥塞红
                  ],
                  positions: [0, 0.2, 0.4, 0.7, 1.0]
                }
              });
            scene.addLayer(heatmapLayer);
            layersRef.current.heatmap = heatmapLayer;

            // 2. 监控区域图层
            const zoneLayer = new PolygonLayer({ zIndex: 2 })
              .source(EMPTY_GEOJSON, { parser: { type: 'geojson' } })
              .color('rgba(0, 240, 255, 0.2)')
              .shape('extrude')
              .size(30)
              .style({ opacity: 0.5 });
            scene.addLayer(zoneLayer);
            layersRef.current.zone = zoneLayer;

            // 3. 地标图层
            const landmarkLayer = new PointLayer({ zIndex: 10 })
              .source({
                type: 'FeatureCollection',
                features: CUSTOM_LANDMARKS.map(lm => ({
                  type: 'Feature',
                  properties: { name: lm.name, type: lm.type },
                  geometry: { type: 'Point', coordinates: [lm.lng, lm.lat] }
                }))
              }, { parser: { type: 'geojson' } })
              .shape('name', 'text')
              .size(14)
              .color('#fbbf24')
              .style({ textAnchor: 'center', textOffset: [0, -20], stroke: '#000', strokeWidth: 2 });
            scene.addLayer(landmarkLayer);
            layersRef.current.landmark = landmarkLayer;

            // 4. 应急通信车图层
            const vehicleLayer = new PointLayer({ zIndex: 8 })
              .source({
                type: 'FeatureCollection',
                features: EMERGENCY_VEHICLES.map(v => ({
                  type: 'Feature',
                  properties: { ...v },
                  geometry: { type: 'Point', coordinates: [v.lng, v.lat] }
                }))
              }, { parser: { type: 'geojson' } })
              .shape('comm-vehicle')
              .size(28);
            scene.addLayer(vehicleLayer);
            layersRef.current.vehicle = vehicleLayer;

            // 5. 基站图层 - 强制使用 sector-site 图标
            const stationLayer = new PointLayer({ zIndex: 6 })
              .source({
                type: 'FeatureCollection',
                features: stationData.map(s => ({
                  type: 'Feature',
                  properties: { ...s },
                  geometry: { type: 'Point', coordinates: [s.lng, s.lat] }
                }))
              }, { parser: { type: 'geojson' } })
              .shape('sector-site') // 全部使用三扇区图标，不区分条件
              .size(30)
              .style({ opacity: 1 });
            scene.addLayer(stationLayer);
            layersRef.current.station = stationLayer;

            // 点击事件 - 打开 3D 爆炸图
            stationLayer.on('click', (e) => {
              if (e.feature) {
                const station = e.feature.properties;
                setSelectedStation(station);
                if (onStationClick) onStationClick(station);
              }
            });

            // 6. 保障人员图层
            const staffLayer = new PointLayer({ zIndex: 7 })
              .source({
                type: 'FeatureCollection',
                features: staffData.map(s => ({
                  type: 'Feature',
                  properties: { ...s },
                  geometry: { type: 'Point', coordinates: [s.lng, s.lat] }
                }))
              }, { parser: { type: 'geojson' } })
              .shape('circle')
              .color('#22c55e')
              .size(6)
              .style({ opacity: 0.8 });
            scene.addLayer(staffLayer);
            layersRef.current.staff = staffLayer;

            // 7. 告警呼吸灯图层 - zIndex 最高确保在最上层
            const alertLayer = new PointLayer({ zIndex: 12 })
              .source(EMPTY_GEOJSON, { parser: { type: 'geojson' } })
              .shape('circle')
              .color('#ef4444')
              .size(25)
              .animate({ enable: true, speed: 1, rings: 3 })
              .style({ opacity: 0.9 });
            scene.addLayer(alertLayer);
            layersRef.current.alert = alertLayer;

            if (isEffectActive && !isDestroyedRef.current) {
              setSceneLoaded(true);
              setLoading(false);
              console.log('[AmapL7Scene] 地图初始化完成');
            }
          } catch (layerErr) {
            console.error('[AmapL7Scene] 图层初始化错误:', layerErr);
            if (isEffectActive) {
              setError('图层初始化失败: ' + layerErr.message);
              setLoading(false);
            }
          }
        });

        // 【安全绑定】错误事件同样检查
        if (scene) {
          scene.on('error', (err) => {
            console.error('[AmapL7Scene] 场景错误:', err);
            if (isEffectActive && !isDestroyedRef.current) {
              setError('地图渲染失败');
              setLoading(false);
            }
          });
        }

      } catch (err) {
        console.error('[AmapL7Scene] 初始化严重异常:', err);
        if (isEffectActive) {
          setError(err.message || '地图初始化失败');
          setLoading(false);
        }
      } finally {
        isInitializingRef.current = false;
      }
    };

    initMap();

    return () => {
      isEffectActive = false;
      isDestroyedRef.current = true;
      if (sceneRef.current) {
        try {
          sceneRef.current.destroy();
        } catch (e) {}
        sceneRef.current = null;
      }
      layersRef.current = { heatmap: null, zone: null, station: null, landmark: null, vehicle: null, staff: null, alert: null };
      isInitializingRef.current = false;
    };
  }, []);

  // 获取 API 数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const zones = await fetchZoneData('defense');
        setZoneData(zones);
      } catch (err) {
        console.error('[AmapL7Scene] 获取数据失败:', err);
      }
    };
    loadData();
  }, [currentTime]);

  // 更新热力图数据
  useEffect(() => {
    if (!sceneLoaded || !sceneRef.current || isDestroyedRef.current) return;
    
    const newHeatData = generateCrowdHeatData(currentTime);
    setCrowdHeatData(newHeatData);
    updateAlerts(newHeatData);
    
    // 更新热力图层
    if (layersRef.current.heatmap) {
      try {
        layersRef.current.heatmap.setData(newHeatData);
      } catch (err) {
        console.error('[AmapL7Scene] 更新热力图失败:', err);
      }
    }
    
    // 高密区域告警点 (count > 75)
    if (layersRef.current.alert) {
      try {
        const highDensityPoints = newHeatData
          .filter(p => p.count > 75)
          .slice(0, 5)
          .map(p => ({ lng: p.lng, lat: p.lat }));
        
        const geojson = {
          type: 'FeatureCollection',
          features: highDensityPoints.map((p, idx) => ({
            type: 'Feature',
            properties: { id: `ALERT-${idx}` },
            geometry: { type: 'Point', coordinates: [p.lng, p.lat] }
          }))
        };
        layersRef.current.alert.setData(geojson);
      } catch (err) {
        console.error('[AmapL7Scene] 更新告警图层失败:', err);
      }
    }
  }, [sceneLoaded, currentTime, updateAlerts]);

  // 更新其他图层
  useEffect(() => {
    if (!sceneLoaded || !sceneRef.current || isDestroyedRef.current) return;
    
    if (layersRef.current.zone && zoneData) {
      try {
        const zones = zoneData.defenseZones || zoneData;
        const geojson = {
          type: 'FeatureCollection',
          features: zones.map(zone => ({
            type: 'Feature',
            properties: { name: zone.name },
            geometry: { type: 'Polygon', coordinates: [zone.coordinates] }
          }))
        };
        layersRef.current.zone.setData(geojson);
      } catch (err) {
        console.error('[AmapL7Scene] 更新区域数据失败:', err);
      }
    }
  }, [sceneLoaded, zoneData]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0B1A2A]">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      
      {(loading || !sceneLoaded) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0B1A2A]/90 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto mb-3" />
            <div className="text-cyan-400 text-lg">初始化 3D 地图...</div>
            {!AMAP_KEY && <div className="text-yellow-400 text-sm mt-2">缺少高德地图 Key 配置</div>}
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0B1A2A]/90 backdrop-blur-sm">
          <div className="text-center text-yellow-400 max-w-md px-4">
            <div className="text-xl font-bold mb-2">地图加载失败</div>
            <div className="text-sm text-white/60">{error}</div>
          </div>
        </div>
      )}
      
      {/* 3D 爆炸图详情面板 */}
      <StationDetail3D data={selectedStation} onClose={() => setSelectedStation(null)} />
      
      {/* 图例面板 - 已移除 "时空切片" */}
      {sceneLoaded && (
        <div className="absolute bottom-4 left-4 bg-cyber-panel/90 rounded-lg p-3 border border-cyan-400/30 z-10 max-w-[220px]">
          <div className="text-cyan-400 text-xs font-bold mb-2">图例</div>
          <div className="space-y-1.5 text-[10px] text-white/70">
            <div className="flex items-center gap-2">
              <span className="w-6 h-3 rounded bg-gradient-to-t from-cyan-500/60 via-green-500/60 to-red-500/60" />
              <span>3D 热力密度</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-yellow-500/50" />
              <span>智能板基站</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-cyan-400 border-2 border-cyan-500/50" />
              <span>5G 基站</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/icons/comm-vehicle.svg" className="w-4 h-4" alt="" />
              <span>应急通信车</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>保障人员</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span>人流告警</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
