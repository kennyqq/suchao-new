import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';

const TERMINAL_DATA = [
  { rank: 1, brand: '华为', model: 'Mate 60 Pro', supports5GA: false, users: 12500 },
  { rank: 2, brand: '苹果', model: 'iPhone 15 Pro', supports5GA: true, users: 11200 },
  { rank: 3, brand: '荣耀', model: 'Magic 6', supports5GA: false, users: 9800 },
  { rank: 4, brand: '小米', model: '14 Pro', supports5GA: true, users: 8900 },
  { rank: 5, brand: 'vivo', model: 'X100 Pro', supports5GA: true, users: 7600 },
];

export default function TerminalRanking() {
  return (
    <div className="space-y-2">
      {TERMINAL_DATA.map((item, index) => (
        <motion.div
          key={item.model}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 * index }}
          className="flex items-center gap-3 p-2 rounded-lg bg-cyber-dark/30 hover:bg-cyber-dark/50 transition-colors"
        >
          {/* 排名 */}
          <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
            item.rank === 1 ? 'bg-cyber-gold/20 text-cyber-gold' :
            item.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
            item.rank === 3 ? 'bg-amber-600/20 text-amber-500' :
            'bg-white/10 text-white/50'
          }`}>
            {item.rank}
          </div>

          {/* 图标 */}
          <Smartphone className="w-4 h-4 text-white/40" />

          {/* 品牌型号 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white truncate">{item.brand} {item.model}</span>
              {item.supports5GA && (
                <span className="badge-5ga">5G-A</span>
              )}
            </div>
            <div className="text-[10px] text-white/40">
              {item.users.toLocaleString()} 用户
            </div>
          </div>

          {/* 占比条 */}
          <div className="w-16">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.users / 12500) * 100}%` }}
                transition={{ delay: 0.2 + 0.1 * index, duration: 0.5 }}
                className={`h-full rounded-full ${
                  item.supports5GA ? 'bg-cyber-gold' : 'bg-cyber-cyan'
                }`}
              />
            </div>
          </div>
        </motion.div>
      ))}

      {/* 5G-A 支持率 */}
      <div className="mt-4 p-3 rounded-lg bg-cyber-dark/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">UE Logo 支持率</span>
          <span className="text-cyber-gold font-din text-lg">60%</span>
        </div>
        <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-[60%] bg-gradient-to-r from-cyber-cyan to-cyber-gold rounded-full" />
        </div>
      </div>
    </div>
  );
}
