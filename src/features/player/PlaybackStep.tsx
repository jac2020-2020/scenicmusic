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
    const { weather, time, scene, tags, resetToHome } = useEnvironmentStore();
    const [showMixer, setShowMixer] = useState(false);
    const [soundLayers, setSoundLayers] = useState<SoundLayer[]>(defaultSoundLayers);

    const initialTrack = useMemo(() => {
        return matchMusicTrack({
            weather,
            time,
            scene,
            tags,
        });
    }, [scene, tags, time, weather]);

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
            {/* 顶部：歌名和标签 */}
            <div className='pt-8 md:pt-4 flex flex-col sm:flex-row sm:justify-end items-start sm:items-center gap-3 sm:gap-4'>
                <div className='text-left sm:text-right order-2 sm:order-1'>
                    <h2 className='text-base sm:text-lg md:text-xl font-light tracking-wide text-white/90'>
                        {track.title}
                    </h2>
                    <p className='text-xs sm:text-sm text-white/60 mt-1'>
                        {weather} · {time} · {scene}
                    </p>
                </div>
                {/* 调节按钮 */}
                <button
                    type='button'
                    onClick={() => setShowMixer(true)}
                    className='order-1 sm:order-2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/25 text-white/80 hover:text-white backdrop-blur-xl border border-white/30 hover:border-white/50 flex items-center justify-center shadow-[0_4px_16px_rgba(255,255,255,0.08)] hover:shadow-[0_4px_24px_rgba(255,255,255,0.15)] transition-all shrink-0'
                >
                    <SlidersHorizontal size={16} className='sm:w-[18px] sm:h-[18px]' />
                </button>
            </div>

            {/* 底部：计时器、播放按钮和返回首页 */}
            <div className='flex flex-col sm:flex-row items-start sm:items-end justify-between pb-8 md:pb-4 gap-6 sm:gap-0'>
                {/* 左下角：计时器和返回首页 */}
                <div className='flex flex-col items-start gap-3'>
                    <div className='flex flex-col'>
                        <span className='text-3xl sm:text-4xl md:text-5xl font-light tracking-wider text-white'>
                            {formatted}
                        </span>
                        <span className='text-xs sm:text-sm text-white/60 mt-1'>专注 ›</span>
                    </div>
                    {/* 返回首页按钮 */}
                    <button
                        type='button'
                        onClick={resetToHome}
                        className='flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/15 hover:bg-white/25 text-white/80 hover:text-white backdrop-blur-xl border border-white/30 hover:border-white/50 shadow-[0_4px_16px_rgba(255,255,255,0.08)] hover:shadow-[0_4px_24px_rgba(255,255,255,0.15)] transition-all text-xs sm:text-sm'
                    >
                        <Home size={14} className='sm:w-4 sm:h-4' />
                        返回首页
                    </button>
                </div>

                {/* 右下角：播放按钮 */}
                <button
                    type='button'
                    onClick={handleTogglePlay}
                    className='w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-xl border border-white/40 hover:border-white/60 flex items-center justify-center shadow-[0_8px_32px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.25)] transition-all active:scale-95 shrink-0'
                >
                    {player.isPlaying ? (
                        <Pause size={24} className='sm:w-7 sm:h-7 md:w-8 md:h-8' />
                    ) : (
                        <Play size={24} className='ml-0.5 sm:ml-1 sm:w-7 sm:h-7 md:w-8 md:h-8' />
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
