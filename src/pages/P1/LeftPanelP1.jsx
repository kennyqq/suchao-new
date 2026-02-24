import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Radio, Server, Zap, Activity, Car, TrendingUp, Bot } from 'lucide-react';

// 模拟日志数据
const LOG_DATA = [
  { time: '19:42:19', type: 'success', content: '切换已恢复 时延+3ms' },
  { time: '19:42:25', type: 'info', content: '流量模式分析中...' },
  { time: '19:42:26', type: 'warn', content: '北广场拥塞指数上升' },
  { time: '19:42:27', type: 'ai', content: '预测性负载均衡启动' },
  { time: '19:42:28', type: 'ai', content: '激活应急波束' },
  { time: '19:42:29', type: 'success', content: '负载已分配 QoS稳定' },
  { time: '19:42:33', type: 'info', content: '小区04 PRB负载激增' },
  { time: '19:42:34', type: 'alert', content: '检测到光纤衰耗(eOTDR)' },
  { time: '19:42:36', type: 'success', content: '自愈运行中 场景: 1/3' },
  { time: '19:42:38', type: 'ai', content: '智能板协同调度完成' },
  { time: '19:42:40', type: 'info', content: '5G-A 载波聚合正常' },
  { time: '19:42:42', type: 'warn', content: '元通站流量预警' },
];

// 顶部核心指标 - 5G站点 + 智能板
const TOP_RESOURCES = [
  { label: '5G 站点', value: '48', unit: '个', icon: Radio, color: 'cyan' },
  { label: '智能板', value: '6', unit: '个', icon: Server, color: 'cyan' },
];

// 底部指标 - 3CC载波 + 应急车
const BOTTOM_RESOURCES = [
  { label: '3CC 载波', value: '48', unit: '个', icon: Zap, color: 'green' },
  { label: '应急通信车', value: '2', unit: '辆', icon: Car, color: 'gold' },
];

// PRB 负荷历史数据
const PRB_HISTORY_DATA = [35, 38, 42, 45, 48, 52, 49, 46, 44, 42, 40, 38, 42, 45, 43];

// 生成 SVG Sparkline 路径
const generateSparklinePath = (data, width, height) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  
  return data.map((value, index) => {
    const x = index * stepX;
    const y = height - ((value - min) / range) * height;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
};

// PRB 负荷卡片组件
function PRBLoadCard() {
  const currentValue = 42;
  const svgWidth = 260;
  const svgHeight = 40;
  const pathD = generateSparklinePath(PRB_HISTORY_DATA, svgWidth, svgHeight);
  const areaPathD = `${pathD} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;
  
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-cyber-dark/50 rounded-lg p-3 border border-cyber-cyan/20 hover:border-cyber-cyan/40 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-xs text-white/60">PRB 负荷</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-din font-bold text-green-400">{currentValue}</span>
          <span className="text-[10px] text-white/40">%</span>
        </div>
      </div>
      
      {/* Sparkline 趋势图 */}
      <div className="relative h-10 w-full">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="prbGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 240, 255, 0.4)" />
              <stop offset="100%" stopColor="rgba(0, 240, 255, 0.05)" />
            </linearGradient>
          </defs>
          <path d={areaPathD} fill="url(#prbGradient)" />
          <path d={pathD} fill="none" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-white/30">过去6小时趋势</span>
        <div className="flex items-center gap-1 text-[10px] text-green-400">
          <TrendingUp className="w-3 h-3" />
          <span>正常</span>
        </div>
      </div>
    </motion.div>
  );
}

// 资源卡片组件
function ResourceCard({ item, index, large = false }) {
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1 * index }}
      className={`bg-cyber-dark/50 rounded-lg p-3 text-center border border-cyber-cyan/10 hover:border-cyber-cyan/30 transition-colors ${large ? 'flex-1' : ''}`}
    >
      <Icon className={`w-5 h-5 mx-auto mb-1.5 ${
        item.color === 'gold' ? 'text-cyber-gold' : 
        item.color === 'green' ? 'text-green-400' : 'text-cyber-cyan'
      }`} />
      <div className={`font-din font-bold ${
        item.color === 'gold' ? 'text-cyber-gold' : 
        item.color === 'green' ? 'text-green-400' : 'text-cyber-cyan'
      } ${large ? 'text-2xl' : 'text-xl'}`}>
        {item.value}
      </div>
      <div className="text-[10px] text-white/50 mt-0.5">{item.unit}</div>
      <div className="text-[10px] text-white/40 mt-0.5">{item.label}</div>
    </motion.div>
  );
}

export default function LeftPanelP1() {
  const [logs, setLogs] = useState(LOG_DATA);
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = {
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
        type: ['info', 'success', 'ai'][Math.floor(Math.random() * 3)],
        content: ['流量监控正常', 'AI 预测模型更新', '基站协同优化中'][Math.floor(Math.random() * 3)],
      };
      setLogs(prev => [...prev.slice(-20), newLog]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getLogColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'warn': return 'text-yellow-400';
      case 'alert': return 'text-red-400';
      case 'ai': return 'text-cyan-400';
      default: return 'text-white/60';
    }
  };

  const getLogPrefix = (type) => {
    switch (type) {
      case 'success': return '[成功]';
      case 'warn': return '[监控]';
      case 'alert': return '[告警]';
      case 'ai': return '[AI动作]';
      default: return '[监控]';
    }
  };

  return (
    <div className="w-[320px] h-full flex flex-col gap-3 p-4 z-10">
      {/* 5G-A 资源与韧性 */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ delay: 0.2 }}
        className="glass-panel rounded-xl p-4 corner-bracket"
      >
        <span className="corner-bl" /><span className="corner-br" />
        
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 bg-cyber-cyan rounded-full" />
          <h3 className="text-base font-semibold text-white">5G-A 资源与韧性</h3>
        </div>

        {/* 顶部核心指标 - 5G站点 + 智能板 */}
        <div className="flex gap-3 mb-3">
          {TOP_RESOURCES.map((item, index) => (
            <ResourceCard key={item.label} item={item} index={index} large />
          ))}
        </div>

        {/* 底部指标 - 3CC载波 + 应急车 */}
        <div className="flex gap-3 mb-3">
          {BOTTOM_RESOURCES.map((item, index) => (
            <ResourceCard key={item.label} item={item} index={index + 2} large />
          ))}
        </div>

        {/* PRB 负荷 - 带趋势图 */}
        <PRBLoadCard />
      </motion.div>

      {/* CoPilot 智能运维终端 */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ delay: 0.3 }}
        className="glass-panel rounded-xl p-4 corner-bracket flex-1 flex flex-col min-h-0"
      >
        <span className="corner-bl" /><span className="corner-br" />
        
        <div className="flex items-center gap-2 mb-3">
          <Bot className="w-5 h-5 text-cyber-cyan" />
          <h3 className="text-base font-semibold text-white">智能运维终端</h3>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            在线
          </span>
        </div>

        <div 
          ref={logContainerRef}
          className="flex-1 bg-black/40 rounded-lg p-3 overflow-hidden font-mono text-xs leading-relaxed scrollbar-cyber"
        >
          <div className="space-y-1.5">
            {logs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2"
              >
                <span className="text-white/30 shrink-0">{log.time}</span>
                <span className={getLogColor(log.type)}>
                  {getLogPrefix(log.type)} {log.content}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[10px] text-white/40">
          <span>状态: 自愈运行中</span>
          <span>场景: 1/3</span>
          <button className="text-cyber-cyan hover:text-cyber-cyan/80 transition-colors">
            查看详情 →
          </button>
        </div>
      </motion.div>
    </div>
  );
}
