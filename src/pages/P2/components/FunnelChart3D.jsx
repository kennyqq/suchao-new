import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';

export default function FunnelChart3D() {
  const data = [
    { value: 200, name: '场馆包用户', itemStyle: { color: '#FFD700' } },
    { value: 1500, name: '全球通金卡', itemStyle: { color: '#C0C0C0' } },
    { value: 48000, name: '普通用户', itemStyle: { color: '#0055FF' } },
  ];

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(11, 15, 25, 0.95)',
      borderColor: '#00F0FF',
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: (params) => `${params.name}<br/>用户数: ${params.value.toLocaleString()}`,
    },
    series: [
      {
        type: 'funnel',
        left: '10%',
        top: 20,
        bottom: 20,
        width: '80%',
        min: 0,
        max: 50000,
        minSize: '20%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}\n{c}人',
          fontSize: 11,
          color: '#fff',
          fontWeight: 'bold',
        },
        labelLine: {
          show: false,
        },
        itemStyle: {
          borderColor: 'rgba(255,255,255,0.3)',
          borderWidth: 1,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 240, 255, 0.3)',
        },
        emphasis: {
          label: {
            fontSize: 14,
          },
          itemStyle: {
            shadowBlur: 30,
            shadowColor: 'rgba(255, 215, 0, 0.5)',
          },
        },
        data: data,
      },
    ],
  };

  return (
    <div className="h-[220px]">
      <ReactECharts option={option} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
