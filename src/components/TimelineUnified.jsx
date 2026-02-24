import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Calendar, ChevronDown, Users, Wifi, Smartphone, Clock } from 'lucide-react';

// 生成15分钟粒度的时间数据（前后3小时，共6小时）
const generateTimeSlots = () => {
  const slots = [];
  const baseHour = 20; // 以20:00为基准
  const baseMinute = 0;
  
  // 前后3小时，15分钟粒度 = 24个时间点
  for (let i = -12; i <= 12; i++) {
    const totalMinutes = baseHour * 60 + baseMinute + i * 15;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    // 模拟三种指标的数据
    const crowdValue = Math.max(0, 5 + Math.sin((i + 12) / 6) * 3 + Math.random() * 2); // 人流（万）
    const trafficValue = Math.max(0, 8 + Math.sin((i + 12) / 5) * 4 + Math.random() * 3); // 话务（TB）
    const fiveGAValue = Math.max(0, 2 + Math.sin((i + 12) / 4) * 1.5 + Math.random() * 1); // 5G-A（Gbps）
    
    slots.push({
      time,
      hour,
      minute,
      index: i + 12,
      values: {
        crowd: Math.round(crowdValue * 10) / 10,
        traffic: Math.round(trafficValue * 10) / 10,
        fiveGA: Math.round(fiveGAValue * 10) / 10,
      }
    });
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

// 指标配置
const METRICS = {
  crowd: {
    id: 'crowd',
    label: '人流',
    unit: '万人',
    icon: Users,
    color: '#00F0FF',
    gradient: 'from-cyan-400 to-blue-500',
  },
  traffic: {
    id: 'traffic',
    label: '流量',
    unit: 'TB',
    icon: Wifi,
    color: '#FFD700',
    gradient: 'from-yellow-400 to-orange-500',
  },
  fiveGA: {
    id: 'fiveGA',
    label: '5G-A',
    unit: 'Gbps',
    icon: Smartphone,
    color: '#FF6B9D',
    gradient: 'from-pink-400 to-rose-500',
  },
};

// 历史日期
const HISTORY_DATES = [
  { date: '2026-05-02', label: '5月2日', match: '南京 2:1 常州', isToday: true },
  { date: '2026-04-26', label: '4月26日', match: '南京 1:0 苏州', isToday: false },
  { date: '2026-04-19', label: '4月19日', match: '南京 3:2 无锡', isToday: false },
  { date: '2026-04-12', label: '4月12日', match: '南京 0:0 徐州', isToday: false },
];

export default function TimelineUnified({ onTimeChange, onMetricChange, onDateChange }) {
  const [currentSlotIndex, setCurrentSlotIndex] = useState(12); // 默认在20:00
  const [currentMetric, setCurrentMetric] = useState('crowd');
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMetricDropdown, setShowMetricDropdown] = useState(false);

  const currentSlot = TIME_SLOTS[currentSlotIndex];
  const currentMetricConfig = METRICS[currentMetric];
  const currentDate = HISTORY_DATES[currentDateIndex];
  const currentValue = currentSlot.values[currentMetric];

  // 计算最大最小值用于柱状图归一化
  const maxValue = useMemo(() => {
    return Math.max(...TIME_SLOTS.map(s => s.values[currentMetric]));
  }, [currentMetric]);

  // 播放控制
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlotIndex(prev => {
          if (prev >= TIME_SLOTS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          const next = prev + 1;
          onTimeChange?.(TIME_SLOTS[next].time);
          return next;
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isPlaying, onTimeChange]);

  const handlePlay = () => setIsPlaying(!isPlaying);
  
  const handleReset = () => {
    setCurrentSlotIndex(12);
    setIsPlaying(false);
    onTimeChange?.(TIME_SLOTS[12].time);
  };

  const handleSliderChange = (e) => {
    const index = parseInt(e.target.value);
    setCurrentSlotIndex(index);
    onTimeChange?.(TIME_SLOTS[index].time);
  };

  const handleMetricSelect = (metricId) => {
    setCurrentMetric(metricId);
    setShowMetricDropdown(false);
    onMetricChange?.(metricId);
  };

  const handleDateSelect = (index) => {
    setCurrentDateIndex(index);
    setShowDatePicker(false);
    onDateChange?.(HISTORY_DATES[index]);
  };

  const MetricIcon = currentMetricConfig.icon;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent pt-6">
      <div className="glass-panel border-t border-cyber-cyan/30 px-6 py-3">
        <div className="flex items-center gap-4 h-16">
          
          {/* 日期选择 */}
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyber-cyan/50 transition-all"
            >
              <Calendar className="w-4 h-4 text-cyber-cyan" />
              <div className="text-left">
                <div className="text-white text-sm font-medium">{currentDate.label}</div>
                <div className="text-white/40 text-[10px]">{currentDate.match}</div>
              </div>
              <ChevronDown className={`w-3 h-3 text-white/40 transition-transform ${showDatePicker ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showDatePicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 mb-2 w-52 glass-panel rounded-lg border border-cyber-cyan/30 overflow-hidden shadow-2xl"
                >
                  <div className="p-2 border-b border-white/10">
                    <span className="text-white/60 text-xs">选择比赛日期</span>
                  </div>
                  {HISTORY_DATES.map((d, i) => (
                    <button
                      key={d.date}
                      onClick={() => handleDateSelect(i)}
                      className={`w-full px-3 py-2.5 text-left transition-colors flex items-center justify-between ${
                        i === currentDateIndex 
                          ? 'bg-cyber-cyan/20' 
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div>
                        <div className={`text-sm font-medium ${i === currentDateIndex ? 'text-cyber-cyan' : 'text-white'}`}>
                          {d.label}
                        </div>
                        <div className="text-white/40 text-[10px]">{d.match}</div>
                      </div>
                      {d.isToday && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan">
                          今日
                        </span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 指标切换下拉框 */}
          <div className="relative">
            <button
              onClick={() => setShowMetricDropdown(!showMetricDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyber-cyan/50 transition-all min-w-[100px]"
            >
              <MetricIcon className="w-4 h-4" style={{ color: currentMetricConfig.color }} />
              <span className="text-white text-sm font-medium">{currentMetricConfig.label}</span>
              <ChevronDown className={`w-3 h-3 text-white/40 transition-transform ${showMetricDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showMetricDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 mb-2 w-40 glass-panel rounded-lg border border-cyber-cyan/30 overflow-hidden shadow-2xl"
                >
                  <div className="p-2 border-b border-white/10">
                    <span className="text-white/60 text-xs">选择指标</span>
                  </div>
                  {Object.values(METRICS).map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        onClick={() => handleMetricSelect(m.id)}
                        className={`w-full px-3 py-2.5 text-left transition-colors flex items-center gap-2 ${
                          currentMetric === m.id 
                            ? 'bg-cyber-cyan/20' 
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4" style={{ color: m.color }} />
                        <span className={`text-sm ${currentMetric === m.id ? 'text-white font-medium' : 'text-white/70'}`}>
                          {m.label}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 分隔线 */}
          <div className="w-px h-10 bg-white/10" />

          {/* 播放控制 */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentSlotIndex(Math.max(0, currentSlotIndex - 1))}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>
            <button
              onClick={handlePlay}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
              style={{ 
                backgroundColor: `${currentMetricConfig.color}20`,
                border: `1px solid ${currentMetricConfig.color}50`
              }}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" style={{ color: currentMetricConfig.color }} />
              ) : (
                <Play className="w-5 h-5 ml-0.5" style={{ color: currentMetricConfig.color }} />
              )}
            </button>
            <button
              onClick={() => setCurrentSlotIndex(Math.min(TIME_SLOTS.length - 1, currentSlotIndex + 1))}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
            <button
              onClick={handleReset}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-white/50" />
            </button>
          </div>

          {/* 分隔线 */}
          <div className="w-px h-10 bg-white/10" />

          {/* 当前时间显示 */}
          <div className="flex-shrink-0 text-center min-w-[80px]">
            <div className="flex items-center gap-1 justify-center text-white/40 text-[10px] mb-0.5">
              <Clock className="w-3 h-3" />
              <span>当前时间</span>
            </div>
            <div 
              className="text-2xl font-bold font-orbitron"
              style={{ color: currentMetricConfig.color }}
            >
              {currentSlot.time}
            </div>
          </div>

          {/* 主要区域：柱状图 + 滑块 */}
          <div className="flex-1 relative h-14">
            {/* 背景柱状图 */}
            <div className="absolute inset-0 flex items-end justify-between px-1 pb-4">
              {TIME_SLOTS.map((slot, i) => {
                const value = slot.values[currentMetric];
                const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                const isActive = i === currentSlotIndex;
                const isPast = i < currentSlotIndex;
                
                return (
                  <motion.div
                    key={slot.time}
                    className="w-[3.5%] rounded-t transition-all duration-300"
                    style={{
                      height: `${height}%`,
                      backgroundColor: isActive 
                        ? currentMetricConfig.color
                        : isPast 
                          ? `${currentMetricConfig.color}60`
                          : 'rgba(255,255,255,0.08)',
                      boxShadow: isActive ? `0 0 10px ${currentMetricConfig.color}` : 'none',
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.01 }}
                  />
                );
              })}
            </div>

            {/* 滑块轨道 */}
            <div className="absolute inset-0 flex items-center">
              <input
                type="range"
                min={0}
                max={TIME_SLOTS.length - 1}
                step={1}
                value={currentSlotIndex}
                onChange={handleSliderChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              
              {/* 进度线 */}
              <div className="w-full h-0.5 bg-white/10 rounded-full">
                <motion.div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    width: `${(currentSlotIndex / (TIME_SLOTS.length - 1)) * 100}%`,
                    backgroundColor: currentMetricConfig.color,
                    boxShadow: `0 0 6px ${currentMetricConfig.color}`
                  }}
                />
              </div>
              
              {/* 滑块 */}
              <motion.div 
                className="absolute top-1/2 w-5 h-5 rounded-full border-2 border-white shadow-lg z-10"
                style={{ 
                  left: `${(currentSlotIndex / (TIME_SLOTS.length - 1)) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: currentMetricConfig.color,
                  boxShadow: `0 0 12px ${currentMetricConfig.color}`
                }}
              />
            </div>

            {/* 时间刻度 - 只显示整点 */}
            <div className="absolute -bottom-1 left-0 right-0 flex justify-between px-1">
              {TIME_SLOTS.filter((_, i) => i % 4 === 0).map((slot, i) => (
                <span key={i} className="text-[9px] text-white/40">
                  {slot.time}
                </span>
              ))}
            </div>
          </div>

          {/* 分隔线 */}
          <div className="w-px h-10 bg-white/10" />

          {/* 当前数值显示 */}
          <div className="flex-shrink-0 text-right min-w-[100px]">
            <div className="text-white/40 text-[10px] mb-0.5">
              当前{currentMetricConfig.label}
            </div>
            <div className="flex items-baseline gap-1 justify-end">
              <span 
                className="text-2xl font-bold font-orbitron"
                style={{ color: currentMetricConfig.color }}
              >
                {currentValue}
              </span>
              <span className="text-white/50 text-sm">{currentMetricConfig.unit}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
