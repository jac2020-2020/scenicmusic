import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Home, SlidersHorizontal, X, CloudRain, Waves, Coffee, Plane, Train, BookOpen, CloudDrizzle, CloudLightning, Flame, Building2, Wind, Volume2 } from 'lucide-react';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useFocusTimer } from '@/hooks/useFocusTimer';
import { matchMusicTrack, type MusicTrack } from '@/utils/musicMap';

interface SoundLayer {
    id: string;
    name: string;
    icon: React.ReactNode;
    volume: number;
}

const defaultSoundLayers: SoundLayer[] = [
    { id: 'rain', name: '雨声', icon: <CloudRain size={20} />, volume: 0.5 },
    { id: 'ocean', name: '海洋', icon: <Waves size={20} />, volume: 0.5 },
    { id: 'cafe', name: '咖啡厅', icon: <Coffee size={20} />, volume: 0.5 },
    { id: 'plane', name: '机舱', icon: <Plane size={20} />, volume: 0.5 },
    { id: 'train', name: '火车', icon: <Train size={20} />, volume: 0.5 },
    { id: 'library', name: '图书馆', icon: <BookOpen size={20} />, volume: 0.5 },
    { id: 'city', name: '城市', icon: <Building2 size={20} />, volume: 0.5 },
    { id: 'wind', name: '风声', icon: <Wind size={20} />, volume: 0.5 },
    { id: 'fire', name: '篝火', icon: <Flame size={20} />, volume: 0.5 },
    { id: 'thunder', name: '雷声', icon: <CloudLightning size={20} />, volume: 0.5 },
    { id: 'drizzle', name: '小雨', icon: <CloudDrizzle size={20} />, volume: 0.5 },
    { id: 'whiteNoise', name: '白噪音', icon: <Volume2 size={20} />, volume: 0.5 },
];

export const PlaybackStep = () => {
    const { weather, time, scene, mood, tags, resetToHome } = useEnvironmentStore();
    const [showMixer, setShowMixer] = useState(false);
    const [soundLayers, setSoundLayers] = useState<SoundLayer[]>(defaultSoundLayers);

    const initialTrack = useMemo(() => {
        return matchMusicTrack({
            weather,
            time,
            scene,
            mood,
            tags,
        });
    }, [scene, mood, tags, time, weather]);

    const [track, setTrack] = useState<MusicTrack>(initialTrack);
    const player = useAudioPlayer({
        src: track.audioUrl,
    });
    const { formatted } = useFocusTimer(player.isPlaying);

    useEffect(() => {
        setTrack(initialTrack);
    }, [initialTrack]);

    const handleTogglePlay = () => {
        if (player.isPlaying) {
            void player.pause();
            return;
        }
        void player.play();
    };

    const handleVolumeChange = (id: string, volume: number) => {
        setSoundLayers(prev => prev.map(layer =>
            layer.id === id ? { ...layer, volume } : layer
        ));
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className='fixed inset-0 z-20 flex flex-col justify-between p-6 md:p-10'
            >
            {/* 顶部：返回首页和调音器按钮 */}
            <div className='pt-20 sm:pt-24 md:pt-28 flex items-start justify-between'>
                {/* 左上角：返回首页图标 */}
                <button
                    type='button'
                    onClick={resetToHome}
                    className='text-white/60 hover:text-white transition-colors'
                    aria-label='返回首页'
                >
                    <Home size={20} className='sm:w-6 sm:h-6' />
                </button>

                {/* 右上角：调音器图标 */}
                <button
                    type='button'
                    onClick={() => setShowMixer(true)}
                    className='text-white/60 hover:text-white transition-colors'
                    aria-label='声音调节'
                >
                    <SlidersHorizontal size={20} className='sm:w-6 sm:h-6' />
                </button>
            </div>

            {/* 底部：歌名、标签、计时器和播放按钮 - 同一排 */}
            <div className='flex items-end justify-between pb-8 md:pb-4'>
                {/* 左侧：歌名、标签和计时器 */}
                <div className='flex flex-col items-start gap-2'>
                    {/* 歌名 - 主要 */}
                    <h2 className='text-xl sm:text-2xl md:text-3xl font-light tracking-wide text-white' style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                        {track.title}
                    </h2>
                    {/* 标签 - 最弱 (天气-时间-心情-场景) */}
                    <p className='text-xs text-white/50' style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                        {weather} · {time} · {mood || '无心情'} · {scene}
                    </p>
                    {/* 计时器 - 次要 */}
                    <span className="text-2xl sm:text-3xl md:text-4xl font-extralight tracking-wider text-white/80 mt-1" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                        {formatted}
                    </span>
                </div>

                {/* 右侧：播放按钮 - 纯净玻璃拟态 */}
                <button
                    type='button'
                    onClick={handleTogglePlay}
                    className='w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all active:scale-95 shrink-0 hover:scale-105'
                    style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)',
                        backdropFilter: 'blur(16px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(16px) saturate(150%)',
                        border: '0.5px solid rgba(255,255,255,0.15)',
                        boxShadow: 'inset 0 0.5px 0.5px rgba(255,255,255,0.3), inset 0 -0.5px 0.5px rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.1)',
                    }}
                >
                    {player.isPlaying ? (
                        <Pause size={24} className='sm:w-7 sm:h-7 md:w-8 md:h-8 text-white/90' />
                    ) : (
                        <Play size={24} className='ml-0.5 sm:ml-1 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white/90' />
                    )}
                </button>
            </div>
            </motion.div>

            {/* 音频调节面板 */}
            <AnimatePresence>
                {showMixer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4'
                        onClick={() => setShowMixer(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className='bg-black/80 backdrop-blur-xl rounded-3xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto'
                            onClick={e => e.stopPropagation()}
                        >
                            {/* 面板标题 */}
                            <div className='flex items-center justify-between mb-6'>
                                <h3 className='text-xl font-light text-white'>声音调节</h3>
                                <button
                                    type='button'
                                    onClick={() => setShowMixer(false)}
                                    className='w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white/70 hover:text-white backdrop-blur-md border border-white/30 hover:border-white/50 flex items-center justify-center transition-all'
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* 声音网格 */}
                            <div className='grid grid-cols-3 sm:grid-cols-4 gap-4'>
                                {soundLayers.map((layer) => (
                                    <div
                                        key={layer.id}
                                        className='flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 hover:border-white/25 transition-all'
                                    >
                                        <div className='w-12 h-12 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white/80'>
                                            {layer.icon}
                                        </div>
                                        <span className='text-xs text-white/70 text-center'>{layer.name}</span>
                                        <input
                                            type='range'
                                            min='0'
                                            max='100'
                                            value={layer.volume * 100}
                                            onChange={(e) => handleVolumeChange(layer.id, Number(e.target.value) / 100)}
                                            className='w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white'
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
