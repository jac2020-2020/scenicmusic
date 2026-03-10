export type Weather = '晴天' | '多云' | '雨天';
export type Time = '清晨' | '午后' | '傍晚' | '夜晚';
export type Scene = '阅读' | '诗会' | '小酌' | '美食';

// 播放模式
export type PlayMode = 'list' | 'shuffle' | 'loop' | 'single';

// 歌曲
export interface Track {
    id: string;
    name: string;
    artist: string;
    description: string;
    audioUrl: string;
    poem?: string[];
}

// 歌单
export interface Playlist {
    id: string;
    name: string;
    weather: Weather;
    time: Time;
    scene: Scene;
    tracks: Track[];
}

export interface EnvironmentState {
    weather: Weather;
    time: Time;
    scene: Scene;

    // 音量控制 (0.0 - 1.0)
    volumes: Record<string, number>;
    musicVolume: number;
}
