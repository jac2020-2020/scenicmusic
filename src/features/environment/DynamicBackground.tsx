import React from 'react';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { WeatherParticles } from './WeatherParticles';
import { CloudyEffect } from './CloudyEffect';
import { LensFlareEffect } from './LensFlareEffect';
import { TimeEffects } from './TimeEffects';
import { EnvironmentLighting } from './EnvironmentLighting';
import { cn } from '@/utils/cn';

export const DynamicBackground: React.FC = () => {
    const { time, weather } = useEnvironmentStore();

    // 采用莫兰迪/低饱和度的自然色系
    const timeGradients: Record<string, string> = {
        '清晨': 'from-[#B5C1C5] to-[#E3D9C9]', // 雾霾蓝 到 晨曦燕麦色
        '正午': 'from-[#90A8C3] to-[#DAE5EC]', // 柔和晴空蓝 到 地平线白
        '傍晚': 'from-[#A28B99] to-[#DFB9A9]', // 烟粉色 到 淡橘桃色
        '夜晚': 'from-[#2C3643] to-[#161B22]', // 调亮后的深岩灰蓝 到 深灰黑
        '凌晨': 'from-[#1E252D] to-[#0D1115]', // 调亮后的幽深黑灰 到 极暗灰
    };

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-black">
            {/* 时间色彩层 (交叉淡入淡出，实现最极致的丝滑过渡) */}
            {Object.entries(timeGradients).map(([key, gradientClass]) => (
                <div
                    key={key}
                    className={cn(
                        'absolute inset-0 bg-gradient-to-b transition-opacity ease-in-out',
                        gradientClass
                    )}
                    style={{
                        opacity: time === key ? 1 : 0,
                        transitionDuration: '1500ms', // 增加过渡时间到1.5秒，实现极致柔和的呼吸感过渡
                    }}
                />
            ))}

            {/* 环境光滤镜层 */}
            <EnvironmentLighting />

            {/* 时段天体特效层 */}
            <TimeEffects />

            {/* 天气特效层 - 仅晴天正午显示镜头光晕 */}
            {weather === '晴天' && time === '正午' && <LensFlareEffect time={time} />}

            {/* 仅在多云时显示云层 */}
            {weather === '多云' && <CloudyEffect time={time} />}

            <WeatherParticles weather={weather} time={time} />
        </div>
    );
};
