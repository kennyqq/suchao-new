import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Target, Activity, Bot, Shield, Zap, FileText, Download, RefreshCw, ChevronRight, Loader2 } from 'lucide-react';
import { fetchEvaluationReport } from '../../api/dashboard.js';

// 默认战报数据
const DEFAULT_REPORT = {
  match: { date: '5月2日', home: '南京', away: '常州', score: '2:1', venue: '南京奥体中心' },
  coreMetrics: {
    peakAttendance: { value: 65328, unit: '人', label: '奥体球迷峰值' },
    peakTraffic: { value: 15.8, unit: 'TB', label: '峰值话务量' },
    packages5GA: { value: 850, unit: '份', label: '5G-A 场馆包销量' }
  },
  vipMetrics: { diamondUsers: 3241, packagesSold: 850 },
  uplinkTrend: [
    { time: '19:00', value: 1.2 }, { time: '19:15', value: 1.5 }, { time: '19:30', value: 2.1 },
    { time: '19:45', value: 2.8 }, { time: '20:00', value: 3.2 }, { time: '20:15', value: 3.5 },
    { time: '20:30', value: 3.8 }, { time: '20:45', value: 4.2, isPeak: true },
    { time: '21:00', value: 3.9 }, { time: '21:15', value: 3.4 }, { time: '21:30', value: 2.8 },
    { time: '21:45', value: 2.2 }, { time: '22:00', value: 1.8 }
  ],
  agentContributions: [
    { label: '智能体自动优化', value: '156 次', desc: '参数自适应调整', trend: '+12% 效率提升', icon: Bot },
    { label: '潜在隐患拦截', value: '23 起', desc: '拥塞风险预警', trend: '0 故障发生', icon: Shield },
    { label: 'VIP感知保障', value: '100%', desc: '钻白卡用户零投诉', trend: '满意度 4.9/5', icon: Activity },
    { label: '资源智能调度', value: '4.2x', desc: '动态负载均衡', trend: '峰值承载提升', icon: Zap }
  ],
  suggestions: [
    { id: 1, title: '南看台F区扩容', desc: '建议增加2个4T4R小区', priority: 'high' },
    { id: 2, title: 'VIP专席保障优化', desc: '下一场提前15分钟预激活', priority: 'medium' },
    { id: 3, title: '上行干扰排查', desc: '西区存在外部干扰源', priority: 'medium' }
  ],
  assuranceLevel: 'S'
};

