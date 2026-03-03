import type { Scene, Time, Weather } from '@/types/environment';

interface ResolveEmotionOptions {
    weather: Weather;
    time: Time;
    scene: Scene;
    tags?: string[];
}

const WEATHER_EMOTION: Record<Weather, string[]> = {
    晴天: ['明朗', '轻快'],
    多云: ['舒展', '平衡'],
    阴天: ['安静', '沉思'],
    大雨: ['包裹感', '深沉'],
    小雨: ['微醺', '温柔'],
    雪天: ['清透', '静谧'],
};

const TIME_EMOTION: Record<Time, string[]> = {
    清晨: ['焕新', '呼吸感'],
    正午: ['活力', '通透'],
    傍晚: ['松弛', '余韵'],
    夜晚: ['沉浸', '柔和'],
    凌晨: ['独处', '低语'],
};

const SCENE_EMOTION: Record<Scene, string[]> = {
    沉浸阅读: ['专注', '宁静'],
    读书聚会: ['灵感', '共鸣'],
    品酒时光: ['醇厚', '微醺'],
    美食享受: ['丰盈', '欢聚'],
};

const TAG_HINTS: Record<string, string> = {
    书本: '知性',
    书桌: '秩序',
    咖啡杯: '松弛',
    酒杯: '浪漫',
    阳光: '温暖',
    植物: '自然',
    餐桌: '满足',
};

export const resolveEmotionTags = ({ weather, time, scene, tags = [] }: ResolveEmotionOptions) => {
    const merged = [
        ...SCENE_EMOTION[scene],
        ...WEATHER_EMOTION[weather],
        ...TIME_EMOTION[time],
        ...tags.map(tag => TAG_HINTS[tag]).filter(Boolean),
    ];

    const deduped = Array.from(new Set(merged));
    return deduped.slice(0, 3);
};
