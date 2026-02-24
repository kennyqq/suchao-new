import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Users, Wifi, AlertTriangle } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const timeLabels = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:45', '21:00', '21:30', '22:00'];
const userData = [12000, 25000, 42000, 55000, 62000, 65328, 58000, 35000, 18000];
const trafficData = [2.5, 5.2, 8.8, 11.5, 13.2, 15.8, 12.5, 6.8, 3.2];
// 拥塞状态: 0=绿(正常), 1=黄(预警), 2=红(拥塞)
const congestionData = [0, 0, 1, 1, 0, 0, 1, 0, 0];

const congestionLabels = ['正常', '预警', '拥塞'];
const congestionColors = ['#00FF88', '#FFD700', '#FF3333'];

export default function PanoramaPlayback() {
  const [currentIndex, setCurrentIndex] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);

  const chartOption = {
    backgroundColor: 'transparent',
    grid: {
      top: 20,
      right: 10,
      bottom: 30,
      left: 10,
    },
    xAxis: {
      type: 'category',
      data: timeLabels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 9,
        interval: 1,
      },
    },
    yAxis: { type: 'value', show: false, max: 70000 },
    series: [
      {
        type: 'bar',
        data: userData.map((val, idx) => ({
          value: val,
          itemStyle: {
            color: idx === currentIndex 
              ? {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#FFD700' },
                    { offset: 1, color: '#FFA500' },
                  ],
                }
              : idx < currentIndex
                ? congestionColors[congestionData[idx]] === '#00FF88' 
                  ? 'rgba(0,255,136,0.6)' 
                  : congestionColors[congestionData[idx]] === '#FFD700'
                    ? 'rgba(255,215,0,0.6)'
                    : 'rgba(255,51,51,0.6)'
                : 'rgba(255,255,255,0.1)',
            borderRadius: [2, 2, 0, 0],
          },
        })),
        barWidth: '50%',
      },
    ],
  };

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= timeLabels.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const currentCongestion = congestionData[currentIndex];

  return (
    <div className="flex flex-col h-full">
      {/* 时间轴控制区 */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={handlePlay}
          className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center hover:bg-yellow-500/30 transition-colors flex-shrink-0"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-yellow-400" />
          ) : (
            <Play className="w-4 h-4 text-yellow-400 ml-0.5" />
          )}
        </button>
        <button
          onClick={handleReset}
          className="w-8 h-8 rounded-full bg-white/5 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
        >
          <RotateCcw className="w-3 h-3 text-white/60" />
        </button>
        
        <div className="flex-1">
          <div className="text-[10px] text-white/40 mb-1">历史时刻</div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-din text-yellow-400">{timeLabels[currentIndex]}</span>
            {currentIndex === 5 && (
              <span className="text-[9px] text-yellow-400/70">(进球时刻)</span>
            )}
          </div>
        </div>
      </div>
      
      {/* 三个指标 */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-cyber-dark/50 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="w-3 h-3 text-cyan-400" />
            <span className="text-[9px] text-white/50">用户数</span>
          </div>
          <div className="text-sm font-din text-cyan-400">
            {userData[currentIndex].toLocaleString()}
          </div>
          <div className="text-[8px] text-white/30">人</div>
        </div>
        
        <div className="bg-cyber-dark/50 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Wifi className="w-3 h-3 text-purple-400" />
            <span className="text-[9px] text-white/50">流量</span>
          </div>
          <div className="text-sm font-din text-purple-400">
            {trafficData[currentIndex]}
          </div>
          <div className="text-[8px] text-white/30">GB</div>
        </div>
        
        <div className="bg-cyber-dark/50 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <AlertTriangle className="w-3 h-3" style={{ color: congestionColors[currentCongestion] }} />
            <span className="text-[9px] text-white/50">拥塞状态</span>
          </div>
          <div className="text-sm font-din" style={{ color: congestionColors[currentCongestion] }}>
            {congestionLabels[currentCongestion]}
          </div>
          <div className="text-[8px] text-white/30">
            {currentCongestion === 0 ? '正常' : currentCongestion === 1 ? '注意' : '拥塞'}
          </div>
        </div>
      </div>
      
      {/* 图表 */}
      <div className="flex-1 min-h-0">
        <ReactECharts option={chartOption} style={{ width: '100%', height: '100%' }} />
      </div>
      
      {/* 滑块 */}
      <div className="relative h-5 mt-1">
        <input
          type="range"
          min={0}
          max={timeLabels.length - 1}
          value={currentIndex}
          onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-1 bg-white/10 rounded-full">
            <motion.div 
              className="h-full bg-yellow-500 rounded-full"
              style={{ width: `${(currentIndex / (timeLabels.length - 1)) * 100}%` }}
            />
          </div>
        </div>
        <motion.div 
          className="absolute top-1/2 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white shadow-lg"
          style={{ 
            left: `${(currentIndex / (timeLabels.length - 1)) * 100}%`, 
            transform: 'translate(-50%, -50%)' 
          }}
        />
      </div>
      
      {/* 图例 */}
      <div className="flex items-center justify-center gap-4 mt-2 text-[9px] text-white/40">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: '#00FF88' }} />
          <span>正常</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: '#FFD700' }} />
          <span>预警</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: '#FF3333' }} />
          <span>拥塞</span>
        </div>
      </div>
    </div>
  );
}
