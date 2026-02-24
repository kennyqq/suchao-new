import { motion } from 'framer-motion';
import { Train, Car, Plane, TrendingUp, MapPin } from 'lucide-react';

// 交通枢纽压力
const TRANSPORT_DATA = [
  { name: '奥体地铁站', icon: Train, pressure: 2.65, today: '8.5万', normal: '3.2万', status: 'high' },
  { name: '南京南站', icon: Train, pressure: 1.56, today: '12.5万', normal: '8万', status: 'medium' },
  { name: '南京站', icon: Train, pressure: 1.51, today: '6.8万', normal: '4.5万', status: 'medium' },
  { name: '禄口机场', icon: Plane, pressure: 1.50, today: '5.2万', normal: '3.5万', status: 'medium' },
];

// 文旅分析
const TOURISM_DATA = [
  { name: '夫子庙秦淮河', visitors: '2.9万', growth: '+156%', rank: 1 },
  { name: '中山陵景区', visitors: '2.1万', growth: '+89%', rank: 2 },
  { name: '新街口商圈', visitors: '1.9万', growth: '+67%', rank: 3 },
  { name: '老门东', visitors: '1.6万', growth: '+134%', rank: 4 },
  { name: '总统府', visitors: '1.3万', growth: '+78%', rank: 5 },
];

export default function RightPanel() {
  return (
    <div className="w-[300px] h-full flex flex-col gap-4 p-4 z-10">
      {/* 交通枢纽压力监测 */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ delay: 0.2 }}
        className="glass-panel rounded-xl p-4 corner-bracket"
      >
        <span className="corner-bl" /><span className="corner-br" />
        
        <div className="flex items-center gap-2 mb-4">
          <Train className="w-4 h-4 text-cyber-cyan" />
          <span className="text-sm font-medium text-white">交通枢纽压力监测</span>
        </div>

        <div className="space-y-3">
          {TRANSPORT_DATA.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className="p-3 rounded-lg bg-cyber-dark/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-white/50" />
                    <span className="text-sm text-white">{item.name}</span>
                  </div>
                  <span className={`text-xs font-din ${
                    item.status === 'high' ? 'text-cyber-red' : 'text-cyber-gold'
                  }`}>
                    {item.pressure.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white/40">今日 </span>
                    <span className="text-white font-din">{item.today}</span>
                  </div>
                  <div>
                    <span className="text-white/40">平日 </span>
                    <span className="text-white/60">{item.normal}</span>
                  </div>
                </div>

                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((item.pressure / 3) * 100, 100)}%` }}
                    transition={{ delay: 0.2 + 0.1 * index, duration: 0.5 }}
                    className={`h-full rounded-full ${
                      item.status === 'high' 
                        ? 'bg-gradient-to-r from-red-500 to-red-400' 
                        : 'bg-gradient-to-r from-cyber-gold to-amber-400'
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 文旅大数据分析 */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ delay: 0.3 }}
        className="glass-panel rounded-xl p-4 corner-bracket flex-1"
      >
        <span className="corner-bl" /><span className="corner-br" />
        
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-cyber-gold" />
          <span className="text-sm font-medium text-white">文旅大数据分析</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-cyber-dark/50 text-center">
            <div className="text-xs text-white/40 mb-1">实时游客 (3天)</div>
            <div className="text-xl font-din text-cyber-cyan">8.6万</div>
          </div>
          <div className="p-3 rounded-lg bg-cyber-dark/50 text-center">
            <div className="text-xs text-white/40 mb-1">平均停留时长</div>
            <div className="text-xl font-din text-cyber-gold">26.5<span className="text-sm">小时</span></div>
          </div>
        </div>

        <div className="text-xs text-white/40 mb-2">热门打卡点 TOP5</div>
        <div className="space-y-2">
          {TOURISM_DATA.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center gap-3 p-2 rounded-lg bg-cyber-dark/30"
            >
              <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                item.rank === 1 ? 'bg-cyber-gold/20 text-cyber-gold' :
                item.rank === 2 ? 'bg-cyber-cyan/20 text-cyber-cyan' :
                item.rank === 3 ? 'bg-blue-500/20 text-blue-400' :
                'bg-white/10 text-white/50'
              }`}>
                {item.rank}
              </span>
              <span className="flex-1 text-sm text-white truncate">{item.name}</span>
              <span className="text-xs font-din text-white">{item.visitors}</span>
              <span className="text-[10px] text-cyber-gold">{item.growth}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
