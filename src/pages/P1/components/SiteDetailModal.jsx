import { motion, AnimatePresence } from 'framer-motion';
import { X, Radio, Wifi, Cpu, Activity, Zap, Server, Signal } from 'lucide-react';

export default function SiteDetailModal({ station, onClose }) {
  if (!station) return null;

  const specs = [
    { icon: Signal, label: '载波配置', value: '3载波 (N1/N78/N79)' },
    { icon: Zap, label: '3CC 状态', value: '已启用', color: 'text-green-400' },
    { icon: Server, label: '智能板', value: '已连接', color: 'text-cyber-cyan' },
    { icon: Cpu, label: 'eOTDR', value: '监控中', color: 'text-cyber-cyan' },
    { icon: Wifi, label: '波束赋形', value: '128束', color: 'text-cyber-cyan' },
    { icon: Activity, label: '当前负载', value: '78%', color: 'text-orange-400' },
  ];

  const metrics = [
    { label: 'RSRP', value: '-82', unit: 'dBm', status: 'good' },
    { label: 'SINR', value: '18', unit: 'dB', status: 'good' },
    { label: 'UL Throughput', value: '85', unit: 'Mbps', status: 'good' },
    { label: 'DL Throughput', value: '920', unit: 'Mbps', status: 'good' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-[480px] max-w-[90vw] glass-panel rounded-2xl border border-cyber-cyan/30 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 py-4 border-b border-white/10 bg-gradient-to-r from-cyber-cyan/10 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyber-cyan/20 border border-cyber-cyan/50 flex items-center justify-center">
                  <Radio className="w-5 h-5 text-cyber-cyan" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">{station.name}</h2>
                  <p className="text-white/50 text-xs">站点-{String(station.id).padStart(3, '0')} 配置信息</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
            
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-20 h-20 opacity-30">
              <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                <path d="M80 0V30L50 0H80Z" fill="url(#grad1)" />
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00F0FF" />
                    <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Status Banner */}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 font-medium text-sm">基站运行正常</span>
              <span className="text-white/40 text-xs ml-auto">最后更新: 19:42:05</span>
            </div>

            {/* Specs Grid */}
            <div>
              <h3 className="text-white/60 text-xs font-medium mb-3 tracking-wider">技术规格</h3>
              <div className="grid grid-cols-2 gap-3">
                {specs.map((spec, index) => (
                  <motion.div
                    key={spec.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <spec.icon className={`w-4 h-4 ${spec.color || 'text-white/50'}`} />
                    <div>
                      <div className="text-white/40 text-[10px]">{spec.label}</div>
                      <div className={`text-sm font-medium ${spec.color || 'text-white'}`}>{spec.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div>
              <h3 className="text-white/60 text-xs font-medium mb-3 tracking-wider">实时指标</h3>
              <div className="grid grid-cols-4 gap-2">
                {metrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="text-center p-3 rounded-lg bg-cyber-cyan/5 border border-cyber-cyan/20"
                  >
                    <div className="text-white/40 text-[9px] mb-1">{metric.label}</div>
                    <div className="font-orbitron text-lg font-bold text-cyber-cyan">
                      {metric.value}
                    </div>
                    <div className="text-white/40 text-[9px]">{metric.unit}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button className="flex-1 py-2.5 rounded-lg bg-cyber-cyan/20 border border-cyber-cyan/50 text-cyber-cyan text-sm font-medium hover:bg-cyber-cyan/30 transition-colors">
                查看历史数据
              </button>
              <button className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white/70 text-sm font-medium hover:bg-white/10 transition-colors">
                远程诊断
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-white/10 bg-white/5 flex items-center justify-between">
            <span className="text-white/30 text-xs">已连接智能板</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
              <span className="text-cyber-cyan text-xs">实时</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
