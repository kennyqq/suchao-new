import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2, MapPin, X, Activity, Zap, Cpu } from 'lucide-react';
import { Scene, GaodeMap, PointLayer, LineLayer, PolygonLayer } from '@antv/l7';
import { fetchFlowData, fetchZoneData } from '../../api/dashboard.js';

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

// ========== Mock 48个基站坐标 (严格约束在奥体周边 ±0.005) ==========
function generateBaseStations() {
  const stations = [];
  const centerLng = 118.7265;
  const centerLat = 32.0087;
  
  for (let i = 0; i < 48; i++) {
    // 严格约束偏移量在 ±0.005 经纬度内
    const lng = centerLng + (Math.random() - 0.5) * 0.01;
    const lat = centerLat + (Math.random() - 0.5) * 0.01;
    
    stations.push({
      id: `BS-${String(i + 1).padStart(3, '0')}`,
      name: `奥体基站-${i + 1}`,
      lng,
      lat,
      bbuLoad: Math.floor(Math.random() * 40) + 30,
      aauStatus: Math.random() > 0.1 ? 'normal' : 'warning',
      hasSmartBoard: i % 8 === 0,
      type: i < 12 ? 'main' : 'micro',
    });
  }
  return stations;
}

// ========== 地面保障人员 (严格约束在奥体周边 ±0.005) ==========
function generateGroundStaff() {
  const staff = [];
  const centerLng = 118.7265;
  const centerLat = 32.0087;
  
  for (let i = 0; i < 20; i++) {
    // 严格约束偏移量在 ±0.005 经纬度内
    const lng = centerLng + (Math.random() - 0.5) * 0.01;
    const lat = centerLat + (Math.random() - 0.5) * 0.01;
    staff.push({
      id: `STAFF-${i + 1}`,
      lng,
      lat,
      role: i < 5 ? '工程师' : '巡检员',
    });
  }
  return staff;
}

