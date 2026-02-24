import { motion } from 'framer-motion';
import { TrendingUp, Activity } from 'lucide-react';

// 现代缺口圆环进度条
function ArcProgress({ value, max = 100, color = '#00F0FF', label }) {
  const radius = 45;
  const strokeWidth = 8;
  const normalizedValue = Math.min(value / max, 1);
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 缺口圆环 75%
  const strokeDashoffset = arcLength - (normalizedValue * arcLength);
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 120 100">
        {/* 背景轨道 */}
        <circle
          cx="60"
          cy="55"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          strokeDasharray={arcLength}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          transform="rotate(135 60 55)"
        />
        {/* 进度条 */}
        <motion.circle
          cx="60"
          cy="55"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={arcLength}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          transform="rotate(135 60 55)"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      {/* 中心数字 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className="text-3xl font-bold"
          style={{ color, fontFamily: 'Orbitron, monospace' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {value}%
        </motion.span>
        <span className="text-white/40 text-[10px] mt-1">{label}</span>
      </div>
    </div>
  );
}

// 平滑预测曲线 - 数据范围 60->65%
function MiniPredictionChart() {
  const data = [
    { time: '-30分', value: 60, type: 'past' },
    { time: '-20分', value: 61, type: 'past' },
    { time: '-10分', value: 62, type: 'past' },
    { time: '当前', value: 62, type: 'now' },
    { time: '+10分', value: 63, type: 'future' },
    { time: '+20分', value: 64, type: 'future' },
    { time: '+30分', value: 65, type: 'future' },
  ];
  
  const maxVal = 70;
  const minVal = 55;
  
  return (
    <div className="h-full flex flex-col">
      {/* 图表区域 */}
      <div className="flex-1 relative">
        <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
          {/* 网格线 */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={80 - y * 0.8}
              x2="200"
              y2={80 - y * 0.8}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}
          
          {/* 过去实线 */}
          <motion.path
            d={`M 0 ${80 - ((data[0].value - minVal) / (maxVal - minVal)) * 80} 
                L 66 ${80 - ((data[1].value - minVal) / (maxVal - minVal)) * 80} 
                L 100 ${80 - ((data[2].value - minVal) / (maxVal - minVal)) * 80}`}
            fill="none"
            stroke="#00F0FF"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
          
          {/* 未来虚线 */}
          <motion.path
            d={`M 100 ${80 - ((data[3].value - minVal) / (maxVal - minVal)) * 80} 
                L 133 ${80 - ((data[4].value - minVal) / (maxVal - minVal)) * 80} 
                L 166 ${80 - ((data[5].value - minVal) / (maxVal - minVal)) * 80}
                L 200 ${80 - ((data[6].value - minVal) / (maxVal - minVal)) * 80}`}
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
            strokeDasharray="4,4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          
          {/* 数据点 */}
          {data.map((point, idx) => (
            <motion.circle
              key={idx}
              cx={idx * 33.3}
              cy={80 - ((point.value - minVal) / (maxVal - minVal)) * 80}
              r="3"
              fill={point.type === 'future' ? '#FFD700' : '#00F0FF'}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
            />
          ))}
        </svg>
      </div>
      
      {/* X轴标签 */}
      <div className="flex justify-between text-[9px] text-white/40 px-1">
        {data.map((d, i) => (
          <span key={i} className={d.type === 'future' ? 'text-yellow-400/60' : ''}>
            {d.time}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function CapacityAgentCard() {
  return (
    <div className="h-full flex flex-row gap-4">
      {/* 左侧：当前空间 - 缺口圆环 (40%) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-[40%] flex flex-col"
      >
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-3.5 h-3.5 text-cyber-cyan" />
          <span className="text-white/70 text-xs">当前空间</span>
        </div>
        
        {/* 缺口圆环 */}
        <div className="flex-1 min-h-0 py-2">
          <ArcProgress value={60} color="#00FF88" label="容量使用率" />
        </div>
        
        {/* 状态标签 */}
        <div className="flex justify-center">
          <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50">
            <span className="text-green-400 text-xs font-bold">绿区 (建议推广)</span>
          </div>
        </div>
      </motion.div>

      {/* 分割线 */}
      <div className="w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />

      {/* 右侧：未来预测 - 平滑曲线 (60%) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="w-[60%] flex flex-col"
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-cyber-gold" />
            <span className="text-white/70 text-xs">未来30min预测</span>
          </div>
          <span className="text-white/40 text-[10px]">平稳增长</span>
        </div>
        
        {/* 预测曲线 */}
        <div className="flex-1 min-h-0">
          <MiniPredictionChart />
        </div>
        
        {/* 预测总结 */}
        <div className="flex items-center justify-between px-1 mt-1">
          <span className="text-white/50 text-xs">预测峰值</span>
          <span className="number-vip text-lg">65%</span>
        </div>
      </motion.div>
    </div>
  );
}
