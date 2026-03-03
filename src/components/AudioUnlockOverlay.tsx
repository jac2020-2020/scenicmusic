import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';

export const AudioUnlockOverlay: React.FC = () => {
    const { audioUnlocked, setAudioUnlocked } = useEnvironmentStore();

    const handleUnlock = () => {
        if (audioUnlocked) return;

        try {
            // 1. Web Audio API 解锁（Safari/iOS 必备）
            const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (Ctx) {
                const ctx = new Ctx();
                ctx.resume();
            }

            // 2. HTMLAudioElement 解锁：用真实文件播放 0 音量（data URI 在某些浏览器无效）
            const a = new Audio('/audio/weather/sunny.mp3');
            a.volume = 0;
            const p = a.play();
            if (p) p.catch(() => {});
        } catch {
            // 忽略
        }
        setAudioUnlocked(true);
    };

    return (
        <AnimatePresence>
            {!audioUnlocked && (
            <motion.div
                key='audio-unlock'
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className='fixed inset-0 z-[100] flex items-center justify-center cursor-pointer'
                onClick={handleUnlock}
                onTouchStart={handleUnlock}
                role='button'
                tabIndex={0}
                aria-label='点击开启声音'
                style={{
                    background: 'rgba(0,0,0,0.35)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                }}
            >
                <div className='text-center px-8 py-12 rounded-2xl max-w-[280px]'>
                    <p className='text-white/95 text-lg sm:text-xl font-medium tracking-wide mb-2'>
                        点击开启声音
                    </p>
                    <p className='text-white/60 text-sm'>
                        轻触屏幕任意位置即可开始体验
                    </p>
                </div>
            </motion.div>
            )}
        </AnimatePresence>
    );
};
