import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface AudioVisualizerProps {
    isPlaying: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying }) => {
    const particles = useMemo(() => {
        return Array.from({ length: 16 }, (_, idx) => ({
            id: idx,
            left: 8 + Math.random() * 84,
            top: 45 + Math.random() * 42,
            size: 5 + Math.random() * 10,
            dx: (Math.random() - 0.5) * 36,
            dy: -12 - Math.random() * 32,
            duration: 8 + Math.random() * 12,
            delay: Math.random() * 3.6,
        }));
    }, []);

    return (
        <div className='absolute inset-0 pointer-events-none overflow-hidden z-0'>
            <motion.div
                className='absolute left-1/2 top-[56%] h-[46vh] w-[130vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%]'
                style={{
                    background:
                        'radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, rgba(190,225,255,0.16) 38%, rgba(120,165,210,0.09) 58%, rgba(0,0,0,0) 80%)',
                    filter: 'blur(22px)',
                }}
                initial={{ opacity: 0 }}
                animate={{
                    opacity: isPlaying ? [0.24, 0.4, 0.26] : 0.12,
                    scaleX: isPlaying ? [1, 1.08, 1] : 1,
                    scaleY: isPlaying ? [1, 0.95, 1] : 1,
                }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
                className='absolute left-1/2 top-[58%] h-[22vh] w-[150vw] -translate-x-1/2 -translate-y-1/2'
                style={{
                    background:
                        'linear-gradient(95deg, rgba(255,255,255,0) 10%, rgba(210,236,255,0.2) 38%, rgba(255,255,255,0.34) 50%, rgba(210,236,255,0.16) 64%, rgba(255,255,255,0) 90%)',
                    filter: 'blur(8px)',
                    mixBlendMode: 'screen',
                }}
                initial={{ opacity: 0 }}
                animate={{
                    opacity: isPlaying ? [0.14, 0.3, 0.16] : 0.08,
                    x: isPlaying ? ['-8%', '8%', '-6%'] : '-2%',
                    y: isPlaying ? ['-2%', '2%', '-1%'] : '0%',
                }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
                className='absolute left-1/2 top-[61%] h-[14vh] w-[132vw] -translate-x-1/2 -translate-y-1/2'
                style={{
                    background:
                        'linear-gradient(86deg, rgba(255,255,255,0) 16%, rgba(186,225,255,0.2) 46%, rgba(255,255,255,0.3) 53%, rgba(186,225,255,0.11) 68%, rgba(255,255,255,0) 88%)',
                    filter: 'blur(6px)',
                    mixBlendMode: 'screen',
                }}
                initial={{ opacity: 0 }}
                animate={{
                    opacity: isPlaying ? [0.12, 0.24, 0.14] : 0.07,
                    x: isPlaying ? ['8%', '-8%', '6%'] : '1%',
                }}
                transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
                className='absolute left-1/2 top-[63%] h-[10vh] w-[120vw] -translate-x-1/2 -translate-y-1/2'
                style={{
                    background:
                        'linear-gradient(90deg, rgba(255,255,255,0) 14%, rgba(220,242,255,0.18) 46%, rgba(255,255,255,0.26) 52%, rgba(220,242,255,0.14) 62%, rgba(255,255,255,0) 90%)',
                    filter: 'blur(5px)',
                    mixBlendMode: 'screen',
                }}
                initial={{ opacity: 0 }}
                animate={{
                    opacity: isPlaying ? [0.06, 0.16, 0.08] : 0.04,
                    x: isPlaying ? ['-4%', '4%', '-3%'] : '0%',
                }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />

            {particles.map(item => (
                <motion.div
                    key={item.id}
                    className='absolute rounded-full'
                    style={{
                        left: `${item.left}%`,
                        top: `${item.top}%`,
                        width: `${item.size}px`,
                        height: `${item.size}px`,
                        background:
                            'radial-gradient(circle, rgba(255,255,255,0.84) 0%, rgba(180,220,255,0.24) 62%, rgba(255,255,255,0) 100%)',
                        filter: 'blur(0.6px)',
                        mixBlendMode: 'screen',
                    }}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{
                        opacity: isPlaying ? [0, 0.46, 0.12, 0] : 0,
                        x: isPlaying ? [0, item.dx, item.dx * 0.58] : 0,
                        y: isPlaying ? [0, item.dy, item.dy - 6] : 0,
                        scale: isPlaying ? [0.68, 1.06, 0.9] : 0.68,
                    }}
                    transition={{
                        duration: item.duration,
                        delay: item.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
};
