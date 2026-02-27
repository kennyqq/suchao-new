import { motion } from 'framer-motion';
import { X, Trophy, Users, Wifi, Crown } from 'lucide-react';

// 默认核心数据
const DEFAULT_CORE_METRICS = {
  peakAttendance: { value: 65328, unit: '人', label: '奥体球迷峰值' },
  peakTraffic: { value: 15.8, unit: 'TB', label: '峰值话务量' },
  packages5GA: { value: 850, unit: '份', label: '5G-A 场馆包销量' }
};

const DEFAULT_MATCH = {
  date: '5月2日',
  home: '南京',
  away: '常州',
  score: '2:1',
  venue: '南京奥体中心'
};

/**
 * 战报卡片组件
 * @param {Object} props
 * @param {Function} props.onClose - 关闭回调
 * @param {Object} props.data - 战报数据
 */
export default function BattleReportCard({ onClose, data = {} }) {
  const { 
    match = DEFAULT_MATCH, 
    coreMetrics = DEFAULT_CORE_METRICS,
    assuranceLevel = 'S'
  } = data;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 30 }}
      transition={{ type: 'spring', damping: 30, stiffness: 400 }}
      className="relative w-[720px] rounded-2xl p-10"
      style={{
        background: 'linear-gradient(135deg, rgba(11, 26, 42, 0.95) 0%, rgba(8, 20, 35, 0.98) 100%)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 215, 0, 0.4)',
        boxShadow: `
          0 0 60px rgba(255, 215, 0, 0.25),
          0 0 120px rgba(255, 215, 0, 0.1),
          inset 0 0 40px rgba(255, 215, 0, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
      }}
    >
      {/* 关闭按钮 */}
      <button 
        onClick={onClose}
        className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all"
      >
        <X className="w-5 h-5" />
      </button>

      {/* 标题区 */}
      <div className="text-center mb-8">
        <motion.div 
          className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30"
          animate={{ 
            boxShadow: [
              '0 0 10px rgba(255, 215, 0, 0.1)',
              '0 0 20px rgba(255, 215, 0, 0.2)',
              '0 0 10px rgba(255, 215, 0, 0.1)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400 text-sm font-medium tracking-wider">2026 苏超联赛 · 通信保障总结战报</span>
        </motion.div>
        
        {/* 对阵比分 */}
        <div className="flex items-center justify-center gap-10 mt-6">
          <div className="text-center">
            <div className="text-4xl font-din font-bold text-white tracking-wider">{match.home}</div>
            <div className="text-xs text-white/40 mt-1 tracking-widest">{match.home.toUpperCase()}</div>
          </div>
          
          <div className="flex items-center gap-3 px-6 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <span className="text-5xl font-din font-bold text-yellow-400">{match.score.split(':')[0]}</span>
            <span className="text-2xl text-white/30">:</span>
            <span className="text-5xl font-din font-bold text-white/70">{match.score.split(':')[1]}</span>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-din font-bold text-white/70 tracking-wider">{match.away}</div>
            <div className="text-xs text-white/40 mt-1 tracking-widest">{match.away.toUpperCase()}</div>
          </div>
        </div>
        
        <div className="text-xs text-white/30 mt-3">{match.date} · {match.venue}</div>
      </div>

      {/* 金色分隔线 */}
      <div className="h-px w-full mb-8" style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.5) 20%, rgba(255, 215, 0, 0.8) 50%, rgba(255, 215, 0, 0.5) 80%, transparent 100%)'
      }} />

      {/* 核心数据 - 3列荣誉展台 */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* 展台1: 峰值人数 */}
        <motion.div 
          className="relative text-center p-5 rounded-xl"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 215, 0, 0.02) 100%)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
            <Users className="w-3 h-3 text-yellow-400" />
          </div>
          <div className="text-3xl font-din font-bold text-white mt-2">
            {coreMetrics.peakAttendance.value.toLocaleString()}
          </div>
          <div className="text-[11px] text-white/50 mt-1">{coreMetrics.peakAttendance.label}</div>
          <div className="text-[10px] text-yellow-400/80 mt-0.5">{coreMetrics.peakAttendance.unit}</div>
          
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px" style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.5), transparent)'
          }} />
        </motion.div>

        {/* 展台2: 峰值流量 */}
        <motion.div 
          className="relative text-center p-5 rounded-xl"
          style={{
            background: 'linear-gradient(180deg, rgba(0, 240, 255, 0.08) 0%, rgba(0, 240, 255, 0.02) 100%)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Wifi className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-3xl font-din font-bold text-white mt-2">{coreMetrics.peakTraffic.value}</div>
          <div className="text-[11px] text-white/50 mt-1">{coreMetrics.peakTraffic.label}</div>
          <div className="text-[10px] text-cyan-400/80 mt-0.5">{coreMetrics.peakTraffic.unit}</div>
          
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px" style={{
            background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.5), transparent)'
          }} />
        </motion.div>

        {/* 展台3: 5G-A 套餐 */}
        <motion.div 
          className="relative text-center p-5 rounded-xl"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 215, 0, 0.02) 100%)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
            <Crown className="w-3 h-3 text-yellow-400" />
          </div>
          <div className="text-3xl font-din font-bold text-white mt-2">{coreMetrics.packages5GA.value}</div>
          <div className="text-[11px] text-white/50 mt-1">{coreMetrics.packages5GA.label}</div>
          <div className="text-[10px] text-yellow-400/80 mt-0.5">{coreMetrics.packages5GA.unit}</div>
          
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px" style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.5), transparent)'
          }} />
        </motion.div>
      </div>

      {/* S级保障评级 - 强烈发光 */}
      <div className="text-center">
        <motion.div 
          className="inline-flex items-center gap-3 px-8 py-3 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.1) 100%)',
            border: '1px solid rgba(255, 215, 0, 0.5)',
          }}
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.15), inset 0 0 20px rgba(255, 215, 0, 0.1)',
              '0 0 40px rgba(255, 215, 0, 0.5), 0 0 80px rgba(255, 215, 0, 0.25), inset 0 0 30px rgba(255, 215, 0, 0.15)',
              '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.15), inset 0 0 20px rgba(255, 215, 0, 0.1)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Trophy className="w-6 h-6 text-yellow-400" />
          <span className="text-xl font-bold text-yellow-400 tracking-widest">{assuranceLevel}级保障 · 圆满完成</span>
        </motion.div>
      </div>

      {/* 四角装饰 */}
      <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-yellow-500/60 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-yellow-500/60 rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-yellow-500/60 rounded-bl-2xl" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-yellow-500/60 rounded-br-2xl" />
    </motion.div>
  );
}
