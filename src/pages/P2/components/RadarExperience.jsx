import ReactECharts from 'echarts-for-react';

const RADAR_DATA = {
  indicator: [
    { name: '下行速率', max: 1000 },
    { name: '微信上传', max: 150 },
    { name: '短视频高清', max: 100 },
    { name: '直播高清', max: 100 },
    { name: '游戏时延', max: 50 },
  ],
  vip: [850, 120, 99, 100, 18],
  normal: [60, 20, 85, 90, 35],
};

export default function RadarExperience() {
  const option = {
    legend: {
      data: ['VIP体验', '普通用户'],
      top: 0,
      textStyle: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 10,
      },
      itemWidth: 12,
      itemHeight: 12,
    },
    radar: {
      indicator: RADAR_DATA.indicator.map(item => ({
        name: item.name,
        max: item.max,
        axisLabel: { show: false },
      })),
      center: ['50%', '55%'],
      radius: '65%',
      splitNumber: 4,
      axisName: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 10,
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(0, 240, 255, 0.02)', 'rgba(0, 240, 255, 0.05)'],
        },
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: RADAR_DATA.vip,
            name: 'VIP体验',
            lineStyle: {
              color: '#FFD700',
              width: 2,
            },
            areaStyle: {
              color: 'rgba(255, 215, 0, 0.2)',
            },
            itemStyle: {
              color: '#FFD700',
            },
            symbol: 'circle',
            symbolSize: 6,
          },
          {
            value: RADAR_DATA.normal,
            name: '普通用户',
            lineStyle: {
              color: '#00F0FF',
              width: 2,
            },
            areaStyle: {
              color: 'rgba(0, 240, 255, 0.2)',
            },
            itemStyle: {
              color: '#00F0FF',
            },
            symbol: 'circle',
            symbolSize: 6,
          },
        ],
      },
    ],
  };

  return (
    <div className="h-full">
      <ReactECharts 
        option={option} 
        style={{ height: '100%' }} 
        notMerge={true}
      />
    </div>
  );
}
