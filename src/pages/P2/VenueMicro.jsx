import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, Smartphone, Wifi, AlertTriangle } from 'lucide-react';
import TimelineV3 from '../../components/TimelineV3';
import LeftPanelP2 from './LeftPanelP2';
import RightPanelP2 from './RightPanelP2';
import CenterStage from './CenterStage';

export default function VenueMicro() {
  const [currentTime, setCurrentTime] = useState('20:00');

  const handleTimeChange = (timeData) => {
    setCurrentTime(timeData.time);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative">
      {/* 主内容区 */}
      <div className="relative z-10 flex flex-col h-full pb-24">
        {/* 中部内容区 - 绝对定位布局 */}
        <div className="flex-1 relative">
          {/* 中央场馆舞台 - 底层背景 */}
          <div className="absolute inset-0">
            <CenterStage />
          </div>

          {/* 左侧面板 - 悬浮 */}
          <div className="absolute left-0 top-0 bottom-32 w-[320px] z-10 p-4">
            <LeftPanelP2 />
          </div>

          {/* 右侧面板 - 悬浮 */}
          <div className="absolute right-0 top-0 bottom-32 w-[320px] z-10 p-4">
            <RightPanelP2 />
          </div>
        </div>
      </div>

      {/* 底部全局时间轴 */}
      <TimelineV3 
        onTimeChange={handleTimeChange}
        externalTime={currentTime}
      />
    </div>
  );
}
