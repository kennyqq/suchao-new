import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FlylineChartEnhanced } from '@jiaminghi/data-view-react';
import { Globe, Map as MapIcon, Info } from 'lucide-react';

// ==================== 中国地图背景（使用可靠的CDN）====================
// 使用 DataV Atlas 地图服务
const CHINA_MAP_BG = 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json';

// 备用：使用SVG绘制简化中国地图轮廓作为背景
const ChinaMapBackground = () => (
  <svg 
    viewBox="0 0 1000 800" 
    className="absolute inset-0 w-full h-full opacity-30"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* 中国地图简化轮廓 */}
    <defs>
      <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.05" />
      </linearGradient>
    </defs>
    
    {/* 中国轮廓 - 简化版 */}
    <path
      d="M850,180 L880,160 L920,170 L940,200 L930,250 L900,300 L850,350 L800,400 L750,450 L700,500 L650,550 L600,600 L550,650 L500,700 L450,720 L400,710 L350,680 L300,640 L250,600 L200,550 L150,500 L120,450 L100,400 L90,350 L100,300 L120,250 L150,200 L200,150 L250,120 L300,100 L350,90 L400,85 L450,80 L500,75 L550,70 L600,75 L650,80 L700,90 L750,110 L800,140 Z"
      fill="url(#mapGradient)"
      stroke="#00F0FF"
      strokeWidth="1"
      strokeOpacity="0.3"
    />
    
    {/* 主要省份轮廓线 */}
    <g stroke="#00F0FF" strokeWidth="0.5" strokeOpacity="0.2" fill="none">
      {/* 省界线 */}
      <path d="M300,200 L350,220 L400,210 L450,230 L500,220 L550,240 L600,230 L650,250" />
      <path d="M200,300 L250,320 L300,310 L350,330 L400,320 L450,340 L500,330 L550,350 L600,340" />
      <path d="M150,400 L200,420 L250,410 L300,430 L350,420 L400,440 L450,430 L500,450 L550,440 L600,460" />
      <path d="M250,500 L300,520 L350,510 L400,530 L450,520 L500,540 L550,530 L600,550" />
    </g>
    
    {/* 网格线 */}
    <g stroke="#00F0FF" strokeWidth="0.3" strokeOpacity="0.1">
      {[...Array(10)].map((_, i) => (
        <line key={`h-${i}`} x1="0" y1={i * 80} x2="1000" y2={i * 80} />
      ))}
      {[...Array(13)].map((_, i) => (
        <line key={`v-${i}`} x1={i * 80} y1="0" x2={i * 80} y2="800" />
      ))}
    </g>
  </svg>
);

// 江苏地图简化背景
const JiangsuMapBackground = () => (
  <svg 
    viewBox="0 0 800 600" 
    className="absolute inset-0 w-full h-full opacity-40"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <linearGradient id="jsMapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    
    {/* 江苏省简化轮廓 */}
    <path
      d="M200,100 L300,80 L400,70 L500,80 L600,100 L700,140 L750,200 L780,280 L750,360 L700,420 L600,480 L500,520 L400,540 L300,530 L200,500 L120,440 L80,360 L70,280 L100,200 L150,140 Z"
      fill="url(#jsMapGradient)"
      stroke="#FFD700"
      strokeWidth="1.5"
      strokeOpacity="0.4"
    />
    
    {/* 省内主要分界线 */}
    <g stroke="#FFD700" strokeWidth="0.5" strokeOpacity="0.25" fill="none">
      <path d="M250,150 L350,170 L450,160 L550,180 L650,200" />
      <path d="M200,250 L300,270 L400,260 L500,280 L600,270 L700,290" />
      <path d="M150,350 L250,370 L350,360 L450,380 L550,370 L650,390" />
      <path d="M200,450 L300,470 L400,460 L500,480 L600,470" />
    </g>
    
    {/* 网格 */}
    <g stroke="#00F0FF" strokeWidth="0.3" strokeOpacity="0.15">
      {[...Array(8)].map((_, i) => (
        <line key={`h-${i}`} x1="0" y1={i * 75} x2="800" y2={i * 75} />
      ))}
      {[...Array(11)].map((_, i) => (
        <line key={`v-${i}`} x1={i * 75} y1="0" x2={i * 75} y2="600" />
      ))}
    </g>
  </svg>
);

