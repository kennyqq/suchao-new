import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const timeLabels = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:45', '21:00', '21:30', '22:00'];
const trafficData = [15, 35, 68, 82, 95, 100, 88, 45, 25]; // 相对流量值

export default function PlaybackTimeline() {
  const [currentIndex, setCurrentIndex] = useState(5); // 默认在峰值
  const [isPlaying, setIsPlaying] = useState(false);

  const chartOption = {
    backgroundColor: 'transparent',
    grid: {
      top: 10,
      right: 20,
      bottom: 40,
      left: 50,
    },
    xAxis: {
      type: 'category',
      data: timeLabels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      show: false,
      max: 120,
    },
    series: [
      {
        type: 'bar',
        data: trafficData.map((val, idx) => ({
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
                ? 'rgba(0,240,255,0.6)'
                : 'rgba(255,255,255,0.1)',
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barWidth: '60%',
        markPoint: {
          data: [
            {
              coord: [5, 100],
              value: '流量峰值',
              itemStyle: { color: '#FFD700' },
              label: {
                color: '#FFD700',
                fontSize: 10,
                offset: [0, -10],
              },
            },
          ],
          symbol: 'pin',
          symbolSize: 40,
        },
      },
    ],
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
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
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="glass-panel rounded-xl p-4 h-full border border-yellow-500/20">
      <div className="flex items-center gap-4 h-full">
        {/* 控制按钮 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handlePlay}
            className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center hover:bg-yellow-500/30 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-yellow-400" />
            ) : (
              <Play className="w-5 h-5 text-yellow-400 ml-0.5" />
            )}
          </button>
          <button
            onClick={handleReset}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* 图表区域 */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">全景回放 (18:00 - 22:00)</span>
            <div className="flex items-center gap-3">
              <span className="text-yellow-400 text-sm font-orbitron">
                {timeLabels[currentIndex]}
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-white/40">流量强度:</span>
                <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-yellow-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${trafficData[currentIndex]}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 直方图 */}
          <div className="flex-1 min-h-0">
            <ReactECharts option={chartOption} style={{ width: '100%', height: '100%' }} />
          </div>

          {/* 滑块控制 */}
          <div className="relative h-6 mt-1">
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
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg"
              style={{ left: `${(currentIndex / (timeLabels.length - 1)) * 100}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