export default function EvaluationView() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchEvaluationReport();
        // 数据格式防御：确保数据有效
        if (data && typeof data === 'object') {
          setReportData(data);
        } else {
          console.warn('[EvaluationView] API 返回无效数据，使用默认值');
          setReportData(DEFAULT_REPORT);
        }
      } catch (err) {
        console.error('[EvaluationView] 加载数据失败:', err);
        setError(err.message);
        // 使用默认数据作为 fallback
        setReportData(DEFAULT_REPORT);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatNumber = (num) => new Intl.NumberFormat('zh-CN').format(num || 0);

  // ========== Loading 拦截器（最关键）==========
  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center text-cyan-400">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <div className="text-lg font-medium">数据加载中...</div>
        </div>
      </div>
    );
  }

  // ========== 数据不存在时的保护 ==========
  if (!reportData) {
    return (
      <div className="flex h-full w-full items-center justify-center text-yellow-400">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">数据加载失败</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/50 hover:bg-cyan-500/30 transition-colors"
          >
            刷新重试
          </button>
        </div>
      </div>
    );
  }

  // ========== 安全获取数据（带可选链和默认值）==========
  const match = reportData?.match || DEFAULT_REPORT.match;
  const coreMetrics = reportData?.coreMetrics || DEFAULT_REPORT.coreMetrics;
  const vipMetrics = reportData?.vipMetrics || DEFAULT_REPORT.vipMetrics;
  const uplinkTrend = reportData?.uplinkTrend || DEFAULT_REPORT.uplinkTrend;
  const agentContributions = reportData?.agentContributions || DEFAULT_REPORT.agentContributions;
  const suggestions = reportData?.suggestions || DEFAULT_REPORT.suggestions;
  const assuranceLevel = reportData?.assuranceLevel || 'S';

  return (
    <div className="h-full flex flex-col gap-4 p-4 overflow-y-auto">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              {match?.home || '南京'} {match?.score || '2:1'} {match?.away || '常州'}
              <span className="text-lg text-white/60 font-normal">{match?.date || '5月2日'}</span>
            </h1>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>{match?.venue || '南京奥体中心'}</span>
              <span className="px-2 py-0.5 bg-cyan-500/20 rounded text-cyan-400 text-xs font-medium">
                {assuranceLevel} 级保障
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="bg-white/10 px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/20 flex items-center gap-2 transition-all">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>
          <button className="bg-cyan-500/20 px-4 py-2 rounded-lg text-cyan-400 hover:bg-cyan-500/30 flex items-center gap-2 transition-all border border-cyan-500/30">
            <Download className="w-4 h-4" /> 导出报告
          </button>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-white/60 text-sm">{coreMetrics?.peakAttendance?.label || '奥体球迷峰值'}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{formatNumber(coreMetrics?.peakAttendance?.value)}</span>
            <span className="text-white/50 text-lg">{coreMetrics?.peakAttendance?.unit || '人'}</span>
          </div>
        </div>

        <div className="bg-white/5 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-white/60 text-sm">{coreMetrics?.peakTraffic?.label || '峰值话务量'}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{coreMetrics?.peakTraffic?.value || '15.8'}</span>
            <span className="text-white/50 text-lg">{coreMetrics?.peakTraffic?.unit || 'TB'}</span>
          </div>
        </div>

        <div className="bg-white/5 border border-yellow-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-white/60 text-sm">{coreMetrics?.packages5GA?.label || '5G-A 场馆包'}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{formatNumber(coreMetrics?.packages5GA?.value)}</span>
            <span className="text-white/50 text-lg">{coreMetrics?.packages5GA?.unit || '份'}</span>
          </div>
        </div>
      </div>

      {/* VIP 保障卡片 */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/30 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="text-yellow-400 font-medium mb-1">VIP 尊享感知保障</div>
              <div className="text-white/60 text-sm">钻白卡用户专属网络通道 • 高优先级QoS调度</div>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{formatNumber(vipMetrics?.diamondUsers)}</div>
              <div className="text-white/50 text-xs">钻白卡用户</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{formatNumber(vipMetrics?.packagesSold)}</div>
              <div className="text-white/50 text-xs">场馆包销量</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">0</div>
              <div className="text-white/50 text-xs">投诉数量</div>
            </div>
          </div>
        </div>
      </div>

      {/* 智能体战报 & 上行趋势 */}
      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        {/* 智能体贡献 */}
        <div className="bg-white/5 border border-cyan-500/20 rounded-xl p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <h2 className="text-white font-bold text-lg">智能体战报</h2>
          </div>
          
          <div className="space-y-3 flex-1 overflow-y-auto">
            {(agentContributions || []).map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  {item?.icon && <item.icon className="w-5 h-5 text-cyan-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium mb-1">{item?.label || '-'}</div>
                  <div className="text-white/50 text-sm">{item?.desc || '-'}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold text-xl">{item?.value || '-'}</div>
                  <div className="text-white/40 text-xs">{item?.trend || ''}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 上行流量趋势 */}
        <div className="bg-white/5 border border-cyan-500/20 rounded-xl p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <h2 className="text-white font-bold text-lg">上行流量趋势</h2>
            <div className="ml-auto text-cyan-400 font-bold text-xl">峰值 4.2x</div>
          </div>
          
          <div className="flex-1 flex items-end gap-1 min-h-[150px]">
            {(uplinkTrend || []).map((item, index) => {
              const height = ((item?.value || 0) / 4.5) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full rounded-t ${item?.isPeak ? 'bg-yellow-400' : 'bg-cyan-400/60'}`}
                    style={{ height: `${Math.max(height, 4)}%`, minHeight: '4px' }}
                  />
                  {index % 2 === 0 && (
                    <div className="text-[10px] text-white/40 mt-1">{item?.time || ''}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 后续建议 */}
      <div className="bg-white/5 border border-cyan-500/20 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <h2 className="text-white font-bold text-lg">下一场次优化建议</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {(suggestions || []).map((item) => (
            <div
              key={item?.id || Math.random()}
              className="p-4 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded text-xs ${
                  item?.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                  item?.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {item?.priority === 'high' ? '高' : item?.priority === 'medium' ? '中' : '低'}优先级
                </span>
                <ChevronRight className="w-4 h-4 text-white/30" />
              </div>
              <div className="text-white font-medium mb-1">{item?.title || '-'}</div>
              <div className="text-white/50 text-sm">{item?.desc || '-'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
