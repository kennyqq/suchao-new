import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import AMapLoader from '@amap/amap-jsapi-loader';
import { Scene, GaodeMap, PolygonLayer } from '@antv/l7';
import { Loader2, AlertCircle } from 'lucide-react';

const AMAP_KEY = '5a28dc3c39c1c149af28785c70558398';
const AMAP_SECURITY_CODE = 'c60259e2676156b50ad3e389f524dad0';
const CENTER_COORDINATES = [118.7265, 32.0087];

// 看台热力区坐标
const STAND_AREAS = [
  {
    id: 'stand_north',
    name: '北看台',
    coordinates: [
      [118.7240, 32.0120],
      [118.7290, 32.0120],
      [118.7290, 32.0140],
      [118.7240, 32.0140],
      [118.7240, 32.0120],
    ],
    heat: 0.9,
  },
  {
    id: 'stand_south',
    name: '南看台',
    coordinates: [
      [118.7240, 32.0030],
      [118.7290, 32.0030],
      [118.7290, 32.0050],
      [118.7240, 32.0050],
      [118.7240, 32.0030],
    ],
    heat: 0.85,
  },
  {
    id: 'stand_east',
    name: '东看台',
    coordinates: [
      [118.7290, 32.0050],
      [118.7310, 32.0050],
      [118.7310, 32.0120],
      [118.7290, 32.0120],
      [118.7290, 32.0050],
    ],
    heat: 0.75,
  },
  {
    id: 'stand_west',
    name: '西看台',
    coordinates: [
      [118.7220, 32.0050],
      [118.7240, 32.0050],
      [118.7240, 32.0120],
      [118.7220, 32.0120],
      [118.7220, 32.0050],
    ],
    heat: 0.8,
  },
];

export default function VenueMap() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let scene = null;

    const initMap = async () => {
      try {
        setLoading(true);
        
        if (typeof window !== 'undefined') {
          window._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY_CODE };
        }

        await AMapLoader.load({
          key: AMAP_KEY,
          version: '2.0',
          plugins: ['AMap.Map'],
        });

        if (!isMounted) return;

        const container = document.getElementById('venue-map-container');
        if (!container) throw new Error('地图容器未找到');

        scene = new Scene({
          id: 'venue-map-container',
          map: new GaodeMap({
            pitch: 65,
            zoom: 16.5,
            center: CENTER_COORDINATES,
            viewMode: '3D',
            style: 'amap://styles/darkblue',
            features: ['bg', 'road', 'building'],
          }),
        });

        scene.on('loaded', () => {
          if (!isMounted) return;
          setLoading(false);
          
          // 添加看台热力图层
          const heatData = {
            type: 'FeatureCollection',
            features: STAND_AREAS.map(area => ({
              type: 'Feature',
              properties: { 
                name: area.name, 
                heat: area.heat,
                id: area.id,
              },
              geometry: { type: 'Polygon', coordinates: [area.coordinates] },
            })),
          };

          const heatLayer = new PolygonLayer({ name: 'stand-heat' })
            .source(heatData)
            .color('heat', (heat) => {
              const alpha = heat * 0.6;
              return `rgba(255, 51, 51, ${alpha})`;
            })
            .shape('fill')
            .style({ opacity: 0.8 })
            .animate({ enable: true, speed: 0.5, rings: 2 });

          scene.addLayer(heatLayer);
        });

        scene.on('error', (err) => {
          if (isMounted) {
            setError(err.message || '地图加载失败');
            setLoading(false);
          }
        });

      } catch (err) {
        if (isMounted) {
          setError(err.message || '初始化失败');
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

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0B1A2A]">
      {/* 地图容器 */}
      <div id="venue-map-container" className="absolute inset-0 w-full h-full z-0" />

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-cyber-bg/80 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <Loader2 className="w-12 h-12 text-cyber-cyan animate-spin mx-auto mb-4" />
            <div className="text-cyber-cyan text-lg font-din">加载场馆地图...</div>
          </motion.div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-cyber-bg/90">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-md p-6">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <div className="text-red-400 text-xl font-bold mb-3">地图加载失败</div>
            <div className="text-white/70 text-sm">{error}</div>
          </motion.div>
        </div>
      )}

      {/* 控件层 */}
      {!loading && !error && (
        <>
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            className="absolute top-4 right-4 z-10 glass-panel rounded-lg p-3 border border-cyber-cyan/30">
            <div className="text-cyber-cyan text-xs font-medium mb-2">看台热力</div>
            <div className="space-y-1.5 text-[10px] text-white/70">
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500/80" /><span>北看台 (90%)</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500/70" /><span>南看台 (85%)</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500/60" /><span>西看台 (80%)</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500/50" /><span>东看台 (75%)</span></div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
