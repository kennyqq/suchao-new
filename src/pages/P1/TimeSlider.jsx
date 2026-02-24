import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Clock, Users, Phone } from 'lucide-react';

const timeSlots = [
  '18:00', '18:15', '18:30', '18:45',
  '19:00', '19:15', '19:30', '19:45',
  '20:00', '20:15', '20:30', '20:45',
  '21:00', '21:15', '21:30', '21:45', '22:00'
];

export default function TimeSlider({ onTimeChange, currentTimeIndex: externalTimeIndex }) {
  const [currentTimeIndex, setCurrentTimeIndex] = useState(externalTimeIndex || 8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState('crowd'); // 'crowd' | 'traffic'
  const [crowdData, setCrowdData] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const sliderRef = useRef(null);

  // 生成人流数据（波浪形）
  useEffect(() => {
    const data = timeSlots.map((time, index) => {
      const baseValue = 2;
      const peakValue = 5.5;
      const normalizedIndex = index / (timeSlots.length - 1);
      const curve = Math.sin((normalizedIndex * 0.8 + 0.1) * Math.PI) * peakValue + baseValue;
      return {
        time,
        value: Math.max(0.5, curve + (Math.random() * 0.4 - 0.2)),
      };
    });
    setCrowdData(data);
  }, []);

  // 生成流量（话务）数据（不同的波浪形态）
  useEffect(() => {
    const data = timeSlots.map((time, index) => {
      const baseValue = 30;
      const peakValue = 85;
      const normalizedIndex = index / (timeSlots.length - 1);
      // 话务高峰稍晚于人流高峰
      const curve = Math.sin((normalizedIndex * 0.9 + 0.15) * Math.PI) * peakValue + baseValue;
      return {
        time,
        value: Math.max(20, curve + (Math.random() * 10 - 5)),
      };
    });
    setTrafficData(data);
  }, []);

  // 自动播放
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeIndex((prev) => {
          if (prev >= timeSlots.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // 通知父组件
  useEffect(() => {
    onTimeChange?.(timeSlots[currentTimeIndex], currentTimeIndex, mode);
  }, [currentTimeIndex, mode, onTimeChange]);

  const handleSliderChange = (e) => {
    const newIndex = parseInt(e.target.value);
    setCurrentTimeIndex(newIndex);
    setIsPlaying(false);
  };

  const handleSkip = (direction) => {
    setCurrentTimeIndex((prev) => {
      const newIndex = Math.max(0, Math.min(timeSlots.length - 1, prev + direction));
      return newIndex;
    });
    setIsPlaying(false);
  };

  const currentTime = timeSlots[currentTimeIndex];
  const currentData = mode === 'crowd' ? crowdData : trafficData;
  const currentValue = currentData[currentTimeIndex]?.value?.toFixed(2) || '0.00';

  // 计算进度百分比
  const progressPercent = (currentTimeIndex / (timeSlots.length - 1)) * 100;

  // 获取柱状图数据的最大值用于归一化
  const maxValue = currentData.length > 0 ? Math.max(...currentData.map(d => d.value)) : 1;

  return (
    <div className="mx-4 mb-4">
      <div 
        className="rounded-xl p-4 border border-cyber-cyan/20"
        style={{ 
          background: 'linear-gradient(180deg, rgba(16, 24, 40, 0.9) 0%, rgba(11, 15, 25, 0.95) 100%)',
          boxShadow: '0 0 30px rgba(0, 240, 255, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <div className="flex items-center gap-6">
          {/* 播放控制 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSkip(-1)}
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
            >
              <SkipBack className="w-4 h-4 text-white/70" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-11 h-11 rounded-lg bg-gradient-to-br from-cyber-cyan/30 to-cyber-blue/30 hover:from-cyber-cyan/40 hover:to-cyber-blue/40 border border-cyber-cyan/50 flex items-center justify-center transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-cyber-cyan" />
              ) : (
                <Play className="w-5 h-5 text-cyber-cyan ml-0.5" />
              )}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSkip(1)}
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
            >
              <SkipForward className="w-4 h-4 text-white/70" />
            </motion.button>
          </div>

          {/* 当前时间显示 */}
          <div className="flex-shrink-0 text-center px-6 border-x border-white/10">
            <div className="flex items-center gap-2 text-white/40 text-xs mb-1 justify-center">
              <Clock className="w-3 h-3" />
              <span>当前时刻</span>
            </div>
            <div className="font-orbitron text-3xl font-bold text-cyber-cyan tracking-wider">
              {currentTime}
            </div>
          </div>

          {/* 滑块区域 */}
          <div className="flex-1 min-w-0">
            {/* 模式切换和数值显示 */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {/* 模式切换按钮 */}
                <div className="flex bg-white/5 rounded-lg p-0.5">
                  <button
                    onClick={() => setMode('crowd')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      mode === 'crowd'
                        ? 'bg-cyber-cyan/30 text-cyber-cyan border border-cyber-cyan/50'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>人流回放</span>
                  </button>
                  <button
                    onClick={() => setMode('traffic')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      mode === 'traffic'
                        ? 'bg-cyber-gold/30 text-cyber-gold border border-cyber-gold/50'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>话务回放</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-xs">{mode === 'crowd' ? '在线用户:' : '话务量:'}</span>
                <span className="font-orbitron text-lg font-bold" style={{ color: mode === 'crowd' ? '#00F0FF' : '#FFD700' }}>
                  {currentValue}
                </span>
                <span className="text-white/40 text-xs">{mode === 'crowd' ? '万' : 'Erl'}</span>
              </div>
            </div>
            
            <div className="relative h-16">
              {/* 柱状图背景 */}
              <div className="absolute inset-0 flex items-end justify-between px-0.5 pb-4 pointer-events-none">
                {currentData.map((d, index) => {
                  const heightPercent = (d.value / maxValue) * 100;
                  const isActive = index <= currentTimeIndex;
                  return (
                    <div
                      key={index}
                      className="flex-1 mx-0.5 rounded-t transition-all duration-300"
                      style={{
                        height: `${Math.max(heightPercent, 5)}%`,
                        background: isActive
                          ? mode === 'crowd'
                            ? 'linear-gradient(to top, rgba(0, 240, 255, 0.8), rgba(0, 240, 255, 0.3))'
                            : 'linear-gradient(to top, rgba(255, 215, 0, 0.8), rgba(255, 215, 0, 0.3))'
                          : 'rgba(255, 255, 255, 0.1)',
                        boxShadow: isActive
                          ? mode === 'crowd'
                            ? '0 0 10px rgba(0, 240, 255, 0.5)'
                            : '0 0 10px rgba(255, 215, 0, 0.5)'
                          : 'none',
                      }}
                    />
                  );
                })}
              </div>

              {/* 滑块轨道 */}
              <div className="absolute inset-0 flex items-end pb-1">
                <input
                  ref={sliderRef}
                  type="range"
                  min={0}
                  max={timeSlots.length - 1}
                  value={currentTimeIndex}
                  onChange={handleSliderChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                
                {/* 背景轨道 */}
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${progressPercent}%`,
                      background: mode === 'crowd'
                        ? 'linear-gradient(90deg, #00F0FF 0%, #FFD700 50%, #00F0FF 100%)'
                        : 'linear-gradient(90deg, #FFD700 0%, #FF6B6B 50%, #FFD700 100%)',
                    }}
                  />
                </div>

                {/* 刻度点 */}
                <div className="absolute inset-0 flex items-center justify-between pointer-events-none px-0.5 pb-0">
                  {timeSlots.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        index <= currentTimeIndex 
                          ? mode === 'crowd'
                            ? 'bg-cyber-cyan shadow-[0_0_5px_#00F0FF]' 
                            : 'bg-cyber-gold shadow-[0_0_5px_#FFD700]'
                          : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>

                {/* 当前位置指示器 */}
                <motion.div
                  className="absolute bottom-0 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-lg pointer-events-none z-10"
                  style={{ 
                    left: `calc(${progressPercent}% - 10px)`,
                    background: mode === 'crowd' ? '#00F0FF' : '#FFD700',
                  }}
                  animate={{ 
                    boxShadow: mode === 'crowd'
                      ? ['0 0 10px rgba(0, 240, 255, 0.5)', '0 0 25px rgba(0, 240, 255, 0.9)', '0 0 10px rgba(0, 240, 255, 0.5)']
                      : ['0 0 10px rgba(255, 215, 0, 0.5)', '0 0 25px rgba(255, 215, 0, 0.9)', '0 0 10px rgba(255, 215, 0, 0.5)'],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </div>

            {/* 时间刻度 */}
            <div className="flex justify-between mt-1">
              <span className="text-white/30 text-[10px]">18:00</span>
              <span className="text-white/30 text-[10px]">19:00</span>
              <span className="text-white/30 text-[10px]">20:00</span>
              <span className="text-white/30 text-[10px]">21:00</span>
              <span className="text-white/30 text-[10px]">22:00</span>
            </div>
          </div>

          {/* 关键事件标记 */}
          <div className="flex-shrink-0 ml-6 pl-6 border-l border-white/10">
            <div className="text-white/40 text-xs mb-2 font-medium">关键事件</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyber-gold shadow-[0_0_5px_#FFD700]" />
                <span className="text-white/60 text-xs">19:30 比赛开始</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_5px_#FF3333]" />
                <span className="text-white/60 text-xs">20:15 峰值时刻</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