// ==================== 中国地图数据 ====================
const nationalConfig = {
  // 移除bgImgSrc，使用SVG背景替代
  bgImgSrc: '',
  
  // 飞线点（城市位置）- 相对坐标 [0-1]
  points: [
    { name: '南京', coordinate: [0.52, 0.52], halo: { show: true, color: '#FFD700', radius: 100 }, text: { show: true, color: '#FFD700', fontSize: 14, offset: [0, -25] } },
    { name: '上海', coordinate: [0.72, 0.48], halo: { show: true, color: '#FF3333', radius: 70 }, text: { show: true, color: '#00F0FF', fontSize: 13 } },
    { name: '杭州', coordinate: [0.68, 0.55], halo: { show: true, color: '#FFD700', radius: 65 }, text: { show: true, color: '#00F0FF', fontSize: 12 } },
    { name: '合肥', coordinate: [0.58, 0.45], halo: { show: true, color: '#00F0FF', radius: 60 }, text: { show: true, color: '#00F0FF', fontSize: 12 } },
    { name: '北京', coordinate: [0.55, 0.22], halo: { show: true, color: '#00F0FF', radius: 70 }, text: { show: true, color: '#00F0FF', fontSize: 12 } },
    { name: '深圳', coordinate: [0.58, 0.78], halo: { show: true, color: '#00F0FF', radius: 55 }, text: { show: true, color: '#00F0FF', fontSize: 11 } },
    { name: '武汉', coordinate: [0.50, 0.50], halo: { show: true, color: '#1E90FF', radius: 60 }, text: { show: true, color: '#00F0FF', fontSize: 11 } },
    { name: '成都', coordinate: [0.32, 0.48], halo: { show: true, color: '#1E90FF', radius: 55 }, text: { show: true, color: '#00F0FF', fontSize: 11 } },
    { name: '西安', coordinate: [0.42, 0.42], halo: { show: true, color: '#4B5563', radius: 50 }, text: { show: true, color: '#00F0FF', fontSize: 10 } },
  ],
  
  // 飞线连接
  lines: [
    { source: '上海', target: '南京', color: '#FF3333', width: 3, duration: [15, 20] },
    { source: '杭州', target: '南京', color: '#FFD700', width: 2.5, duration: [18, 25] },
    { source: '合肥', target: '南京', color: '#FFD700', width: 2.5, duration: [16, 22] },
    { source: '北京', target: '南京', color: '#00F0FF', width: 2, duration: [20, 30] },
    { source: '深圳', target: '南京', color: '#00F0FF', width: 1.5, duration: [25, 35] },
    { source: '武汉', target: '南京', color: '#1E90FF', width: 1.5, duration: [18, 25] },
    { source: '成都', target: '南京', color: '#1E90FF', width: 1.5, duration: [22, 30] },
    { source: '西安', target: '南京', color: '#4B5563', width: 1, duration: [20, 28] },
  ],
  
  // 全局光晕配置
  halo: {
    show: true,
    duration: [20, 30],
    color: '#00F0FF',
    radius: 80,
  },
  
  // 全局文本配置
  text: {
    show: true,
    offset: [0, 15],
    color: '#00F0FF',
    fontSize: 11,
  },
  
  // 全局图标配置
  icon: {
    show: false,
    src: '',
    width: 15,
    height: 15,
  },
  
  // 全局飞线配置
  line: {
    width: 2,
    color: '#ffde93',
    orbitColor: 'rgba(0, 240, 255, 0.25)',
    duration: [15, 30],
    radius: 120,
  },
  
  // 飞线收束程度
  k: -0.4,
  // 飞线曲率
  curvature: 5,
  // 使用相对坐标
  relative: true,
};

