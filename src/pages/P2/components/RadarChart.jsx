import ReactECharts from 'echarts-for-react';

export default function RadarChart() {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: 'rgba(11, 15, 25, 0.95)',
      borderColor: '#00F0FF',
      textStyle: { color: '#fff', fontSize: 11 },
    },
    // 图例移到右上角，水平排列
    legend: {
      data: ['VIP用户', '普通用户'],
      top: '0%',
      right: '0%',
      orient: 'horizontal',
      textStyle: { 
        color: 'rgba(255,255,255,0.7)', 
        fontSize: 11,
      },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 15,
    },
    radar: {
      indicator: [
        { name: '下行速率', max: 100 },
        { name: '低时延', max: 100 },
        { name: '直播上行', max: 100 },
        { name: '视频卡顿', max: 100 },
        { name: '语音清晰', max: 100 },
      ],
      center: ['50%', '58%'],
      radius: '55%',
      axisName: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(0, 240, 255, 0.05)', 'rgba(0, 240, 255, 0.02)'],
        },
      },
      axisLine: {
        lineStyle: { color: 'rgba(255,255,255,0.1)' },
      },
      splitLine: {
        lineStyle: { color: 'rgba(255,255,255,0.1)' },
      },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [98, 95, 99, 92, 95],
            name: 'VIP用户',
            symbol: 'circle',
            symbolSize: 5,
            lineStyle: { color: '#FFD700', width: 2 },
            itemStyle: { color: '#FFD700' },
            areaStyle: {
              color: 'rgba(255, 215, 0, 0.35)',
            },
          },
          {
            value: [60, 70, 65, 60, 80],
            name: '普通用户',
            symbol: 'circle',
            symbolSize: 5,
            lineStyle: { color: '#0055FF', width: 2 },
            itemStyle: { color: '#0055FF' },
            areaStyle: {
              color: 'rgba(0, 85, 255, 0.2)',
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="h-full">
      <ReactECharts option={option} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
