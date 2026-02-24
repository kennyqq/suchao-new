import ReactECharts from 'echarts-for-react';

export default function MiniTrendChart() {
  const option = {
    backgroundColor: 'transparent',
    grid: {
      top: 10,
      right: 10,
      bottom: 20,
      left: 40,
    },
    xAxis: {
      type: 'category',
      data: ['18:00', '19:00', '20:00', '20:45', '21:00', '22:00'],
      axisLine: {
        lineStyle: { color: 'rgba(255,255,255,0.2)' },
      },
      axisLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 9,
      },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 150000,
      axisLine: { show: false },
      splitLine: {
        lineStyle: { color: 'rgba(255,255,255,0.1)' },
      },
      axisLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 9,
        formatter: (value) => {
          if (value >= 10000) return (value / 10000) + '万';
          return value;
        },
      },
    },
    series: [
      {
        type: 'line',
        data: [15000, 45000, 85000, 120000, 95000, 60000],
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: '#00F0FF',
          width: 3,
          shadowColor: 'rgba(0,240,255,0.5)',
          shadowBlur: 10,
        },
        itemStyle: {
          color: '#00F0FF',
          borderColor: '#fff',
          borderWidth: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0,240,255,0.4)' },
              { offset: 1, color: 'rgba(0,240,255,0)' },
            ],
          },
        },
        markPoint: {
          data: [
            {
              coord: ['20:45', 120000],
              value: '峰值',
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

  return (
    <div className="w-full h-full">
      <ReactECharts option={option} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
