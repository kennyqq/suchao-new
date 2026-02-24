import { motion } from 'framer-motion';
import { Bot, Shield, Zap, Brain, Activity } from 'lucide-react';

const contributions = [
  { 
    label: '智能体自动优化', 
    value: '156 次', 
    icon: Bot,
    color: '#00F0FF',
    desc: '参数自适应调整',
    trend: '+12% 效率提升'
  },
  { 
    label: '潜在隐患拦截', 
    value: '23 起', 
    icon: Shield,
    color: '#00FF88',
    desc: '拥塞风险预警',
    trend: '0 故障发生'
  },
  { 
    label: 'VIP感知保障', 
    value: '100%', 
    icon: Activity,
    color: '#FFD700',
    desc: '钻白卡用户零投诉',
    trend: '满意度 4.9/5'
  },
  { 
    label: '资源智能调度', 
    value: '4.2x', 
    icon: Zap,
    color: '#FF6B6B',
    desc: '动态负载均衡',
    trend: '峰值承载提升'
  },
];

export default function AgentContribution() {
  return (
    <div className="space-y-2">
      {contributions.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors group"
        >
          <div className="flex items-center gap-3">
            {/* 图标 */}
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${item.color}20` }}
            >
              <item.icon className="w-5 h-5" style={{ color: item.color }} />
            </div>
            
            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-white/80 text-xs">{item.label}</span>
                <span className="font-bold font-orbitron" style={{ color: item.color }}>
                  {item.value}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-[10px]">{item.desc}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                  {item.trend}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* 底部智能体标语 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 text-center"
      >
        <div className="flex items-center justify-center gap-2">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-purple-400 text-xs font-medium">
            AI智能体全程护航 · 让网络服务更聪明
          </span>
        </div>
      </motion.div>
    </div>
  );
}
