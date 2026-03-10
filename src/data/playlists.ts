import type { Playlist, Weather, Time, Scene } from '@/types/environment';
import { MUSIC_CONFIG } from './musicConfig';
import { TRACK_META } from './trackMeta';

// 歌单命名映射
const PLAYLIST_NAMES: Record<Weather, Record<Time, Record<Scene, string>>> = {
    '晴天': {
        '清晨': { '阅读': '晨光初照', '诗会': '晓风吟咏', '小酌': '朝露微醺', '美食': '晨间雅膳' },
        '午后': { '阅读': '暖阳展卷', '诗会': '晴日诗情', '小酌': '午后清酌', '美食': '午间盛宴' },
        '傍晚': { '阅读': '暮色书香', '诗会': '夕照吟哦', '小酌': '黄昏独醉', '美食': '晚风佳肴' },
        '夜晚': { '阅读': '星河夜读', '诗会': '月下诗会', '小酌': '夜间小酌', '美食': '夜宴流光' },
    },
    '多云': {
        '清晨': { '阅读': '云霭书声', '诗会': '晨雾诗心', '小酌': '云间清酌', '美食': '云端早味' },
        '午后': { '阅读': '云卷云舒', '诗会': '云中雅集', '小酌': '云淡风轻', '美食': '云间飨宴' },
        '傍晚': { '阅读': '暮云凝香', '诗会': '晚云诗话', '小酌': '暮色微醺', '美食': '云暮晚宴' },
        '夜晚': { '阅读': '云夜静读', '诗会': '云深诗意', '小酌': '夜色微醺', '美食': '夜云佳肴' },
    },
    '雨天': {
        '清晨': { '阅读': '卷旁听雨', '诗会': '雨韵诗情', '小酌': '雨晨浅醉', '美食': '雨润晨食' },
        '午后': { '阅读': '雨声伴读', '诗会': '雨中诗会', '小酌': '雨落杯中', '美食': '雨日午膳' },
        '傍晚': { '阅读': '暮雨书怀', '诗会': '晚雨诗兴', '小酌': '雨夕独酌', '美食': '雨夜晚宴' },
        '夜晚': { '阅读': '夜雨书灯', '诗会': '雨夜诗魂', '小酌': '夜雨小酌', '美食': '雨夜盛宴' },
    },
};

// 音乐文件基础路径
const MUSIC_BASE_URL = '';

const SCENE_DIR_MAP: Record<Scene, string> = {
    '阅读': 'reading',
    '诗会': 'gathering',
    '小酌': 'drink',
    '美食': 'food',
};

const WEATHER_DIR_MAP: Record<Weather, string> = {
    '晴天': 'sunny',
    '多云': 'cloudy',
    '雨天': 'rainy',
};

const TIME_DIR_MAP: Record<Time, string> = {
    '清晨': 'morning',
    '午后': 'afternoon',
    '傍晚': 'evening',
    '夜晚': 'night',
};

// 生成歌曲数据
const generateTracks = (weather: Weather, time: Time, scene: Scene): Playlist['tracks'] => {
    const weatherDir = WEATHER_DIR_MAP[weather];
    const timeDir = TIME_DIR_MAP[time];
    const sceneDir = SCENE_DIR_MAP[scene];
    
    // 从配置文件中读取该组合的文件名列表
    const fileNames = MUSIC_CONFIG[weather]?.[time]?.[scene] || [];
    
    return fileNames.map((fileName, i) => {
        // 去掉文件后缀作为歌名
        const songName = fileName.replace(/\.[^/.]+$/, "");
        const poem = TRACK_META[weather]?.[time]?.[scene]?.[fileName]?.poem;
        
        return {
            id: `${weatherDir}-${timeDir}-${sceneDir}-${i + 1}`,
            name: songName,
            artist: 'Scenic Music',
            description: '沉浸式背景音乐',
            poem,
            // 组合音频 URL: 基础路径 + 天气 + 时段 + 场景 + 文件名
            audioUrl: `${MUSIC_BASE_URL}/music/${weatherDir}/${timeDir}/${sceneDir}/${fileName}`,
        };
    });
};

// 生成所有歌单
export const playlists: Playlist[] = [];

const weatherList: Weather[] = ['晴天', '多云', '雨天'];
const timeList: Time[] = ['清晨', '午后', '傍晚', '夜晚'];
const sceneList: Scene[] = ['阅读', '诗会', '小酌', '美食'];

let idCounter = 1;

for (const weather of weatherList) {
    for (const time of timeList) {
        // 按时段过滤场景：
        // 清晨：阅读、诗会；午后：阅读、诗会、美食；傍晚：全部；夜晚：阅读、诗会、小酌
        let scenesForTime: Scene[] = sceneList;
        if (time === '清晨') {
            scenesForTime = sceneList.filter(s => s !== '小酌' && s !== '美食');
        } else if (time === '午后') {
            scenesForTime = sceneList.filter(s => s !== '小酌');
        } else if (time === '夜晚') {
            scenesForTime = sceneList.filter(s => s !== '美食');
        }
        for (const scene of scenesForTime) {
            const name = PLAYLIST_NAMES[weather][time][scene];
            playlists.push({
                id: `playlist-${idCounter++}`,
                name,
                weather,
                time,
                scene,
                tracks: generateTracks(weather, time, scene),
            });
        }
    }
}

// 根据天气、时段、场景获取歌单
export const getPlaylist = (weather: Weather, time: Time, scene: Scene): Playlist | undefined => {
    return playlists.find(p => p.weather === weather && p.time === time && p.scene === scene);
};

// 获取所有歌单
export const getAllPlaylists = (): Playlist[] => playlists;
