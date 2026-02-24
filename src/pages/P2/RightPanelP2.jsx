import { motion } from 'framer-motion';
import { Wifi, Shield, AlertTriangle, ChevronRight } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

// ========== 模块一：分层分级体验（雷达图）==========
function RadarExperience() {
  const option = {
    legend: {
      data: ['VIP用户', '普通用户'],
      top: 0,
      left: 'center',
      textStyle: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 10,
      },
      itemWidth: 10,
      itemHeight: 10,
    },
    radar: {
      indicator: [
        { name: '下行速率', max: 1000 },
        { name: '语音清晰', max: 100 },
        { name: '视频卡顿', max: 100 },
        { name: '直播上行', max: 100 },
        { name: '低时延', max: 100 },
      ],
      center: ['50%', '55%'],
      radius: '55%',
      splitNumber: 4,
      axisName: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 9,
      },
      splitLine: {
        lineStyle: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(0, 240, 255, 0.02)', 'rgba(0, 240, 255, 0.05)'],
        },
      },
      axisLine: {
        lineStyle: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: [850, 95, 98, 100, 95],
          name: 'VIP用户',
          lineStyle: { color: '#FFD700', width: 2 },
          areaStyle: { color: 'rgba(255, 215, 0, 0.2)' },
          itemStyle: { color: '#FFD700' },
          symbol: 'circle',
          symbolSize: 4,
        },
        {
          value: [400, 80, 75, 85, 70],
          name: '普通用户',
          lineStyle: { color: '#00F0FF', width: 2 },
          areaStyle: { color: 'rgba(0, 240, 255, 0.15)' },
          itemStyle: { color: '#00F0FF' },
          symbol: 'circle',
          symbolSize: 4,
        },
      ],
    }],
  };

  return (
    <motion.div 
      initial={{ x: 50, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      transition={{ delay: 0.2 }}
      className="glass-panel rounded-xl p-4 corner-bracket"
    >
      <span className="corner-bl" /><span className="corner-br" />
      
      <div className="flex items-center gap-2 mb-2">
        <Wifi className="w-5 h-5 text-cyber-gold" />
        <h3 className="text-base font-semibold text-white">分层分级体验</h3>
      </div>

      <div className="h-[200px]">
        <ReactECharts 
          option={option} 
          style={{ height: '100%' }} 
          notMerge={true}
        />
      </div>
    </motion.div>
  );
}

// ========== 模块二：基础业务保障（App KQI Grid）==========
function AppKQIGrid() {
  const appData = [
    { name: '微信消息', metric: '20ms', label: '时延', status: 'good', icon: '💬' },
    { name: '抖音播放', metric: '高清', label: '画质', status: 'good', icon: '📱' },
    { name: '网页首屏', metric: '优', label: '体验', status: 'good', icon: '🌐' },
    { name: '扫码支付', metric: '99.99%', label: '成功', status: 'good', icon: '💳' },
  ];

  return (
    <motion.div 
      initial={{ x: 50, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      transition={{ delay: 0.3 }}
      className="glass-panel rounded-xl p-4 corner-bracket"
    >
      <span className="corner-bl" /><span className="corner-br" />
      
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-5 h-5 text-green-400" />
        <h3 className="text-base font-semibold text-white">基础业务保障</h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {appData.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 * index }}
            className="bg-green-500/10 border border-green-500/20 rounded-lg p-2.5"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">{item.icon}</span>
              <span className="text-xs text-white/70">{item.name}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-din text-green-400">{item.metric}</span>
              <span className="text-[9px] text-white/40">{item.label}</span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-[9px] text-green-400/80">正常</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ========== 模块三：智能根因诊断 ===========
function DiagnosticsAlerts() {
  const alerts = [
    { 
      level: 'high', 
      title: '南看台-干扰过高', 
      desc: '检测到外部干扰源',
      time: '2分钟前'
    },
    { 
      level: 'medium', 
      title: '西入口-弱覆盖', 
      desc: '信号强度低于阈值',
      time: '5分钟前'
    },
  ];

  return (
    <motion.div 
      initial={{ x: 50, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      transition={{ delay: 0.4 }}
      className="glass-panel rounded-xl p-4 corner-bracket flex-1"
    >
      <span className="corner-bl" /><span className="corner-br" />
      
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-cyber-gold" />
        <h3 className="text-base font-semibold text-white">智能根因诊断</h3>
      </div>

      <div className="space-y-2">
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.title}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 * index }}
            className={`p-3 rounded-lg border-l-2 cursor-pointer transition-all hover:bg-opacity-20 ${
              alert.level === 'high' 
                ? 'bg-red-500/10 border-red-500' 
                : 'bg-yellow-500/10 border-yellow-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${
                  alert.level === 'high' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {alert.title}
                </div>
                <div className="text-[10px] text-white/40 mt-0.5">
                  {alert.desc}
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 ${
                alert.level === 'high' ? 'text-red-400/50' : 'text-yellow-400/50'
              }`} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ========== 右侧面板主组件 ===========
export default function RightPanelP2() {
  return (
    <div className="h-full flex flex-col gap-3">
      <RadarExperience />
      <AppKQIGrid />
      <DiagnosticsAlerts />
    </div>
  );
}
