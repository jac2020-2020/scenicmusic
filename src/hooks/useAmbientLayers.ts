import { useEffect, useRef } from 'react';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { getWeatherAudioPath, getTimeAudioPath, getSceneAudioPath } from '@/utils/ambientMap';
import type { Weather, Time, Scene } from '@/types/environment';

const LAYER_VOLUME = 0.12; // 每层音效基础音量，三层叠加约 0.36
const CROSSFADE_MS = 1800; // 切换淡入淡出时长

// 午后音频音量进一步减小
const VOL_MULT_TIME_AFTERNOON = 0.5;
const VOL_MULT_TIME_MORNING = 0.5;

const getPathFromSrc = (src: string): string => {
    if (!src) return '';
    try {
        const url = src.startsWith('http') || src.startsWith('file')
            ? new URL(src)
            : new URL(src, window.location.origin);
        return url.pathname;
    } catch {
        return src.split('?')[0] || '';
    }
};

const pathsMatch = (current: string, incoming: string): boolean => {
    const norm = (p: string) => (p.startsWith('/') ? p : `/${p}`).toLowerCase().replace(/\/+/g, '/');
    return norm(current) === norm(incoming);
};

const crossfade = (
    outAudio: HTMLAudioElement,
    inAudio: HTMLAudioElement,
    targetVol: number,
    durationMs: number
) => {
    const start = performance.now();
    let rafId: number;

    const tick = () => {
        const elapsed = performance.now() - start;
        const t = Math.min(1, elapsed / durationMs);
        const eased = t * t * (3 - 2 * t); // smoothstep
        outAudio.volume = Math.max(0, targetVol * (1 - eased));
        inAudio.volume = Math.min(targetVol, targetVol * eased);
        if (t < 1) rafId = requestAnimationFrame(tick);
        else {
            outAudio.pause();
            outAudio.currentTime = 0;
        }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
};

export const useAmbientLayers = () => {
    const {
        weather,
        time,
        scene,
        currentStep,
        volumes,
        audioUnlocked,
        playbackRunning,
    } = useEnvironmentStore();

    // Weather layers
    const weatherRefs = useRef<Record<string, { a: HTMLAudioElement; b: HTMLAudioElement; active: 'A' | 'B' }>>({});
    // Time layers
    const timeRefs = useRef<Record<string, { a: HTMLAudioElement; b: HTMLAudioElement; active: 'A' | 'B' }>>({});
    // Scene layers
    const sceneRefs = useRef<Record<string, { a: HTMLAudioElement; b: HTMLAudioElement; active: 'A' | 'B' }>>({});

    useEffect(() => {
        const createPair = () => {
            const a = new Audio();
            const b = new Audio();
            a.loop = true;
            b.loop = true;
            a.volume = 0;
            b.volume = 0;
            return { a, b, active: 'A' as const };
        };

        const playLayer = (
            refs: React.MutableRefObject<Record<string, { a: HTMLAudioElement; b: HTMLAudioElement; active: 'A' | 'B' }>>,
            key: string,
            src: string,
            isActive: boolean,
            baseVolume: number,
            volMultiplier = 1
        ): (() => void) | void => {
            if (!refs.current[key]) {
                refs.current[key] = createPair();
            }
            const layer = refs.current[key];
            const a = layer.a;
            const b = layer.b;

            const targetVol = LAYER_VOLUME * baseVolume * volMultiplier;

            if (!isActive || baseVolume === 0) {
                a.pause();
                a.volume = 0;
                b.pause();
                b.volume = 0;
                return;
            }

            const current = layer.active === 'A' ? a : b;
            const next = layer.active === 'A' ? b : a;

            const currentSrc = getPathFromSrc(current.src);
            const newSrcPath = src.startsWith('/') ? src : `/${src}`;
            if (pathsMatch(currentSrc, newSrcPath)) {
                if (current.paused) {
                    current.volume = targetVol;
                    const playPromise = current.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(e => console.log('Audio play failed:', e));
                    }
                } else {
                    current.volume = targetVol;
                }
                return;
            }

            const isFirstPlay = !current.src || current.src === '';
            next.src = newSrcPath;
            const onCanPlay = () => {
                if (isFirstPlay) {
                    next.volume = targetVol;
                    const playPromise = next.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(e => console.log('Audio play failed:', e));
                    }
                } else {
                    next.volume = 0;
                    const playPromise = next.play();
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            crossfade(current, next, targetVol, CROSSFADE_MS);
                        }).catch(e => console.log('Audio play failed:', e));
                    }
                }
                layer.active = layer.active === 'A' ? 'B' : 'A';
                next.removeEventListener('canplay', onCanPlay);
            };
            next.addEventListener('canplay', onCanPlay);
            return () => next.removeEventListener('canplay', onCanPlay);
        };

        if (!audioUnlocked) return;

        const canPlayInCurrentStep =
            currentStep <= 2 ||
            currentStep === 3 ||
            (currentStep === 4 && playbackRunning);
        const stepAllowsWeatherTime = canPlayInCurrentStep && currentStep >= 1;
        const stepAllowsScene = canPlayInCurrentStep && currentStep >= 2;

        // 获取所有可能的天气/时间/场景
        const allWeathers: Weather[] = ['晴天', '阴天', '雨天'];
        const allTimes: Time[] = ['清晨', '午后', '傍晚', '夜晚'];
        const allScenes: Scene[] = ['阅读', '诗会', '小酌', '美食'];

        const cleanups: Array<() => void> = [];

        // 对每一个选项，如果有设置音量则播放它，如果它是当前选中的选项，则必须播放（即使没有手动设置音量，默认音量为 1）
        allWeathers.forEach(w => {
            const isActive = stepAllowsWeatherTime && (weather === w || (volumes[`weather_${w}`] ?? 0) > 0);
            const baseVol = weather === w && volumes[`weather_${w}`] === undefined ? 1 : (volumes[`weather_${w}`] ?? 0);
            const c = playLayer(weatherRefs, w, getWeatherAudioPath(w), isActive, baseVol, 1);
            if (c) cleanups.push(c);
        });

        allTimes.forEach(t => {
            const isActive = stepAllowsWeatherTime && (time === t || (volumes[`time_${t}`] ?? 0) > 0);
            const baseVol = time === t && volumes[`time_${t}`] === undefined ? 1 : (volumes[`time_${t}`] ?? 0);
            const mult = t === '午后' ? VOL_MULT_TIME_AFTERNOON : t === '清晨' ? VOL_MULT_TIME_MORNING : 1;
            const c = playLayer(timeRefs, t, getTimeAudioPath(t), isActive, baseVol, mult);
            if (c) cleanups.push(c);
        });

        allScenes.forEach(s => {
            const isActive = stepAllowsScene && (scene === s || (volumes[`scene_${s}`] ?? 0) > 0);
            const baseVol = scene === s && volumes[`scene_${s}`] === undefined ? 1 : (volumes[`scene_${s}`] ?? 0);
            const c = playLayer(sceneRefs, s, getSceneAudioPath(s), isActive, baseVol);
            if (c) cleanups.push(c);
        });

        return () => cleanups.forEach(fn => fn());
    }, [weather, time, scene, currentStep, volumes, audioUnlocked, playbackRunning]);
};
