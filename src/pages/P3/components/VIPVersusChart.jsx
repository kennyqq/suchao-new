import { motion } from 'framer-motion';
import { Zap, Clock, Smartphone, Gamepad2, Video } from 'lucide-react';

const VERSUS_DATA = [
  { 
    icon: Zap, 
    label: '下行速率', 
    vip: 850, 
    normal: 60, 
    unit: 'Mbps',
    max: 1000,
  },
  { 
    icon: Video, 
    label: '微信上传', 
    vip: 120, 
    normal: 20, 
    unit: 'Mbps',
    max: 150,
  },
  { 
    icon: Smartphone, 
    label: '短视频高清', 
    vip: 99, 
    normal: 85, 
    unit: '%',
    max: 100,
  },
  { 
    icon: Video, 
    label: '直播高清', 
    vip: 100, 
    normal: 90, 
    unit: '%',
    max: 100,
  },
  { 
    icon: Gamepad2, 
    label: '游戏时延', 
    vip: 18, 
    normal: 35, 
    unit: 'ms',
    max: 50,
    reverse: true,
  },
];

export default function VIPVersusChart() {
  return (
    <div className="space-y-4">
      {VERSUS_DATA.map((item, index) => {
        const Icon = item.icon;
        const vipPercent = (item.vip / item.max) * 100;
        const normalPercent = (item.normal / item.max) * 100;
        
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="relative"
          >
            {/* 标签 */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-white/50" />
              <span className="text-xs text-white/70">{item.label}</span>
            </div>

            {/* 对比条 */}
            <div className="flex items-center gap-2">
              {/* VIP 值 - 左侧 */}
              <div className="flex-1 flex justify-end">
                <div className="text-right mr-2">
                  <span className="text-sm font-din text-cyber-gold">{item.vip}</span>
                  <span className="text-[10px] text-white/40 ml-0.5">{item.unit}</span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${vipPercent}%` }}
                  transition={{ delay: 0.2 + 0.1 * index, duration: 0.5 }}
                  className="h-3 bg-gradient-to-l from-cyber-gold to-amber-500 rounded-l-full"
                  style={{ maxWidth: '120px' }}
                />
              </div>

              {/* 中间图标 */}
              <div className="w-8 h-8 rounded-full bg-cyber-dark/50 border border-white/10 flex items-center justify-center shrink-0">
                <span className="text-[10px] text-white/50">VS</span>
              </div>

              {/* 普通值 - 右侧 */}
              <div className="flex-1 flex">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${normalPercent}%` }}
                  transition={{ delay: 0.2 + 0.1 * index, duration: 0.5 }}
                  className="h-3 bg-gradient-to-r from-cyber-cyan to-blue-500 rounded-r-full"
                  style={{ maxWidth: '80px' }}
                />
                <div className="text-left ml-2">
                  <span className="text-sm font-din text-cyber-cyan">{item.normal}</span>
                  <span className="text-[10px] text-white/40 ml-0.5">{item.unit}</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* 总结 */}
      <div className="mt-4 p-3 rounded-lg bg-cyber-dark/50 text-center">
        <div className="text-xs text-white/50">VIP 体验提升</div>
        <div className="text-lg font-din text-cyber-gold">10倍</div>
        <div className="text-[10px] text-white/30">下行速率对比</div>
      </div>
    </div>
  );
}
