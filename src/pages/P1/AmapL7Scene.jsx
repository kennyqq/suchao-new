import { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { Scene, GaodeMap, PointLayer, LineLayer, PolygonLayer } from '@antv/l7';
import { fetchFlowData, fetchZoneData, fetchBaseStations } from '../../api/dashboard.js';

const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || '';
const AMAP_SECURITY_CODE = import.meta.env.VITE_AMAP_SECURITY_CODE || '';
const CENTER_COORDINATES = [118.7265, 32.0087];

// 默认空 GeoJSON
const EMPTY_GEOJSON = { type: 'FeatureCollection', features: [] };

// ========== 全局高德安全配置（必须在组件渲染前执行） ==========
if (typeof window !== 'undefined') {
  window._AMapSecurityConfig = {
    securityJsCode: AMAP_SECURITY_CODE,
  };
}

// ========== 数据清洗工具函数 ==========
function cleanCoordinates(data) {
  if (!Array.isArray(data)) return [];
  return data.filter(item => {
    const lng = parseFloat(item.lng ?? item.longitude ?? item.lon);
    const lat = parseFloat(item.lat ?? item.latitude ?? item.lat);
    return !isNaN(lng) && !isNaN(lat) && lng !== 0 && lat !== 0;
  }).map(item => ({
    ...item,
    lng: parseFloat(item.lng ?? item.longitude ?? item.lon),
    lat: parseFloat(item.lat ?? item.latitude ?? item.lat),
  }));
}

function cleanFlowData(data) {
  if (!Array.isArray(data)) return [];
  return data.filter(item => {
    if (!item.path || !Array.isArray(item.path)) return false;
    // 检查路径中所有坐标是否合法
    return item.path.every(coord => 
      Array.isArray(coord) && 
      coord.length >= 2 &&
      !isNaN(parseFloat(coord[0])) && 
      !isNaN(parseFloat(coord[1]))
    );
  });
}

function cleanZoneData(data) {
  if (!data) return [];
  const zones = data.defenseZones || data;
  if (!Array.isArray(zones)) return [];
  
  return zones.filter(zone => {
    if (!zone.coordinates || !Array.isArray(zone.coordinates)) return false;
    // 检查多边形坐标是否合法
    return zone.coordinates.every(ring => 
      Array.isArray(ring) && ring.every(coord =>
        Array.isArray(coord) &&
        coord.length >= 2 &&
        !isNaN(parseFloat(coord[0])) &&
        !isNaN(parseFloat(coord[1]))
      )
    );
  });
}

export default function AmapL7Scene({ onStationClick, currentTime = '20:00' }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const flowLayerRef = useRef(null);
  const zoneLayerRef = useRef(null);
  const stationLayerRef = useRef(null);
  
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // API 数据状态
  const [flowData, setFlowData] = useState(null);
  const [zoneData, setZoneData] = useState(null);
  const [stationData, setStationData] = useState(null);

  // ========== 第一步：初始化地图和空图层（只执行一次） ==========
  useEffect(() => {
    let isMounted = true;
    let scene = null;

    const initMap = async () => {
      try {
        if (!containerRef.current) {
          setTimeout(initMap, 100);
          return;
        }

        if (!AMAP_KEY) {
          throw new Error('高德 Key 未配置 (VITE_AMAP_KEY)');
        }

        // 创建场景 - 传入正确的 token
        scene = new Scene({
          id: containerRef.current,
          map: new GaodeMap({
            pitch: 55,
            zoom: 15,
            center: CENTER_COORDINATES,
            viewMode: '3D',
            style: 'amap://styles/darkblue',
            token: AMAP_KEY, // <-- 关键：传入正确的 Key
          }),
        });

        scene.setBgColor('#0B1A2A');
        sceneRef.current = scene;

        // 等待场景加载
        scene.on('loaded', () => {
          if (!isMounted) return;
          
          try {
            // 初始化空图层（必须给默认空数据）
            
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

            // 3. 基站点位图层
            const stationLayer = new PointLayer({ zIndex: 3 })
              .source(EMPTY_GEOJSON, { parser: { type: 'geojson' } })
              .shape('circle')
              .color('#00F0FF')
              .size(20)
              .style({ opacity: 0.8 })
              .animate({ enable: true, speed: 0.02, rings: 2 });
            scene.addLayer(stationLayer);
            stationLayerRef.current = stationLayer;
            
            // 点击事件
            stationLayer.on('click', (e) => {
              if (e.feature && onStationClick) {
                onStationClick(e.feature.properties);
              }
            });

            setSceneLoaded(true);
            setLoading(false);
            console.log('[AmapL7Scene] 地图和空图层初始化完成');
          } catch (layerErr) {
            console.error('[AmapL7Scene] 图层初始化错误:', layerErr);
            if (isMounted) {
              setError('图层初始化失败: ' + layerErr.message);
              setLoading(false);
            }
          }
        });

        scene.on('error', (err) => {
          console.error('[AmapL7Scene] 场景错误:', err);
          if (isMounted) {
            setError('地图渲染失败: ' + (err.message || '未知错误'));
            setLoading(false);
          }
        });

      } catch (err) {
        console.error('[AmapL7Scene] 初始化错误:', err);
        if (isMounted) {
          setError(err.message || '地图初始化失败');
          setLoading(false);
        }
      }
    };

    initMap();

    // 清理函数 - 确保组件卸载时销毁场景
    return () => {
      isMounted = false;
      if (sceneRef.current) {
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
        const [flow, zones, stations] = await Promise.all([
          fetchFlowData(currentTime),
          fetchZoneData('defense'),
          fetchBaseStations()
        ]);
        
        // 数据清洗 - 过滤非法坐标
        const cleanFlow = cleanFlowData(flow);
        const cleanZones = cleanZoneData(zones);
        const cleanStations = cleanCoordinates(stations);
        
        setFlowData(cleanFlow);
        setZoneData(cleanZones);
        setStationData(cleanStations);
        
        console.log('[AmapL7Scene] API 数据加载完成:', {
          flow: cleanFlow.length,
          zones: cleanZones.length,
          stations: cleanStations.length
        });
      } catch (err) {
        console.error('[AmapL7Scene] 获取数据失败:', err);
      }
    };
    
    loadData();
  }, [currentTime]);

  // ========== 第三步：更新图层数据（当 sceneLoaded 和数据都准备好时） ==========
  useEffect(() => {
    if (!sceneLoaded) return;
    
    // 更新人流数据
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
        console.log('[AmapL7Scene] 人流数据已更新:', flowData.length);
      } catch (err) {
        console.error('[AmapL7Scene] 更新人流数据失败:', err);
      }
    }
    
    // 更新区域数据
    if (zoneLayerRef.current && zoneData && zoneData.length > 0) {
      try {
        const geojson = {
          type: 'FeatureCollection',
          features: zoneData.map(zone => ({
            type: 'Feature',
            properties: { name: zone.name, height: zone.height, color: zone.color },
            geometry: { type: 'Polygon', coordinates: [zone.coordinates] }
          }))
        };
        zoneLayerRef.current.setData(geojson);
        console.log('[AmapL7Scene] 区域数据已更新:', zoneData.length);
      } catch (err) {
        console.error('[AmapL7Scene] 更新区域数据失败:', err);
      }
    }
    
    // 更新基站数据
    if (stationLayerRef.current && stationData && stationData.length > 0) {
      try {
        const geojson = {
          type: 'FeatureCollection',
          features: stationData.map(station => ({
            type: 'Feature',
            properties: { ...station },
            geometry: { type: 'Point', coordinates: [station.lng, station.lat] }
          }))
        };
        stationLayerRef.current.setData(geojson);
        console.log('[AmapL7Scene] 基站数据已更新:', stationData.length);
      } catch (err) {
        console.error('[AmapL7Scene] 更新基站数据失败:', err);
      }
    }
  }, [sceneLoaded, flowData, zoneData, stationData]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0B1A2A]">
      {/* 核心：地图容器必须永远存在！ */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      
      {/* 加载遮罩悬浮于上方 */}
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
            <div className="text-xs text-white/40 mt-4">
              请检查 VITE_AMAP_KEY 和 VITE_AMAP_SECURITY_CODE 配置
            </div>
          </div>
        </div>
      )}
      
      {/* 其他 UI 面板 */}
      {sceneLoaded && (
        <>
          <div className="absolute top-4 right-4 bg-cyber-panel/90 rounded-lg p-3 border border-cyan-400/30 z-10">
            <div className="text-cyan-400 text-xs font-bold mb-2 flex items-center gap-2">
              <MapPin className="w-3 h-3" /> 图例
            </div>
            <div className="space-y-1.5 text-[10px] text-white/70">
              <div className="flex items-center gap-2"><span className="w-4 h-0.5 bg-cyan-400" />进场人流</div>
              <div className="flex items-center gap-2"><span className="w-4 h-0.5 bg-orange-400" />散场人流</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-400" />主基站</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-cyan-400" />子基站</div>
            </div>
          </div>

          <div className="absolute top-4 left-4 bg-cyber-panel/90 rounded-lg px-4 py-2 border border-cyan-400/30 z-10">
            <div className="text-[10px] text-white/50">时空切片</div>
            <div className="text-xl font-bold text-cyan-400">{currentTime}</div>
          </div>
        </>
      )}
    </div>
  );
}
