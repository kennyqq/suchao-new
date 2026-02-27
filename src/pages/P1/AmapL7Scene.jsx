import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2, MapPin, AlertCircle, RefreshCw } from 'lucide-react';

const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || '';
const AMAP_SECURITY_CODE = import.meta.env.VITE_AMAP_SECURITY_CODE || '';
const CENTER_COORDINATES = [118.7265, 32.0087];

const FLOW_DATA = [
  { id: 'flow_001', from: '元通枢纽', to: '奥体', volume: 65, type: 'enter', path: [[118.7350, 32.0050], [118.7330, 32.0055], [118.7310, 32.0060], [118.7290, 32.0065], [118.7270, 32.0070], [118.7265, 32.0087]] },
  { id: 'flow_002', from: '华采天地', to: '奥体', volume: 78, type: 'enter', path: [[118.7340, 32.0035], [118.7345, 32.0045], [118.7335, 32.0055], [118.7325, 32.0065], [118.7315, 32.0075], [118.7300, 32.0085], [118.7265, 32.0087]] },
  { id: 'flow_003', from: '梦都大街', to: '奥体', volume: 52, type: 'enter', path: [[118.7180, 32.0150], [118.7190, 32.0140], [118.7200, 32.0130], [118.7210, 32.0120], [118.7220, 32.0110], [118.7230, 32.0100], [118.7240, 32.0090], [118.7265, 32.0087]] },
  { id: 'flow_004', from: '奥体', to: '元通枢纽', volume: 120, type: 'exit', path: [[118.7265, 32.0087], [118.7275, 32.0075], [118.7295, 32.0065], [118.7315, 32.0055], [118.7335, 32.0050], [118.7350, 32.0050]] },
  { id: 'flow_005', from: '奥体', to: '华采天地', volume: 95, type: 'exit', path: [[118.7265, 32.0087], [118.7280, 32.0075], [118.7300, 32.0065], [118.7320, 32.0055], [118.7340, 32.0045], [118.7340, 32.0035]] },
  { id: 'flow_006', from: '奥体', to: '梦都大街', volume: 82, type: 'exit', path: [[118.7265, 32.0087], [118.7250, 32.0095], [118.7240, 32.0105], [118.7230, 32.0115], [118.7210, 32.0125], [118.7190, 32.0135], [118.7180, 32.0150]] }
];

const ZONE_DATA = [
  { id: 'zone_001', name: '主体育场', type: 'core', height: 80, color: 'rgba(0, 240, 255, 0.35)', coordinates: [[118.723, 32.011], [118.730, 32.011], [118.730, 32.006], [118.723, 32.006]] },
  { id: 'zone_002', name: '华采天地', type: 'commercial', height: 70, color: 'rgba(204, 0, 255, 0.35)', coordinates: [[118.732, 32.005], [118.736, 32.005], [118.736, 32.002], [118.732, 32.002]] },
  { id: 'zone_003', name: '元通枢纽', type: 'transit', height: 55, color: 'rgba(255, 165, 0, 0.4)', coordinates: [[118.728, 32.001], [118.731, 32.001], [118.731, 31.998], [118.728, 31.998]] },
  { id: 'zone_004', name: '北门安检口', type: 'checkpoint', height: 40, color: 'rgba(255, 51, 51, 0.4)', coordinates: [[118.725, 32.013], [118.728, 32.013], [118.728, 32.012], [118.725, 32.012]] }
];

const STATIONS = [
  { id: 'site_001', name: '奥体主站', lng: 118.7265, lat: 32.0087, type: 'main' },
  { id: 'site_002', name: '奥体东站', lng: 118.7320, lat: 32.0095, type: 'sub' },
  { id: 'site_003', name: '奥体西站', lng: 118.7210, lat: 32.0090, type: 'sub' },
  { id: 'site_004', name: '奥体南站', lng: 118.7270, lat: 32.0030, type: 'sub' },
  { id: 'site_005', name: '奥体北站', lng: 118.7260, lat: 32.0140, type: 'sub' },
  { id: 'site_006', name: '元通站', lng: 118.7350, lat: 32.0050, type: 'sub' },
  { id: 'site_007', name: '梦都大街站', lng: 118.7180, lat: 32.0150, type: 'sub' },
  { id: 'site_008', name: '河西中央公园站', lng: 118.7400, lat: 32.0120, type: 'sub' }
];

