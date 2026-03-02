export type Weather = '晴天' | '多云' | '阴天' | '大雨' | '小雨' | '雪天';
export type Time = '清晨' | '正午' | '傍晚' | '夜晚' | '凌晨';
export type Scene = '沉浸阅读' | '文学聚会' | '品酒时光' | '美食盛宴';

export interface EnvironmentState {
    weather: Weather;
    time: Time;
    scene: Scene;
}
