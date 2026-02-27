import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2, MapPin, X, Activity, Zap, Cpu } from 'lucide-react';
import { Scene, GaodeMap, PointLayer, LineLayer, PolygonLayer } from '@antv/l7';
import { fetchFlowData, fetchZoneData, fetchBaseStations } from '../../api/dashboard.js';

const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || '';
const AMAP_SECURITY_CODE = import.meta.env.VITE_AMAP_SECURITY_CODE || '';
const CENTER_COORDINATES = [118.7265, 32.0087];

// 默认空 GeoJSON
const EMPTY_GEOJSON = { type: 'FeatureCollection', features: [] };

// ========== 苏超专属核心地标数据 ==========
const CUSTOM_LANDMARKS = [
  { name: '南京奥体中心', lng: 118.7265, lat: 32.0087, type: 'main' },
  { name: '奥体东地铁站', lng: 118.7350, lat: 32.0050, type: 'metro' },
  { name: '元通地铁站', lng: 118.7200, lat: 32.0150, type: 'metro' },
  { name: '华彩中心(第二现场)', lng: 118.7400, lat: 32.0120, type: 'secondary' },
];

// ========== 应急通信车位置 ==========
const EMERGENCY_VEHICLES = [
  { id: 'EV-001', name: '应急通信车-东', lng: 118.7350, lat: 32.0030, status: 'active' },
  { id: 'EV-002', name: '应急通信车-西', lng: 118.7180, lat: 32.0100, status: 'active' },
];

// ========== Mock 48个基站坐标 ==========
function generateBaseStations() {
  const stations = [];
  const centerLng = 118.7265;
  const centerLat = 32.0087;
  
  // 围绕奥体中心生成48个基站
  for (let i = 0; i < 48; i++) {
    const angle = (i / 48) * Math.PI * 2;
    const radius = 0.003 + Math.random() * 0.005; // 半径随机
    const lng = centerLng + Math.cos(angle) * radius;
    const lat = centerLat + Math.sin(angle) * radius;
    
    stations.push({
      id: `BS-${String(i + 1).padStart(3, '0')}`,
      name: `奥体基站-${i + 1}`,
      lng,
      lat,
      bbuLoad: Math.floor(Math.random() * 40) + 30, // 30-70%
      aauStatus: Math.random() > 0.1 ? 'normal' : 'warning', // 90%正常
      hasSmartBoard: i % 8 === 0, // 每8个基站有一个智能板
      type: i < 12 ? 'main' : 'micro',
    });
  }
  return stations;
}

// ========== 地面保障人员 ==========
function generateGroundStaff() {
  const staff = [];
  const centerLng = 118.7265;
  const centerLat = 32.0087;
  
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.002 + Math.random() * 0.006;
    staff.push({
      id: `STAFF-${i + 1}`,
      lng: centerLng + Math.cos(angle) * radius,
      lat: centerLat + Math.sin(angle) * radius,
      role: i < 5 ? '工程师' : '巡检员',
    });
  }
  return staff;
}

// ========== 生成人流数据(根据时间) ==========
function generateCrowdData(currentTime) {
  const hour = parseInt(currentTime?.split(':')[0] || '20');
  const isPeak = hour >= 19 && hour <= 21;
  const baseMultiplier = isPeak ? 3 : 1;
  
  const crowdPoints = [];
  const centerLng = 118.7265;
  const centerLat = 32.0087;
  
  // 网格化人流热点
  for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.001 + Math.random() * 0.008;
    const count = Math.floor((Math.random() * 500 + 100) * baseMultiplier);
    
    crowdPoints.push({
      id: `CROWD-${i}`,
      lng: centerLng + Math.cos(angle) * radius,
      lat: centerLat + Math.sin(angle) * radius,
      count,
      isAlert: count > 1500, // 超过1500人触发告警
    });
  }
  return crowdPoints;
}

// ========== 全局高德安全配置 ==========
if (typeof window !== 'undefined') {
  window._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY_CODE };
}

