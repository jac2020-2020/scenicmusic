import { create } from 'zustand';
import type { EnvironmentState, Weather, Time, Scene, Mood } from '@/types/environment';

export type Step = 1 | 2 | 3 | 4 | 5;

interface EnvironmentStore extends EnvironmentState {
    currentStep: Step;
    setWeather: (weather: Weather) => void;
    setTime: (time: Time) => void;
    setScene: (scene: Scene) => void;
    setMood: (mood: Mood | undefined) => void;
    setPhotoUrl: (url: string) => void;
    setTags: (tags: string[]) => void;
    
    // 音量设置
    volumes: Record<string, number>;
    setVolume: (id: string, volume: number) => void;
    musicVolume: number;
    setMusicVolume: (volume: number) => void;

    nextStep: () => void;
    prevStep: () => void;
    setStep: (step: Step) => void;
    resetToHome: () => void;

    // 音频解锁（浏览器需用户点击后才允许播放）
    audioUnlocked: boolean;
    setAudioUnlocked: (v: boolean) => void;
}

export const useEnvironmentStore = create<EnvironmentStore>((set) => ({
    currentStep: 1,
    weather: '晴天',
    time: '正午',
    scene: '沉浸阅读',
    mood: undefined,
    photoUrl: undefined,
    tags: undefined,
    
    // 默认音量设定
    volumes: {},
    musicVolume: 0.7,

    setWeather: (weather) => set({ weather }),
    setTime: (time) => set({ time }),
    setScene: (scene) => set({ scene }),
    setMood: (mood) => set({ mood }),
    setPhotoUrl: (photoUrl) => set({ photoUrl }),
    setTags: (tags) => set({ tags }),
    
    setVolume: (id, volume) => set((state) => ({
        volumes: { ...state.volumes, [id]: volume }
    })),
    setMusicVolume: (musicVolume) => set({ musicVolume }),

    nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) as Step })),
    prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) as Step })),
    setStep: (step) => set({ currentStep: step }),
    resetToHome: () => set((state) => ({
        currentStep: 1,
        weather: '晴天',
        time: '正午',
        scene: '沉浸阅读',
        mood: undefined,
        photoUrl: undefined,
        tags: undefined,
        // 重置时保留用户设置的音量，或根据需求重置
        // 这里选择保留，所以不覆盖 volume 状态
    })),

    audioUnlocked: false,
    setAudioUnlocked: (v) => set({ audioUnlocked: v }),
}));

