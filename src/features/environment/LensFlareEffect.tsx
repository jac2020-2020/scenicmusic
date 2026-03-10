import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Time } from '@/types/environment';

interface LensFlareEffectProps {
    time: Time;
}

// 获取不同时间的真实镜头光晕参数
const getFlareConfig = (time: Time) => {
    switch (time) {
        case '清晨':
            return {
                x: '20%', y: '25%', // 左上
                angle: 30,          // 光带与伪影的倾斜角度
                color: '255, 230, 180', // 偏暖黄
                intensity: 0.65 // 适中强度
            };
        case '午后':
            return {
                x: '75%', y: '15%', // 右上
                angle: -25,
                color: '255, 250, 240', // 纯白微黄
                intensity: 0.8 // 适中强度
            };
        case '傍晚':
            return {
                x: '15%', y: '45%', // 左侧偏下
                angle: 15,
                color: '255, 160, 80', // 橘红夕阳
                intensity: 0.7 // 适中强度
            };
        case '夜晚':
            return {
                x: '80%', y: '20%',
                angle: -35,
                color: '180, 200, 255',
                intensity: 0 // 夜晚几乎没有光晕
            };
    }
};

export const LensFlareEffect: React.FC<LensFlareEffectProps> = ({ time }) => {
    const [delayedTime, setDelayedTime] = useState<Time>(time);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (time !== delayedTime) {
            // 当时间改变时，先让当前光晕淡出
            setIsTransitioning(true);
            
            // 等待 1200ms (背景切换是1500ms，我们留出一点缓冲)，然后更新光晕位置和颜色并淡入
            const timer = setTimeout(() => {
                setDelayedTime(time);
                setIsTransitioning(false);
            }, 1200);

            return () => clearTimeout(timer);
        }
    }, [time, delayedTime]);

    const config = getFlareConfig(delayedTime);
    const { x, y, angle, color, intensity } = config;

    // 正在切换时将强度降为 0（淡出），切换完后恢复为其真实的强度（淡入）
    const currentIntensity = isTransitioning ? 0 : intensity;

    return (
        <div 
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ 
                mixBlendMode: 'screen', // 使用 screen 叠加模式，模拟真实光学叠加
                opacity: currentIntensity,
                zIndex: 10,
                transition: 'opacity 0.8s ease-in-out' // 800ms 的平滑淡入淡出
            }}
        >
            <motion.div 
                className="absolute w-full h-full"
                animate={{ 
                    opacity: [0.95, 1, 0.95],
                    scale: [1, 1.01, 1] 
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
                {/* 1. 超大范围环境泛光 (Ambient Glow) */}
                <div 
                    className="absolute rounded-full"
                    style={{
                        left: x, top: y,
                        width: '150vmax', height: '150vmax',
                        transform: 'translate(-50%, -50%)',
                        background: `radial-gradient(circle, rgba(${color}, 0.15) 0%, rgba(${color}, 0.05) 25%, transparent 60%)`,
                    }}
                />

                {/* 2. 主光源多层光晕 (Multi-layered Core Halo) */}
                <div 
                    className="absolute rounded-full"
                    style={{
                        left: x, top: y,
                        width: '300px', height: '300px',
                        transform: 'translate(-50%, -50%)',
                        background: `radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 10%, rgba(${color}, 0.2) 30%, transparent 70%)`,
                        filter: 'blur(12px)'
                    }}
                />

                {/* 3. 极亮白心 (Hotspot) - 弱化 */}
                <div 
                    className="absolute rounded-full"
                    style={{
                        left: x, top: y,
                        width: '40px', height: '40px',
                        transform: 'translate(-50%, -50%)',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 80%)',
                        filter: 'blur(3px)'
                    }}
                />

                {/* 4. 横向主光带 (Anamorphic Main Streak) - 减弱 */}
                <div 
                    className="absolute"
                    style={{
                        left: x, top: y,
                        width: '120vw', height: '2px',
                        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                        background: `linear-gradient(90deg, transparent 0%, rgba(${color}, 0.15) 35%, rgba(255,255,255,0.5) 50%, rgba(${color}, 0.15) 65%, transparent 100%)`,
                        filter: 'blur(2px)'
                    }}
                />
                
                {/* 5. 横向柔和光带 (Anamorphic Soft Streak) - 减弱 */}
                <div 
                    className="absolute"
                    style={{
                        left: x, top: y,
                        width: '100vw', height: '15px',
                        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                        background: `linear-gradient(90deg, transparent 0%, rgba(${color}, 0.08) 30%, rgba(255,255,255,0.2) 50%, rgba(${color}, 0.08) 70%, transparent 100%)`,
                        filter: 'blur(12px)'
                    }}
                />

                {/* 6. 星芒交叉光束 (Cross Starburst) - 减弱 */}
                <div 
                    className="absolute"
                    style={{
                        left: x, top: y,
                        width: '400px', height: '400px',
                        transform: `translate(-50%, -50%) rotate(${angle / 2}deg)`,
                        background: `conic-gradient(from 0deg at 50% 50%, 
                            transparent 0deg, rgba(255,255,255,0.08) 5deg, transparent 10deg,
                            transparent 80deg, rgba(255,255,255,0.08) 85deg, transparent 90deg,
                            transparent 170deg, rgba(255,255,255,0.08) 175deg, transparent 180deg,
                            transparent 260deg, rgba(255,255,255,0.08) 265deg, transparent 270deg,
                            transparent 350deg, rgba(255,255,255,0.08) 355deg, transparent 360deg
                        )`,
                        filter: 'blur(3px)'
                    }}
                />

                {/* 7. 镜头内部反射伪影系统 (Lens Ghosts & Artifacts)
                    贯穿光源，形成斜向的彩色伪影序列 
                */}
                <div
                    className="absolute"
                    style={{
                        left: x, top: y,
                        width: '200vw', height: '0', 
                        transform: `translate(-50%, 0) rotate(${angle}deg)`,
                    }}
                >
                    {/* 伪影 1: 靠近光源的六边形光圈 (光圈叶片) */}
                    <div className="absolute" 
                         style={{ 
                             left: '30%', top: '-25px', 
                             width: '40px', height: '40px', 
                             background: 'rgba(100, 220, 255, 0.05)', 
                             clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
                             border: '1px solid rgba(100, 220, 255, 0.15)',
                             filter: 'blur(1px)'
                         }} 
                    />
                    
                    {/* 伪影 2: 小蓝色高亮色散 */}
                    <div className="absolute rounded-full" 
                         style={{ 
                             left: '42%', top: '-8px', 
                             width: '12px', height: '12px', 
                             background: 'rgba(50, 150, 255, 0.15)', 
                             filter: 'blur(2px)' 
                         }} 
                    />

                    {/* 伪影 3: 绿色大空心环 */}
                    <div className="absolute rounded-full border border-green-400/10" 
                         style={{ 
                             left: '58%', top: '-40px', 
                             width: '60px', height: '60px', 
                             background: 'rgba(50, 255, 100, 0.01)',
                             filter: 'blur(2px)' 
                         }} 
                    />

                    {/* 伪影 4: 带有主体颜色的失焦大圆晕 */}
                    <div className="absolute rounded-full" 
                         style={{ 
                             left: '68%', top: '-75px', 
                             width: '120px', height: '120px', 
                             background: `radial-gradient(circle, rgba(${color}, 0.05) 0%, transparent 60%)`,
                             border: `1px solid rgba(${color}, 0.03)`,
                             filter: 'blur(4px)' 
                         }} 
                    />

                    {/* 伪影 5: 远端的品红六边形 */}
                    <div className="absolute" 
                         style={{ 
                             left: '82%', top: '-30px', 
                             width: '50px', height: '50px', 
                             background: 'rgba(200, 50, 255, 0.04)', 
                             clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
                             filter: 'blur(3px)'
                         }} 
                    />
                </div>
            </motion.div>
        </div>
    );
};
