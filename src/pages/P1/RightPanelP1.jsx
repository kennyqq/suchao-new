import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle } from 'lucide-react';
import KQIMatrix from './components/KQIMatrix';

// 扩展告警数据 - 展示更多条目
const ALERT_DATA = [
  { id: 1, level: 'high', title: '北广场拥塞指数上升', time: '2分钟前', area: '北广场', detail: '人流量超过阈值85%' },
  { id: 2, level: 'high', title: '主入口基站负载过高', time: '3分钟前', area: '主入口', detail: 'PRB利用率达到92%' },
  { id: 3, level: 'medium', title: '元通站流量预警', time: '5分钟前', area: '元通站', detail: '上行流量突增45%' },
  { id: 4, level: 'medium', title: '应急车通信延迟', time: '7分钟前', area: '应急车-1', detail: '延迟达到120ms' },
  { id: 5, level: 'low', title: '小区04 PRB负载波动', time: '8分钟前', area: '小区04', detail: '周期性波动 detected' },
  { id: 6, level: 'low', title: '3CC载波切换频繁', time: '10分钟前', area: '全网', detail: '5分钟内切换12次' },
  { id: 7, level: 'info', title: '3CC载波聚合正常', time: '12分钟前', area: '全网', detail: '载波聚合效率98%' },
  { id: 8, level: 'info', title: 'AI预测模型更新完成', time: '15分钟前', area: '系统', detail: '模型版本 v2.3.1' },
];

// 告警级别配置
const ALERT_CONFIG = {
  high: { 
    bg: 'bg-red-500/10', 
    border: 'border-red-500', 
    text: 'text-red-400',
    label: '严重',
    pulse: true,
  },
  medium: { 
    bg: 'bg-orange-500/10', 
    border: 'border-orange-500', 
    text: 'text-orange-400',
    label: '警告',
    pulse: false,
  },
  low: { 
    bg: 'bg-cyber-cyan/10', 
    border: 'border-cyber-cyan', 
    text: 'text-cyber-cyan',
    label: '提示',
    pulse: false,
  },
  info: { 
    bg: 'bg-green-500/10', 
    border: 'border-green-500', 
    text: 'text-green-400',
    label: '正常',
    pulse: false,
  },
};

export default function RightPanelP1() {
  const activeAlerts = ALERT_DATA.filter(a => a.level !== 'info').length;

  return (
    <div className="w-[320px] h-full flex flex-col p-4 z-10">
      {/* 关键性能指标 KQI - 随内容撑开 */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ delay: 0.2 }}
        className="glass-panel rounded-xl p-4 corner-bracket flex-shrink-0"
      >
        <span className="corner-bl" /><span className="corner-br" />
        
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-5 h-5 text-cyber-cyan" />
          <h3 className="text-base font-semibold text-white">关键性能指标</h3>
        </div>

        <KQIMatrix />
      </motion.div>

      {/* 实时告警 - 占据剩余所有可用高度 */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ delay: 0.3 }}
        className="glass-panel rounded-xl p-4 corner-bracket flex-1 flex flex-col min-h-0 mt-3"
      >
        <span className="corner-bl" /><span className="corner-br" />
        
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-cyber-gold" />
          <h3 className="text-base font-semibold text-white">实时告警</h3>
          <span className="ml-auto px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
            {activeAlerts} 活跃
          </span>
        </div>

        {/* 告警列表 - 可滚动，占据所有可用空间 */}
        <div className="flex-1 overflow-y-auto scrollbar-cyber space-y-2 pr-1">
          {ALERT_DATA.map((alert, index) => {
            const config = ALERT_CONFIG[alert.level];
            return (
              <motion.div
                key={alert.id}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 * index }}
                className={`p-3 rounded-lg border-l-2 ${config.bg} ${config.border} hover:bg-opacity-20 transition-colors cursor-pointer`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${config.text} truncate`}>
                        {alert.title}
                      </span>
                      {config.pulse && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-[10px] text-white/40 mt-1">
                      {alert.area} · {alert.time}
                    </div>
                    <div className="text-[11px] text-white/60 mt-1.5 leading-relaxed">
                      {alert.detail}
                    </div>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${config.bg} ${config.text} flex-shrink-0`}>
                    {config.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 底部统计 */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40">
          <span>共 {ALERT_DATA.length} 条记录</span>
          <button className="text-cyber-cyan hover:text-cyber-cyan/80 transition-colors">
            查看全部 →
          </button>
        </div>
      </motion.div>
    </div>
  );
}