// ==================== 江苏地图数据 ====================
const jiangsuConfig = {
  bgImgSrc: '',
  
  points: [
    { name: '南京', coordinate: [0.45, 0.48], halo: { show: true, color: '#FFD700', radius: 100 }, text: { show: true, color: '#FFD700', fontSize: 14, offset: [0, -25] } },
    { name: '苏州', coordinate: [0.72, 0.62], halo: { show: true, color: '#FF3333', radius: 75 }, text: { show: true, color: '#00F0FF', fontSize: 13 } },
    { name: '无锡', coordinate: [0.65, 0.55], halo: { show: true, color: '#FFD700', radius: 70 }, text: { show: true, color: '#00F0FF', fontSize: 12 } },
    { name: '常州', coordinate: [0.58, 0.52], halo: { show: true, color: '#FFD700', radius: 65 }, text: { show: true, color: '#00F0FF', fontSize: 12 } },
    { name: '南通', coordinate: [0.78, 0.45], halo: { show: true, color: '#00F0FF', radius: 65 }, text: { show: true, color: '#00F0FF', fontSize: 12 } },
    { name: '徐州', coordinate: [0.25, 0.25], halo: { show: true, color: '#00F0FF', radius: 60 }, text: { show: true, color: '#00F0FF', fontSize: 11 } },
    { name: '扬州', coordinate: [0.55, 0.35], halo: { show: true, color: '#1E90FF', radius: 60 }, text: { show: true, color: '#00F0FF', fontSize: 11 } },
    { name: '盐城', coordinate: [0.70, 0.30], halo: { show: true, color: '#1E90FF', radius: 60 }, text: { show: true, color: '#00F0FF', fontSize: 11 } },
    { name: '泰州', coordinate: [0.62, 0.40], halo: { show: true, color: '#4B5563', radius: 55 }, text: { show: true, color: '#00F0FF', fontSize: 11 } },
  ],
  
  lines: [
    { source: '苏州', target: '南京', color: '#FF3333', width: 3, duration: [12, 18] },
    { source: '无锡', target: '南京', color: '#FFD700', width: 2.5, duration: [14, 20] },
    { source: '常州', target: '南京', color: '#FFD700', width: 2.5, duration: [13, 19] },
    { source: '南通', target: '南京', color: '#00F0FF', width: 2, duration: [16, 24] },
    { source: '徐州', target: '南京', color: '#00F0FF', width: 1.5, duration: [20, 28] },
    { source: '扬州', target: '南京', color: '#1E90FF', width: 1.5, duration: [14, 20] },
    { source: '盐城', target: '南京', color: '#1E90FF', width: 1.5, duration: [18, 25] },
    { source: '泰州', target: '南京', color: '#4B5563', width: 1, duration: [15, 22] },
  ],
  
  halo: {
    show: true,
    duration: [15, 25],
    color: '#FFD700',
    radius: 60,
  },
  
  text: {
    show: true,
    offset: [0, 12],
    color: '#FFD700',
    fontSize: 11,
  },
  
  icon: {
    show: false,
    src: '',
    width: 12,
    height: 12,
  },
  
  line: {
    width: 2,
    color: '#FFD700',
    orbitColor: 'rgba(255, 215, 0, 0.2)',
    duration: [12, 25],
    radius: 100,
  },
  
  k: -0.3,
  curvature: 4,
  relative: true,
};

// 流量强度图例数据
const flowLegend = [
  { color: '#FF3333', label: '>12k', desc: '极高' },
  { color: '#FFD700', label: '8-12k', desc: '高' },
  { color: '#00F0FF', label: '5-8k', desc: '中高' },
  { color: '#1E90FF', label: '3-5k', desc: '中' },
  { color: '#4B5563', label: '<3k', desc: '一般' },
];

