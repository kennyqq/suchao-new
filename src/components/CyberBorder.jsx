import { motion } from 'framer-motion';

export default function CyberBorder({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative ${className}`}
    >
      {/* 主容器 - 玻璃态 + 四角高亮 */}
      <div className="relative glass-panel rounded-lg p-4 corner-bracket">
        {/* 四角装饰 */}
        <span className="absolute top-0 left-0 w-3 h-3 border-l border-t border-cyber-cyan/50 rounded-tl" />
        <span className="absolute top-0 right-0 w-3 h-3 border-r border-t border-cyber-cyan/50 rounded-tr" />
        <span className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-cyber-cyan/50 rounded-bl" />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-cyber-cyan/50 rounded-br" />
        
        {children}
      </div>
    </motion.div>
  );
}
