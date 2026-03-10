import React, { useEffect, useRef, useCallback } from 'react';
import type { Weather } from '@/types/environment';

interface RainDrop {
    x: number;
    y: number;
    z: number;
    speedY: number;
    speedX: number;
    length: number;
    opacity: number;
    width: number;
}

interface SnowFlake {
    x: number;
    y: number;
    z: number;
    speedY: number;
    speedX: number;
    size: number;
    opacity: number;
    swayAmplitude: number;
    swayFrequency: number;
    swayOffset: number;
    rotation: number;
    rotationSpeed: number;
}

interface ButtonObstacle {
    x: number;
    y: number;
    radius: number;
}

interface WeatherParticlesProps {
    weather: Weather;
    time: string;
}

export const WeatherParticles: React.FC<WeatherParticlesProps> = ({ weather, time }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>(0);
    const rainDropsRef = useRef<RainDrop[]>([]);
    const snowFlakesRef = useRef<SnowFlake[]>([]);
    const windRef = useRef(0);
    const timeRef = useRef(0);
    const buttonsRef = useRef<ButtonObstacle[]>([]);
    const lastUpdateRef = useRef(0);

    // 检测并更新按钮位置
    const updateButtonPositions = useCallback(() => {
        const now = Date.now();
        // 每100ms更新一次按钮位置，避免频繁查询DOM
        if (now - lastUpdateRef.current < 100) return;
        lastUpdateRef.current = now;

        // 查找所有导航按钮
        const buttons = document.querySelectorAll('button[aria-label*="步"], button[aria-label*="首页"]');
        const newButtons: ButtonObstacle[] = [];

        buttons.forEach(btn => {
            const rect = btn.getBoundingClientRect();
            const radius = rect.width / 2;
            const centerX = rect.left + radius;
            const centerY = rect.top + radius;

            // 只记录在可视区域内的按钮
            if (centerY > 0 && centerY < window.innerHeight) {
                newButtons.push({
                    x: centerX,
                    y: centerY,
                    radius: radius + 5, // 稍微扩大碰撞范围
                });
            }
        });

        buttonsRef.current = newButtons;
    }, []);

    // 检测点与圆形按钮的碰撞
    const checkButtonCollision = (x: number, y: number): ButtonObstacle | null => {
        for (const btn of buttonsRef.current) {
            const dx = x - btn.x;
            const dy = y - btn.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < btn.radius) {
                return btn;
            }
        }
        return null;
    };

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

        // 初始化雨滴
        const initRain = () => {
            rainDropsRef.current = [];
            const isHeavyRain = weather === '雨天';
            const count = isHeavyRain ? 80 : 35;

            for (let i = 0; i < count; i++) {
                const z = Math.random();
                rainDropsRef.current.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    z,
                    speedY: (isHeavyRain ? 12 : 6) + Math.random() * 4 + z * 6,
                    speedX: (Math.random() - 0.5) * 0.5,
                    length: (isHeavyRain ? 15 : 8) + Math.random() * 10 + z * 10,
                    opacity: (isHeavyRain ? 0.15 : 0.1) + z * 0.1,
                    width: 0.5 + z * 0.8,
                });
            }
        };

        // 初始化雪花
        const initSnow = () => {
            snowFlakesRef.current = [];
            const count = 60;

            for (let i = 0; i < count; i++) {
                const z = Math.random();
                snowFlakesRef.current.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    z,
                    speedY: 0.4 + Math.random() * 0.4 + z * 0.3,
                    speedX: (Math.random() - 0.5) * 0.3,
                    size: 1 + Math.random() * 2 + z * 2,
                    opacity: 0.2 + z * 0.25,
                    swayAmplitude: 10 + Math.random() * 20,
                    swayFrequency: 0.001 + Math.random() * 0.002,
                    swayOffset: Math.random() * Math.PI * 2,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.02,
                });
            }
        };

        if (weather === '雨天') {
            initRain();
        }

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            timeRef.current += 16;

            // 更新按钮位置
            updateButtonPositions();

            // 模拟风的变化
            windRef.current = Math.sin(timeRef.current * 0.0001) * 0.5;

            // 获取受当前时段影响的环境光颜色
            const getParticleColor = (alpha: number) => {
                if (time === '夜晚') {
                    return `rgba(200, 210, 230, ${alpha})`; // 冷蓝
                } else if (time === '傍晚') {
                    // 傍晚的背景是烟粉到淡橘色，所以粒子需要更白、更亮一些，带极其微弱的暖光，否则会隐形
                    return `rgba(255, 240, 230, ${Math.min(1, alpha * 1.5)})`;
                } else {
                    return `rgba(255, 255, 255, ${alpha})`; // 自然白
                }
            };

            if (weather === '雨天') {
                rainDropsRef.current.forEach(drop => {
                    const windOffset = windRef.current * (1 + drop.z);
                    const endX = drop.x + drop.speedX + windOffset * 5;
                    const endY = drop.y + drop.length;

                    // 检测碰撞 - 使用雨滴的终点位置
                    const hitBtn = checkButtonCollision(endX, endY);
                    if (hitBtn) {
                        // 计算碰撞法线
                        const dx = endX - hitBtn.x;
                        const dy = endY - hitBtn.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const nx = dx / dist;
                        const ny = dy / dist;

                        // 雨滴碰到按钮后：沿表面滑落（更真实）
                        // 根据碰撞角度决定滑动方向
                        const slideDirection = nx > 0 ? 1 : -1;
                        drop.speedX = slideDirection * (0.5 + Math.random() * 0.5);
                        drop.speedY = Math.max(drop.speedY * 0.3, 2); // 减速但继续下落

                        // 位置调整：移到按钮边缘，沿边缘滑落
                        drop.x = hitBtn.x + nx * hitBtn.radius;
                        drop.y = hitBtn.y + ny * hitBtn.radius;

                        // 偶尔在边缘形成小水珠然后滴落
                        if (Math.random() > 0.95 && Math.abs(ny) > 0.5) {
                            // 在按钮下方边缘形成小水珠
                            ctx.beginPath();
                            ctx.arc(
                                hitBtn.x + nx * hitBtn.radius,
                                hitBtn.y + hitBtn.radius + 2,
                                Math.random() * 1.2,
                                0,
                                Math.PI * 2
                            );
                            ctx.fillStyle = getParticleColor(drop.opacity * 0.6);
                            ctx.fill();
                        }
                    }

                    // 绘制雨滴
                    const gradient = ctx.createLinearGradient(drop.x, drop.y, endX, endY);
                    gradient.addColorStop(0, getParticleColor(0));
                    gradient.addColorStop(0.3, getParticleColor(drop.opacity));
                    gradient.addColorStop(1, getParticleColor(drop.opacity * 0.3));

                    ctx.beginPath();
                    ctx.moveTo(drop.x, drop.y);
                    ctx.lineTo(endX, endY);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = drop.width;
                    ctx.lineCap = 'round';
                    ctx.stroke();

                    // 偶尔在雨滴头部添加小光点
                    if (drop.z > 0.7 && Math.random() > 0.98) {
                        ctx.beginPath();
                        ctx.arc(drop.x, drop.y, drop.width * 0.8, 0, Math.PI * 2);
                        ctx.fillStyle = getParticleColor(drop.opacity * 0.5);
                        ctx.fill();
                    }

                    // 更新位置
                    drop.y += drop.speedY;
                    drop.x += drop.speedX + windOffset;

                    // 恢复正常的下落速度（反弹后逐渐恢复）
                    const isHeavyRain = weather === '雨天';
                    const targetSpeedY = (isHeavyRain ? 12 : 6) + drop.z * 6;
                    if (drop.speedY < targetSpeedY) {
                        drop.speedY += 0.5; // 逐渐加速回到正常速度
                    }
                    // speedX 也逐渐回到接近0
                    drop.speedX *= 0.95;

                    // 重置
                    if (drop.y > height + drop.length) {
                        drop.y = -drop.length - Math.random() * 100;
                        drop.x = Math.random() * width;
                        // 重置速度
                        drop.speedY = targetSpeedY;
                        drop.speedX = (Math.random() - 0.5) * 0.5;
                    }
                    if (drop.x > width + 50) drop.x = -50;
                    if (drop.x < -50) drop.x = width + 50;
                });
            }

            if (false) { // 雪天已删除
                snowFlakesRef.current.forEach(flake => {
                    const sway = Math.sin(timeRef.current * flake.swayFrequency + flake.swayOffset) * flake.swayAmplitude * (1 + flake.z);
                    const windOffset = windRef.current * 20 * (1 + flake.z);

                    const drawX = flake.x + sway + windOffset;
                    const drawY = flake.y;

                    // 检测碰撞
                    const hitBtn = checkButtonCollision(drawX, drawY);
                    if (hitBtn) {
                        // 计算碰撞法线
                        const dx = drawX - hitBtn.x;
                        const dy = drawY - hitBtn.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const nx = dx / dist;
                        const ny = dy / dist;

                        // 雪花极轻柔地被推开，主要沿表面滑过
                        flake.speedX = nx * 0.3 + (Math.random() - 0.5) * 0.2;
                        flake.speedY = Math.abs(flake.speedY) * 0.5; // 明显减速，模拟被挡住

                        // 位置调整
                        flake.x = hitBtn.x + nx * hitBtn.radius - sway - windOffset;
                        flake.y = hitBtn.y + ny * hitBtn.radius;

                        // 轻微的旋转变化
                        flake.rotationSpeed += (Math.random() - 0.5) * 0.01;
                    }

                    ctx.save();
                    ctx.translate(drawX, drawY);
                    ctx.rotate(flake.rotation);

                    // 绘制雪花
                    ctx.beginPath();
                    if (flake.z > 0.6) {
                        const spikes = 6;
                        const outerRadius = flake.size;
                        const innerRadius = flake.size * 0.4;
                        for (let i = 0; i < spikes * 2; i++) {
                            const r = i % 2 === 0 ? outerRadius : innerRadius;
                            const angle = (i / (spikes * 2)) * Math.PI * 2;
                            const x = Math.cos(angle) * r;
                            const y = Math.sin(angle) * r;
                            if (i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.closePath();
                        ctx.strokeStyle = getParticleColor(flake.opacity);
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    } else {
                        ctx.arc(0, 0, flake.size * 0.6, 0, Math.PI * 2);
                        ctx.fillStyle = getParticleColor(flake.opacity);
                        ctx.fill();
                    }

                    ctx.restore();

                    // 更新
                    flake.y += flake.speedY;
                    flake.x += flake.speedX;
                    flake.rotation += flake.rotationSpeed;

                    // 逐渐恢复正常状态
                    flake.speedX *= 0.98;
                    flake.rotationSpeed *= 0.98;
                    const targetSpeedY = 0.8 + flake.z * 0.6;
                    if (flake.speedY < targetSpeedY) {
                        flake.speedY += 0.02;
                    }

                    // 重置
                    if (flake.y > height + 10) {
                        flake.y = -10 - Math.random() * 50;
                        flake.x = Math.random() * width;
                        flake.speedY = targetSpeedY;
                        flake.speedX = (Math.random() - 0.5) * 0.3;
                        flake.rotationSpeed = (Math.random() - 0.5) * 0.02;
                    }
                    if (flake.x > width + 50) flake.x = -50;
                    if (flake.x < -50) flake.x = width + 50;
                });
            }

            animationFrameRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [weather, time, updateButtonPositions]);

    if (weather !== '雨天') return null;

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-10"
        />
    );
};
