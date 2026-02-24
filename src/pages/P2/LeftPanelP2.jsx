import { motion } from 'framer-motion';
import { Users, Activity, Smartphone, ChevronRight } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

// ========== 模块一：分层分级用户（金字塔漏斗图）==========
function PyramidFunnel() {
  const pyramidData = [
    { label: '场馆包用户', value: 200, color: '#FFD700', width: '35%' },
    { label: '全球通金卡', value: 1500, color: '#C0C0C0', width: '55%' },
    { label: '普通用户', value: 48000, color: '#00F0FF', width: '85%', inverted: true },
  ];

  const total = pyramidData.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      transition={{ delay: 0.2 }}
      className="glass-panel rounded-xl p-4 corner-bracket"
    >
      <span className="corner-bl" /><span className="corner-br" />
      
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-cyber-gold" />
        <h3 className="text-base font-semibold text-white">分层分级用户</h3>
      </div>

      {/* 金字塔漏斗 */}
      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-[180px]">
          {pyramidData.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="mx-auto mb-1 relative"
              style={{ width: item.width }}
            >
              <div
                className="h-12 flex items-center justify-center text-xs font-medium"
                style={{
                  background: `linear-gradient(180deg, ${item.color}30 0%, ${item.color}50 100%)`,
                  border: `1px solid ${item.color}`,
                  borderRadius: index === 0 ? '4px 4px 0 0' : index === 2 ? '0 0 4px 4px' : '0',
                  clipPath: index === 0 
                    ? 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'  // 顶层：正梯形
                    : index === 2
                    ? 'polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)'  // 底层：倒梯形（上宽下窄）
                    : 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',  // 中层：正梯形
                }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-white text-[10px] font-medium">{item.label}</span>
                  <span className="text-[9px]" style={{ color: item.color }}>
                    {item.value.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 总数 */}
        <div className="mt-3 text-center">
          <div className="text-[10px] text-white/40">总用户数</div>
          <div className="text-2xl font-din text-white">{total.toLocaleString()}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ========== 模块二：放号评估智能体 ===========
function CapacityAgent() {
  const currentValue = 60;
  const peakValue = 65;
  
  // 预测折线图配置
  const lineOption = {
    grid: { top: 25, right: 10, bottom: 25, left: 10 },
    xAxis: {
      type: 'category',
      data: ['-30分', '-20分', '-10分', '当前', '+10分', '+20分', '+30分'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
    },
    yAxis: { 
      type: 'value', 
      show: false, 
      min: 55, 
      max: 70,
    },
    series: [
      // 历史数据（青色实线+圆点）
      {
        data: [
          { value: 58, symbol: 'none' },
          { value: 59, symbol: 'circle', symbolSize: 6, itemStyle: { color: '#00F0FF' } },
          { value: 60, symbol: 'circle', symbolSize: 6, itemStyle: { color: '#00F0FF' } },
          { value: 60, symbol: 'circle', symbolSize: 8, itemStyle: { color: '#00F0FF', borderColor: '#fff', borderWidth: 2 } },
        ],
        type: 'line',
        smooth: true,
        lineStyle: { color: '#00F0FF', width: 2 },
        symbol: 'none',
      },
      // 预测数据（黄色虚线/实线+菱形点）
      {
        data: [
          { value: 60, symbol: 'none' },
          { value: 61, symbol: 'diamond', symbolSize: 6, itemStyle: { color: '#FFD700' } },
          { value: 62, symbol: 'diamond', symbolSize: 6, itemStyle: { color: '#FFD700' } },
          { value: 63, symbol: 'diamond', symbolSize: 6, itemStyle: { color: '#FFD700' } },
          { value: 65, symbol: 'diamond', symbolSize: 8, itemStyle: { color: '#FFD700' } },
        ],
        type: 'line',
        smooth: true,
        lineStyle: { color: '#FFD700', width: 2, type: 'solid' },
        symbol: 'none',
      },
    ],
  };

  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      transition={{ delay: 0.3 }}
      className="glass-panel rounded-xl p-4 corner-bracket"
    >
      <span className="corner-bl" /><span className="corner-br" />
      
      {/* 头部标题 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-cyber-cyan/20 flex items-center justify-center">
          <Activity className="w-4 h-4 text-cyber-cyan" />
        </div>
        <h3 className="text-base font-semibold text-white">放号评估智能体</h3>
      </div>

      {/* 主内容区 - 左右分栏 */}
      <div className="flex gap-4">
        {/* 左侧：缺口环形 + 状态 */}
        <div className="w-[110px] flex flex-col items-center">
          {/* 缺口环形进度条 */}
          <div className="relative w-24 h-20">
            <svg className="w-full h-full" viewBox="0 0 100 60">
              {/* 背景圆弧 */}
              <path
                d="M 10 50 A 40 40 0 1 1 90 50"
                fill="none"
                stroke="rgba(0,240,255,0.1)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* 进度圆弧 */}
              <path
                d="M 10 50 A 40 40 0 1 1 90 50"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${currentValue * 1.5} 251`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00F0FF" />
                  <stop offset="100%" stopColor="#00FF88" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
              <span className="text-xl font-din text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-green-400">
                {currentValue}%
              </span>
            </div>
          </div>
          
          {/* 放号空间使用率文字 */}
          <div className="text-xs text-white/40 mt-1">容量使用率</div>
          
          {/* 绿区标签 */}
          <div className="mt-3 px-4 py-1.5 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-medium">
            建议推广
          </div>
        </div>

        {/* 右侧：折线图区域 */}
        <div className="flex-1">
          {/* 图表标题栏 */}
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
              <polyline points="17,6 23,6 23,12" />
            </svg>
            <span className="text-sm text-white/70 whitespace-nowrap">未来30min预测</span>
          </div>

          {/* 折线图 */}
          <div className="h-20">
            <ReactECharts 
              option={lineOption} 
              style={{ height: '100%', width: '100%' }} 
              notMerge={true}
            />
          </div>

          {/* 预测峰值 */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-white/40">预测峰值</span>
            <span className="text-xl font-din text-yellow-400">{peakValue}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ========== 模块三：终端能力分析 ===========
function TerminalAnalysis() {
  const terminalList = [
    { rank: 1, brand: '华为', model: 'Mate 60 Pro', users: 12500, is5GA: false },
    { rank: 2, brand: '苹果', model: 'iPhone 15 Pro', users: 11200, is5GA: true },
    { rank: 3, brand: '小米', model: '14 Pro', users: 8900, is5GA: true },
    { rank: 4, brand: '荣耀', model: 'Magic 6', users: 7600, is5GA: true },
    { rank: 5, brand: 'vivo', model: 'X100 Pro', users: 6200, is5GA: true },
  ];

  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      transition={{ delay: 0.4 }}
      className="glass-panel rounded-xl p-4 corner-bracket flex-1"
    >
      <span className="corner-bl" /><span className="corner-br" />
      
      <div className="flex items-center gap-2 mb-3">
        <Smartphone className="w-5 h-5 text-cyber-cyan" />
        <h3 className="text-base font-semibold text-white">终端能力分析</h3>
      </div>

      <div className="flex gap-3">
        {/* 左侧：UE Logo 支持率环形图 */}
        <div className="w-[90px] flex flex-col items-center justify-center">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(139,92,246,0.2)"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="3"
                strokeDasharray="60, 100"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-din text-white">60%</span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-white/60 text-center">UE Logo<br/>支持率</div>
        </div>

        {/* 右侧：TOP终端排行 */}
        <div className="flex-1 space-y-1.5">
          {terminalList.map((item, index) => (
            <motion.div
              key={item.model}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center gap-2 text-xs"
            >
              {/* 排名 */}
              <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                item.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                item.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                item.rank === 3 ? 'bg-amber-600/20 text-amber-500' :
                'bg-white/10 text-white/40'
              }`}>
                {item.rank}
              </span>
              
              {/* 型号 */}
              <span className="text-white/80 flex-1 truncate">{item.brand} {item.model}</span>
              
              {/* 5G-A 标签 */}
              {item.is5GA && (
                <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-[9px] font-medium">
                  5G-A
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ========== 左侧面板主组件 ===========
export default function LeftPanelP2() {
  return (
    <div className="h-full flex flex-col gap-3">
      <PyramidFunnel />
      <CapacityAgent />
      <TerminalAnalysis />
    </div>
  );
}
