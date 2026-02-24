import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 8个基站位置（调整位置以匹配亚运会参考图布局）
const baseStations = [
  { id: 1, x: 28, y: 32, name: '奥体中心站' },
  { id: 2, x: 38, y: 28, name: '北门站' },
  { id: 3, x: 48, y: 24, name: '东广场站' },
  { id: 4, x: 58, y: 28, name: '南门站' },
  { id: 5, x: 68, y: 32, name: '西广场站' },
  { id: 6, x: 33, y: 48, name: '商业区站' },
  { id: 7, x: 52, y: 52, name: '中心站' },
  { id: 8, x: 72, y: 46, name: '停车场站' },
];

const smartBoardCenter = { x: 50, y: 38 };

const emergencyVehicles = [
  { id: 1, x: 18, y: 65, name: '应急车-1' },
  { id: 2, x: 82, y: 65, name: '应急车-2' },
];

const riskZone = { x: 50, y: 18, width: 20, height: 14 };

export default function DigitalTwinMap({ currentTime, onStationClick }) {
  const [hoveredStation, setHoveredStation] = useState(null);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Base Layer - 亚运会风格3D夜景 */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 40%, rgba(0, 150, 255, 0.15) 0%, transparent 60%),
            radial-gradient(ellipse at 30% 70%, rgba(0, 240, 255, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 70%, rgba(0, 240, 255, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 20%, rgba(255, 215, 0, 0.05) 0%, transparent 40%),
            linear-gradient(180deg, #050a14 0%, #0a1424 40%, #080c18 100%)
          `,
        }}
      >
        {/* 3D 建筑轮廓 - 亚运会风格 */}
        <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="buildingGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a3a5c" />
              <stop offset="50%" stopColor="#0d1f33" />
              <stop offset="100%" stopColor="#050a14" />
            </linearGradient>
            <linearGradient id="buildingGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2a4a6c" />
              <stop offset="100%" stopColor="#0a1424" />
            </linearGradient>
            <filter id="buildingGlow">
              <feGaussianBlur stdDeviation="0.3" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* 主体育场 - 椭圆造型 */}
          <ellipse cx="50" cy="48" rx="18" ry="14" fill="url(#buildingGrad1)" stroke="rgba(0,240,255,0.3)" strokeWidth="0.4" filter="url(#buildingGlow)"/>
          <ellipse cx="50" cy="46" rx="15" ry="11" fill="none" stroke="rgba(0,150,255,0.2)" strokeWidth="0.2"/>
          
          {/* 场馆建筑群 - 立体块 */}
          {/* 左侧建筑群 */}
          <polygon points="15,35 22,30 22,50 15,55" fill="url(#buildingGrad2)" stroke="rgba(0,240,255,0.15)" strokeWidth="0.2"/>
          <polygon points="22,30 28,28 28,48 22,50" fill="url(#buildingGrad1)" stroke="rgba(0,240,255,0.1)" strokeWidth="0.2"/>
          <rect x="12" y="55" width="10" height="18" fill="url(#buildingGrad2)" stroke="rgba(0,240,255,0.1)" strokeWidth="0.2"/>
          
          {/* 右侧建筑群 */}
          <polygon points="78,30 85,35 85,55 78,50" fill="url(#buildingGrad2)" stroke="rgba(0,240,255,0.15)" strokeWidth="0.2"/>
          <polygon points="72,28 78,30 78,50 72,48" fill="url(#buildingGrad1)" stroke="rgba(0,240,255,0.1)" strokeWidth="0.2"/>
          <rect x="78" y="52" width="10" height="20" fill="url(#buildingGrad2)" stroke="rgba(0,240,255,0.1)" strokeWidth="0.2"/>
          
          {/* 高层建筑 */}
          <rect x="5" y="25" width="6" height="35" fill="url(#buildingGrad1)" stroke="rgba(0,240,255,0.1)" strokeWidth="0.2"/>
          <rect x="89" y="28" width="6" height="32" fill="url(#buildingGrad1)" stroke="rgba(0,240,255,0.1)" strokeWidth="0.2"/>
        </svg>

        {/* 发光道路网格 */}
        <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <filter id="roadGlow">
              <feGaussianBlur stdDeviation="0.8" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* 主干道 */}
          <line x1="0" y1="55" x2="100" y2="55" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="0.8" filter="url(#roadGlow)"/>
          <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="0.8" filter="url(#roadGlow)"/>
          {/* 次干道 */}
          <line x1="25" y1="0" x2="75" y2="100" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="0.4"/>
          <line x1="75" y1="0" x2="25" y2="100" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="0.4"/>
          {/* 环形路 */}
          <ellipse cx="50" cy="48" rx="22" ry="18" fill="none" stroke="rgba(0, 240, 255, 0.12)" strokeWidth="0.3"/>
        </svg>
      </div>

      {/* Risk Zone - North Plaza (Red Pulsing Border) */}
      <div
        className="absolute rounded-lg border-2"
        style={{
          left: `${riskZone.x - riskZone.width/2}%`,
          top: `${riskZone.y - riskZone.height/2}%`,
          width: `${riskZone.width}%`,
          height: `${riskZone.height}%`,
          background: 'rgba(255, 51, 51, 0.06)',
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-red-500"
          animate={{
            opacity: [0.4, 1, 0.4],
            boxShadow: [
              '0 0 15px rgba(255, 51, 51, 0.3), inset 0 0 15px rgba(255, 51, 51, 0.1)',
              '0 0 40px rgba(255, 51, 51, 0.6), inset 0 0 30px rgba(255, 51, 51, 0.2)',
              '0 0 15px rgba(255, 51, 51, 0.3), inset 0 0 15px rgba(255, 51, 51, 0.1)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Floating Warning Bubble */}
        <motion.div 
          className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center gap-1.5 bg-red-500/90 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg shadow-red-500/30">
            <span className="text-base">⚠️</span>
            <span>高密预警 (High Density)</span>
          </div>
        </motion.div>
      </div>

      {/* Smart Board Center - 核心节点 */}
      <div
        className="absolute z-20"
        style={{
          left: `${smartBoardCenter.x}%`,
          top: `${smartBoardCenter.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* 外层光环 */}
        <motion.div 
          className="absolute w-20 h-20 rounded-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
          style={{
            border: '1px solid rgba(0, 240, 255, 0.3)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div 
          className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.4), rgba(0, 150, 255, 0.2))',
            border: '2px solid rgba(0, 240, 255, 0.9)',
            boxShadow: '0 0 40px rgba(0, 240, 255, 0.6), inset 0 0 20px rgba(0, 240, 255, 0.3)',
          }}
          whileHover={{ scale: 1.15 }}
          animate={{ 
            boxShadow: [
              '0 0 25px rgba(0, 240, 255, 0.5), inset 0 0 15px rgba(0, 240, 255, 0.2)',
              '0 0 50px rgba(0, 240, 255, 0.8), inset 0 0 30px rgba(0, 240, 255, 0.4)',
              '0 0 25px rgba(0, 240, 255, 0.5), inset 0 0 15px rgba(0, 240, 255, 0.2)',
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <svg className="w-8 h-8 text-cyber-cyan" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </motion.div>
        {/* Label */}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-cyber-cyan text-xs font-bold bg-black/60 px-2 py-0.5 rounded border border-cyber-cyan/30">智能板</span>
        </div>
      </div>

      {/* 8 Base Stations with Dashed Lines to Smart Board */}
      {baseStations.map((station) => (
        <div key={station.id}>
          {/* Dashed Connection Line with Flow Animation */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
            <defs>
              <linearGradient id={`lineGrad-${station.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0, 240, 255, 0.05)" />
                <stop offset="50%" stopColor="rgba(0, 255, 136, 0.8)" />
                <stop offset="100%" stopColor="rgba(0, 240, 255, 0.05)" />
              </linearGradient>
            </defs>
            <motion.line
              x1={`${station.x}%`}
              y1={`${station.y}%`}
              x2={`${smartBoardCenter.x}%`}
              y2={`${smartBoardCenter.y}%`}
              stroke={`url(#lineGrad-${station.id})`}
              strokeWidth="2"
              strokeDasharray="4,2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: station.id * 0.1 }}
            />
            {/* Flowing dot */}
            <motion.circle r="3" fill="#00FF88" filter="drop-shadow(0 0 6px #00FF88)">
              <animateMotion
                dur={`${2 + station.id * 0.2}s`}
                repeatCount="indefinite"
                path={`M ${station.x} ${station.y} L ${smartBoardCenter.x} ${smartBoardCenter.y}`}
              />
            </motion.circle>
          </svg>
          
          {/* Base Station Icon - 亚运会风格绿色图标 */}
          <motion.div
            className="absolute z-10"
            style={{
              left: `${station.x}%`,
              top: `${station.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseEnter={() => setHoveredStation(station.id)}
            onMouseLeave={() => setHoveredStation(null)}
            onClick={() => onStationClick?.(station)}
          >
            {/* 信号波纹 */}
            <motion.div
              className="absolute w-16 h-16 rounded-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 pointer-events-none"
              style={{
                border: '1px solid rgba(0, 255, 136, 0.3)',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: station.id * 0.2 }}
            />
            <motion.div
              className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer"
              style={{
                background: hoveredStation === station.id 
                  ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.5), rgba(0, 200, 100, 0.3))' 
                  : 'linear-gradient(135deg, rgba(0, 255, 136, 0.3), rgba(0, 150, 80, 0.2))',
                border: '2px solid rgba(0, 255, 136, 0.8)',
                boxShadow: hoveredStation === station.id 
                  ? '0 0 25px rgba(0, 255, 136, 0.6), inset 0 0 10px rgba(0, 255, 136, 0.3)' 
                  : '0 0 15px rgba(0, 255, 136, 0.3)',
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* 基站图标 - 信号塔样式 */}
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C11.45 2 11 2.45 11 3V11H8L12 22L16 11H13V3C13 2.45 12.55 2 12 2Z"/>
                <path d="M8.5 6C8.5 6 6 8 6 11" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M15.5 6C15.5 6 18 8 18 11" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            </motion.div>
            
            {/* Hover tooltip */}
            <AnimatePresence>
              {hoveredStation === station.id && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap z-20"
                >
                  <span className="text-green-400 text-[10px] bg-black/80 px-2 py-1 rounded border border-green-500/30">
                    {station.name}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Click hint */}
            <AnimatePresence>
              {hoveredStation === station.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                  <span className="text-white/70 text-[9px] bg-black/60 px-1.5 py-0.5 rounded border border-white/10">
                    点击查看详情
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      ))}

      {/* 5G-A Beams - 锥形光束效果 */}
      {[0, 90, 180, 270].map((angle, index) => (
        <motion.div
          key={index}
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '48%',
            transform: `rotate(${angle}deg)`,
            transformOrigin: 'center bottom',
            mixBlendMode: 'screen',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: index * 1 }}
        >
          {/* Beam Cone */}
          <div
            className="w-0 h-0"
            style={{
              borderLeft: '50px solid transparent',
              borderRight: '50px solid transparent',
              borderBottom: '200px solid rgba(0, 240, 255, 0.2)',
              filter: 'blur(4px)',
            }}
          />
          {/* Inner Core */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-cyber-cyan"
            style={{ 
              height: '200px', 
              top: 0,
              filter: 'blur(1px) drop-shadow(0 0 15px #00F0FF)',
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
          />
        </motion.div>
      ))}

      {/* Emergency Vehicles with Yellow Dome */}
      {emergencyVehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          className="absolute z-15"
          style={{
            left: `${vehicle.x}%`,
            top: `${vehicle.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Yellow Hemisphere Dome */}
          <motion.div
            className="absolute w-44 h-44 rounded-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 30%, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0.08) 50%, transparent 70%)',
              border: '1px solid rgba(255, 215, 0, 0.4)',
              boxShadow: '0 0 50px rgba(255, 215, 0, 0.3)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          {/* Vehicle Icon */}
          <motion.div 
            className="relative z-10 w-12 h-12 rounded-xl bg-cyber-gold/20 border-2 border-cyber-gold/70 flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            animate={{
              boxShadow: [
                '0 0 10px rgba(255, 215, 0, 0.3)',
                '0 0 25px rgba(255, 215, 0, 0.6)',
                '0 0 10px rgba(255, 215, 0, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg className="w-7 h-7 text-cyber-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </motion.div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
            <span className="text-cyber-gold text-xs font-bold bg-black/60 px-2 py-0.5 rounded border border-cyber-gold/30">{vehicle.name}</span>
          </div>
        </div>
      ))}

      {/* Status Bar at Top */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-panel rounded-full px-8 py-2.5 z-20 flex items-center gap-8">
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-2.5 h-2.5 rounded-full bg-green-400"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-white/80 text-sm">智能板协同: <span className="text-green-400 font-bold">8站合一</span></span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-2.5 h-2.5 rounded-full bg-cyber-gold"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <span className="text-white/80 text-sm">应急车: <span className="text-cyber-gold font-bold">2辆在网</span></span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-2.5 h-2.5 rounded-full bg-red-500"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
          <span className="text-white/80 text-sm">风险区域: <span className="text-red-400 font-bold">北广场高密</span></span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass-panel rounded-lg p-4 z-20">
        <div className="text-white/60 text-sm font-medium mb-2">图例说明</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-400/80 border border-green-400 shadow-[0_0_8px_#00FF88]" />
            <span className="text-white/60 text-xs">5G-A基站 (可点击)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-cyber-gold/60 border border-cyber-gold" />
            <span className="text-white/60 text-xs">应急车覆盖</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500/60 border border-red-500" />
            <span className="text-white/60 text-xs">风险预警区</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3 text-cyber-cyan" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            </svg>
            <span className="text-white/60 text-xs">智能板</span>
          </div>
        </div>
      </div>
    </div>
  );
}
