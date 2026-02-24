import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

// 生成模拟人流数据（柱状图）
const generateCrowdData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    // 模拟比赛日人流曲线：开场前低，比赛中高，散场后逐渐降低
    const hour = i;
    let value;
    if (hour < 17) value = 20 + Math.random() * 15; // 开场前
    else if (hour < 19) value = 40 + Math.random() * 20; // 入场
    else if (hour < 21) value = 85 + Math.random() * 15; // 比赛中峰值
    else if (hour < 22) value = 60 + Math.random() * 20; // 散场
    else value = 30 + Math.random() * 15; // 赛后
    
    data.push({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      value: Math.round(value),
    });
  }
  return data;
};

const TIMELINE_DATA = generateCrowdData();

export default function TimelineV2({ onTimeChange }) {
  const [currentIndex, setCurrentIndex] = useState(19); // 默认 19:00
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-05-02');

  const currentTime = TIMELINE_DATA[currentIndex];
  const maxValue = Math.max(...TIMELINE_DATA.map(d => d.value));

  // 播放控制
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= TIMELINE_DATA.length - 1) {
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
      onTimeChange(currentTime);
    }
  }, [currentIndex, onTimeChange]);

  const handleSliderChange = (e) => {
    setCurrentIndex(parseInt(e.target.value));
    setIsPlaying(false);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[60%] min-w-[800px]">
      <div className="glass-panel rounded-xl px-6 py-4 corner-bracket">
        {/* 四角装饰 */}
        <span className="corner-bl" />
        <span className="corner-br" />

        <div className="flex items-center gap-6">
          {/* 日期选择 */}
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Calendar className="w-4 h-4 text-cyber-cyan" />
            <select 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border border-cyber-cyan/30 rounded px-2 py-1 text-cyber-cyan focus:outline-none"
            >
              <option value="2026-05-02" className="bg-cyber-dark">5月2日</option>
              <option value="2026-04-26" className="bg-cyber-dark">4月26日</option>
              <option value="2026-04-19" className="bg-cyber-dark">4月19日</option>
            </select>
          </div>

          {/* 播放控制 */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-cyber-cyan transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full bg-cyber-cyan/20 hover:bg-cyber-cyan/30 text-cyber-cyan transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setCurrentIndex(Math.min(TIMELINE_DATA.length - 1, currentIndex + 1))}
              className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-cyber-cyan transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* 时间轴主体 */}
          <div className="flex-1 relative">
            {/* 柱状图背景 */}
            <div className="absolute inset-0 flex items-end justify-between gap-1 h-16 -top-8 pointer-events-none">
              {TIMELINE_DATA.map((data, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-sm transition-all duration-300"
                  style={{
                    height: `${(data.value / maxValue) * 100}%`,
                    background: index <= currentIndex 
                      ? 'linear-gradient(180deg, rgba(0, 240, 255, 0.4) 0%, rgba(0, 240, 255, 0.1) 100%)'
                      : 'linear-gradient(180deg, rgba(0, 240, 255, 0.1) 0%, rgba(0, 240, 255, 0.05) 100%)',
                  }}
                />
              ))}
            </div>

            {/* 滑块轨道 */}
            <div className="relative h-6 flex items-center">
              <input
                type="range"
                min="0"
                max={TIMELINE_DATA.length - 1}
                value={currentIndex}
                onChange={handleSliderChange}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider-timeline"
                style={{
                  background: `linear-gradient(90deg, #00F0FF 0%, #00F0FF ${(currentIndex / (TIMELINE_DATA.length - 1)) * 100}%, rgba(255,255,255,0.2) ${(currentIndex / (TIMELINE_DATA.length - 1)) * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
              
              {/* 当前时间指示器 */}
              <div 
                className="absolute top-0 -translate-x-1/2 pointer-events-none"
                style={{ left: `${(currentIndex / (TIMELINE_DATA.length - 1)) * 100}%` }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-cyber-cyan shadow-glow-cyan border-2 border-white" />
                  <div className="mt-1 text-xs text-cyber-cyan font-din whitespace-nowrap">
                    {currentTime.hour}
                  </div>
                </div>
              </div>
            </div>

            {/* 时间刻度 */}
            <div className="flex justify-between mt-1 text-[10px] text-white/40">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:00</span>
            </div>
          </div>

          {/* 当前数值显示 */}
          <div className="text-right min-w-[100px]">
            <div className="text-[10px] text-white/50">当前人流</div>
            <div className="text-xl font-din text-cyber-cyan">
              {currentTime.value}%
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .slider-timeline::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00F0FF;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
          border: 2px solid #fff;
        }
        .slider-timeline::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00F0FF;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
