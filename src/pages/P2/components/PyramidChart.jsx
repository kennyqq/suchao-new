import { motion } from 'framer-motion';

const PYRAMID_DATA = [
  { label: '场馆包用户', value: 200, color: '#FFD700', width: '30%' },
  { label: '全球通金卡', value: 1500, color: '#C0C0C0', width: '50%' },
  { label: '普通用户', value: 48000, color: '#00F0FF', width: '80%' },
];

export default function PyramidChart() {
  const total = PYRAMID_DATA.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col items-center">
      {/* 金字塔 */}
      <div className="relative w-full max-w-[200px]">
        {PYRAMID_DATA.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            className="mx-auto mb-1 relative group cursor-pointer"
            style={{ width: item.width }}
          >
            <div
              className="h-10 flex items-center justify-center text-xs font-medium transition-all duration-300 group-hover:brightness-110"
              style={{
                background: `linear-gradient(90deg, ${item.color}40 0%, ${item.color}60 50%, ${item.color}40 100%)`,
                borderLeft: `2px solid ${item.color}`,
                borderRight: `2px solid ${item.color}`,
                borderTop: index === 0 ? `2px solid ${item.color}` : 'none',
                borderBottom: `2px solid ${item.color}`,
                clipPath: index === 0 
                  ? 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' // 顶层梯形
                  : index === PYRAMID_DATA.length - 1
                  ? 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)' // 底层梯形
                  : 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)', // 中层梯形
              }}
            >
              <div className="flex flex-col items-center">
                <span className="text-white font-medium">{item.label}</span>
                <span className="text-[10px]" style={{ color: item.color }}>
                  {item.value.toLocaleString()} 人
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 总计 */}
      <div className="mt-4 text-center">
        <div className="text-[10px] text-white/50">总用户数</div>
        <div className="text-2xl font-din text-white">
          {total.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
