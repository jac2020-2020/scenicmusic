export type Weather = '晴天' | '多云' | '阴天' | '大雨' | '小雨' | '雪天';
export type Time = '清晨' | '正午' | '傍晚' | '夜晚' | '凌晨';
export type Scene = '沉浸阅读' | '读书聚会' | '品酒时光' | '美食享受';
export type Mood = '愉悦' | '平静' | '忧伤' | '兴奋' | '疲惫' | '焦虑' | '怀旧' | '期待';

export interface EnvironmentState {
    weather: Weather;
    time: Time;
    scene: Scene;
    mood?: Mood;
    photoUrl?: string;
    tags?: string[];
}
