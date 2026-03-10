import { create } from 'zustand';
import type { EnvironmentState, Weather, Time, Scene, PlayMode, Playlist, Track } from '@/types/environment';

export type Step = 1 | 2 | 3;

interface EnvironmentStore extends EnvironmentState {
    currentStep: Step;
    setWeather: (weather: Weather) => void;
    setTime: (time: Time) => void;
    setScene: (scene: Scene) => void;

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
    playbackRunning: boolean;
    setPlaybackRunning: (v: boolean) => void;

    // 歌单相关
    currentPlaylist: Playlist | null;
    currentTrackIndex: number;
    playMode: PlayMode;
    isPlaylistOpen: boolean;
    currentTrack: Track | null;

    // 歌单 Actions
    setCurrentPlaylist: (playlist: Playlist) => void;
    setCurrentTrackIndex: (index: number) => void;
    nextTrack: () => void;
    prevTrack: () => void;
    setPlayMode: (mode: PlayMode) => void;
    cyclePlayMode: () => void;
    setPlaylistOpen: (open: boolean) => void;
    setCurrentTrack: (track: Track) => void;
}

export const useEnvironmentStore = create<EnvironmentStore>((set, get) => ({
    currentStep: 1,
    weather: '晴天',
    time: '午后',
    scene: '阅读',

    // 默认音量设定
    volumes: {},
    musicVolume: 0.6,

    setWeather: (weather) => set({ weather }),
    setTime: (time) => set({ time }),
    setScene: (scene) => set({ scene }),

    setVolume: (id, volume) => set((state) => ({
        volumes: { ...state.volumes, [id]: volume }
    })),
    setMusicVolume: (musicVolume) => set({ musicVolume }),

    nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 3) as Step })),
    prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) as Step })),
    setStep: (step) => set({ currentStep: step }),
    resetToHome: () => set(() => ({
        currentStep: 1,
        weather: '晴天',
        time: '午后',
        scene: '阅读',
        // 重置时保留用户设置的音量
        playbackRunning: false,
    })),

    audioUnlocked: false,
    setAudioUnlocked: (v) => set({ audioUnlocked: v }),
    playbackRunning: false,
    setPlaybackRunning: (v) => set({ playbackRunning: v }),

    // 歌单相关初始状态
    currentPlaylist: null,
    currentTrackIndex: 0,
    playMode: 'loop',
    isPlaylistOpen: false,
    currentTrack: null,

    setCurrentPlaylist: (playlist) => set({ 
        currentPlaylist: playlist,
        currentTrackIndex: 0,
        currentTrack: playlist.tracks[0] || null
    }),
    setCurrentTrackIndex: (index) => {
        const { currentPlaylist } = get();
        if (currentPlaylist && currentPlaylist.tracks[index]) {
            set({ 
                currentTrackIndex: index,
                currentTrack: currentPlaylist.tracks[index]
            });
        }
    },
    nextTrack: () => {
        const { currentPlaylist, currentTrackIndex, playMode } = get();
        if (!currentPlaylist) return;
        
        const totalTracks = currentPlaylist.tracks.length;
        let nextIndex: number;

        if (playMode === 'shuffle') {
            nextIndex = Math.floor(Math.random() * totalTracks);
        } else if (playMode === 'single') {
            nextIndex = currentTrackIndex;
        } else {
            nextIndex = (currentTrackIndex + 1) % totalTracks;
        }

        set({ 
            currentTrackIndex: nextIndex,
            currentTrack: currentPlaylist.tracks[nextIndex]
        });
    },
    prevTrack: () => {
        const { currentPlaylist, currentTrackIndex } = get();
        if (!currentPlaylist) return;
        
        const totalTracks = currentPlaylist.tracks.length;
        const prevIndex = (currentTrackIndex - 1 + totalTracks) % totalTracks;

        set({ 
            currentTrackIndex: prevIndex,
            currentTrack: currentPlaylist.tracks[prevIndex]
        });
    },
    setPlayMode: (mode) => set({ playMode: mode }),
    cyclePlayMode: () => {
        const modes: PlayMode[] = ['list', 'shuffle', 'loop', 'single'];
        const { playMode } = get();
        const currentIndex = modes.indexOf(playMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        set({ playMode: modes[nextIndex] });
    },
    setPlaylistOpen: (open) => set({ isPlaylistOpen: open }),
    setCurrentTrack: (track) => set({ currentTrack: track }),
}));
