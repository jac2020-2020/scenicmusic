import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import type { Mood } from '@/types/environment';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const MOOD_OPTIONS: Mood[] = ['愉悦', '平静', '忧伤', '兴奋', '疲惫', '焦虑', '怀旧', '期待'];

// 紧凑排布的气泡配置 - 更聚集的位置
const bubbleConfigs = [
    { size: 68, x: 20, y: 25 },   // 愉悦
    { size: 60, x: 50, y: 18 },   // 平静
    { size: 74, x: 80, y: 28 },   // 忧伤 - 大一点
    { size: 56, x: 35, y: 55 },   // 兴奋 - 小一点
    { size: 64, x: 65, y: 52 },   // 疲惫
    { size: 52, x: 15, y: 75 },   // 焦虑 - 最小
    { size: 70, x: 48, y: 78 },   // 怀旧 - 大
    { size: 58, x: 82, y: 70 },   // 期待
];

export const MoodStep: React.FC = () => {
    const { mood, setMood, nextStep, prevStep } = useEnvironmentStore();
    const [customMood, setCustomMood] = useState('');
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const handleMoodSelect = (selectedMood: Mood) => {
        if (mood === selectedMood) {
            setMood(undefined);
        } else {
            setMood(selectedMood);
            setCustomMood('');
        }
    };

    const handleCustomMoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomMood(value);
        if (value.trim()) {
            setMood(undefined);
        }
    };

    // 舒缓的漂浮动画 - 稍微明显的幅度，更长的周期
    const floatAnimations = useMemo(() => {
        return MOOD_OPTIONS.map((_, index) => ({
            y: [0, -8 - (index % 3) * 3, 0],
            x: [0, (index % 2 === 0 ? 4 : -4), 0],
            transition: {
                duration: 6 + (index % 4) * 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5,
            }
        }));
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col w-full max-w-md mx-auto items-center"
        >
            {/* 此情文字 - 横向排布，左右有小横线 */}
            <div className="flex items-center gap-5 mb-8">
                <div className="w-6 h-px bg-white/40" />
                <span className="hetian-font text-base sm:text-lg md:text-xl text-white/80 tracking-widest">
                    此情
                </span>
                <div className="w-6 h-px bg-white/40" />
            </div>

            {/* 漂浮气泡区域 - 更紧凑 */}
            <div className="relative w-full h-56 sm:h-60 mb-8">
                {MOOD_OPTIONS.map((moodOption, index) => {
                    const isSelected = mood === moodOption;
                    const config = bubbleConfigs[index];
                    const isHovered = hoveredIndex === index;

                    // 计算鼠标跟随偏移量
                    const offsetX = isHovered ? (mousePos.x - 0.5) * 8 : 0;
                    const offsetY = isHovered ? (mousePos.y - 0.5) * 8 : 0;

                    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;
                        const relativeX = (e.clientX - centerX) / (rect.width / 2);
                        const relativeY = (e.clientY - centerY) / (rect.height / 2);
                        setMousePos({ x: Math.max(-1, Math.min(1, relativeX)), y: Math.max(-1, Math.min(1, relativeY)) });
                    };

                    const handleMouseEnter = () => {
                        setHoveredIndex(index);
                    };

                    const handleMouseLeave = () => {
                        setHoveredIndex(null);
                        setMousePos({ x: 0, y: 0 });
                    };

                    return (
                        <motion.button
                            key={moodOption}
                            type="button"
                            onClick={() => handleMoodSelect(moodOption)}
                            onMouseMove={handleMouseMove}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{
                                opacity: 1,
                                scale: isSelected ? 1.15 : 1,
                                y: (floatAnimations[index].y as number) + offsetY,
                                x: (floatAnimations[index].x as number) + offsetX,
                            }}
                            transition={{
                                opacity: { duration: 0.5, delay: index * 0.1 },
                                scale: {
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 15,
                                    delay: index * 0.1
                                },
                                y: floatAnimations[index].transition,
                                x: floatAnimations[index].transition,
                            }}
                            whileHover={{
                                scale: isSelected ? 1.25 : 1.12,
                                transition: { duration: 0.3 }
                            }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                                absolute rounded-full flex items-center justify-center
                                transition-all duration-500
                                ${isSelected ? 'z-10' : 'z-0'}
                            `}
                            style={{
                                width: isSelected ? `${config.size * 1.15}px` : `${config.size}px`,
                                height: isSelected ? `${config.size * 1.15}px` : `${config.size}px`,
                                left: `calc(${config.x}% - ${isSelected ? config.size * 1.15 / 2 : config.size / 2}px)`,
                                top: `calc(${config.y}% - ${isSelected ? config.size * 1.15 / 2 : config.size / 2}px)`,
                                // 模拟真实的玻璃/水滴折射材质：中间极度透明，边缘因折射率变厚而泛白
                                background: isSelected
                                    ? 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.05) 70%, rgba(255,255,255,0.3) 100%)'
                                    : 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.02) 75%, rgba(255,255,255,0.15) 100%)',
                                backdropFilter: 'blur(6px)',
                                WebkitBackdropFilter: 'blur(6px)',
                                // 用内外阴影替代生硬的边框，刻画体积感
                                boxShadow: isSelected
                                    ? 'inset 0 0 15px rgba(255,255,255,0.4), inset 0 0 4px rgba(255,255,255,0.6), 0 10px 25px rgba(0,0,0,0.15)'
                                    : 'inset 0 0 10px rgba(255,255,255,0.2), inset 0 0 2px rgba(255,255,255,0.4), 0 6px 15px rgba(0,0,0,0.08)',
                                border: 'none',
                            }}
                        >
                            {/* 真实曲面高光 (模拟单侧主光源，如窗户或太阳在球面的反射) */}
                            <div
                                className="absolute pointer-events-none transition-all duration-500"
                                style={{
                                    top: '8%',
                                    left: '12%',
                                    width: '45%',
                                    height: '25%',
                                    borderRadius: '50%',
                                    background: isSelected 
                                        ? 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0) 100%)'
                                        : 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0) 100%)',
                                    transform: 'rotate(-25deg)',
                                    filter: 'blur(0.5px)'
                                }}
                            />
                            
                            {/* 底部环境漫反射 (Bounce light，增加晶莹剔透的水滴感) */}
                            <div
                                className="absolute rounded-full pointer-events-none transition-all duration-500"
                                style={{
                                    bottom: '3%',
                                    right: '8%',
                                    width: '60%',
                                    height: '35%',
                                    background: isSelected 
                                        ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)'
                                        : 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
                                    transform: 'rotate(-25deg)',
                                    filter: 'blur(2px)'
                                }}
                            />
                            <span
                                className={`
                                    relative z-10 text-xs sm:text-sm tracking-wide transition-all duration-300
                                    ${isSelected ? 'text-white font-semibold text-sm sm:text-base' : 'text-white/90 font-medium'}
                                `}
                                style={{
                                    textShadow: isSelected
                                        ? '0 1px 4px rgba(0,0,0,0.5), 0 0 12px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)'
                                        : '0 1px 3px rgba(0,0,0,0.35), 0 0 6px rgba(255,255,255,0.2)'
                                }}
                            >
                                {moodOption}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            {/* 自定义心情输入 */}
            <div className="w-full max-w-xs mb-8 px-4">
                <input
                    type="text"
                    value={customMood}
                    onChange={handleCustomMoodChange}
                    placeholder="其他心情..."
                    className="
                        w-full bg-transparent border-b border-white/30
                        text-center text-white/90 text-sm sm:text-base
                        placeholder:text-white/40
                        py-2 px-4 outline-none
                        focus:border-white/60 transition-colors
                    "
                />
            </div>

            {/* 导航按钮 */}
            <div className="flex items-center justify-center gap-6">
                <motion.button
                    type="button"
                    onClick={prevStep}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all"
                    style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 100%)',
                        backdropFilter: 'blur(16px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(16px) saturate(150%)',
                        border: '0.5px solid rgba(255,255,255,0.2)',
                        boxShadow: 'inset 0 0.5px 0.5px rgba(255,255,255,0.35), 0 2px 8px rgba(0,0,0,0.08)',
                    }}
                    aria-label="返回上一步"
                >
                    <ArrowLeft size={22} className="sm:w-6 sm:h-6 text-white/90" />
                </motion.button>

                <motion.button
                    type="button"
                    onClick={nextStep}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all"
                    style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 100%)',
                        backdropFilter: 'blur(16px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(16px) saturate(150%)',
                        border: '0.5px solid rgba(255,255,255,0.2)',
                        boxShadow: 'inset 0 0.5px 0.5px rgba(255,255,255,0.35), 0 2px 8px rgba(0,0,0,0.08)',
                    }}
                    aria-label="下一步"
                >
                    <ArrowRight size={22} className="sm:w-6 sm:h-6" />
                </motion.button>
            </div>
        </motion.div>
    );
};
