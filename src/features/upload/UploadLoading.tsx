import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { DynamicBackground } from '@/features/environment/DynamicBackground';

interface UploadLoadingProps {
    isResolved: boolean;
    onReadyToContinue: () => void;
}

export const UploadLoading: React.FC<UploadLoadingProps> = ({
    isResolved,
    onReadyToContinue,
}) => {
    const { weather, time, scene } = useEnvironmentStore();
    const [progress, setProgress] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const hasCompletedRef = useRef(false);
    const minDurationTimerRef = useRef<number | null>(null);
    const [hasMinDuration, setHasMinDuration] = useState(false);

    const floatingTextItems = useMemo(() => {
        const words: string[] = [weather, time, scene];

        const items = [];
        for (let i = 0; i < 28; i++) {
            const word = words[i % words.length];
            const depth = Math.random();
            const layer = depth < 0.38 ? 'back' : depth < 0.75 ? 'mid' : 'front';
            const layerConfig = {
                back: {
                    opacity: 0.04 + Math.random() * 0.08,
                    blur: 3 + Math.random() * 3.5,
                    brightness: 0.9,
                    shadow: 0,
                    zIndex: 1,
                },
                mid: {
                    opacity: 0.14 + Math.random() * 0.16,
                    blur: 1 + Math.random() * 1.5,
                    brightness: 1,
                    shadow: 0.08,
                    zIndex: 2,
                },
                front: {
                    opacity: 0.34 + Math.random() * 0.28,
                    blur: 0.2 + Math.random() * 0.5,
                    brightness: 1.08,
                    shadow: 0.16,
                    zIndex: 3,
                },
            }[layer];

            items.push({
                id: `${word}-${i}`,
                text: word.split(''),
                startY: Math.random() < 0.3 ? Math.random() * 80 : -20 - Math.random() * 50,
                endY: 120 + Math.random() * 20,
                startX: Math.random() * 90 + 5,
                endX: (Math.random() - 0.5) * 5,
                delay: Math.random() < 0.5 ? 0 : Math.random() * 3,
                duration: Math.random() * 5 + 6 + (layer === 'back' ? 1.5 : 0),
                scale:
                    layer === 'back'
                        ? 0.64 + Math.random() * 0.25
                        : layer === 'mid'
                            ? 0.82 + Math.random() * 0.2
                            : 1.0 + Math.random() * 0.25,
                baseOpacity: layerConfig.opacity,
                blurPx: layerConfig.blur,
                brightness: layerConfig.brightness,
                shadowAlpha: layerConfig.shadow,
                zIndex: layerConfig.zIndex,
            });
        }
        return items;
    }, [weather, time, scene]);

    useEffect(() => {
        const minDurationMs = 2300;
        minDurationTimerRef.current = window.setTimeout(() => {
            setHasMinDuration(true);
        }, minDurationMs);
        return () => {
            if (minDurationTimerRef.current !== null) {
                window.clearTimeout(minDurationTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return 100;

                if (isResolved) {
                    const delta = Math.max(0.8, (100 - prev) * 0.22);
                    return Math.min(100, prev + delta);
                }

                if (prev < 70) {
                    return Math.min(70, prev + 1.7);
                }
                return Math.min(92, prev + 0.28);
            });
        }, 40);

        return () => window.clearInterval(interval);
    }, [isResolved]);

    useEffect(() => {
        // 不再依赖进度百分比阈值，避免在低帧率/长时停留后卡在加载页
        if (hasCompletedRef.current || !isResolved || !hasMinDuration) return;

        hasCompletedRef.current = true;
        setProgress(100);
        setIsExiting(true);
        const timer = window.setTimeout(() => {
            onReadyToContinue();
        }, 380);

        return () => window.clearTimeout(timer);
    }, [hasMinDuration, isResolved, onReadyToContinue]);

    return (
        <div className='relative w-full min-h-screen overflow-hidden'>
            <DynamicBackground />

            {/* 动画元素 */}
            <motion.div
                className='relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-8 text-center'
                animate={{ opacity: isExiting ? 0 : 1 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
            >
                {/* 纯文本进度 */}
                <div className='relative flex items-center justify-center mb-8 h-24'>
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='text-5xl font-light tracking-wider text-white/90'
                        style={{ fontFamily: "'Playfair Display', 'Times New Roman', serif" }}
                    >
                        {Math.round(progress)}%
                    </motion.span>
                </div>

                {/* 光斑动画 (mix-blend-mode) */}
                <motion.div
                    className='absolute inset-0 pointer-events-none mix-blend-overlay opacity-30'
                    animate={{
                        background: [
                            'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)',
                            'radial-gradient(circle at 80% 70%, rgba(255,255,255,0.4) 0%, transparent 50%)',
                            'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 50%)',
                        ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
            </motion.div>

            {/* 下雨般掉落的文字 (放置在最上层 z-50) */}
            <motion.div
                className='loading-zh absolute inset-0 z-50 pointer-events-none overflow-hidden'
                animate={{ opacity: isExiting ? 0 : 1 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
            >
                {floatingTextItems.map((item) => (
                    <motion.div
                        key={item.id}
                        className='absolute text-white tracking-[0.3em] flex flex-col items-center justify-start gap-1'
                        style={{
                            left: `${item.startX}%`,
                            fontSize: `${item.scale * 1.2}rem`,
                            fontFamily:
                                '\'Source Han Sans SC\', \'Source Han Sans CN\', \'Noto Sans SC\', \'Microsoft YaHei\', sans-serif',
                            filter: `blur(${item.blurPx}px) brightness(${item.brightness})`,
                            textShadow:
                                item.shadowAlpha > 0
                                    ? `0 0 10px rgba(255, 255, 255, ${item.shadowAlpha})`
                                    : 'none',
                            zIndex: item.zIndex,
                        }}
                        initial={{
                            opacity: 0,
                            y: `${item.startY}vh`,
                            x: 0,
                        }}
                        animate={{
                            opacity: [0, item.baseOpacity, item.baseOpacity, 0],
                            y: [`${item.startY}vh`, `${item.endY}vh`],
                            x: [0, item.endX],
                        }}
                        transition={{
                            duration: item.duration,
                            delay: item.delay,
                            repeat: Infinity,
                            ease: 'linear', // Use linear for falling effect
                            // If an item starts on screen, make sure it has opacity immediately
                            opacity: {
                                duration: item.duration,
                                delay: item.delay,
                                repeat: Infinity,
                                ease: 'linear',
                                times: [0, 0.1, 0.8, 1] // Fade in quickly, stay, fade out at the end
                            }
                        }}
                    >
                        {item.text.map((char, charIdx) => (
                            <span
                                key={charIdx}
                                style={{
                                    writingMode: 'vertical-rl',
                                    fontFamily:
                                        "'Source Han Sans SC', 'Source Han Sans CN', 'Noto Sans SC', 'Microsoft YaHei', sans-serif"
                                }}
                            >
                                {char}
                            </span>
                        ))}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};
