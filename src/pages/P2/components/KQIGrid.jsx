import { motion } from 'framer-motion';
import { MessageCircle, Smartphone, Globe, QrCode } from 'lucide-react';

const kqiItems = [
  { 
    app: '微信消息', 
    icon: MessageCircle, 
    value: '20', 
    unit: 'ms',
    sub: '时延',
    status: 'green',
    color: '#00FF88',
  },
  { 
    app: '抖音播放', 
    icon: Smartphone, 
    value: '高清', 
    unit: '',
    sub: '画质',
    status: 'green',
    color: '#00F0FF',
  },
  { 
    app: '网页首屏', 
    icon: Globe, 
    value: '优', 
    unit: '',
    sub: '体验',
    status: 'green',
    color: '#FFD700',
  },
  { 
    app: '扫码支付', 
    icon: QrCode, 
    value: '成功', 
    unit: '',
    sub: '99.99%',
    status: 'green',
    color: '#FF6B9D',
  },
];

export default function KQIGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {kqiItems.map((item, index) => (
        <motion.div
          key={item.app}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-green-900/5 border border-green-500/30 hover:border-green-500/50 transition-colors"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <item.icon className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-white/80 text-sm font-medium">{item.app}</span>
          </div>
          
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="font-orbitron text-2xl font-bold text-green-400">
                {item.value}
              </span>
              <span className="text-green-400 text-sm">{item.unit}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-white/50 text-xs">{item.sub}</span>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
