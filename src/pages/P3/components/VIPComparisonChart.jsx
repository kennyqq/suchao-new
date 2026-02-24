import { motion } from 'framer-motion';

const categories = [
  { name: '下行速率', icon: '🚀', vip: 850, norm: 60, unit: 'Mbps' },
  { name: '微信上传', icon: '⬆️', vip: 120, norm: 20, unit: 'Mbps' },
  { name: '短视频高清', icon: '🎬', vip: 99, norm: 85, unit: '%' },
  { name: '直播高清', icon: '📹', vip: 100, norm: 90, unit: '%' },
  { name: '游戏时延', icon: '🎮', vip: 18, norm: 35, unit: 'ms', reverse: true },
];

export default function VIPComparisonChart() {
  return (
    <div className="h-full flex flex-col">
      {/* 图例 */}
      <div className="flex items-center justify-center gap-6 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-yellow-400 to-yellow-600" />
          <span className="text-yellow-400 text-xs font-medium">VIP用户 (5G-A)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-cyan-400 to-blue-500" />
          <span className="text-cyan-400 text-xs font-medium">普通用户 (5G)</span>
        </div>
      </div>

      {/* 对比项 */}
      <div className="flex-1 space-y-2 overflow-y-auto scrollbar-thin">
        {categories.map((item, index) => {
          const vipPercent = item.reverse 
            ? (item.norm / item.vip) * 100  // 时延反向计算
            : (item.vip / (item.vip * 1.2)) * 100;
          const normPercent = item.reverse
            ? (item.vip / item.norm) * 50
            : (item.norm / item.vip) * vipPercent;

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="relative"
            >
              {/* 标签 */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-yellow-400 text-xs font-bold font-orbitron">
                  {item.vip} {item.unit}
                </span>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-full">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-white/80 text-xs">{item.name}</span>
                </div>
                <span className="text-cyan-400 text-xs font-bold font-orbitron">
                  {item.norm} {item.unit}
                </span>
              </div>

              {/* 胶囊条 */}
              <div className="h-6 bg-white/5 rounded-full relative overflow-hidden flex items-center">
                {/* VIP 值 (左侧金色) */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${vipPercent * 0.45}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                  className="h-4 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 ml-1"
                  style={{ maxWidth: '45%' }}
                />
                
                {/* 中心分隔 */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 -translate-x-1/2" />
                
                {/* 普通用户值 (右侧青色) */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${normPercent * 0.45}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  className="h-4 rounded-full bg-gradient-to-l from-cyan-500 to-cyan-400 mr-1 ml-auto"
                  style={{ maxWidth: '45%' }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 底部高亮 */}
      <div className="mt-3 p-2 rounded-lg bg-gradient-to-r from-yellow-500/10 to-cyan-500/10 border border-yellow-500/20">
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="text-center">
            <span className="text-yellow-400 font-bold font-orbitron">10倍</span>
            <span className="text-white/50 ml-1">速率提升</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="text-center">
            <span className="text-cyan-400 font-bold font-orbitron">50%</span>
            <span className="text-white/50 ml-1">时延降低</span>
          </div>
        </div>
      </div>
    </div>
  );
}
