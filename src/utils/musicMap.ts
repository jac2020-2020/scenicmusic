import type { Scene, Time, Weather, Mood } from '@/types/environment';

export interface MusicTrack {
    id: string;
    title: string;
    artist: string;
    coverUrl: string;
    audioUrl: string;
    weathers: Weather[];
    times: Time[];
    scenes: Scene[];
    moods: Mood[];
    tags: string[];
}

interface MatchMusicOptions {
    weather: Weather;
    time: Time;
    scene: Scene;
    mood?: Mood;
    tags?: string[];
    excludeTrackIds?: string[];
}

const MUSIC_LIBRARY: MusicTrack[] = [
    {
        id: 'rain-night-reading',
        title: 'Blue Window',
        artist: 'Scenic Ensemble',
        coverUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        weathers: ['大雨', '小雨', '阴天'],
        times: ['夜晚', '凌晨'],
        scenes: ['沉浸阅读', '读书聚会'],
        moods: ['平静', '忧伤', '怀旧'],
        tags: ['书本', '书桌', '雨滴', '咖啡杯'],
    },
    {
        id: 'sunny-noon-feast',
        title: 'Golden Table',
        artist: 'Azure Kitchen Band',
        coverUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        weathers: ['晴天', '多云'],
        times: ['正午', '傍晚'],
        scenes: ['美食享受'],
        moods: ['愉悦', '兴奋', '期待'],
        tags: ['餐桌', '甜点', '果盘', '阳光'],
    },
    {
        id: 'cloudy-dusk-wine',
        title: 'Velvet Glass',
        artist: 'Moon & Barrel',
        coverUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=600&q=80',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        weathers: ['多云', '阴天', '小雨'],
        times: ['傍晚', '夜晚'],
        scenes: ['品酒时光', '读书聚会'],
        moods: ['平静', '疲惫', '怀旧'],
        tags: ['酒杯', '烛光', '木桌'],
    },
    {
        id: 'snow-morning-focus',
        title: 'White Breath',
        artist: 'North Tale',
        coverUrl: 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&w=600&q=80',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        weathers: ['雪天', '阴天'],
        times: ['清晨', '凌晨'],
        scenes: ['沉浸阅读'],
        moods: ['平静', '忧伤', '焦虑'],
        tags: ['窗边', '毛毯', '书本'],
    },
    {
        id: 'sunrise-literary',
        title: 'Paper Dawn',
        artist: 'Aster Quartet',
        coverUrl: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=600&q=80',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        weathers: ['晴天', '多云'],
        times: ['清晨', '正午'],
        scenes: ['读书聚会', '沉浸阅读'],
        moods: ['愉悦', '平静', '期待'],
        tags: ['书本', '纸张', '阳光', '植物'],
    },
    {
        id: 'city-rain-feast',
        title: 'Warm Steam',
        artist: 'Night Spoon',
        coverUrl: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=600&q=80',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        weathers: ['小雨', '大雨', '多云'],
        times: ['夜晚', '正午', '傍晚'],
        scenes: ['美食享受', '品酒时光'],
        moods: ['愉悦', '疲惫', '焦虑'],
        tags: ['餐桌', '热汤', '咖啡杯', '酒杯'],
    },
];

const normalize = (value: string) => value.trim().toLowerCase();

export const getMusicLibrary = () => MUSIC_LIBRARY;

export const matchMusicTrack = ({
    weather,
    time,
    scene,
    mood,
    tags = [],
    excludeTrackIds = [],
}: MatchMusicOptions): MusicTrack => {
    const excluded = new Set(excludeTrackIds);
    const normalizedTags = tags.map(normalize);
    const candidateTracks = MUSIC_LIBRARY.filter(track => !excluded.has(track.id));
    const pool = candidateTracks.length > 0 ? candidateTracks : MUSIC_LIBRARY;

    const scored = pool.map(track => {
        const weatherScore = track.weathers.includes(weather) ? 4 : 0;
        const timeScore = track.times.includes(time) ? 3 : 0;
        const sceneScore = track.scenes.includes(scene) ? 5 : 0;
        const moodScore = mood && track.moods.includes(mood) ? 3 : 0;
        const tagScore = normalizedTags.reduce((sum, tag) => {
            return track.tags.map(normalize).includes(tag) ? sum + 2 : sum;
        }, 0);

        return {
            track,
            score: weatherScore + timeScore + sceneScore + moodScore + tagScore,
        };
    });

    const maxScore = Math.max(...scored.map(item => item.score));
    const topMatches = scored.filter(item => item.score === maxScore).map(item => item.track);
    const randomIndex = Math.floor(Math.random() * topMatches.length);
    return topMatches[randomIndex];
};
