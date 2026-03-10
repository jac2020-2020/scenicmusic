export type Weather = '晴天' | '阴天' | '雨天';
export type Time = '清晨' | '午后' | '傍晚' | '夜晚';
export type Scene = '阅读' | '诗会' | '小酌' | '美食';
export type Mood = '愉悦' | '平静' | '忧伤' | '兴奋' | '疲惫' | '焦虑' | '怀旧' | '期待';

export interface EnvironmentState {
    weather: Weather;
    time: Time;
    scene: Scene;
    mood?: Mood;

    // 音量控制 (0.0 - 1.0)
    volumes: Record<string, number>;
    musicVolume: number;
}
