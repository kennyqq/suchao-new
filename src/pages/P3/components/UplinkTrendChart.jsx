import ReactECharts from 'echarts-for-react';

// 模拟上行流量数据，20:45 是进球时刻
const UPLINK_DATA = [
  { time: '19:00', value: 1.2 },
  { time: '19:15', value: 1.5 },
  { time: '19:30', value: 2.1 },
  { time: '19:45', value: 2.8 },
  { time: '20:00', value: 3.2 },
  { time: '20:15', value: 3.5 },
  { time: '20:30', value: 3.8 },
  { time: '20:45', value: 4.2, isPeak: true },
  { time: '21:00', value: 3.9 },
  { time: '21:15', value: 3.4 },
  { time: '21:30', value: 2.8 },
  { time: '21:45', value: 2.2 },
  { time: '22:00', value: 1.8 },
];

export default function UplinkTrendChart() {
  const option = {
    grid: { top: 40, right: 10, bottom: 30, left: 50 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: UPLINK_DATA.map(d => d.time),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      name: 'Gbps',
      nameTextStyle: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },
    },
    series: [
      {
        data: UPLINK_DATA.map(d => ({
          value: d.value,
          itemStyle: d.isPeak ? { color: '#FFD700' } : undefined,
        })),
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#00FF88',
          width: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 255, 136, 0.4)' },
              { offset: 1, color: 'rgba(0, 255, 136, 0)' },
            ],
          },
        },
        symbol: 'circle',
        symbolSize: (data, params) => {
          return UPLINK_DATA[params.dataIndex]?.isPeak ? 10 : 4;
        },
        markPoint: {
          data: [
            {
              coord: ['20:45', 4.2],
              value: 'Peak: 4.2Gbps\n(进球时刻)',
              itemStyle: { color: '#FFD700' },
              label: {
                show: true,
                position: 'top',
                color: '#FFD700',
                fontSize: 10,
                formatter: '{b}',
              },
            },
          ],
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(11, 26, 42, 0.9)',
      borderColor: 'rgba(0, 240, 255, 0.3)',
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: (params) => {
        const data = params[0];
        const isPeak = UPLINK_DATA[data.dataIndex]?.isPeak;
        return `
          <div style="padding: 4px;">
            <div style="color: rgba(255,255,255,0.6); font-size: 10px;">${data.name}</div>
            <div style="color: ${isPeak ? '#FFD700' : '#00FF88'}; font-weight: bold;">
              上行流量: ${data.value} Gbps
            </div>
            ${isPeak ? '<div style="color: #FFD700; font-size: 10px;">进球时刻</div>' : ''}
          </div>
        `;
      },
    },
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
