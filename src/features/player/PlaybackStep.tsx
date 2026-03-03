import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Home, SlidersHorizontal } from 'lucide-react';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useFocusTimer } from '@/hooks/useFocusTimer';
import { matchMusicTrack, type MusicTrack } from '@/utils/musicMap';
import { VolumePanel } from '@/components/ui/VolumePanel';

export const PlaybackStep = () => {
    const { weather, time, scene, mood, tags, resetToHome } = useEnvironmentStore();
    const [showMixer, setShowMixer] = useState(false);

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
    const { musicVolume } = useEnvironmentStore();
    const player = useAudioPlayer({
        src: track.audioUrl,
        initialVolume: musicVolume,
    });

    useEffect(() => {
        player.setVolume(musicVolume);
    }, [musicVolume, player.setVolume]);

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
                    className='text-white/60 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10'
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
            <VolumePanel isOpen={showMixer} onClose={() => setShowMixer(false)} />
        </>
    );
};
