import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Calendar, ChevronDown } from 'lucide-react';

// 生成8小时的时间刻度（17:00 - 01:00，每15分钟一个点，共33个点）
const generateTimeSlots = () => {
  const slots = [];
  const startHour = 17;
  const totalHours = 8;
  
  for (let h = 0; h < totalHours; h++) {
    const hour = (startHour + h) % 24;
    for (let m = 0; m < 60; m += 15) {
      slots.push(`${hour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }
  // 添加最后一点 01:00
  slots.push('01:00');
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

// 生成模拟数据（33个点对应8小时）
const generateMockData = (baseValue, peakValue, peakIndex) => {
  const data = [];
  for (let i = 0; i < TIME_SLOTS.length; i++) {
    // 使用正弦曲线模拟数据变化，在peakIndex处达到峰值
    const distanceFromPeak = Math.abs(i - peakIndex);
    const factor = Math.max(0, 1 - distanceFromPeak / 12);
    const value = baseValue + (peakValue - baseValue) * factor + (Math.random() - 0.5) * baseValue * 0.2;
    data.push(Math.max(0, Number(value.toFixed(1))));
  }
  return data;
};

// 三种指标的模拟数据
const METRICS_DATA = {
  crowd: {
    label: '人流',
    unit: '万人',
    icon: '👥',
    data: generateMockData(2, 9.5, 20),
    threshold: 8.0,
  },
  traffic: {
    label: '流量',
    unit: 'TB',
    icon: '📶',
    data: generateMockData(0.5, 10, 20),
    threshold: 8.0,
  },
  fiveGA: {
    label: '5G-A用户流量',
    unit: 'Gbps',
    icon: '📱',
    data: generateMockData(1, 13, 20),
    threshold: 10.0,
  },
};

// 生成日期选项（以今天为基准，前后15天）
const generateDateOptions = () => {
  const dates = [];
  const today = new Date();
  for (let i = -15; i <= 15; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    dates.push({
      value: `${month}-${day}`,
      label: `${month}月${day}日`,
      fullDate: date,
      isToday: i === 0,
    });
  }
  return dates;
};

const DATE_OPTIONS = generateDateOptions();

export default function TimelineV3({ onTimeChange, onMetricChange, externalTime }) {
  // 根据外部时间初始化索引
  const getInitialIndex = () => {
    if (externalTime) {
      const index = TIME_SLOTS.indexOf(externalTime);
      return index >= 0 ? index : 20;
    }
    return 20; // 默认 20:00
  };

  const [currentIndex, setCurrentIndex] = useState(getInitialIndex());
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('crowd');
  const [showMetricDropdown, setShowMetricDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState(DATE_OPTIONS[15]); // 默认5月2日（数组中间）

  const currentMetric = METRICS_DATA[selectedMetric];
  const currentValue = currentMetric.data[currentIndex];
  const currentTime = TIME_SLOTS[currentIndex];
  const maxValue = Math.max(...currentMetric.data);

  // 监听外部时间变化，同步更新内部状态
  useEffect(() => {
    if (externalTime) {
      const index = TIME_SLOTS.indexOf(externalTime);
      if (index >= 0 && index !== currentIndex) {
        setCurrentIndex(index);
      }
    }
  }, [externalTime]);

  // 播放控制
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= TIME_SLOTS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // 通知父组件时间变化
  useEffect(() => {
    if (onTimeChange) {
      onTimeChange({ time: currentTime, value: currentValue, metric: selectedMetric });
    }
  }, [currentIndex, selectedMetric]);

  const handlePlay = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(20);
  };
  const handlePrev = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
    setIsPlaying(false);
  };
  const handleNext = () => {
    setCurrentIndex(Math.min(TIME_SLOTS.length - 1, currentIndex + 1));
    setIsPlaying(false);
  };

  const handleSliderChange = (e) => {
    setCurrentIndex(parseInt(e.target.value));
    setIsPlaying(false);
  };

  const handleMetricChange = (metric) => {
    setSelectedMetric(metric);
    setShowMetricDropdown(false);
    if (onMetricChange) {
      onMetricChange(metric);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDateDropdown(false);
  };

  // 判断是否为波峰
  const isPeak = (value) => value >= currentMetric.threshold;

  // 计算柱子的渐变颜色
  const getBarGradient = (value, index, isActive) => {
    if (isPeak(value)) {
      return 'linear-gradient(180deg, rgba(255, 215, 0, 0.9) 0%, rgba(255, 165, 0, 0.6) 50%, rgba(255, 215, 0, 0.3) 100%)';
    }
    if (isActive) {
      return 'linear-gradient(180deg, rgba(0, 240, 255, 0.7) 0%, rgba(0, 191, 255, 0.4) 50%, rgba(0, 240, 255, 0.2) 100%)';
    }
    return 'linear-gradient(180deg, rgba(0, 240, 255, 0.15) 0%, rgba(0, 240, 255, 0.08) 50%, rgba(0, 240, 255, 0.02) 100%)';
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-[#0B1A2A]/90 backdrop-blur-md border border-cyber-cyan/20 rounded-xl h-[76px] flex items-center px-4">
        
        {/* 1. 日期选择区 */}
        <div className="flex items-center gap-3 w-[140px] shrink-0">
          <div className="w-9 h-9 rounded-lg bg-cyber-cyan/20 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-cyber-cyan" />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="flex items-center gap-1 text-white hover:text-cyber-cyan transition-colors"
            >
              <span className="text-sm font-medium">{selectedDate.label}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showDateDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showDateDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full left-0 mb-2 w-32 max-h-48 overflow-y-auto bg-cyber-dark border border-cyber-cyan/30 rounded-lg shadow-lg scrollbar-cyber"
              >
                {DATE_OPTIONS.map((date) => (
                  <button
                    key={date.value}
                    onClick={() => handleDateChange(date)}
                    className={`w-full px-3 py-2 text-xs text-left hover:bg-cyber-cyan/10 transition-colors ${
                      selectedDate.value === date.value ? 'bg-cyber-cyan/20 text-cyber-cyan' : 'text-white/70'
                    }`}
                  >
                    {date.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* 分隔线 */}
        <div className="w-px h-10 bg-white/10 mx-3" />

        {/* 2. 指标选择器 */}
        <div className="relative w-[120px] shrink-0">
          <button 
            onClick={() => setShowMetricDropdown(!showMetricDropdown)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-cyber-dark/50 border border-cyber-cyan/30 hover:border-cyber-cyan/50 transition-colors"
          >
            <span className="text-sm text-white truncate">
              {currentMetric.icon} {currentMetric.label}
            </span>
            <ChevronDown className={`w-4 h-4 text-white/50 transition-transform flex-shrink-0 ${showMetricDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showMetricDropdown && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-0 mb-2 w-full bg-cyber-dark border border-cyber-cyan/30 rounded-lg overflow-hidden shadow-lg"
            >
              {Object.entries(METRICS_DATA).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => handleMetricChange(key)}
                  className={`w-full px-3 py-2 text-sm text-left hover:bg-cyber-cyan/10 transition-colors ${
                    selectedMetric === key ? 'bg-cyber-cyan/20 text-cyber-cyan' : 'text-white/70'
                  }`}
                >
                  {data.icon} {data.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* 分隔线 */}
        <div className="w-px h-10 bg-white/10 mx-3" />

        {/* 3. 播放控制区 */}
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={handlePrev} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <SkipBack className="w-4 h-4" />
          </button>
          <button 
            onClick={handlePlay}
            className={`p-2 rounded-lg border transition-all ${
              isPlaying 
                ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan' 
                : 'border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/10'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button onClick={handleNext} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <SkipForward className="w-4 h-4" />
          </button>
          <button onClick={handleReset} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* 分隔线 */}
        <div className="w-px h-10 bg-white/10 mx-3" />

        {/* 4. 时间显示与核心轨道（占据最大空间） */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 时间显示 */}
          <div className="flex items-center gap-4 mb-1">
            <div>
              <div className="text-[10px] text-white/40">当前时间</div>
              <div className="text-xl font-din text-cyber-cyan">{currentTime}</div>
            </div>
          </div>

          {/* 柱状图轨道 */}
          <div className="relative h-8 flex items-end">
            {/* 柱状图背景 - 变细并使用渐变 */}
            <div className="absolute inset-0 flex items-end gap-[1px]">
              {currentMetric.data.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-sm transition-all duration-300"
                  style={{
                    height: `${(value / maxValue) * 100}%`,
                    minHeight: value > 0 ? '2px' : '0',
                    background: getBarGradient(value, index, index <= currentIndex),
                    boxShadow: isPeak(value) ? '0 0 6px rgba(255, 215, 0, 0.3)' : 'none',
                  }}
                />
              ))}
            </div>

            {/* 滑块轨道 */}
            <div className="absolute inset-0 flex items-center">
              <input
                type="range"
                min="0"
                max={TIME_SLOTS.length - 1}
                value={currentIndex}
                onChange={handleSliderChange}
                className="w-full h-1.5 bg-transparent appearance-none cursor-pointer z-10 slider-timeline"
                style={{
                  background: `linear-gradient(90deg, rgba(0, 240, 255, 0.5) 0%, rgba(0, 240, 255, 0.5) ${(currentIndex / (TIME_SLOTS.length - 1)) * 100}%, transparent ${(currentIndex / (TIME_SLOTS.length - 1)) * 100}%, transparent 100%)`,
                }}
              />
            </div>

            {/* 时间刻度 - 每2小时显示一个 */}
            <div className="absolute -bottom-3 left-0 right-0 flex justify-between text-[9px] text-white/30">
              <span>17:00</span>
              <span>19:00</span>
              <span>21:00</span>
              <span>23:00</span>
              <span>01:00</span>
            </div>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="w-px h-10 bg-white/10 mx-3" />

        {/* 5. 当前动态数值区 */}
        <div className="w-[100px] shrink-0 text-right">
          <div className="text-[10px] text-white/40">当前{currentMetric.label}</div>
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-2xl font-din text-white">{currentValue.toFixed(1)}</span>
            <span className="text-xs text-white/60">{currentMetric.unit}</span>
          </div>
        </div>
      </div>

      <style>{`
        .slider-timeline::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #00F0FF;
          border: 2px solid #fff;
          box-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
          cursor: pointer;
        }
        .slider-timeline::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #00F0FF;
          border: 2px solid #fff;
          box-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
          cursor: pointer;
        }
        .scrollbar-cyber::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-cyber::-webkit-scrollbar-track {
          background: rgba(0, 240, 255, 0.05);
        }
        .scrollbar-cyber::-webkit-scrollbar-thumb {
          background: rgba(0, 240, 255, 0.3);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
