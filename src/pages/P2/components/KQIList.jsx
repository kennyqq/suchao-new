import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Globe, MessageSquare } from 'lucide-react';

const kqiItems = [
  { icon: CheckCircle2, label: '扫码支付成功率', value: '99.99%', status: 'green' },
  { icon: MessageSquare, label: '微信消息时延', value: '20ms', status: 'green' },
  { icon: Globe, label: '网页浏览首屏', value: 'Excellent', status: 'green' },
];

export default function KQIList() {
  return (
    <div className="space-y-2">
      {kqiItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/20 hover:border-green-500/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <item.icon className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-white/80 text-sm">{item.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-orbitron text-green-400 font-bold">{item.value}</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
