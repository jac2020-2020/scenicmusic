import { useEffect, useMemo, useState } from 'react';

const pad = (value: number) => value.toString().padStart(2, '0');

export const formatSeconds = (totalSeconds: number) => {
    const safeSeconds = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

/** 时长自然格式：3秒、5分钟、2小时1分钟 */
export const formatDurationNatural = (totalSeconds: number) => {
    const s = Math.max(0, Math.floor(totalSeconds));
    if (s < 60) return `${s}秒`;
    const m = Math.floor(s / 60);
    const secs = s % 60;
    if (s < 3600) return secs > 0 ? `${m}分钟${secs}秒` : `${m}分钟`;
    const h = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const parts: string[] = [`${h}小时`];
    if (mins > 0) parts.push(`${mins}分钟`);
    if (secs > 0) parts.push(`${secs}秒`);
    return parts.join('');
};

export const useFocusTimer = (isRunning: boolean) => {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        if (!isRunning) return undefined;

        const intervalId = window.setInterval(() => {
            setElapsedSeconds(prev => prev + 1);
        }, 1000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [isRunning]);

    const formatted = useMemo(() => formatSeconds(elapsedSeconds), [elapsedSeconds]);

    return {
        elapsedSeconds,
        formatted,
    };
};
