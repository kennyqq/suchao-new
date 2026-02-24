import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';

// 模拟预测数据（最高到65%）
const PREDICTION_DATA = [
  { time: '-30分', value: 60 },
  { time: '-20分', value: 61 },
  { time: '-10分', value: 62 },
  { time: '当前', value: 62 },
  { time: '+10分', value: 63 },
  { time: '+20分', value: 64 },
  { time: '+30分', value: 65 },
];

export default function ArcProgress() {
  const currentValue = 62;

  // 缺口环形图配置
  const arcOption = {
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        splitNumber: 1,
        radius: '90%',
        center: ['50%', '55%'],
        itemStyle: {
          color: '#00F0FF',
        },
        progress: {
          show: true,
          roundCap: true,
          width: 12,
        },
        pointer: {
          show: false,
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 12,
            color: [[1, 'rgba(0, 240, 255, 0.1)']],
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        title: { show: false },
        detail: {
          valueAnimation: true,
          fontSize: 36,
          fontWeight: 'bold',
          fontFamily: 'DIN Alternate, Orbitron, monospace',
          color: '#00F0FF',
          offsetCenter: [0, 0],
          formatter: '{value}%',
        },
        data: [{ value: currentValue }],
      },
    ],
  };

  // 预测折线图配置
  const lineOption = {
    grid: { top: 30, right: 10, bottom: 20, left: 40 },
    xAxis: {
      type: 'category',
      data: PREDICTION_DATA.map(d => d.time),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      min: 55,
      max: 70,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, formatter: '{value}%' },
    },
    series: [
      {
        data: PREDICTION_DATA.map((d, i) => ({
          value: d.value,
          itemStyle: { color: i < 4 ? '#00F0FF' : '#FFD700' },
        })),
        type: 'line',
        smooth: true,
        lineStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#00F0FF' },
              { offset: 0.57, color: '#00F0FF' },
              { offset: 0.57, color: '#FFD700' },
              { offset: 1, color: '#FFD700' },
            ],
          },
          width: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 240, 255, 0.2)' },
              { offset: 1, color: 'rgba(0, 240, 255, 0)' },
            ],
          },
        },
        symbol: 'circle',
        symbolSize: 6,
      },
    ],
  };

  return (
    <div className="flex flex-col h-full">
      {/* 缺口环形图 */}
      <div className="flex-1 min-h-0">
        <div className="text-center mb-2">
          <div className="text-xs text-white/50">当前空间利用率</div>
        </div>
        <ReactECharts 
          option={arcOption} 
          style={{ height: '140px' }} 
          notMerge={true}
        />
      </div>

      {/* 预测折线图 */}
      <div className="mt-2">
        <div className="text-xs text-white/50 mb-1">未来30min预测</div>
        <ReactECharts 
          option={lineOption} 
          style={{ height: '100px' }} 
          notMerge={true}
        />
      </div>

      {/* 说明 */}
      <div className="mt-2 flex items-center justify-center gap-4 text-[10px]">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyber-cyan" />
          <span className="text-white/50">历史</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyber-gold" />
          <span className="text-white/50">预测</span>
        </div>
      </div>
    </div>
  );
}
