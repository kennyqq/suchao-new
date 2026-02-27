import { useEffect } from 'react';
import useDashboardStore from '../../store/useDashboardStore';

/**
 * P1 - 全局态势防御视图
 * 
 * TODO: 等待用户提供完美样式的源码
 * 当前为占位符状态
 * 
 * API 数据结构 (用于后续替换数字):
 * - p1Data.global: { resources: {stations, smartBoards, carriers3CC, emergencyCars}, prbLoad, crowdDistribution, heatmapData }
 * - p1Data.kqi: [{ label, value, unit, trend, trendData }]
 * - p1Data.flow: [{ id, from, to, volume, type, path }]
 * - p1Data.opLogs: [{ time, type, content }]
 */
export default function GlobalDefense() {
  const { p1Data, loading, fetchP1Data, fetchP1FlowData } = useDashboardStore();

  useEffect(() => {
    fetchP1Data();
    fetchP1FlowData();
  }, [fetchP1Data, fetchP1FlowData]);

  // 数据示例（后续替换为 apiData?.xxx || 默认值）
  const global = p1Data?.global || {};
  const kqi = p1Data?.kqi || [];
  const opLogs = p1Data?.opLogs || [];

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-cyber-bg">
      <div className="text-center">
        <div className="text-4xl font-bold text-cyber-cyan mb-4">P1 - 全局态势防御</div>
        <div className="text-white/60 mb-8">等待完美样式源码中...</div>
        
        {/* 数据加载状态展示 */}
        <div className="glass-panel rounded-xl p-6 max-w-2xl mx-auto text-left">
          <h3 className="text-cyber-cyan font-bold mb-4">API 数据预览 (用于后续替换):</h3>
          
          {loading?.p1 ? (
            <div className="text-white/60">加载中...</div>
          ) : (
            <div className="space-y-4 font-mono text-sm">
              <div>
                <span className="text-yellow-400">global.resources:</span>
                <pre className="text-white/70 mt-1">
                  {JSON.stringify(global?.resources, null, 2)}
                </pre>
              </div>
              <div>
                <span className="text-yellow-400">kqi[0]:</span>
                <span className="text-white/70 ml-2">
                  {kqi[0] ? `${kqi[0].label}: ${kqi[0].value} ${kqi[0].unit}` : '无数据'}
                </span>
              </div>
              <div>
                <span className="text-yellow-400">opLogs 数量:</span>
                <span className="text-white/70 ml-2">{opLogs.length}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-white/40 text-sm">
          请提供完美样式的源码，我将仅替换数字为 apiData?.xxx || 默认值
        </div>
      </div>
    </div>
  );
}
