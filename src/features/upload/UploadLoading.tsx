import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';

interface UploadLoadingProps {
    isResolved: boolean;
    onReadyToContinue: () => void;
}

export const UploadLoading: React.FC<UploadLoadingProps> = ({
    isResolved,
    onReadyToContinue,
}) => {
    const { weather, photoUrl } = useEnvironmentStore();
    const [progress, setProgress] = useState(0);
    const [textIndex, setTextIndex] = useState(0);
    const [showPulse, setShowPulse] = useState(false);
    const hasCompletedRef = useRef(false);

    const textSequence = useMemo(() => {
        switch (weather) {
            case '大雨':
            case '小雨':
                return ['雨滴正在勾勒轮廓...', '光影正在分离前景...', '情绪标签即将生成...'];
            case '晴天':
                return ['阳光正在提取细节...', '暖色层正在稳定...', '旋律正在靠近...'];
            case '多云':
            case '阴天':
                return ['云层正在解析场景...', '层次正在重建...', '情绪纹理正在收敛...'];
            case '雪天':
                return ['雪花正在凝结轮廓...', '冷暖对比正在融合...', '安静频段正在浮现...'];
            default:
                return ['正在感知画面情绪...', '正在提取空间特征...', '正在匹配氛围旋律...'];
        }
    }, [weather]);

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
        if (textSequence.length <= 1) return;
        const interval = window.setInterval(() => {
            setTextIndex(prev => (prev + 1) % textSequence.length);
        }, 1200);
        return () => window.clearInterval(interval);
    }, [textSequence]);

    useEffect(() => {
        if (hasCompletedRef.current || progress < 99.9) return;

        hasCompletedRef.current = true;
        setShowPulse(true);
        const timer = window.setTimeout(() => {
            onReadyToContinue();
        }, 520);

        return () => window.clearTimeout(timer);
    }, [onReadyToContinue, progress]);

    return (
        <div className='relative w-full max-w-md mx-auto aspect-video rounded-2xl overflow-hidden flex flex-col items-center justify-center'>
            {/* 模糊的背景图 */}
            {photoUrl && (
                <motion.div
                    className='absolute inset-0 w-full h-full bg-cover bg-center'
                    style={{ backgroundImage: `url(${photoUrl})` }}
                    initial={{ filter: 'blur(0px)' }}
                    animate={{
                        filter: isResolved ? 'blur(24px)' : 'blur(18px)',
                        scale: isResolved ? 1.05 : 1.02,
                    }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                />
            )}

            {/* 遮罩层 */}
            <div className='absolute inset-0 bg-black/42 backdrop-blur-sm' />

            {/* 动画元素 */}
            <div className='relative z-10 flex flex-col items-center justify-center h-full w-full p-6 text-center'>
                {/* 环形进度条 */}
                <div className='relative w-24 h-24 mb-8'>
                    <motion.div
                        className='absolute inset-0 rounded-full border border-white/20'
                        animate={{ scale: [1, 1.06, 1], opacity: [0.45, 0.7, 0.45] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    {showPulse && (
                        <motion.div
                            initial={{ scale: 1, opacity: 0.7 }}
                            animate={{ scale: 1.85, opacity: 0 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className='absolute inset-0 rounded-full border border-white/65'
                        />
                    )}
                    <svg className='w-full h-full transform -rotate-90' viewBox='0 0 100 100'>
                        <circle
                            cx='50'
                            cy='50'
                            r='45'
                            fill='transparent'
                            stroke='rgba(255,255,255,0.12)'
                            strokeWidth='2'
                        />
                        <motion.circle
                            cx='50'
                            cy='50'
                            r='45'
                            fill='transparent'
                            stroke='rgba(255,255,255,0.86)'
                            strokeWidth='2.4'
                            strokeDasharray='283'
                            strokeDashoffset={283 - (283 * progress) / 100}
                            transition={{ duration: 0.08, ease: 'linear' }}
                        />
                    </svg>
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <span className='text-xl font-light tracking-wider'>{Math.round(progress)}%</span>
                    </div>
                </div>

                {/* 动态文本 */}
                <AnimatePresence mode='wait'>
                    <motion.p
                        key={`${textSequence[textIndex]}-${textIndex}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        className='text-lg font-light tracking-widest text-white/90'
                    >
                        {textSequence[textIndex]}
                    </motion.p>
                </AnimatePresence>

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
            </div>
        </div>
    );
};
