import { useState, memo } from 'react';
import { Activity, AlertTriangle } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

// 默认告警数据
const DEFAULT_ALARMS = [
  { id: 1, level: 'high', title: '北广场拥塞指数上升', time: '2分钟前', area: '北广场' },
  { id: 2, level: 'high', title: '主入口基站负载过高', time: '3分钟前', area: '主入口' },
  { id: 3, level: 'medium', title: '元通站流量预警', time: '5分钟前', area: '元通站' },
  { id: 4, level: 'medium', title: '应急车通信延迟', time: '7分钟前', area: '应急车-1' },
  { id: 5, level: 'low', title: '小区04 PRB负载波动', time: '8分钟前', area: '小区04' },
  { id: 6, level: 'info', title: 'AI预测模型更新完成', time: '15分钟前', area: '系统' }
];

// KQI 数据（带趋势）
const KQI_DATA = [
  { 
    label: '总流量', 
    value: '8,420', 
    unit: 'GB', 
    trend: '+12%',
    trendData: [6500, 7200, 6800, 7500, 8200, 7900, 8420]
  },
  { 
    label: '语音话务量', 
    value: '420', 
    unit: 'Erl', 
    trend: '+5%',
    trendData: [380, 390, 400, 410, 415, 418, 420]
  },
  { 
    label: '平均吞吐', 
    value: '520', 
    unit: 'Mbps', 
    trend: '-2%',
    trendData: [480, 490, 510, 530, 540, 535, 520]
  },
  { 
    label: '时延', 
    value: '12', 
    unit: 'ms', 
    trend: '-8%',
    trendData: [18, 16, 15, 14, 13, 12.5, 12]
  }
];

const ALARM_LEVELS = {
  high: { color: '#FF3333', label: '高', bgClass: 'bg-red-500/10', borderClass: 'border-red-500/30', textClass: 'text-red-400' },
  medium: { color: '#FF9900', label: '中', bgClass: 'bg-yellow-500/10', borderClass: 'border-yellow-500/30', textClass: 'text-yellow-400' },
  low: { color: '#FFCC00', label: '低', bgClass: 'bg-yellow-400/10', borderClass: 'border-yellow-400/30', textClass: 'text-yellow-400' },
  info: { color: '#00F0FF', label: '提示', bgClass: 'bg-cyan-500/10', borderClass: 'border-cyan-500/30', textClass: 'text-cyan-400' }
};

const AlarmCard = memo(({ alarm }) => {
  const level = ALARM_LEVELS[alarm.level] || ALARM_LEVELS.info;
  return (
    <div className={`p-3 mb-2 rounded-lg border ${level.borderClass} ${level.bgClass}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <AlertTriangle className={`w-4 h-4 ${level.textClass}`} />
          <div className="min-w-0">
            <div className="text-white text-sm font-medium truncate">{alarm.title}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-white/50">{alarm.area}</span>
              <span className="text-[10px] text-white/40">•</span>
              <span className="text-[10px] text-white/50">{alarm.time}</span>
            </div>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${level.bgClass} ${level.textClass}`}>{level.label}</span>
      </div>
    </div>
  );
});

// 迷你趋势图组件
function MiniTrendChart({ data, color = '#00F0FF' }) {
  const option = {
    grid: { top: 2, right: 2, bottom: 2, left: 2 },
    xAxis: { type: 'category', show: false, data: Array.from({ length: data.length }, (_, i) => i) },
    yAxis: { type: 'value', show: false },
    series: [{
      type: 'line',
      data,
      smooth: true,
      symbol: 'none',
      lineStyle: { color, width: 2 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: color + '40' },
            { offset: 1, color: color + '00' }
          ]
        }
      }
    }]
  };

  return (
    <div className="h-10 w-full">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}

export default function RightPanelP1() {
  const [alarms] = useState(DEFAULT_ALARMS);

  return (
    <div className="w-[320px] h-full flex flex-col gap-3 p-4 z-10 overflow-y-auto pb-32">
      {/* 模块一：KQI 业务指标（顶部） */}
      <div className="glass-panel rounded-xl p-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="text-white text-sm font-bold">KQI 业务指标</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {KQI_DATA.map((item) => (
            <div key={item.label} className="bg-white/5 p-3 rounded-lg border border-cyan-500/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/70 text-xs">{item.label}</span>
              </div>
              <div className="text-xl font-bold text-white">{item.value} <span className="text-xs font-normal text-white/50">{item.unit}</span></div>
              <div className={`text-xs mt-1 font-medium ${item.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{item.trend}</div>
              {/* 迷你趋势图 */}
              <MiniTrendChart 
                data={item.trendData} 
                color={item.label === '时延' ? '#FF6B6B' : '#00F0FF'} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* 模块二：智能体告警监测（底部，可滚动） */}
      <div className="glass-panel rounded-xl p-4 flex-1 min-h-0 flex-shrink-0 flex flex-col">
        <div className="flex items-center gap-2 mb-3 px-1 flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h2 className="text-white text-sm font-bold">智能体告警监测</h2>
          <div className="ml-auto flex items-center gap-2">
            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full font-medium">2 高优</span>
            <span className="text-cyan-400 text-xs font-bold">{alarms.length}</span>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 min-h-0 pr-1">
          {alarms.map((alarm) => (
            <AlarmCard key={alarm.id} alarm={alarm} />
          ))}
        </div>
      </div>
    </div>
  );
}
