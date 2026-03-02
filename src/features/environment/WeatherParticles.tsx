import React, { useEffect, useRef } from 'react';
import type { Weather } from '@/types/environment';

interface Particle {
    x: number;
    y: number;
    speedX: number;
    speedY: number;
    size: number;
    opacity: number;
}

interface WeatherParticlesProps {
    weather: Weather;
}

export const WeatherParticles: React.FC<WeatherParticlesProps> = ({ weather }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);

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

        // 初始化粒子
        const initParticles = () => {
            particlesRef.current = [];
            let count = 0;
            if (weather === '大雨') count = 200;
            if (weather === '小雨') count = 80;
            if (weather === '雪天') count = 150;

            for (let i = 0; i < count; i++) {
                particlesRef.current.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    speedX: weather === '雪天' ? (Math.random() - 0.5) * 1 : (Math.random() - 0.5) * 0.5 + 0.5,
                    speedY: weather === '雪天' ? Math.random() * 1 + 1 : weather === '大雨' ? Math.random() * 5 + 10 : Math.random() * 2 + 5,
                    size: weather === '雪天' ? Math.random() * 3 + 1 : Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.5 + 0.3,
                });
            }
        };

        initParticles();

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            
            ctx.fillStyle = weather === '雪天' ? 'white' : '#a0aec0';

            particlesRef.current.forEach(p => {
                ctx.beginPath();
                if (weather === '雪天') {
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                    ctx.fill();
                } else {
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x + p.speedX * 2, p.y + p.speedY * 2);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity})`;
                    ctx.lineWidth = p.size;
                    ctx.stroke();
                }

                p.x += p.speedX;
                p.y += p.speedY;

                if (p.y > height) {
                    p.y = -10;
                    p.x = Math.random() * width;
                }
                if (p.x > width) p.x = 0;
                if (p.x < 0) p.x = width;
            });

            animationFrameRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [weather]);

    if (!['大雨', '小雨', '雪天'].includes(weather)) return null;

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-10"
        />
    );
};
