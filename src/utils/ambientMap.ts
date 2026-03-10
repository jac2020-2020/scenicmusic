import type { Weather, Time, Scene } from '@/types/environment';

const AUDIO_BASE = '/audio';

export const getWeatherAudioPath = (weather: Weather): string => {
    const map: Record<Weather, string> = {
        '晴天': 'sunny.mp3',
        '多云': 'cloudy.mp3',
        '雨天': 'rain.mp3',
    };
    return `${AUDIO_BASE}/weather/${map[weather]}`;
};

export const getTimeAudioPath = (time: Time): string => {
    const map: Record<Time, string> = {
        '清晨': 'morning.mp3',
        '午后': 'noon.mp3',
        '傍晚': 'dusk.mp3',
        '夜晚': 'night.mp3',
        '凌晨': 'dawn.mp3',
    };
    return `${AUDIO_BASE}/time/${map[time]}`;
};

export const getSceneAudioPath = (scene: Scene): string => {
    const map: Record<Scene, string> = {
        '阅读': 'reading.mp3',
        '诗会': 'book-party.mp3',
        '小酌': 'wine.mp3',
        '美食': 'food.mp3',
    };
    return `${AUDIO_BASE}/scene/${map[scene]}`;
};
