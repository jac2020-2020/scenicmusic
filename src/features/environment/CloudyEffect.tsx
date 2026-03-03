import React, { useEffect, useRef } from 'react';

interface Cloud {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    opacity: number;
    scale: number;
    layer: number; // 0 = 远, 1 = 中, 2 = 近
}

export const CloudyEffect: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cloudsRef = useRef<Cloud[]>([]);
    const animationFrameRef = useRef<number>(0);

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

        // 初始化云层 - 只生成1-2朵云，避免重叠
        const initClouds = () => {
            cloudsRef.current = [];

            // 只有1朵淡淡的远景云
            cloudsRef.current.push({
                x: Math.random() * width * 0.5,
                y: Math.random() * height * 0.15 + 50,
                width: 250 + Math.random() * 150,
                height: 45 + Math.random() * 20,
                speed: 0.03 + Math.random() * 0.02,
                opacity: 0.05 + Math.random() * 0.03,
                scale: 0.6,
                layer: 0,
            });

            // 偶尔有第2朵，位置错开
            if (Math.random() > 0.4) {
                cloudsRef.current.push({
                    x: width * 0.6 + Math.random() * width * 0.5,
                    y: Math.random() * height * 0.12 + 90,
                    width: 200 + Math.random() * 180,
                    height: 38 + Math.random() * 18,
                    speed: 0.04 + Math.random() * 0.02,
                    opacity: 0.04 + Math.random() * 0.03,
                    scale: 0.55,
                    layer: 0,
                });
            }
        };

        initClouds();

        // 绘制一朵云
        const drawCloud = (cloud: Cloud) => {
            const { x, y, width: w, height: h, opacity, layer } = cloud;

            ctx.save();

            // 非常柔和的模糊
            ctx.filter = 'blur(70px)';

            // 绘制一朵融合的云 - 三个圆紧密重叠形成整体
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;

            // 主体 - 中心大圆（稍微偏下）
            ctx.beginPath();
            ctx.arc(x + w * 0.5, y + h * 0.55, h * 0.65, 0, Math.PI * 2);
            ctx.fill();

            // 左侧圆 - 与主体大量重叠
            ctx.beginPath();
            ctx.arc(x + w * 0.32, y + h * 0.5, h * 0.5, 0, Math.PI * 2);
            ctx.fill();

            // 右侧圆 - 与主体大量重叠
            ctx.beginPath();
            ctx.arc(x + w * 0.68, y + h * 0.5, h * 0.52, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        };

        let time = 0;

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            time += 0.016;


            // 绘制所有云

            cloudsRef.current.forEach(cloud => {
                // 更新位置
                cloud.x += cloud.speed;

                // 添加上下轻微浮动
                const floatY = Math.sin(time * 0.5 + cloud.x * 0.001) * 3;

                // 绘制云（使用浮动后的位置）
                const cloudWithFloat = { ...cloud, y: cloud.y + floatY };
                drawCloud(cloudWithFloat);

                // 如果云完全移出屏幕右侧，重置到左侧
                if (cloud.x > width + cloud.width * 0.5) {
                    cloud.x = -cloud.width - Math.random() * 200;
                    cloud.y = Math.random() * height * 0.15 + 50;
                }
            });

            animationFrameRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 5 }}
        />
    );
};