export default function AmapL7Scene({ onStationClick, currentTime = '20:00', onAlertsChange }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const flowLayerRef = useRef(null);
  const zoneLayerRef = useRef(null);
  const stationLayerRef = useRef(null);
  const landmarkLayerRef = useRef(null);
  const vehicleLayerRef = useRef(null);
  const staffLayerRef = useRef(null);
  const crowdLayerRef = useRef(null);
  const alertLayerRef = useRef(null);
  
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [alerts, setAlerts] = useState([]);
  
  // API 数据状态
  const [flowData, setFlowData] = useState(null);
  const [zoneData, setZoneData] = useState(null);
  const [stationData, setStationData] = useState(() => generateBaseStations());
  const [staffData] = useState(() => generateGroundStaff());
  const [crowdData, setCrowdData] = useState(() => generateCrowdData('20:00'));

  // ========== 更新告警列表 ==========
  const updateAlerts = useCallback((crowdPoints) => {
    const newAlerts = crowdPoints
      .filter(p => p.isAlert)
      .map(p => ({
        id: `ALERT-${p.id}`,
        level: 'high',
        title: `区域人流超标: ${p.count}人`,
        time: '刚刚',
        area: `奥体周边-${p.id}`,
        lng: p.lng,
        lat: p.lat,
      }));
    
    setAlerts(newAlerts);
    if (onAlertsChange) {
      onAlertsChange(newAlerts);
    }
  }, [onAlertsChange]);

  // ========== 第一步：初始化地图和图层 ==========
  useEffect(() => {
    // 【拦截器】防止 React 18 严格模式下的二次实例化
    if (sceneRef.current) {
      console.log('[AmapL7Scene] 场景已存在，跳过二次初始化');
      return;
    }

    const container = containerRef.current;
    if (!container) {
      setError('地图容器未找到');
      setLoading(false);
      return;
    }

    if (!AMAP_KEY) {
      setError('高德 Key 未配置 (VITE_AMAP_KEY)');
      setLoading(false);
      return;
    }

    try {
      // 创建场景 - 净化底图配置
      const scene = new Scene({
        id: container,
        map: new GaodeMap({
          pitch: 55,
          zoom: 15,
          center: CENTER_COORDINATES,
          viewMode: '3D',
          style: 'amap://styles/darkblue',
          token: AMAP_KEY,
          features: ['bg', 'road', 'building'], // 【模块1】隐藏原生POI，只留建筑和道路
        }),
        logoVisible: false,
      });

      scene.setBgColor('#0B1A2A');
      sceneRef.current = scene;

      // 等待场景加载
      scene.on('loaded', async () => {
        console.log('[AmapL7Scene] 地图加载成功');
        
        try {
          // 【模块2】注册图标
          await Promise.all([
            scene.addImage('base-station', '/icons/base-station.svg'),
            scene.addImage('comm-vehicle', '/icons/comm-vehicle.svg'),
            scene.addImage('smart-board', '/icons/smart-board.svg'),
          ]);
          console.log('[AmapL7Scene] 图标注册完成');

          // 1. 人流动线图层
          const flowLayer = new LineLayer({ zIndex: 1 })
            .source(EMPTY_GEOJSON, { parser: { type: 'geojson' } })
            .size(2)
            .shape('line')
            .color('#00f0ff')
            .animate({ enable: true, interval: 0.1, trailLength: 0.5, duration: 2 })
            .style({ opacity: 0.8 });
          scene.addLayer(flowLayer);
          flowLayerRef.current = flowLayer;

          // 2. 监控区域图层
          const zoneLayer = new PolygonLayer({ zIndex: 2 })
            .source(EMPTY_GEOJSON, { parser: { type: 'geojson' } })
            .color('rgba(0, 240, 255, 0.3)')
            .shape('extrude')
            .size(50)
            .style({ opacity: 0.6 });
          scene.addLayer(zoneLayer);
          zoneLayerRef.current = zoneLayer;

          // 【模块1】3. 专属地标图层 (文本)
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
            .color('#fbbf24') // 金黄色赛博朋克
            .style({
              textAnchor: 'center',
              textOffset: [0, -20],
              stroke: '#000',
              strokeWidth: 2,
            });
          scene.addLayer(landmarkLayer);
          landmarkLayerRef.current = landmarkLayer;

          // 【模块2】4. 应急通信车图层
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
            .size(25);
          scene.addLayer(vehicleLayer);
          vehicleLayerRef.current = vehicleLayer;

          // 【模块2】5. 基站集群图层 (使用自定义图标)
          const stationLayer = new PointLayer({ zIndex: 6 })
            .source({
              type: 'FeatureCollection',
              features: stationData.map(s => ({
                type: 'Feature',
                properties: { ...s },
                geometry: { type: 'Point', coordinates: [s.lng, s.lat] }
              }))
            }, { parser: { type: 'geojson' } })
            .shape(s => s.hasSmartBoard ? 'smart-board' : 'base-station')
            .size(s => s.hasSmartBoard ? 28 : 22);
          scene.addLayer(stationLayer);
          stationLayerRef.current = stationLayer;

          // 【模块3】基站点击事件
          stationLayer.on('click', (e) => {
            if (e.feature) {
              const station = e.feature.properties;
              setSelectedStation(station);
              if (onStationClick) onStationClick(station);
            }
          });

          // 【模块2】6. 地面保障人员图层 (绿色小圆点)
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
            .size(8)
            .style({ opacity: 0.9 });
          scene.addLayer(staffLayer);
          staffLayerRef.current = staffLayer;

          // 【模块4】7. 人流3D柱状热力图层 (圆柱体)
          const crowdLayer = new PointLayer({ zIndex: 5 })
            .source(EMPTY_GEOJSON, { parser: { type: 'geojson' } })
            .shape('cylinder')
            .size('count', [10, 1000]) // 人越多柱子越高
            .color('count', ['#34d399', '#fbbf24', '#ef4444']) // 绿->黄->红
            .style({ opacity: 0.7 });
          scene.addLayer(crowdLayer);
          crowdLayerRef.current = crowdLayer;

          // 【模块5】8. 告警呼吸灯图层 (红色波纹动画)
          const alertLayer = new PointLayer({ zIndex: 9 })
            .source(EMPTY_GEOJSON, { parser: { type: 'geojson' } })
            .shape('circle')
            .color('#ef4444')
            .size(30)
            .animate({ enable: true, speed: 0.5, rings: 3 }) // 呼吸灯效果
            .style({ opacity: 0.8 });
          scene.addLayer(alertLayer);
          alertLayerRef.current = alertLayer;

          setSceneLoaded(true);
          setLoading(false);
          console.log('[AmapL7Scene] 所有图层初始化完成');
        } catch (layerErr) {
          console.error('[AmapL7Scene] 图层初始化错误:', layerErr);
          setError('图层初始化失败: ' + layerErr.message);
          setLoading(false);
        }
      });

      scene.on('error', (err) => {
        console.error('[AmapL7Scene] 场景错误:', err);
        setError('地图渲染失败: ' + (err.message || '未知错误'));
        setLoading(false);
      });

    } catch (err) {
      console.error('[AmapL7Scene] 初始化严重异常:', err);
      setError(err.message || '地图初始化失败');
      setLoading(false);
    }

    // 清理函数
    return () => {
      if (sceneRef.current) {
        console.log('[AmapL7Scene] 销毁地图实例');
        try {
          sceneRef.current.destroy();
        } catch (e) {
          console.warn('[AmapL7Scene] 销毁场景时出错:', e);
        }
        sceneRef.current = null;
      }
    };
  }, []); // 空依赖数组，只执行一次

  // ========== 第二步：获取 API 数据 ==========
  useEffect(() => {
    const loadData = async () => {
      try {
        const [flow, zones] = await Promise.all([
          fetchFlowData(currentTime),
          fetchZoneData('defense'),
        ]);
        
        setFlowData(flow);
        setZoneData(zones);
      } catch (err) {
        console.error('[AmapL7Scene] 获取数据失败:', err);
      }
    };
    
    loadData();
  }, [currentTime]);

  // ========== 第三步：根据时间更新人流数据和告警 ==========
  useEffect(() => {
    if (!sceneLoaded || !sceneRef.current) return;
    
    // 【模块4】生成新的人流数据
    const newCrowdData = generateCrowdData(currentTime);
    setCrowdData(newCrowdData);
    
    // 【模块5】更新告警
    updateAlerts(newCrowdData);
    
    // 更新人流3D柱状图层
    if (crowdLayerRef.current) {
      try {
        const geojson = {
          type: 'FeatureCollection',
          features: newCrowdData.map(p => ({
            type: 'Feature',
            properties: { count: p.count },
            geometry: { type: 'Point', coordinates: [p.lng, p.lat] }
          }))
        };
        crowdLayerRef.current.setData(geojson);
      } catch (err) {
        console.error('[AmapL7Scene] 更新人流数据失败:', err);
      }
    }
    
    // 【模块5】更新告警呼吸灯图层
    if (alertLayerRef.current) {
      try {
        const alertPoints = newCrowdData.filter(p => p.isAlert);
        const geojson = {
          type: 'FeatureCollection',
          features: alertPoints.map(p => ({
            type: 'Feature',
            properties: {},
            geometry: { type: 'Point', coordinates: [p.lng, p.lat] }
          }))
        };
        alertLayerRef.current.setData(geojson);
      } catch (err) {
        console.error('[AmapL7Scene] 更新告警图层失败:', err);
      }
    }
  }, [sceneLoaded, currentTime, updateAlerts]);

  // ========== 第四步：更新其他图层数据 ==========
  useEffect(() => {
    if (!sceneLoaded || !sceneRef.current) return;
    
    // 更新人流线数据
    if (flowLayerRef.current && flowData && flowData.length > 0) {
      try {
        const geojson = {
          type: 'FeatureCollection',
          features: flowData.map(item => ({
            type: 'Feature',
            properties: { type: item.type, volume: item.volume },
            geometry: { type: 'LineString', coordinates: item.path }
          }))
        };
        flowLayerRef.current.setData(geojson);
      } catch (err) {
        console.error('[AmapL7Scene] 更新人流线失败:', err);
      }
    }
    
    // 更新区域数据
    if (zoneLayerRef.current && zoneData) {
      try {
        const zones = zoneData.defenseZones || zoneData;
        const geojson = {
          type: 'FeatureCollection',
          features: zones.map(zone => ({
            type: 'Feature',
            properties: { name: zone.name, height: zone.height, color: zone.color },
            geometry: { type: 'Polygon', coordinates: [zone.coordinates] }
          }))
        };
        zoneLayerRef.current.setData(geojson);
      } catch (err) {
        console.error('[AmapL7Scene] 更新区域数据失败:', err);
      }
    }
  }, [sceneLoaded, flowData, zoneData]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0B1A2A]">
      {/* 核心：地图容器 */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      
      {/* 加载遮罩 */}
      {(loading || !sceneLoaded) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0B1A2A]/90 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto mb-3" />
            <div className="text-cyan-400 text-lg">初始化 3D 地图...</div>
            {!AMAP_KEY && (
              <div className="text-yellow-400 text-sm mt-2">缺少高德地图 Key 配置</div>
            )}
          </div>
        </div>
      )}
      
      {/* 错误遮罩 */}
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0B1A2A]/90 backdrop-blur-sm">
          <div className="text-center text-yellow-400 max-w-md px-4">
            <div className="text-xl font-bold mb-2">地图加载失败</div>
            <div className="text-sm text-white/60">{error}</div>
          </div>
        </div>
      )}
      
      {/* 【模块3】基站详情悬浮面板 */}
      {sceneLoaded && selectedStation && (
        <div className="absolute top-20 right-4 z-20 w-72">
          <div className="glass-panel rounded-xl p-4 border border-cyan-400/30 relative">
            {/* 关闭按钮 */}
            <button 
              onClick={() => setSelectedStation(null)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
            
            {/* 标题 */}
            <div className="flex items-center gap-2 mb-3 pr-6">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">{selectedStation.name}</h3>
                <p className="text-white/40 text-xs">{selectedStation.id}</p>
              </div>
            </div>
            
            {/* 状态信息 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-white/70 text-xs">BBU 负载</span>
                </div>
                <span className={`text-sm font-bold ${selectedStation.bbuLoad > 60 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {selectedStation.bbuLoad}%
                </span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/70 text-xs">AAU 状态</span>
                </div>
                <span className={`text-sm font-bold ${selectedStation.aauStatus === 'normal' ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedStation.aauStatus === 'normal' ? '正常' : '告警'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <span className="text-white/70 text-xs">无线智能板</span>
                </div>
                <span className={`text-sm font-bold ${selectedStation.hasSmartBoard ? 'text-cyan-400' : 'text-white/30'}`}>
                  {selectedStation.hasSmartBoard ? '已启用' : '未启用'}
                </span>
              </div>
            </div>
            
            {/* 坐标信息 */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">经度</span>
                <span className="text-white/60 font-mono">{selectedStation.lng?.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-white/40">纬度</span>
                <span className="text-white/60 font-mono">{selectedStation.lat?.toFixed(4)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 图例面板 */}
      {sceneLoaded && (
        <>
          <div className="absolute top-4 left-4 bg-cyber-panel/90 rounded-lg px-4 py-2 border border-cyan-400/30 z-10">
            <div className="text-[10px] text-white/50">时空切片</div>
            <div className="text-xl font-bold text-cyan-400">{currentTime}</div>
          </div>
          
          <div className="absolute bottom-4 left-4 bg-cyber-panel/90 rounded-lg p-3 border border-cyan-400/30 z-10 max-w-[200px]">
            <div className="text-cyan-400 text-xs font-bold mb-2">图例</div>
            <div className="space-y-1.5 text-[10px] text-white/70">
              <div className="flex items-center gap-2">
                <img src="/icons/base-station.svg" className="w-4 h-4" alt="基站" />
                <span>5G 基站</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/icons/smart-board.svg" className="w-4 h-4" alt="智能板" />
                <span>智能板基站</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/icons/comm-vehicle.svg" className="w-4 h-4" alt="应急车" />
                <span>应急通信车</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span>保障人员</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-gradient-to-t from-green-400 via-yellow-400 to-red-500" />
                <span>人流热力</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span>人流告警</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
