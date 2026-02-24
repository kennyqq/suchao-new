import { motion } from 'framer-motion';
import { X, Wifi, Video, Mic, PhoneOff } from 'lucide-react';
import CountUp from 'react-countup';

export default function VideoModal({ onClose }) {
  return (
    <>
      {/* 遮罩层 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* 视频通话窗口 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-[800px] h-[500px] glass-panel rounded-2xl border border-cyber-cyan/40 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-20 px-5 py-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/50">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-sm font-medium">实时连线中</span>
                </div>
                <span className="text-white/80 text-sm">南看台保障专员 - 张三</span>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* 视频画面区域 - 分屏 */}
          <div className="absolute inset-0 flex">
            {/* 左侧：专员画面 */}
            <div className="flex-1 relative bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
              {/* 模拟视频背景 */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: 'url(/stadium_internal_view.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'grayscale(100%)',
                }}
              />
              
              {/* 专员头像占位 */}
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 rounded-full bg-green-500/30 border-4 border-green-500 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div className="text-white font-bold text-lg">张三</div>
                <div className="text-white/50 text-sm">南看台保障专员</div>
              </div>

              {/* 网络测速数据 - 移动 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-20 left-6 p-4 rounded-xl bg-black/80 border border-green-500/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-xs font-bold">移动 5G</span>
                </div>
                <div className="font-orbitron text-2xl font-bold text-green-400">
                  <CountUp end={800} duration={2} />
                  <span className="text-sm ml-1">Mbps</span>
                </div>
                <div className="text-white/50 text-xs mt-1">下载速度实测</div>
              </motion.div>

              {/* 网络测速数据 - 联通对比 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-6 left-6 p-3 rounded-lg bg-black/60 border border-white/20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Wifi className="w-3 h-3 text-white/50" />
                  <span className="text-white/50 text-xs">联通 5G (对比)</span>
                </div>
                <div className="font-orbitron text-xl font-bold text-white/50">
                  <CountUp end={400} duration={2} />
                  <span className="text-sm ml-1">Mbps</span>
                </div>
              </motion.div>
            </div>

            {/* 右侧：本地画面 */}
            <div className="w-[240px] bg-gray-900 border-l border-white/10 flex flex-col">
              <div className="flex-1 flex items-center justify-center relative">
                <div className="text-center text-white/30">
                  <Video className="w-12 h-12 mx-auto mb-2" />
                  <span className="text-sm">本地视频</span>
                </div>
              </div>
              
              {/* 控制按钮 */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center justify-center gap-4">
                  <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    <Mic className="w-5 h-5 text-white" />
                  </button>
                  <button 
                    onClick={onClose}
                    className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                  >
                    <PhoneOff className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 底部信息栏 */}
          <div className="absolute bottom-0 left-0 right-0 px-5 py-3 bg-gradient-to-t from-black/90 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-white/50">
                <span>通话时长: 02:35</span>
                <span>信号强度: -72dBm</span>
                <span>延迟: 12ms</span>
              </div>
              <div className="text-white/30 text-xs">
                WeLink 视频通话
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
