import React, { useEffect, useRef } from 'react';
import type { Time } from '@/types/environment';

interface CloudPart {
    cx: number;
    cy: number;
    r: number;
}

interface Cloud {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    baseOpacity: number;
    scale: number;
    layer: number; // 0 = 远(暗/慢), 1 = 中, 2 = 近(亮/快)
    parts: CloudPart[];
}

interface CloudyEffectProps {
    time: Time;
}

interface RGB { r: number; g: number; b: number; }

const parseColor = (str: string): RGB => {
    const [r, g, b] = str.split(',').map(s => Number(s.trim()));
    return { r, g, b };
};

const lerpColor = (c1: RGB, c2: RGB, t: number): RGB => {
    return {
        r: c1.r + (c2.r - c1.r) * t,
        g: c1.g + (c2.g - c1.g) * t,
        b: c1.b + (c2.b - c1.b) * t,
    };
};

const toRgbString = (c: RGB) => `${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}`;

const getCloudColors = (time: Time) => {
    switch (time) {
        case '清晨':
            return {
                highlight: '255, 240, 245',
                mid: '240, 220, 225',
                shadow: '200, 180, 190',
                opacity: 0.45, // 降低整体透明度
            };
        case '正午':
            return {
                highlight: '255, 255, 255',
                mid: '245, 245, 250',
                shadow: '210, 215, 225',
                opacity: 0.55,
            };
        case '傍晚':
            return {
                highlight: '255, 210, 190',
                mid: '240, 170, 160',
                shadow: '180, 130, 140',
                opacity: 0.5,
            };
        case '夜晚':
        case '凌晨':
            return {
                highlight: '140, 160, 190',
                mid: '100, 120, 150',
                shadow: '60, 75, 100',
                opacity: 0.25,
            };
    }
};

const generateCloudParts = (width: number, height: number): CloudPart[] => {
    const parts: CloudPart[] = [];
    // 中心主云团
    parts.push({ cx: width * 0.5, cy: height * 0.6, r: height * 0.5 });
    // 左侧副云团
    parts.push({ cx: width * 0.25, cy: height * 0.7, r: height * 0.35 });
    // 右侧副云团
    parts.push({ cx: width * 0.75, cy: height * 0.7, r: height * 0.38 });
    // 左上部凸起
    parts.push({ cx: width * 0.35, cy: height * 0.4, r: height * 0.4 });
    // 右上部凸起
    parts.push({ cx: width * 0.65, cy: height * 0.45, r: height * 0.35 });
    // 边缘小团，增加松散感
    parts.push({ cx: width * 0.1, cy: height * 0.8, r: height * 0.2 });
    parts.push({ cx: width * 0.9, cy: height * 0.8, r: height * 0.25 });
    return parts;
};

export const CloudyEffect: React.FC<CloudyEffectProps> = ({ time }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cloudsRef = useRef<Cloud[]>([]);
    const animationFrameRef = useRef<number>(0);
    const currentColorRef = useRef(getCloudColors(time));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        // 初始化体积云，生成5-6朵云
        const initClouds = () => {
            cloudsRef.current = [];
            const count = 6;
            for (let i = 0; i < count; i++) {
                const layer = i % 3; // 0=远, 1=中, 2=近
                const scale = 0.6 + Math.random() * 1.5; // 大小差异
                const w = 300 * scale;
                const h = 120 * scale;
                cloudsRef.current.push({
                    x: Math.random() * width,
                    // 云层高度分布：限制在屏幕中下部（避开顶部文字）
                    // 从 height 的 35% 处开始向下分布，最大延伸到底部附近
                    y: height * 0.35 + Math.random() * height * 0.4 + (layer * 30),
                    width: w,
                    height: h,
                    // 近景云移动更快
                    speed: (0.15 + Math.random() * 0.2) * (layer * 0.5 + 1),
                    baseOpacity: 0.4 + Math.random() * 0.3, // 进一步降低基础透明度，使其更内敛
                    scale,
                    layer,
                    parts: generateCloudParts(w, h),
                });
            }
        };

        initClouds();

        let animTime = 0;

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            animTime += 0.016;

            // 平滑过渡颜色
            const targetColors = getCloudColors(time);
            const current = currentColorRef.current;
            
            const curH = parseColor(current.highlight);
            const tarH = parseColor(targetColors.highlight);
            const curM = parseColor(current.mid);
            const tarM = parseColor(targetColors.mid);
            const curS = parseColor(current.shadow);
            const tarS = parseColor(targetColors.shadow);

            const lerpFactor = 0.02; // 缓动系数，实现丝滑变色
            
            current.highlight = toRgbString(lerpColor(curH, tarH, lerpFactor));
            current.mid = toRgbString(lerpColor(curM, tarM, lerpFactor));
            current.shadow = toRgbString(lerpColor(curS, tarS, lerpFactor));
            current.opacity = current.opacity + (targetColors.opacity - current.opacity) * lerpFactor;

            // 为了让云朵看起来柔和，我们给整个画布加一点点全局模糊（注意性能，不要太大）
            ctx.filter = 'blur(12px)';

            // 按层级排序绘制 (从远到近: 0 -> 1 -> 2)
            const sortedClouds = [...cloudsRef.current].sort((a, b) => a.layer - b.layer);

            sortedClouds.forEach(cloud => {
                // 更新位置：向右飘动
                cloud.x += cloud.speed;

                // 上下轻微浮动，具有呼吸感
                const floatY = Math.sin(animTime * 0.3 + cloud.x * 0.005) * 8 * cloud.scale;

                // 如果云完全移出屏幕右侧，重置到左侧屏幕外
                if (cloud.x > width + cloud.width * 0.5) {
                    cloud.x = -cloud.width * 1.5;
                    cloud.y = height * 0.35 + Math.random() * height * 0.4 + (cloud.layer * 30);
                }

                ctx.save();
                
                // 根据层级决定透明度，远景云更透明
                const layerAlpha = cloud.layer === 0 ? 0.4 : cloud.layer === 1 ? 0.7 : 1.0;
                ctx.globalAlpha = cloud.baseOpacity * current.opacity * layerAlpha;

                // 绘制云的每一个组成圆，形成体积感
                cloud.parts.forEach(part => {
                    const drawX = cloud.x + part.cx;
                    const drawY = cloud.y + part.cy + floatY;
                    
                    // 使用径向渐变模拟单侧受光（例如高光在左上，阴影在右下）
                    // 渐变中心稍微向左上偏移
                    const grad = ctx.createRadialGradient(
                        drawX - part.r * 0.2, drawY - part.r * 0.3, part.r * 0.1,
                        drawX, drawY, part.r
                    );
                    
                    grad.addColorStop(0, `rgba(${current.highlight}, 1)`);
                    grad.addColorStop(0.4, `rgba(${current.mid}, 0.8)`);
                    grad.addColorStop(1, `rgba(${current.shadow}, 0)`);

                    ctx.beginPath();
                    ctx.arc(drawX, drawY, part.r, 0, Math.PI * 2);
                    ctx.fillStyle = grad;
                    ctx.fill();
                });

                ctx.restore();
            });

            // 恢复滤镜，避免影响其他可能的东西
            ctx.filter = 'none';

            animationFrameRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [time]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 6 }}
        />
    );
};
