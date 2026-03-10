import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';

export const TimeEffects: React.FC = () => {
    const { time, weather } = useEnvironmentStore();

    // 根据天气情况精细化调整天体透明度
    const getOpacityClass = () => {
        if (weather === '晴天') return 'opacity-100';
        if (weather === '多云') return 'opacity-60 blur-[2px]';
        // 雨天时，天体（日月）被云层严重遮挡，仅保留微弱轮廓
        return 'opacity-10';
    };

    const opacityClass = getOpacityClass();

    // 多云、雨天时星空不可见
    const isOvercast = weather === '多云' || weather === '雨天';

    return (
        <div className={`absolute inset-0 pointer-events-none transition-all duration-[1500ms] ease-in-out ${opacityClass}`}>
            <AnimatePresence>
                {/* 清晨：晨光初现，居中在“境”字下方 */}
                {time === '清晨' && (
                    <motion.div
                        key="morning-sun"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                        className="absolute top-[25%] left-1/2 -translate-x-1/2 pointer-events-none"
                    >
                        {/* 外层大光晕 (大气层散射) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
                            style={{ background: 'radial-gradient(circle, rgba(255,230,170,0.3) 0%, rgba(255,210,150,0.1) 40%, transparent 70%)', mixBlendMode: 'screen', filter: 'blur(20px)' }} />
                        {/* 中层暖光 (太阳周围的高亮) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full"
                            style={{ background: 'radial-gradient(circle, rgba(255,240,190,0.7) 0%, rgba(255,220,150,0.2) 50%, transparent 80%)', mixBlendMode: 'screen', filter: 'blur(12px)' }} />
                        {/* 太阳实体核心 (柔和的发光球体) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-[#FFFDF8]"
                            style={{ boxShadow: '0 0 30px 10px rgba(255, 235, 180, 0.9)', filter: 'blur(4px)' }} />
                    </motion.div>
                )}

                {/* 正午：在 LensFlareEffect 中处理了强烈的光晕，这里就不额外添加天体以免冲突 */}

                {/* 傍晚：日落，底部居中，露出一半 */}
                {time === '傍晚' && (
                    <motion.div
                        key="sunset"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                        className="absolute bottom-0 left-1/2 pointer-events-none"
                    >
                        {/* 外层漫反射晚霞 (染红天空) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-[100%]"
                            style={{ background: 'radial-gradient(ellipse, rgba(255,180,160,0.4) 0%, rgba(220,140,140,0.15) 40%, transparent 70%)', mixBlendMode: 'screen', filter: 'blur(30px)' }} />
                        {/* 中层火红光晕 (落日周围的强反光) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full"
                            style={{ background: 'radial-gradient(circle, rgba(255,190,160,0.6) 0%, rgba(250,150,120,0.2) 50%, transparent 80%)', mixBlendMode: 'screen', filter: 'blur(20px)' }} />
                        {/* 落日实体核心 (柔和发光球体) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full bg-[#FFF5F0]"
                            style={{ boxShadow: '0 0 50px 20px rgba(255, 170, 140, 0.7), inset 0 -10px 20px rgba(255,140,110,0.4)', filter: 'blur(6px)' }} />
                    </motion.div>
                )}

                {/* 夜晚：月亮 */}
                {time === '夜晚' && (
                    <motion.div
                        key="moon"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                        className="absolute top-[12%] right-[15%] sm:right-[25%] w-20 h-20 md:w-28 md:h-28 rounded-full"
                        style={{
                            background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #f7f8f5 25%, #e1e4e8 65%, #bac4d0 100%)',
                            boxShadow: '0 0 40px 10px rgba(230, 240, 255, 0.4), 0 0 120px 30px rgba(200, 220, 255, 0.2), inset -8px -8px 20px rgba(100, 115, 140, 0.4), inset 4px 4px 12px rgba(255, 255, 255, 1)',
                        }}
                    >
                        {/* 极度柔和的月海纹理，使用内部元素避免硬边缘 */}
                        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none opacity-40 mix-blend-multiply">
                            <div className="absolute top-[10%] left-[20%] w-[50%] h-[45%] rounded-[45%_55%_40%_60%] bg-[#a0aab5] blur-[8px]" />
                            <div className="absolute top-[45%] right-[10%] w-[45%] h-[45%] rounded-[60%_40%_50%_50%] bg-[#92a0b0] blur-[10px]" />
                            <div className="absolute bottom-[10%] left-[30%] w-[40%] h-[35%] rounded-[50%_50%_60%_40%] bg-[#8b99ab] blur-[6px]" />
                        </div>
                    </motion.div>
                )}

                {/* 夜晚：星空（仅在不是阴雨天气时显示） */}
                {time === '夜晚' && !isOvercast && (
                    <motion.div
                        key="stars"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3 }}
                        className="absolute inset-0"
                    >
                        {[...Array(30)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full bg-white"
                                style={{
                                    width: Math.random() * 2 + 1 + 'px',
                                    height: Math.random() * 2 + 1 + 'px',
                                    top: Math.random() * 60 + '%', // 星星主要集中在上半部分
                                    left: Math.random() * 100 + '%',
                                }}
                                animate={{
                                    opacity: [0.02, 0.25, 0.02],
                                    scale: [0.8, 1.1, 0.8],
                                }}
                                transition={{
                                    duration: Math.random() * 4 + 3,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: Math.random() * 3,
                                }}
                            />
                        ))}
                    </motion.div>
                )}

                {/* 凌晨：地平线微光 */}
                {time === '凌晨' && (
                    <motion.div
                        key="dawn-light"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                        className="absolute bottom-0 left-0 right-0 h-1/2"
                        style={{
                            background: 'linear-gradient(to top, rgba(160, 190, 230, 0.3) 0%, rgba(120, 150, 190, 0.1) 40%, transparent 100%)',
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
