import { useState, useEffect, useRef } from 'react';
import { Radio, Server, Zap, Activity, Car, Signal, Bot } from 'lucide-react';

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

// PRB 监控数据（热点场景）
const PRB_DATA = [
  { label: '元通地铁入口', value: 78, status: 'warning' },
  { label: '南看台 F区', value: 62, status: 'warning' },
  { label: '奥体北门检票口', value: 45, status: 'normal' },
  { label: '内场VIP区', value: 38, status: 'normal' },
];

export default function LeftPanelP1() {
  const [logs] = useState(LOG_DATA);
  const logContainerRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  // 自动向上滚动动画
  useEffect(() => {
    const container = logContainerRef.current;
    if (!container) return;

    let scrollPos = 0;
    scrollIntervalRef.current = setInterval(() => {
      scrollPos += 0.5;
      if (scrollPos >= container.scrollHeight - container.clientHeight) {
        scrollPos = 0;
      }
      container.scrollTop = scrollPos;
    }, 50);

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
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

  return (
    <div className="w-[320px] h-full flex flex-col gap-3 p-4 z-10 overflow-y-auto pb-32">
      {/* 模块一：5G-A 资源与韧性 */}
      <div className="glass-panel rounded-xl p-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 bg-cyan-400 rounded-full" />
          <h3 className="text-base font-semibold text-white">5G-A 资源与韧性</h3>
        </div>

        {/* 资源指标 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <Radio className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
            <div className="text-xl font-bold text-cyan-400">48</div>
            <div className="text-[10px] text-white/50">5G 站点</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <Server className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
            <div className="text-xl font-bold text-cyan-400">6</div>
            <div className="text-[10px] text-white/50">智能板</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <Zap className="w-5 h-5 mx-auto mb-1 text-green-400" />
            <div className="text-xl font-bold text-green-400">48</div>
            <div className="text-[10px] text-white/50">3CC 载波</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <Car className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
            <div className="text-xl font-bold text-yellow-400">2</div>
            <div className="text-[10px] text-white/50">应急车</div>
          </div>
        </div>
      </div>

      {/* 模块二：PRB 负载监控（从右侧移入，使用热点场景名称） */}
      <div className="glass-panel rounded-xl p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Signal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-white text-sm font-bold">PRB 负载监控</h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">56<span className="text-sm">%</span></div>
          </div>
        </div>
        <div className="space-y-2">
          {PRB_DATA.map((cell) => (
            <div key={cell.label} className="flex items-center gap-2">
              <span className="text-white/60 text-xs w-24 truncate">{cell.label}</span>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${cell.status === 'warning' ? 'bg-yellow-400' : 'bg-gradient-to-r from-cyan-400 to-green-400'}`}
                  style={{ width: `${cell.value}%` }}
                />
              </div>
              <span className={`text-xs font-bold w-8 text-right ${cell.status === 'warning' ? 'text-yellow-400' : 'text-white/70'}`}>{cell.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* 模块三：智能运维终端 */}
      <div className="glass-panel rounded-xl p-4 flex-1 flex flex-col min-h-0 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-semibold text-white">智能运维终端</h3>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            在线
          </span>
        </div>

        <div 
          ref={logContainerRef}
          className="flex-1 bg-black/40 rounded-lg p-3 overflow-hidden font-mono text-xs leading-relaxed"
        >
          <div className="space-y-1.5">
            {logs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-white/30 shrink-0">{log.time}</span>
                <span className={getLogColor(log.type)}>{log.content}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