export default function MigrationMap() {
  const [mapMode, setMapMode] = useState('national');
  
  // 根据当前模式获取配置
  const currentConfig = useMemo(() => {
    const baseConfig = mapMode === 'national' ? nationalConfig : jiangsuConfig;
    return {
      ...baseConfig,
      halo: { ...baseConfig.halo, show: true },
      text: { ...baseConfig.text, show: true },
      icon: { ...baseConfig.icon, show: false },
      relative: true,
    };
  }, [mapMode]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 地图背景层 */}
      {mapMode === 'national' ? <ChinaMapBackground /> : <JiangsuMapBackground />}
      
      {/* DataV 飞线图增强版 - 叠加层 */}
      <div className="absolute inset-0 w-full h-full">
        <FlylineChartEnhanced
          config={currentConfig}
          style={{ width: '100%', height: '100%' }}
          dev={false}
        />
      </div>

      {/* 地图模式切换 */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
        <motion.div 
          initial={{ x: -50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          className="glass-panel rounded-lg p-1.5 flex gap-1 border border-cyber-cyan/20"
        >
          <button 
            onClick={() => setMapMode('national')} 
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
              mapMode === 'national' 
                ? 'bg-cyber-gold text-cyber-bg shadow-lg shadow-cyber-gold/30' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>全国视图</span>
          </button>
          <button 
            onClick={() => setMapMode('jiangsu')} 
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
              mapMode === 'jiangsu' 
                ? 'bg-cyber-cyan text-cyber-bg shadow-lg shadow-cyber-cyan/30' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>江苏视图</span>
          </button>
        </motion.div>

        {/* 流量图例 */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ delay: 0.1 }} 
          className="glass-panel rounded-lg p-3 z-20 border border-cyber-cyan/20"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Info className="w-3.5 h-3.5 text-cyber-cyan" />
            <span className="text-white/80 text-xs font-medium">球迷流量强度</span>
          </div>
          <div className="space-y-1.5">
            {flowLegend.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div 
                  className="w-6 h-1.5 rounded-sm" 
                  style={{ 
                    backgroundColor: item.color, 
                    boxShadow: `0 0 6px ${item.color}` 
                  }} 
                />
                <span className="text-white/70 text-[10px] font-mono">{item.label}</span>
                <span className="text-white/40 text-[9px]">· {item.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 数据说明卡片 */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ delay: 0.2 }} 
          className="glass-panel rounded-lg p-3 z-20 border border-cyber-cyan/20 max-w-[160px]"
        >
          <div className="text-white/60 text-[10px] leading-relaxed">
            <span className="text-cyber-cyan font-medium">数据来源：</span>
            移动信令大数据实时分析
          </div>
          <div className="mt-1.5 text-white/40 text-[9px]">
            更新时间：实时
          </div>
        </motion.div>
      </div>

      {/* 右侧统计信息 */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
        <motion.div 
          initial={{ x: 50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-lg p-3 border border-cyber-gold/30"
        >
          <div className="text-white/60 text-[10px] mb-1">当前主要来源</div>
          <div className="text-cyber-gold text-lg font-orbitron font-bold">
            {mapMode === 'national' ? '上海' : '苏州'}
          </div>
          <div className="text-white/40 text-[9px] mt-0.5">
            {mapMode === 'national' ? '15,200 人' : '12,400 人'}
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: 50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-lg p-3 border border-cyber-cyan/30"
        >
          <div className="text-white/60 text-[10px] mb-1">目的地</div>
          <div className="text-cyber-cyan text-lg font-orbitron font-bold">南京</div>
          <div className="text-white/40 text-[9px] mt-0.5">
            奥体中心体育场
          </div>
        </motion.div>
      </div>

      {/* 底部提示 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-full px-4 py-1.5 border border-white/10"
        >
          <span className="text-white/50 text-[10px]">
            DataV 飞线图增强版 · 实时球迷迁徙态势
          </span>
        </motion.div>
      </div>
    </div>
  );
}
