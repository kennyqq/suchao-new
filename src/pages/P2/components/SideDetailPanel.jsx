import { motion } from 'framer-motion';
import { X, Users, Wifi, AlertTriangle, Activity, MapPin } from 'lucide-react';
import CountUp from 'react-countup';

export default function SideDetailPanel({ onClose }) {
  const metrics = [
    { icon: Users, label: '当前人数', value: 2000, unit: '人', color: '#00F0FF' },
    { icon: Wifi, label: '流量密度', value: '高', unit: '', color: '#FFD700' },
    { icon: AlertTriangle, label: '拥塞度', value: 85, unit: '%', color: '#FF6B6B' },
    { icon: Activity, label: '平均速率', value: 45, unit: 'Mbps', color: '#00FF88' },
  ];

  return (
    <>
      {/* 遮罩层 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* 侧边面板 */}
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-4 top-1/2 -translate-y-1/2 w-[320px] glass-panel rounded-2xl border border-cyber-cyan/30 overflow-hidden z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-5 py-4 border-b border-white/10 bg-gradient-to-r from-red-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">南看台 F 区画像</h3>
                <p className="text-white/50 text-xs">Zone F Profile</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>

        {/* 核心指标 */}
        <div className="p-5 space-y-4">
          {/* 指标卡片网格 */}
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-center"
              >
                <metric.icon className="w-5 h-5 mx-auto mb-2" style={{ color: metric.color }} />
                <div className="font-orbitron text-xl font-bold" style={{ color: metric.color }}>
                  {typeof metric.value === 'number' ? (
                    <CountUp end={metric.value} duration={1.5} />
                  ) : (
                    metric.value
                  )}
                  <span className="text-xs ml-0.5">{metric.unit}</span>
                </div>
                <div className="text-white/40 text-[10px] mt-1">{metric.label}</div>
              </motion.div>
            ))}
          </div>

          {/* 拥塞警告 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <div className="text-red-400 font-bold text-sm">拥塞警告</div>
                <div className="text-white/50 text-xs">建议启动负载均衡策略</div>
              </div>
            </div>
          </motion.div>

          {/* 用户构成 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-white/60 text-xs mb-2 font-medium">用户构成</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">VIP用户</span>
                <span className="text-cyber-gold font-bold">45人 (2.3%)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">全球通用户</span>
                <span className="text-cyber-cyan font-bold">380人 (19%)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">普通用户</span>
                <span className="text-white/70 font-bold">1,575人 (78.7%)</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-white/5 flex items-center justify-between">
          <span className="text-white/30 text-xs">最后更新: 刚刚</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs">实时监控中</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}
