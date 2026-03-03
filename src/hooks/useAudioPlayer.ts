import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface UseAudioPlayerOptions {
    src: string;
    fadeDurationMs?: number;
    initialVolume?: number;
}

interface UseAudioPlayerReturn {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    play: () => Promise<void>;
    pause: () => Promise<void>;
    seek: (nextTime: number) => void;
    setVolume: (nextVolume: number) => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const useAudioPlayer = ({
    src,
    fadeDurationMs = 1200,
    initialVolume = 0.7,
}: UseAudioPlayerOptions): UseAudioPlayerReturn => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fadeRafRef = useRef<number | null>(null);
    const fadeStartRef = useRef<number | null>(null);
    const fadeFromRef = useRef(0);
    const fadeToRef = useRef(0);
    const fadeResolverRef = useRef<(() => void) | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(clamp(initialVolume, 0, 1));

    // 新增：允许外部改变 volume 时同步到 audio 元素，并忽略正在进行的淡入淡出（如果有必要）
    useEffect(() => {
        if (audioRef.current && audioRef.current.volume !== volume) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const stopFade = useCallback(() => {
        if (fadeRafRef.current !== null) {
            window.cancelAnimationFrame(fadeRafRef.current);
            fadeRafRef.current = null;
        }
        if (fadeResolverRef.current) {
            fadeResolverRef.current();
            fadeResolverRef.current = null;
        }
        fadeStartRef.current = null;
    }, []);

    useEffect(() => {
        const audio = new Audio(src);
        audio.preload = 'metadata';
        audioRef.current = audio;
        audio.volume = volume;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
        const handleDurationChange = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(audio.duration || 0);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMeta);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);

        return () => {
            stopFade();
            audio.pause();
            audio.src = '';
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMeta);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [src, stopFade]);

    const fadeTo = useCallback((target: number) => {
        const audio = audioRef.current;
        if (!audio) return Promise.resolve();

        stopFade();

        fadeFromRef.current = audio.volume;
        fadeToRef.current = clamp(target, 0, 1);
        fadeStartRef.current = null;

        return new Promise<void>((resolve) => {
            fadeResolverRef.current = resolve;
            const tick = (timestamp: number) => {
                if (!audioRef.current) {
                    resolve();
                    return;
                }

                if (fadeStartRef.current === null) {
                    fadeStartRef.current = timestamp;
                }

                const elapsed = timestamp - fadeStartRef.current;
                const progress = clamp(elapsed / fadeDurationMs, 0, 1);
                const nextVolume = fadeFromRef.current + (fadeToRef.current - fadeFromRef.current) * progress;
                audioRef.current.volume = nextVolume;

                if (progress < 1) {
                    fadeRafRef.current = window.requestAnimationFrame(tick);
                    return;
                }

                fadeRafRef.current = null;
                fadeStartRef.current = null;
                if (fadeResolverRef.current) {
                    fadeResolverRef.current();
                    fadeResolverRef.current = null;
                }
            };

            fadeRafRef.current = window.requestAnimationFrame(tick);
        });
    }, [fadeDurationMs, stopFade]);

    const play = useCallback(async () => {
        const audio = audioRef.current;
        if (!audio) return;
        stopFade();
        audio.volume = 0;
        await audio.play();
        await fadeTo(volume);
    }, [fadeTo, stopFade, volume]);

    const pause = useCallback(async () => {
        const audio = audioRef.current;
        if (!audio) return;
        await fadeTo(0);
        audio.pause();
        audio.volume = volume;
    }, [fadeTo, volume]);

    const seek = useCallback((nextTime: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        const safeTime = clamp(nextTime, 0, duration || 0);
        audio.currentTime = safeTime;
        setCurrentTime(safeTime);
    }, [duration]);

    const setVolume = useCallback((nextVolume: number) => {
        const safe = clamp(nextVolume, 0, 1);
        setVolumeState(safe);
        if (audioRef.current) {
            audioRef.current.volume = safe;
        }
    }, []);

    return useMemo(() => ({
        isPlaying,
        currentTime,
        duration,
        volume,
        play,
        pause,
        seek,
        setVolume,
    }), [currentTime, duration, isPlaying, pause, play, seek, setVolume, volume]);
};
