import React from 'react';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { AnimatePresence, motion } from 'framer-motion';

export const SceneForeground: React.FC = () => {
    const { scene } = useEnvironmentStore();

    const sceneConfig: Record<string, { gradient: string; text: string }> = {
        '沉浸阅读': {
            gradient: 'from-amber-900/40 via-transparent to-transparent',
            text: '📖 书桌一角',
        },
        '文学聚会': {
            gradient: 'from-orange-900/40 via-transparent to-transparent',
            text: '🛋️ 茶几与书籍',
        },
        '品酒时光': {
            gradient: 'from-purple-900/40 via-transparent to-transparent',
            text: '🍷 吧台与酒杯',
        },
        '美食盛宴': {
            gradient: 'from-red-900/40 via-transparent to-transparent',
            text: '🍽️ 餐桌盛宴',
        },
    };

    const currentScene = sceneConfig[scene];

    return (
        <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden flex flex-col justify-end">
            <AnimatePresence mode="wait">
                <motion.div
                    key={scene}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    className={`w-full h-1/3 bg-gradient-to-t ${currentScene.gradient} flex items-end justify-center pb-10 blur-[2px]`}
                >
                    {/* Placeholder for the actual illustration/mask */}
                    <div className="text-white/20 text-3xl font-light tracking-widest mix-blend-overlay">
                        {currentScene.text}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
