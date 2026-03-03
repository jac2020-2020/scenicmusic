import type { Weather, Time, Scene } from '@/types/environment';

const AUDIO_BASE = '/audio';

export const getWeatherAudioPath = (weather: Weather): string => {
    const map: Record<Weather, string> = {
        '晴天': 'sunny.mp3',
        '多云': 'cloudy.mp3',
        '阴天': 'overcast.mp3',
        '大雨': 'rain-heavy.mp3',
        '小雨': 'rain-light.mp3',
        '雪天': 'snow.mp3',
    };
    return `${AUDIO_BASE}/weather/${map[weather]}`;
};

export const getTimeAudioPath = (time: Time): string => {
    const map: Record<Time, string> = {
        '清晨': 'morning.mp3',
        '正午': 'noon.mp3',
        '傍晚': 'dusk.mp3',
        '夜晚': 'night.mp3',
        '凌晨': 'dawn.mp3',
    };
    return `${AUDIO_BASE}/time/${map[time]}`;
};

export const getSceneAudioPath = (scene: Scene): string => {
    const map: Record<Scene, string> = {
        '沉浸阅读': 'reading.wav',
        '读书聚会': 'book-party.wav',
        '品酒时光': 'wine.mp3',
        '美食享受': 'food.mp3',
    };
    return `${AUDIO_BASE}/scene/${map[scene]}`;
};
