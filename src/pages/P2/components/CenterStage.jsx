import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video } from 'lucide-react';
import VideoModal from './VideoModal';
import SideDetailPanel from './SideDetailPanel';

export default function CenterStage() {
  const [showVideo, setShowVideo] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 1. 背景图层：体育场内部图片 */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/stadium_internal_view.jpg')",
          filter: "brightness(0.65) contrast(1.1)",
        }} 
      />

      {/* 暗角效果 */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* 2. 南看台热力块 - 3D透视效果贴合看台 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-[18%] left-[40%] w-[220px] h-[120px] cursor-pointer"
        style={{
          perspective: '800px',
        }}
        onClick={() => setShowDetail(true)}
      >
        {/* 3D透视红区 - 贴合看台角度 */}
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-red-500"
          animate={{
            opacity: [0.4, 0.7, 0.4],
            boxShadow: [
              '0 0 30px rgba(255, 51, 51, 0.4)',
              '0 0 60px rgba(255, 51, 51, 0.7)',
              '0 0 30px rgba(255, 51, 51, 0.4)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ 
            transform: 'perspective(600px) rotateX(50deg) rotateY(-5deg) rotateZ(-2deg)',
            transformOrigin: 'center bottom',
            backgroundColor: 'rgba(255, 51, 51, 0.5)',
            mixBlendMode: 'overlay',
          }}
        />
        
        {/* 标签 */}
        <motion.div 
          className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center gap-1.5 bg-red-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
            <span>🔥</span>
            <span>南看台 F 区 (点击查看)</span>
          </div>
        </motion.div>
      </motion.div>

      {/* 3. 保障专员图标 - 带摄像头+脉冲动画 */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
        className="absolute bottom-[15%] left-[55%] cursor-pointer group"
        onClick={() => setShowVideo(true)}
      >
        {/* 脉冲光环 */}
        <motion.div
          className="absolute w-4 h-4 rounded-full bg-green-500"
          animate={{
            scale: [1, 2.5, 2.5, 1],
            opacity: [0.8, 0.2, 0, 0.8],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        />
        
        {/* 专员图标 */}
        <div className="relative w-10 h-10 rounded-full bg-green-500/80 flex items-center justify-center border-2 border-white shadow-[0_0_20px_rgba(0,255,0,0.5)] group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>

        {/* 专员名称标签 - 带摄像头图标 */}
        <motion.div 
          className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="text-green-400 font-mono text-sm bg-black/80 px-3 py-1.5 rounded border border-green-500/50 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>保障专员: 张三</span>
            {/* 摄像头图标 + 脉冲动画 */}
            <div className="relative flex items-center justify-center">
              <Video className="w-4 h-4 text-green-400" />
              {/* 脉冲环效果 */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-green-400"
                animate={{
                  scale: [1, 1.8, 1.8],
                  opacity: [1, 0.3, 0],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* 4. 顶部状态栏 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-panel rounded-full px-8 py-2 flex items-center gap-6 z-10">
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-2.5 h-2.5 rounded-full bg-cyber-gold"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-white/80 text-sm">场馆人数: <span className="text-cyber-gold font-bold">49,700</span></span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-2.5 h-2.5 rounded-full bg-cyber-cyan"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <span className="text-white/80 text-sm">VIP专区: <span className="text-cyber-cyan font-bold">1,700</span></span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-2.5 h-2.5 rounded-full bg-green-400"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
          <span className="text-white/80 text-sm">网络状态: <span className="text-green-400 font-bold">优</span></span>
        </div>
      </div>

      {/* 5. 弹窗组件 */}
      <AnimatePresence>
        {showDetail && (
          <SideDetailPanel onClose={() => setShowDetail(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVideo && (
          <VideoModal onClose={() => setShowVideo(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
