import { useEffect, useMemo, useState } from 'react';

const pad = (value: number) => value.toString().padStart(2, '0');

export const formatSeconds = (totalSeconds: number) => {
    const safeSeconds = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
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
