import type { Scene, Time, Weather } from '@/types/environment';

interface ResolveEmotionOptions {
    weather: Weather;
    time: Time;
    scene: Scene;
}

const WEATHER_EMOTION: Record<Weather, string[]> = {
    晴天: ['明朗', '轻快'],
    多云: ['舒展', '平衡'],
    雨天: ['包裹感', '深沉'],
};

const TIME_EMOTION: Record<Time, string[]> = {
    清晨: ['焕新', '呼吸感'],
    午后: ['活力', '通透'],
    傍晚: ['松弛', '余韵'],
    夜晚: ['沉浸', '柔和'],
};

const SCENE_EMOTION: Record<Scene, string[]> = {
    阅读: ['专注', '宁静'],
    诗会: ['灵感', '共鸣'],
    小酌: ['醇厚', '微醺'],
    美食: ['丰盈', '欢聚'],
};

export const resolveEmotionTags = ({ weather, time, scene }: ResolveEmotionOptions) => {
    const merged = [
        ...SCENE_EMOTION[scene],
        ...WEATHER_EMOTION[weather],
        ...TIME_EMOTION[time],
    ];

    const deduped = Array.from(new Set(merged));
    return deduped.slice(0, 3);
};
