import { motion } from 'framer-motion';
import { Wifi, Smartphone, MessageCircle, Video } from 'lucide-react';

// 默认 KQI 数据（当 API 数据未加载时显示）
const DEFAULT_KQI_DATA = [
  { 
    label: '总流量', 
    value: '8,420', 
    unit: 'GB', 
    trend: '+12%', 
    trendData: [6500, 7200, 6800, 7500, 8200, 7900, 8420],
    isHigherBetter: true,
  },
  { 
    label: '语音话务量', 
    value: '420', 
    unit: 'Erl', 
    trend: '+5%', 
    trendData: [380, 390, 400, 395, 410, 415, 420],
    isHigherBetter: true,
  },
  { 
    label: '平均吞吐', 
    value: '520', 
    unit: 'Mbps', 
    trend: '-2%', 
    trendData: [480, 510, 530, 545, 535, 528, 520],
    isHigherBetter: true,
  },
  { 
    label: '时延', 
    value: '12', 
    unit: 'ms', 
    trend: '-8%', 
    trendData: [18, 16, 15, 14, 13, 12.5, 12],
    isHigherBetter: false,
  },
];

// 图标映射
const ICON_MAP = {
  '总流量': Wifi,
  '语音话务量': MessageCircle,
  '平均吞吐': Smartphone,
  '时延': Video,
};

// 生成 SVG Sparkline 路径
const generateSparklinePath = (data, width, height) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  
  return data.map((value, index) => {
    const x = index * stepX;
    const y = height - ((value - min) / range) * height * 0.7 - height * 0.15;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
};

const generateAreaPath = (data, width, height) => {
  const pathD = generateSparklinePath(data, width, height);
  return `${pathD} L ${width} ${height} L 0 ${height} Z`;
};

// 单个 KPI 卡片组件
function KPICard({ item, index }) {
  const Icon = ICON_MAP[item.label] || Wifi;
  const isPositive = item.trend.startsWith('+');
  const trendColor = item.isHigherBetter 
    ? (isPositive ? 'text-cyber-cyan' : 'text-cyber-red')
    : (isPositive ? 'text-cyber-red' : 'text-green-400');
  
  const gradientColor = item.label === '时延' 
    ? { start: 'rgba(74, 222, 128, 0.6)', end: 'rgba(74, 222, 128, 0.05)', stroke: '#4ADE80' }
    : { start: 'rgba(0, 240, 255, 0.6)', end: 'rgba(0, 240, 255, 0.05)', stroke: '#00F0FF' };
  
  const svgWidth = 140;
  const svgHeight = 60;
  const areaPathD = generateAreaPath(item.trendData, svgWidth, svgHeight);
  const linePathD = generateSparklinePath(item.trendData, svgWidth, svgHeight);
  
  return (
    <motion.div
      key={item.label}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1 * index }}
      className="relative overflow-hidden rounded-lg bg-cyber-dark/50 border border-cyber-cyan/10 hover:border-cyber-cyan/30 transition-colors flex flex-col"
    >
      {/* 头部信息 */}
      <div className="p-2.5 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 text-cyber-cyan" />
            <span className="text-[11px] text-white/60">{item.label}</span>
          </div>
          <span className={`text-[10px] font-medium ${trendColor}`}>{item.trend}</span>
        </div>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-lg font-din text-white">{item.value}</span>
          <span className="text-[9px] text-white/40">{item.unit}</span>
        </div>
      </div>
      
      {/* 大图趋势 - 占据主要空间 */}
      <div className="flex-1 h-14 min-h-[56px] w-full mt-1.5">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`kpi-gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={gradientColor.start} />
              <stop offset="100%" stopColor={gradientColor.end} />
            </linearGradient>
          </defs>
          <path d={areaPathD} fill={`url(#kpi-gradient-${index})`} />
          <path 
            d={linePathD} 
            fill="none" 
            stroke={gradientColor.stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </motion.div>
  );
}

/**
 * KQI 矩阵组件
 * @param {Object} props
 * @param {Array} props.data - 从 BFF 获取的 KQI 数据
 */
export default function KQIMatrix({ data }) {
  // 使用传入的数据或默认数据
  const displayData = data && data.length > 0 ? data : DEFAULT_KQI_DATA;
  
  return (
    <div className="grid grid-cols-2 gap-3">
      {displayData.map((item, index) => (
        <KPICard key={item.label} item={item} index={index} />
      ))}
    </div>
  );
}
