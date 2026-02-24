import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Search, ChevronRight } from 'lucide-react';

const issues = [
  { 
    id: 1, 
    text: '南看台-干扰过高', 
    level: 'high',
    description: '检测到外部干扰源',
  },
  { 
    id: 2, 
    text: '西入口-弱覆盖', 
    level: 'medium',
    description: '信号强度低于阈值',
  },
  { 
    id: 3, 
    text: '北区-切换失败', 
    level: 'low',
    description: '邻区配置异常',
  },
];

const levelConfig = {
  high: {
    icon: AlertTriangle,
    color: '#FF6B6B',
    bgColor: 'rgba(255, 107, 107, 0.1)',
    label: '高',
  },
  medium: {
    icon: AlertCircle,
    color: '#FFD700',
    bgColor: 'rgba(255, 215, 0, 0.1)',
    label: '中',
  },
  low: {
    icon: AlertCircle,
    color: '#00F0FF',
    bgColor: 'rgba(0, 240, 255, 0.1)',
    label: '低',
  },
};

export default function RootCauseList() {
  return (
    <div className="h-full flex flex-col">
      {/* 问题列表 */}
      <div className="flex-1 space-y-2 overflow-y-auto scrollbar-thin">
        {issues.map((issue, index) => {
          const config = levelConfig[issue.level];
          const Icon = config.icon;
          
          return (
            <motion.div
              key={issue.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer group"
              style={{ backgroundColor: config.bgColor }}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${config.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: config.color }} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white/90 text-sm font-medium truncate">
                      {issue.text}
                    </span>
                    <span 
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ 
                        color: config.color,
                        backgroundColor: `${config.color}20`,
                      }}
                    >
                      {config.label}
                    </span>
                  </div>
                  <p className="text-white/40 text-xs mt-0.5">
                    {issue.description}
                  </p>
                </div>
                
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 底部操作按钮 */}
      <div className="mt-3 pt-3 border-t border-white/10 flex justify-end">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 hover:bg-cyber-cyan/20 hover:border-cyber-cyan/50 transition-all group">
          <Search className="w-4 h-4 text-cyber-cyan" />
          <span className="text-cyber-cyan text-sm font-medium">MAE 根因分析</span>
          <ChevronRight className="w-4 h-4 text-cyber-cyan group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
