import type { Playlist, Weather, Time, Scene } from '@/types/environment';

// 歌单命名映射
const PLAYLIST_NAMES: Record<Weather, Record<Time, Record<Scene, string>>> = {
    '晴天': {
        '清晨': { '阅读': '晨光书语', '诗会': '晨曦诗韵', '小酌': '朝霞醉语', '美食': '朝食暖阳' },
        '午后': { '阅读': '暖阳书卷', '诗会': '晴午诗风', '小酌': '阳春微醉', '美食': '午膳时光' },
        '傍晚': { '阅读': '余晖书香', '诗会': '暮光诗行', '小酌': '夕酌', '美食': '晚飨' },
        '夜晚': { '阅读': '星夜书声', '诗会': '夜吟', '小酌': '杯中月', '美食': '夜宴' },
        '凌晨': { '阅读': '夜阑书语', '诗会': '夜半诗声', '小酌': '深夜醉', '美食': '夜宵' },
    },
    '多云': {
        '清晨': { '阅读': '晓云书声', '诗会': '晨雾诗语', '小酌': '雾晨醉', '美食': '早云餐' },
        '午后': { '阅读': '云下午茶', '诗会': '云中诗会', '小酌': '云淡风轻', '美食': '云餐' },
        '傍晚': { '阅读': '暮云书卷', '诗会': '晚云诗话', '小酌': '暮色微醺', '美食': '暮餐' },
        '夜晚': { '阅读': '夜云书斋', '诗会': '云夜诗眠', '小酌': '云夜独酌', '美食': '夜宵' },
        '凌晨': { '阅读': '夜云书声', '诗会': '云夜诗语', '小酌': '云夜醉', '美食': '云宵' },
    },
    '雨天': {
        '清晨': { '阅读': '雨晨书声', '诗会': '晨雨诗韵', '小酌': '雨朝醉', '美食': '雨朝食' },
        '午后': { '阅读': '雨下午茶', '诗会': '雨中诗会', '小酌': '雨醉', '美食': '雨午膳' },
        '傍晚': { '阅读': '雨暮书声', '诗会': '暮雨诗行', '小酌': '雨夕醉', '美食': '雨晚飨' },
        '夜晚': { '阅读': '雨夜书香', '诗会': '夜雨诗眠', '小酌': '夜雨对酌', '美食': '雨夜宴' },
        '凌晨': { '阅读': '夜雨书声', '诗会': '雨夜诗韵', '小酌': '雨夜醉', '美食': '雨宵' },
    },
};

// 生成占位歌曲数据
const generatePlaceholderTracks = (playlistName: string): Playlist['tracks'] => {
    return [
        {
            id: `${playlistName}-1`,
            name: `${playlistName} - 曲目一`,
            artist: '待添加',
            description: '点击添加您的音乐素材',
            audioUrl: '',
        },
        {
            id: `${playlistName}-2`,
            name: `${playlistName} - 曲目二`,
            artist: '待添加',
            description: '点击添加您的音乐素材',
            audioUrl: '',
        },
        {
            id: `${playlistName}-3`,
            name: `${playlistName} - 曲目三`,
            artist: '待添加',
            description: '点击添加您的音乐素材',
            audioUrl: '',
        },
        {
            id: `${playlistName}-4`,
            name: `${playlistName} - 曲目四`,
            artist: '待添加',
            description: '点击添加您的音乐素材',
            audioUrl: '',
        },
        {
            id: `${playlistName}-5`,
            name: `${playlistName} - 曲目五`,
            artist: '待添加',
            description: '点击添加您的音乐素材',
            audioUrl: '',
        },
    ];
};

// 生成所有歌单
export const playlists: Playlist[] = [];

const weatherList: Weather[] = ['晴天', '多云', '雨天'];
const timeList: Time[] = ['清晨', '午后', '傍晚', '夜晚', '凌晨'];
const sceneList: Scene[] = ['阅读', '诗会', '小酌', '美食'];

let idCounter = 1;

for (const weather of weatherList) {
    for (const time of timeList) {
        for (const scene of sceneList) {
            const name = PLAYLIST_NAMES[weather][time][scene];
            playlists.push({
                id: `playlist-${idCounter++}`,
                name,
                weather,
                time,
                scene,
                tracks: generatePlaceholderTracks(name),
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
