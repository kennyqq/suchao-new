import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Sun, User, Wifi } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/p0', label: '宏观溯源', color: 'gold' },
  { path: '/p1', label: '全局态势', color: 'cyan' },
  { path: '/p2', label: '场内微观', color: 'gold' },
  { path: '/p3', label: '评估闭环', color: 'cyan' },
];

export default function Header() {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isActive = (path) => {
    if (path === '/p0') return location.pathname === '/' || location.pathname === '/p0';
    return location.pathname === path;
  };

  return (
    <motion.header 
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[70px] flex-shrink-0 z-50 relative"
      style={{
        background: 'linear-gradient(180deg, rgba(11, 15, 25, 0.98) 0%, rgba(11, 15, 25, 0.9) 100%)',
        borderBottom: '1px solid rgba(0, 240, 255, 0.15)',
      }}
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Logo 和标题 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-cyan to-blue-600 flex items-center justify-center shadow-glow-cyan">
            <Wifi className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient-cyan">
              江苏移动苏超智能化指挥中心
            </h1>
          </div>
        </div>

        {/* 导航 Tabs */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="relative px-4 py-2 mx-1 rounded-lg transition-all duration-300 group"
            >
              {/* 背景高亮 */}
              {isActive(item.path) && (
                <motion.div
                  layoutId="nav-highlight"
                  className={`absolute inset-0 rounded-lg ${
                    item.color === 'gold' 
                      ? 'bg-cyber-gold/20 shadow-glow-gold' 
                      : 'bg-cyber-cyan/20 shadow-glow-cyan'
                  }`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              
              {/* 文字 */}
              <span className={`relative z-10 text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? item.color === 'gold' ? 'text-cyber-gold' : 'text-cyber-cyan'
                  : 'text-white/60 group-hover:text-white'
              }`}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* 右侧信息 */}
        <div className="flex items-center gap-4">
          {/* 时间 */}
          <div className="text-right">
            <div className="text-xs text-white/50">
              {currentTime.toLocaleDateString('zh-CN')}
            </div>
            <div className="text-lg font-din text-cyber-cyan">
              {currentTime.toLocaleTimeString('zh-CN', { hour12: false })}
            </div>
          </div>

          {/* 天气 */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
            <Sun className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-white/70">24°C</span>
          </div>

          {/* 用户 */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
            <User className="w-4 h-4 text-white/50" />
            <span className="text-sm text-white/70">Admin</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
