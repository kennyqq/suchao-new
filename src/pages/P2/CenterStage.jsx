import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Wifi, Flame, UserCircle, Video, X, Phone, Mic } from 'lucide-react';

// ========== 顶部悬浮数据条 ==========
function TopInfoBar() {
  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="absolute top-6 left-1/2 -translate-x-1/2 z-20"
    >
      <div className="glass-panel rounded-full px-8 py-3 border border-white/10 flex items-center gap-8">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-white/60 text-sm">场馆人数</span>
          <span className="text-xl font-din text-white">49,700</span>
        </div>
        <div className="w-px h-6 bg-white/20" />
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-cyber-cyan" />
          <span className="text-white/60 text-sm">VIP专区</span>
          <span className="text-xl font-din text-cyber-cyan">1,700</span>
        </div>
        <div className="w-px h-6 bg-white/20" />
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-green-400" />
          <span className="text-white/60 text-sm">网络状态</span>
          <span className="text-xl font-din text-green-400">优</span>
        </div>
      </div>
    </motion.div>
  );
}

// ========== DataV 风格热点标记 ==========
function HotspotMarker({ position, label, color, isAlert, onClick, hasVideo }) {
  const colorMap = {
    red: { dot: 'bg-red-500', border: 'border-red-500/50', glow: 'shadow-red-500/50', text: 'text-red-400' },
    cyan: { dot: 'bg-cyber-cyan', border: 'border-cyber-cyan/50', glow: 'shadow-cyber-cyan/50', text: 'text-cyber-cyan' },
    green: { dot: 'bg-green-500', border: 'border-green-500/50', glow: 'shadow-green-500/50', text: 'text-green-400' },
  };
  
  const theme = colorMap[color];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5 + Math.random() * 0.2 }}
      className="absolute cursor-pointer group"
      style={{ 
        top: position.top, 
        left: position.left, 
        transform: position.transform || 'translate(-50%, -50%)' 
      }}
      onClick={onClick}
    >
      {/* 玻璃态标签 */}
      <div className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full
        bg-[rgba(11,26,42,0.85)] backdrop-blur-sm
        border ${theme.border}
        transition-all duration-300
        group-hover:bg-[rgba(11,26,42,0.95)] group-hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]
      `}>
        {/* 脉冲指示点 */}
        <span className={`relative w-2 h-2 rounded-full ${theme.dot}`}>
          <span className={`absolute inset-0 rounded-full ${theme.dot} animate-ping opacity-75`} style={{ animationDuration: '2s' }} />
        </span>
        
        {/* 标签文字 */}
        <span className={`text-xs font-medium ${theme.text} whitespace-nowrap`}>
          {label}
        </span>
        
        {/* 视频图标 */}
        {hasVideo && <Video className="w-3 h-3 text-white/60" />}
      </div>
    </motion.div>
  );
}

// ========== 南看台 F区画像弹窗 ==========
function ZoneProfileModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const metrics = [
    { label: '当前人数', value: '2,000', unit: '人', color: 'text-cyber-cyan' },
    { label: '流量密度', value: '高', unit: '', color: 'text-yellow-400' },
    { label: '拥塞度', value: '85', unit: '%', color: 'text-red-400' },
    { label: '平均速率', value: '45', unit: 'Mbps', color: 'text-green-400' },
  ];

  const users = [
    { label: 'VIP用户', value: '45人 (2.3%)', color: 'text-yellow-400' },
    { label: '全球通用户', value: '380人 (19%)', color: 'text-cyber-cyan' },
    { label: '普通用户', value: '1,575人 (78.7%)', color: 'text-white/80' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* 弹窗 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[360px]"
          >
            <div className="glass-panel rounded-xl border border-cyber-cyan/30 overflow-hidden">
              {/* 头部 */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">南看台 F区画像</h3>
                    <p className="text-xs text-white/40">Zone F Profile</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-1 rounded hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* 内容 */}
              <div className="p-4 space-y-4">
                {/* 2x2 指标网格 */}
                <div className="grid grid-cols-2 gap-3">
                  {metrics.map((item) => (
                    <div key={item.label} className="bg-white/5 rounded-lg p-3 text-center">
                      <div className="text-xs text-white/50 mb-1">{item.label}</div>
                      <div className={`text-xl font-din ${item.color}`}>
                        {item.value}<span className="text-xs ml-0.5">{item.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 警告横幅 */}
                <div className="bg-red-900/40 border border-red-500/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-medium text-red-400">拥塞警告</span>
                  </div>
                  <p className="text-xs text-white/60">建议启动负载均衡策略</p>
                </div>

                {/* 用户构成 */}
                <div>
                  <div className="text-xs text-white/50 mb-2">用户构成</div>
                  <div className="space-y-2">
                    {users.map((item) => (
                      <div key={item.label} className="flex justify-between items-center">
                        <span className="text-sm text-white/70">{item.label}</span>
                        <span className={`text-sm font-medium ${item.color}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ========== WeLink 视频通话弹窗 ==========
function VideoCallModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
            onClick={onClose}
          />
          
          {/* 弹窗 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[800px] h-[450px]"
          >
            <div className="glass-panel rounded-xl border border-cyber-cyan/30 overflow-hidden h-full flex flex-col">
              {/* 头部 */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-sm text-green-400">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    实时连线中
                  </span>
                  <span className="text-white/20">|</span>
                  <h3 className="text-lg font-semibold text-white">南看台保障专员 - 张三</h3>
                </div>
                <button onClick={onClose} className="p-1.5 rounded hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* 内容区域 - 左右分割 */}
              <div className="flex-1 flex">
                {/* 左侧面板 */}
                <div className="w-1/2 p-6 flex flex-col items-center justify-center relative">
                  {/* 头像 */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyber-cyan/30 to-cyber-cyan/10 border-2 border-cyber-cyan/50 flex items-center justify-center">
                      <UserCircle className="w-12 h-12 text-cyber-cyan" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-slate-900 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl font-semibold text-white">张三</div>
                    <div className="text-sm text-white/50 mt-1">南看台保障专员</div>
                  </div>

                  {/* 网速对比卡片 */}
                  <div className="absolute bottom-6 left-6 right-6 glass-panel rounded-lg p-4 border border-white/10">
                    <div className="text-xs text-white/40 mb-3">实时网速实测</div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-white/70">移动 5G</span>
                          <span className="text-lg font-din text-green-400">800 Mbps</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full w-[80%] bg-gradient-to-r from-cyber-cyan to-green-400 rounded-full" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-white/50">联通 5G (对比)</span>
                          <span className="text-sm font-din text-white/50">400 Mbps</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full w-[40%] bg-white/20 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右侧面板 - 视频区域 */}
                <div className="w-1/2 bg-slate-800/80 relative flex flex-col items-center justify-center">
                  {/* 视频占位 */}
                  <div className="flex flex-col items-center text-white/30">
                    <Video className="w-16 h-16 mb-3" />
                    <span className="text-sm">本地视频</span>
                  </div>

                  {/* 控制按钮 */}
                  <div className="absolute bottom-6 right-6 flex items-center gap-4">
                    <button className="w-12 h-12 rounded-full bg-gray-700/80 hover:bg-gray-600 flex items-center justify-center transition-colors">
                      <Mic className="w-5 h-5 text-white" />
                    </button>
                    <button 
                      onClick={onClose}
                      className="flex items-center gap-2 px-4 py-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                    >
                      <Phone className="w-5 h-5 text-white" />
                      <span className="text-sm text-white font-medium">结束通话</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ========== 主组件 ==========
export default function CenterStage() {
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* 底层背景 */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(/stadium-bg.jpg)',
          backgroundColor: '#0B1A2A'
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* 顶部悬浮数据条 */}
      <TopInfoBar />

      {/* 交互热点层 - 严格对齐背景 */}
      <div className="absolute inset-0">
        {/* 南看台 F区 - 红圈位置（左上方看台） */}
        <HotspotMarker 
          position={{ top: '38%', left: '35%' }}
          label="南看台 F区"
          color="red"
          isAlert={true}
          onClick={() => setZoneModalOpen(true)}
        />
        
        {/* 西看台 VIP */}
        <HotspotMarker 
          position={{ top: '50%', left: '18%' }}
          label="西看台 VIP"
          color="cyan"
        />
        
        {/* 东看台 A区 */}
        <HotspotMarker 
          position={{ top: '48%', left: '82%' }}
          label="东看台 A区"
          color="cyan"
        />

        {/* 保障专员张三 - 黄圈位置（右侧中层看台） */}
        <HotspotMarker 
          position={{ top: '42%', left: '68%' }}
          label="保障专员：张三"
          color="green"
          hasVideo={true}
          onClick={() => setVideoModalOpen(true)}
        />
      </div>

      {/* 底部渐变遮罩 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B1A2A] to-transparent" />

      {/* 弹窗 */}
      <ZoneProfileModal isOpen={zoneModalOpen} onClose={() => setZoneModalOpen(false)} />
      <VideoCallModal isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)} />
    </div>
  );
}
