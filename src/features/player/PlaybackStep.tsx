import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Home, SlidersHorizontal, Square } from 'lucide-react';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useFocusTimer } from '@/hooks/useFocusTimer';
import { VolumePanel } from '@/components/ui/VolumePanel';
import { AudioVisualizer } from '@/components/ui/AudioVisualizer';

export const PlaybackStep = () => {
    const { weather, time, scene, mood, resetToHome, setPlaybackRunning } = useEnvironmentStore();
    const [showMixer, setShowMixer] = useState(false);
    const { musicVolume } = useEnvironmentStore();
    const trackTitle = 'Here';
    const player = useAudioPlayer({
        src: '/audio/mood/Here.mp3',
        initialVolume: musicVolume,
        loop: false,
    });

    useEffect(() => {
        player.setVolume(musicVolume);
    }, [musicVolume, player.setVolume]);

    const { formatted } = useFocusTimer(player.isPlaying);

    useEffect(() => {
        setPlaybackRunning(player.isPlaying);
    }, [player.isPlaying, setPlaybackRunning]);

    useEffect(() => {
        void player.play();
        return () => {
            void player.pause();
            setPlaybackRunning(false);
        };
    }, [player.pause, player.play, setPlaybackRunning]);

    const handleTogglePlay = () => {
        if (player.isPlaying) {
            void player.pause();
            return;
        }
        void player.play();
    };

    const handleStop = () => {
        void player.pause();
        setPlaybackRunning(false);
        resetToHome();
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className='fixed inset-0 z-20 flex flex-col justify-between p-6 md:p-10 pointer-events-none'
            >
                {/* Visualizer stays behind everything else but within the playback step */}
                <AudioVisualizer isPlaying={player.isPlaying} />

            <div className='pt-28 sm:pt-32 md:pt-36 flex items-start justify-center pointer-events-auto gap-2'>
                <button
                    type='button'
                    onClick={resetToHome}
                    className='w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors hover:bg-white/10'
                    aria-label='返回首页'
                >
                    <Home size={20} className='sm:w-6 sm:h-6' />
                </button>
                <button
                    type='button'
                    onClick={() => setShowMixer(true)}
                    className='w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors hover:bg-white/10'
                    aria-label='调音器'
                >
                    <SlidersHorizontal size={20} className='sm:w-6 sm:h-6' />
                </button>
            </div>

            {/* 底部：歌名、标签、计时器和播放按钮 - 同一排 */}
            <div className='flex items-end justify-between pb-safe md:pb-4 pointer-events-auto'>
                {/* 左侧：歌名、标签和计时器 */}
                <div className='flex flex-col items-start gap-2'>
                    {/* 歌名 - 主要 */}
                    <h2 className='text-xl sm:text-2xl md:text-3xl font-light tracking-wide text-white' style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                        {trackTitle}
                    </h2>
                    {/* 标签 - 最弱 (天气-时间-心情-场景) */}
                    <p className='text-xs text-white/50' style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                        {weather} · {time}{mood ? ` · ${mood}` : ''} · {scene}
                    </p>
                    {/* 计时器 - 次要 */}
                    <span className="text-2xl sm:text-3xl md:text-4xl font-extralight tracking-wider text-white/80 mt-1" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                        {formatted}
                    </span>
                </div>

                {/* 右侧：播放/暂停与停止按钮 */}
                <div className='flex items-center gap-3 shrink-0'>
                    <button
                        type='button'
                        onClick={handleTogglePlay}
                        className='w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all active:scale-95 shrink-0 hover:scale-105'
                        style={{
                            background:
                                'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)',
                            backdropFilter: 'blur(16px) saturate(150%)',
                            WebkitBackdropFilter: 'blur(16px) saturate(150%)',
                            border: '0.5px solid rgba(255,255,255,0.15)',
                            boxShadow:
                                'inset 0 0.5px 0.5px rgba(255,255,255,0.3), inset 0 -0.5px 0.5px rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.1)',
                        }}
                    >
                        {player.isPlaying ? (
                            <Pause size={24} className='sm:w-7 sm:h-7 md:w-8 md:h-8 text-white/90' />
                        ) : (
                            <Play size={24} className='ml-0.5 sm:ml-1 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white/90' />
                        )}
                    </button>
                    <button
                        type='button'
                        onClick={handleStop}
                        className='w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all active:scale-95 shrink-0 hover:scale-105'
                        style={{
                            background:
                                'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.02) 100%)',
                            backdropFilter: 'blur(16px) saturate(150%)',
                            WebkitBackdropFilter: 'blur(16px) saturate(150%)',
                            border: '0.5px solid rgba(255,255,255,0.12)',
                            boxShadow:
                                'inset 0 0.5px 0.5px rgba(255,255,255,0.2), inset 0 -0.5px 0.5px rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.08)',
                        }}
                        aria-label='停止'
                    >
                        <Square size={24} className='sm:w-7 sm:h-7 md:w-8 md:h-8 text-white/85 fill-white/85' />
                    </button>
                </div>
            </div>
            </motion.div>

            {/* 音频调节面板 */}
            <VolumePanel isOpen={showMixer} onClose={() => setShowMixer(false)} />
        </>
    );
};