export default function AmapL7Scene({ onStationClick, currentTime = '20:00' }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let scene = null;
    let isMounted = true;

    const init = async () => {
      // 确保容器存在
      if (!containerRef.current) {
        console.log('[AmapL7Scene] 等待容器就绪...');
        setTimeout(init, 100);
        return;
      }

      console.log('[AmapL7Scene] 容器已就绪，开始初始化');

      if (!AMAP_KEY) {
        setError('高德 Key 未配置');
        setLoading(false);
        return;
      }

      try {
        // 导入依赖
        const [{ default: AMapLoader }, L7] = await Promise.all([
          import('@amap/amap-jsapi-loader'),
          import('@antv/l7')
        ]);

        const { Scene, GaodeMap, PointLayer, LineLayer, PolygonLayer } = L7;

        // 配置安全密钥
        if (typeof window !== 'undefined') {
          window._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY_CODE };
        }

        // 加载高德
        await AMapLoader.load({ key: AMAP_KEY, version: '2.0', plugins: [] });

        if (!isMounted || !containerRef.current) return;

        // 创建场景
        scene = new Scene({
          id: containerRef.current,
          map: new GaodeMap({
            pitch: 55,
            zoom: 15,
            center: CENTER_COORDINATES,
            viewMode: '3D',
            style: 'amap://styles/darkblue',
          }),
        });

        scene.setBgColor('#0B1A2A');
        sceneRef.current = scene;

        scene.on('loaded', () => {
          if (!isMounted) return;
          console.log('[AmapL7Scene] 地图加载完成');
          setMapReady(true);
          setLoading(false);

          // 添加图层
          const flowLayer = new LineLayer({ zIndex: 1 })
            .source(FLOW_DATA, { parser: { type: 'json', coordinates: 'path' } })
            .size('volume', [2, 5])
            .shape('line')
            .color('type', (type) => type === 'exit' ? '#ff6432' : '#00f0ff')
            .animate({ enable: true, interval: 0.1, trailLength: 0.5, duration: 2 })
            .style({ opacity: 0.8 });
          scene.addLayer(flowLayer);

          const zoneGeoData = {
            type: 'FeatureCollection',
            features: ZONE_DATA.map(zone => ({
              type: 'Feature',
              properties: { name: zone.name, height: zone.height, color: zone.color },
              geometry: { type: 'Polygon', coordinates: [zone.coordinates] }
            }))
          };
          const zoneLayer = new PolygonLayer({ zIndex: 2 })
            .source(zoneGeoData)
            .color('color')
            .shape('extrude')
            .size('height')
            .style({ opacity: 0.6 });
          scene.addLayer(zoneLayer);

          const mainStations = STATIONS.filter(s => s.type === 'main');
          const subStations = STATIONS.filter(s => s.type === 'sub');

          if (mainStations.length > 0) {
            const mainLayer = new PointLayer({ zIndex: 3 })
              .source(mainStations, { parser: { type: 'json', x: 'lng', y: 'lat' } })
              .shape('circle').color('#FFD700').size(30).style({ opacity: 0.8 })
              .animate({ enable: true, speed: 0.02, rings: 2 });
            scene.addLayer(mainLayer);
            mainLayer.on('click', (e) => e.feature && onStationClick && onStationClick(e.feature));
          }

          if (subStations.length > 0) {
            const subLayer = new PointLayer({ zIndex: 3 })
              .source(subStations, { parser: { type: 'json', x: 'lng', y: 'lat' } })
              .shape('circle').color('#00F0FF').size(20).style({ opacity: 0.7 })
              .animate({ enable: true, speed: 0.025, rings: 2 });
            scene.addLayer(subLayer);
            subLayer.on('click', (e) => e.feature && onStationClick && onStationClick(e.feature));
          }
        });

        scene.on('error', (err) => {
          console.error('[AmapL7Scene] 错误:', err);
          if (isMounted) {
            setError('地图渲染错误: ' + (err.message || '未知'));
            setLoading(false);
          }
        });

      } catch (err) {
        console.error('[AmapL7Scene] 初始化错误:', err);
        if (isMounted) {
          setError('初始化失败: ' + (err.message || '未知'));
          setLoading(false);
        }
      }
    };

    // 延迟初始化
    const timer = setTimeout(init, 800);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (sceneRef.current) {
        try { sceneRef.current.destroy(); } catch (e) {}
        sceneRef.current = null;
      }
    };
  }, [onStationClick]);

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-cyber-bg/80">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <div className="text-cyan-400 text-xl font-bold">加载 3D 地图...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-cyber-bg/90">
        <div className="text-center max-w-md p-6">
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <div className="text-yellow-400 text-xl font-bold mb-2">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/50"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" /> 刷新重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0B1A2A]">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      {mapReady && (
        <>
          <div className="absolute top-4 right-4 bg-cyber-panel/90 rounded-lg p-3 border border-cyan-400/30 z-10">
            <div className="text-cyan-400 text-xs font-bold mb-2"><MapPin className="w-3 h-3 inline mr-1" /> 图例</div>
            <div className="space-y-1 text-[10px] text-white/70">
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
