import { motion } from 'framer-motion';
import { BarChart3, Zap, Target } from 'lucide-react';
import CyberBorder from '../../components/CyberBorder';
import VIPComparisonChart from './components/VIPComparisonChart';
import AgentContribution from './components/AgentContribution';

export default function RightPanelP3() {
  return (
    <div className="w-[380px] flex flex-col h-full gap-4">
      {/* 面板标题 */}
      <div className="flex items-center gap-2 px-2">
        <div className="w-1 h-6 bg-cyan-500 rounded-full" />
        <div>
          <h2 className="header-secondary">分层体验与智能体贡献</h2>
          <p className="decor-en">VIP Experience & Agent Value</p>
        </div>
      </div>

      {/* 模块1: VIP vs 普通用户对比 - 胶囊中心轴 */}
      <CyberBorder delay={0.1} className="flex-1">
        <div className="glass-panel rounded-lg p-4 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded bg-yellow-500/20 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-yellow-400" />
            </div>
            <h3 className="text-white font-bold text-sm">VIP vs 普通用户体验对比</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/30 to-transparent ml-2" />
          </div>
          
          <div className="text-white/40 text-xs mb-2">实测数据对比</div>
          
          <div className="flex-1 min-h-0">
            <VIPComparisonChart />
          </div>
        </div>
      </CyberBorder>

      {/* 模块2: 智能体贡献 */}
      <CyberBorder delay={0.2}>
        <div className="glass-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <h3 className="text-white font-bold text-sm">智能体贡献</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent ml-2" />
          </div>
          
          <AgentContribution />
        </div>
      </CyberBorder>

      {/* 模块3: 持续优化建议 */}
      <CyberBorder delay={0.3}>
        <div className="glass-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded bg-orange-500/20 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <h3 className="text-white font-bold text-sm">持续优化建议</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-orange-500/30 to-transparent ml-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="w-5 h-5 rounded bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-400 text-xs">1</span>
              </div>
              <div>
                <div className="text-white/80 text-xs">南看台F区扩容</div>
                <div className="text-white/40 text-[10px]">建议增加2个4T4R小区</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="w-5 h-5 rounded bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-400 text-xs">2</span>
              </div>
              <div>
                <div className="text-white/80 text-xs">VIP专席保障优化</div>
                <div className="text-white/40 text-[10px]">下一场提前15分钟预激活</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="w-5 h-5 rounded bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-400 text-xs">3</span>
              </div>
              <div>
                <div className="text-white/80 text-xs">上行干扰排查</div>
                <div className="text-white/40 text-[10px]">西区存在外部干扰源</div>
              </div>
            </div>
          </div>
        </div>
      </CyberBorder>
    </div>
  );
}
