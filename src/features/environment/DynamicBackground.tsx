import React from 'react';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { WeatherParticles } from './WeatherParticles';
import { CloudyEffect } from './CloudyEffect';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

export const DynamicBackground: React.FC = () => {
    const { time, weather } = useEnvironmentStore();

    const timeGradients: Record<string, string> = {
        '清晨': 'from-orange-200/90 to-yellow-100/90',
        '正午': 'from-blue-200/90 to-blue-50/90',
        '傍晚': 'from-orange-500/90 to-pink-400/90',
        '夜晚': 'from-indigo-900/90 to-purple-900/90',
        '凌晨': 'from-slate-900/90 to-blue-900/90',
    };

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-black">
            {/* 时间色彩层 */}
            <div
                className={cn(
                    'absolute inset-0 bg-gradient-to-b transition-colors duration-1000 ease-in-out',
                    timeGradients[time]
                )}
            />

            {/* 阴天覆盖层 */}
            {weather === '阴天' && (
                <div className="absolute inset-0 bg-gray-500/40 mix-blend-multiply transition-opacity duration-1000" />
            )}

            {/* 天气特效层 */}
            {weather === '晴天' && (
                <motion.div
                    className="absolute top-20 right-20 w-64 h-64 bg-white/30 rounded-full blur-[80px]"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
            )}

            {weather === '多云' && <CloudyEffect />}

            <WeatherParticles weather={weather} />
        </div>
    );
};
