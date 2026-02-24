import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import TimelineV3 from './components/TimelineV3';

// P0 宏观溯源
import LeftPanelP0 from './components/LeftPanel';
import RightPanelP0 from './components/RightPanel';
import MacroMigrationMap from './components/MacroMigrationMap';

// P1 全局防御
import AmapL7Scene from './pages/P1/AmapL7Scene';
import LeftPanelP1 from './pages/P1/LeftPanelP1';
import RightPanelP1 from './pages/P1/RightPanelP1';
import SiteDetailModal from './pages/P1/components/SiteDetailModal';

// P2 场内微观
import VenueMicro from './pages/P2/VenueMicro';

// P3 评估闭环
import EvaluationView from './pages/P3/EvaluationView';

import { useState } from 'react';

// P0 宏观溯源视图
function MacroOriginView() {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden pb-20">
        <LeftPanelP0 />
        
        {/* 中央地图区域 */}
        <div className="flex-1 flex flex-col relative py-2">
          <motion.div 
            initial={{ y: -20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.3 }} 
            className="text-center mb-1 flex-shrink-0"
          >
            <div className="text-cyber-gold text-lg font-bold tracking-[0.3em]" style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}>
              "一张网，火一座城"
            </div>
          </motion.div>

          {/* 地图容器 */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }} 
            className="flex-1 relative mx-2 min-h-0"
          >
            <div className="absolute inset-0 rounded-xl overflow-visible border border-cyber-cyan/20 corner-bracket">
              <span className="corner-bl" />
              <span className="corner-br" />
              <MacroMigrationMap />
            </div>
          </motion.div>
        </div>

        <RightPanelP0 />
      </div>
    </div>
  );
}

// P1 全局防御视图
function GlobalDefense() {
  const [selectedStation, setSelectedStation] = useState(null);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-20" 
          style={{ background: 'radial-gradient(circle, rgba(0, 240, 255, 0.1) 0%, transparent 50%)' }} 
        />
      </div>

      {/* 主内容区 */}
      <div className="relative z-10 flex flex-col h-full pb-20">
        <div className="flex-1 flex overflow-hidden">
          <LeftPanelP1 />

          {/* C位数字孪生地图 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col relative"
          >
            {/* 顶部标语 */}
            <div className="text-center py-3">
              <motion.div 
                className="text-cyber-cyan text-xl font-bold tracking-[0.4em]"
                style={{ textShadow: '0 0 30px rgba(0, 240, 255, 0.3)' }}
              >
                "看得清态势，防得住隐患"
              </motion.div>
            </div>

            {/* 地图容器 */}
            <div className="flex-1 relative mx-3 rounded-2xl overflow-hidden border border-cyber-cyan/20 corner-bracket" 
              style={{ boxShadow: '0 0 50px rgba(0, 240, 255, 0.1), inset 0 0 100px rgba(0, 240, 255, 0.03)' }}
            >
              <span className="absolute top-0 left-0 w-6 h-6 border-l border-t border-cyber-cyan/60 z-10" />
              <span className="absolute top-0 right-0 w-6 h-6 border-r border-t border-cyber-cyan/60 z-10" />
              <span className="absolute bottom-0 left-0 w-6 h-6 border-l border-b border-cyber-cyan/60 z-10" />
              <span className="absolute bottom-0 right-0 w-6 h-6 border-r border-b border-cyber-cyan/60 z-10" />
              
              <AmapL7Scene onStationClick={setSelectedStation} />
            </div>
          </motion.div>

          <RightPanelP1 />
        </div>
      </div>

      {/* 站点详情模态框 */}
      <SiteDetailModal 
        station={selectedStation} 
        onClose={() => setSelectedStation(null)} 
      />
    </div>
  );
}

// 动画包装组件
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MacroOriginView />} />
        <Route path="/p0" element={<MacroOriginView />} />
        <Route path="/p1" element={<GlobalDefense />} />
        <Route path="/p2" element={<VenueMicro />} />
        <Route path="/p3" element={<EvaluationView />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="w-full h-screen bg-cyber-bg overflow-hidden flex flex-col">
        <Header />
        
        <div className="flex-1 relative">
          <AnimatedRoutes />
        </div>

        {/* 底部全局回放条 */}
        <TimelineV3 onTimeChange={(time) => console.log('Time changed:', time)} />
      </div>
    </Router>
  );
}
