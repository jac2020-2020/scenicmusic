import React from 'react';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { motion, AnimatePresence } from 'framer-motion';

export const EnvironmentLighting: React.FC = () => {
    const { time, weather } = useEnvironmentStore();

    const isOvercast = weather === '多云' || weather === '雨天';
    const isSnow = false; // 雪天暂未实现
    const isSunnyNoon = time === '午后' && weather === '晴天';
    const isSunset = time === '傍晚';

    return (
        <AnimatePresence>
            {/* 阴天、雨天：全局叠加灰蓝滤镜 (multiply) 以降低亮度和饱和度 */}
            {isOvercast && (
                <motion.div
                    key="overcast-lighting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 mix-blend-multiply pointer-events-none"
                    style={{
                        backgroundColor: time === '夜晚' ? 'rgba(20, 30, 40, 0.6)' : 'rgba(100, 110, 120, 0.4)'
                    }}
                />
            )}

            {/* 雪天：全局叠加微白 (screen)，模拟雪地和空中的反光 */}
            {isSnow && (
                <motion.div
                    key="snow-lighting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 mix-blend-screen pointer-events-none"
                    style={{
                        backgroundColor: time === '夜晚' ? 'rgba(30, 40, 60, 0.2)' : 'rgba(200, 210, 220, 0.3)',
                        backdropFilter: 'blur(2px)' // 空气带微弱霜冻白雾
                    }}
                />
            )}

            {/* 傍晚全屏微加暖色滤镜 (overlay) */}
            {isSunset && (
                <motion.div
                    key="sunset-lighting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 mix-blend-overlay pointer-events-none"
                    style={{
                        backgroundColor: 'rgba(255, 150, 100, 0.15)'
                    }}
                />
            )}

            {/* 晴天正午：高明度通透感 (overlay) */}
            {isSunnyNoon && (
                <motion.div
                    key="noon-lighting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 mix-blend-overlay pointer-events-none"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                />
            )}
        </AnimatePresence>
    );
};