// ========== 生成人流数据 (严格约束在奥体周边 ±0.005) ==========
function generateCrowdData(currentTime) {
  const hour = parseInt(currentTime?.split(':')[0] || '20');
  const isPeak = hour >= 19 && hour <= 21;
  const baseMultiplier = isPeak ? 3 : 1;
  
  const crowdPoints = [];
  const centerLng = 118.7265;
  const centerLat = 32.0087;
  
  for (let i = 0; i < 30; i++) {
    // 严格约束偏移量在 ±0.005 经纬度内
    const lng = centerLng + (Math.random() - 0.5) * 0.01;
    const lat = centerLat + (Math.random() - 0.5) * 0.01;
    const count = Math.floor((Math.random() * 500 + 100) * baseMultiplier);
    
    crowdPoints.push({
      id: `CROWD-${i}`,
      lng,
      lat,
      count,
      isAlert: count > 800, // 调整告警阈值为800人
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
  const isInitializingRef = useRef(false);
  const isDestroyedRef = useRef(false);
  
  // 图层引用
  const layersRef = useRef({
    flow: null,
    zone: null,
    station: null,
    landmark: null,
    vehicle: null,
    staff: null,
    crowd: null,
    alert: null,
  });
  
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  
  // 数据状态
  const [flowData, setFlowData] = useState(null);
  const [zoneData, setZoneData] = useState(null);
  const [stationData] = useState(() => generateBaseStations());
  const [staffData] = useState(() => generateGroundStaff());
  const [crowdData, setCrowdData] = useState(() => generateCrowdData('20:00'));

  // ========== 更新告警 ==========
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
    
    if (onAlertsChange) onAlertsChange(newAlerts);
  }, [onAlertsChange]);

  // ========== 严格的初始化 useEffect ==========
  useEffect(() => {
    // 严格拦截器 - 防止任何情况下的重复初始化
    if (isInitializingRef.current || sceneRef.current) {
      console.log('[AmapL7Scene] 拦截重复初始化');
      return;
    }
    
    // 标记正在初始化
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
      setError('高德 Key 未配置 (VITE_AMAP_KEY)');
      setLoading(false);
      isInitializingRef.current = false;
      return;
    }

    let scene = null;
    let isEffectActive = true;

    const initMap = async () => {
      try {
        // 创建场景
        scene = new Scene({
          id: container,
          map: new GaodeMap({
            pitch: 55,
            zoom: 15,
            center: CENTER_COORDINATES,
            viewMode: '3D',
            style: 'amap://styles/darkblue',
            token: AMAP_KEY,
            features: ['bg', 'road', 'building'],
          }),
          logoVisible: false,
        });

        scene.setBgColor('#0B1A2A');
        
        // 保存引用
        sceneRef.current = scene;

        // 等待场景加载
        scene.on('loaded', async () => {
          // 检查组件是否仍然挂载
          if (!isEffectActive || isDestroyedRef.current) {
            console.log('[AmapL7Scene] 场景加载完成但组件已卸载，放弃初始化');
            if (scene) scene.destroy();
            return;
          }
          
          try {
            // 注册图标
            try {
              await Promise.all([
                scene.addImage('base-station', '/icons/base-station.svg'),
                scene.addImage('comm-vehicle', '/icons/comm-vehicle.svg'),
                scene.addImage('smart-board', '/icons/smart-board.svg'),
              ]);
            } catch (imgErr) {
              console.warn('[AmapL7Scene] 图标注册失败，使用默认样式:', imgErr);
            }

            // 1. 人流动线图层
            const flowLayer = new LineLayer({ zIndex: 1 })
              .source(EMPTY_GEOJSON, { parser: { type: 'geojson' } })
              .size(2)
              .shape('line')
              .color('#00f0ff')
              .animate({ enable: true, interval: 0.1, trailLength: 0.5, duration: 2 })
              .style({ opacity: 0.8 });
            scene.addLayer(flowLayer);
            layersRef.current.flow = flowLayer;

            // 2. 监控区域图层
            const zoneLayer = new PolygonLayer({ zIndex: 2 })
              .source(EMPTY_GEOJSON, { parser: { type: 'geojson' } })
              .color('rgba(0, 240, 255, 0.3)')
              .shape('extrude')
              .size(50)
              .style({ opacity: 0.6 });
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
              .size(25);
            scene.addLayer(vehicleLayer);
            layersRef.current.vehicle = vehicleLayer;

            // 5. 基站图层
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
            layersRef.current.station = stationLayer;

            // 点击事件
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
              .size(8)
              .style({ opacity: 0.9 });
            scene.addLayer(staffLayer);
            layersRef.current.staff = staffLayer;

            // 7. 人流热力图层 - 修复 Cylinder 尺寸映射
            const crowdLayer = new PointLayer({ zIndex: 5 })
              .source(EMPTY_GEOJSON, { parser: { type: 'geojson' } })
              .shape('cylinder')
              // size 传入回调函数：固定半径为 5(米) 左右，高度根据 count 计算
              .size('count', (count) => {
                return [5, 5, Math.min(count / 10, 100)]; // [底面半径, 顶面半径, 高度]，限制最大高度100
              })
              .color('count', (count) => {
                if (count > 800) return '#ef4444'; // 红色告警
                if (count > 500) return '#fbbf24'; // 黄色预警
                return '#34d399'; // 绿色正常
              })
              .style({ opacity: 0.8 });
            scene.addLayer(crowdLayer);
            layersRef.current.crowd = crowdLayer;

            // 8. 告警呼吸灯图层 - 固定合理尺寸
            const alertLayer = new PointLayer({ zIndex: 9 })
              .source(EMPTY_GEOJSON, { parser: { type: 'geojson' } })
              .shape('circle')
              .color('#ef4444')
              .size(25) // 固定一个合理的像素大小
              .animate({ enable: true, speed: 1, rings: 3 })
              .style({ opacity: 0.8 });
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

        scene.on('error', (err) => {
          console.error('[AmapL7Scene] 场景错误:', err);
          if (isEffectActive && !isDestroyedRef.current) {
            setError('地图渲染失败: ' + (err.message || '未知错误'));
            setLoading(false);
          }
        });

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

    // 【严格清理】
    return () => {
      console.log('[AmapL7Scene] 组件卸载，开始清理');
      isEffectActive = false;
      isDestroyedRef.current = true;
      
      if (sceneRef.current) {
        try {
          sceneRef.current.destroy();
        } catch (e) {
          console.warn('[AmapL7Scene] 销毁场景时出错:', e);
        }
        sceneRef.current = null;
      }
      
      // 重置所有状态
      layersRef.current = { flow: null, zone: null, station: null, landmark: null, vehicle: null, staff: null, crowd: null, alert: null };
      isInitializingRef.current = false;
    };
  }, []); // 空依赖数组，只执行一次

  // ========== 获取 API 数据 ==========
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

  // ========== 更新人流数据和告警 ==========
  useEffect(() => {
    if (!sceneLoaded || !sceneRef.current || isDestroyedRef.current) return;
    
    const newCrowdData = generateCrowdData(currentTime);
    setCrowdData(newCrowdData);
    updateAlerts(newCrowdData);
    
    // 更新人流图层
    if (layersRef.current.crowd) {
      try {
        const geojson = {
          type: 'FeatureCollection',
          features: newCrowdData.map(p => ({
            type: 'Feature',
            properties: { count: p.count },
            geometry: { type: 'Point', coordinates: [p.lng, p.lat] }
          }))
        };
        layersRef.current.crowd.setData(geojson);
      } catch (err) {
        console.error('[AmapL7Scene] 更新人流数据失败:', err);
      }
    }
    
    // 更新告警图层
    if (layersRef.current.alert) {
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
        layersRef.current.alert.setData(geojson);
      } catch (err) {
        console.error('[AmapL7Scene] 更新告警图层失败:', err);
      }
    }
  }, [sceneLoaded, currentTime, updateAlerts]);

  // ========== 更新其他图层 ==========
  useEffect(() => {
    if (!sceneLoaded || !sceneRef.current || isDestroyedRef.current) return;
    
    if (layersRef.current.flow && flowData) {
      try {
        const geojson = {
          type: 'FeatureCollection',
          features: flowData.map(item => ({
            type: 'Feature',
            properties: { type: item.type, volume: item.volume },
            geometry: { type: 'LineString', coordinates: item.path }
          }))
        };
        layersRef.current.flow.setData(geojson);
      } catch (err) {
        console.error('[AmapL7Scene] 更新人流线失败:', err);
      }
    }
    
    if (layersRef.current.zone && zoneData) {
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
        layersRef.current.zone.setData(geojson);
      } catch (err) {
        console.error('[AmapL7Scene] 更新区域数据失败:', err);
      }
    }
  }, [sceneLoaded, flowData, zoneData]);

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
      
      {sceneLoaded && selectedStation && (
        <div className="absolute top-20 right-4 z-20 w-72">
          <div className="glass-panel rounded-xl p-4 border border-cyan-400/30 relative">
            <button 
              onClick={() => setSelectedStation(null)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
            
            <div className="flex items-center gap-2 mb-3 pr-6">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">{selectedStation.name}</h3>
                <p className="text-white/40 text-xs">{selectedStation.id}</p>
              </div>
            </div>
            
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
          </div>
        </div>
      )}
      
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
                <img src="/icons/base-station.svg" className="w-4 h-4" alt="" />
                <span>5G 基站</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/icons/smart-board.svg" className="w-4 h-4" alt="" />
                <span>智能板基站</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/icons/comm-vehicle.svg" className="w-4 h-4" alt="" />
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
