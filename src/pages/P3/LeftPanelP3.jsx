import { motion } from 'framer-motion';
import { Crown, Package, TrendingUp, Upload, History, MessageSquare } from 'lucide-react';
import CyberBorder from '../../components/CyberBorder';
import UplinkTrendChart from './components/UplinkTrendChart';
import VIPCareCard from './components/VIPCareCard';
import PanoramaPlayback from './components/PanoramaPlayback';

const vipMetrics = [
  { 
    label: '钻白卡用户', 
    sublabel: '重保VIP',
    value: '3,241', 
    unit: '人', 
    icon: Crown,
    color: '#E5E4E2',
    bgColor: 'from-gray-300/20 to-gray-500/20',
    borderColor: 'border-gray-400/30'
  },
  { 
    label: '5G-A场馆包', 
    sublabel: '销量',
    value: '850', 
    unit: '份', 
    icon: Package,
    color: '#FFD700',
    bgColor: 'from-yellow-400/20 to-yellow-600/20',
    borderColor: 'border-yellow-500/30'
  },
];

export default function LeftPanelP3() {
  return (
    <div className="w-[380px] flex flex-col h-full gap-4">
      {/* 面板标题 */}
      <div className="flex items-center gap-2 px-2">
        <div className="w-1 h-6 bg-yellow-500 rounded-full" />
        <div>
          <h2 className="header-secondary" style={{ color: '#FFD700' }}>经营变现与赛后关怀</h2>
          <p className="decor-en">Post-Match Care & Analytics</p>
        </div>
      </div>

      {/* 模块1: 核心价值用户 - 2x2 网格 */}
      <CyberBorder delay={0.1}>
        <div className="glass-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-yellow-500/20 flex items-center justify-center">
              <Crown className="w-3.5 h-3.5 text-yellow-400" />
            </div>
            <h3 className="text-white font-bold text-sm">核心价值用户</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/30 to-transparent ml-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {vipMetrics.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl bg-gradient-to-br ${item.bgColor} border ${item.borderColor}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  <span className="text-white/70 text-xs">{item.label}</span>
                </div>
                <div className="text-white/50 text-[10px] mb-1">{item.sublabel}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-orbitron" style={{ color: item.color }}>
                    {item.value}
                  </span>
                  <span className="text-white/60 text-sm">{item.unit}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CyberBorder>

      {/* 模块2: 现场上行流量趋势 */}
      <CyberBorder delay={0.2}>
        <div className="glass-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded bg-cyan-500/20 flex items-center justify-center">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <h3 className="text-white font-bold text-sm">现场上行流量趋势</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent ml-2" />
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-white/50 text-xs mb-1">用户分享活跃度 (网络数据)</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-cyan-400 font-orbitron">Peak: 4.2</span>
                <span className="text-cyan-400 text-sm">Gbps</span>
                <span className="text-green-400 text-xs flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  峰值时刻
                </span>
              </div>
            </div>
          </div>
          
          <div className="h-[120px]">
            <UplinkTrendChart />
          </div>
          
          <div className="mt-2 text-center">
            <span className="text-white/40 text-xs">峰值时刻: 20:45 (进球时刻)</span>
          </div>
        </div>
      </CyberBorder>

      {/* 模块3: 全景回放 */}
      <CyberBorder delay={0.3}>
        <div className="glass-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded bg-yellow-500/20 flex items-center justify-center">
              <History className="w-3.5 h-3.5 text-yellow-400" />
            </div>
            <h3 className="text-white font-bold text-sm">全景回放</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/30 to-transparent ml-2" />
          </div>
          
          <div className="h-[200px]">
            <PanoramaPlayback />
          </div>
        </div>
      </CyberBorder>
      
      {/* 模块4: VIP赛后关怀 - 手机通知样式 */}
      <CyberBorder delay={0.4} className="flex-1">
        <div className="glass-panel rounded-lg p-4 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5 text-green-400" />
            </div>
            <h3 className="text-white font-bold text-sm">权益体验报告</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-green-500/30 to-transparent ml-2" />
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <VIPCareCard />
          </div>
        </div>
      </CyberBorder>
    </div>
  );
}
