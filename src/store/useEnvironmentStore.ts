import { create } from 'zustand';
import type { EnvironmentState, Weather, Time, Scene } from '@/types/environment';

export type Step = 1 | 2 | 3 | 4;

interface EnvironmentStore extends EnvironmentState {
    currentStep: Step;
    setWeather: (weather: Weather) => void;
    setTime: (time: Time) => void;
    setScene: (scene: Scene) => void;
    setPhotoUrl: (url: string) => void;
    setTags: (tags: string[]) => void;
    nextStep: () => void;
    prevStep: () => void;
    setStep: (step: Step) => void;
    resetToHome: () => void;
}

export const useEnvironmentStore = create<EnvironmentStore>((set) => ({
    currentStep: 1,
    weather: '晴天',
    time: '正午',
    scene: '沉浸阅读',
    photoUrl: undefined,
    tags: undefined,
    setWeather: (weather) => set({ weather }),
    setTime: (time) => set({ time }),
    setScene: (scene) => set({ scene }),
    setPhotoUrl: (photoUrl) => set({ photoUrl }),
    setTags: (tags) => set({ tags }),
    nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) as Step })),
    prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) as Step })),
    setStep: (step) => set({ currentStep: step }),
    resetToHome: () => set({
        currentStep: 1,
        weather: '晴天',
        time: '正午',
        scene: '沉浸阅读',
        photoUrl: undefined,
        tags: undefined,
    }),
}));

