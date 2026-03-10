import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Home, SlidersHorizontal, ListMusic, SkipBack, SkipForward, Repeat, Repeat1, Shuffle, ListOrdered } from 'lucide-react';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { VolumePanel } from '@/components/ui/VolumePanel';
import { AudioVisualizer } from '@/components/ui/AudioVisualizer';
import { PlaylistPanel } from '@/components/PlaylistPanel';
import { getPlaylist } from '@/data/playlists';
// import { resolveEmotionTags } from '@/utils/emotionMap';
import type { PlayMode } from '@/types/environment';

const playModeIcons: Record<PlayMode, React.ReactNode> = {
    list: <ListOrdered size={18} />,
    shuffle: <Shuffle size={18} />,
    loop: <Repeat size={18} />,
    single: <Repeat1 size={18} />,
};

export const PlaybackStep = () => {
    const { weather, time, scene, resetToHome, setPlaybackRunning, playbackRunning, currentPlaylist, setCurrentPlaylist, playMode, cyclePlayMode, setPlaylistOpen, currentTrack, nextTrack, prevTrack } = useEnvironmentStore();
    const [showMixer, setShowMixer] = useState(false);
    const { musicVolume } = useEnvironmentStore();
    const trackTitle = currentTrack?.name || 'Here';
    // const emotionTags = resolveEmotionTags({ weather, time, scene }); // 暂时移除未使用的变量
    const player = useAudioPlayer({
        src: currentTrack?.audioUrl || '/audio/mood/Here.mp3',
        initialVolume: musicVolume,
        loop: playMode === 'single',
    });

    useEffect(() => {
        player.setVolume(musicVolume);
    }, [musicVolume, player.setVolume]);

    // 初始化歌单
    useEffect(() => {
        const playlist = getPlaylist(weather, time, scene);
        if (playlist) {
            setCurrentPlaylist(playlist);
        }
    }, [weather, time, scene, setCurrentPlaylist]);

    // 歌曲结束处理 - 通过监听isPlaying状态变化来判断
    const wasPlayingRef = useRef(false);
    useEffect(() => {
        if (wasPlayingRef.current && !player.isPlaying && player.currentTime > 0 && player.duration > 0) {
            // 歌曲自然结束（currentTime接近duration）
            const timeDiff = player.duration - player.currentTime;
            if (timeDiff < 1 && playMode !== 'single') {
                nextTrack();
            }
        }
        wasPlayingRef.current = player.isPlaying;
    }, [player.isPlaying, player.currentTime, player.duration, playMode, nextTrack]);

    useEffect(() => {
        if (!currentTrack?.audioUrl) return;
        setPlaybackRunning(true);
        void player.play().catch(() => undefined);
        return () => {
            void player.pause().catch(() => undefined);
        };
    }, [currentTrack?.audioUrl, player.pause, player.play, setPlaybackRunning]);

    useEffect(() => {
        return () => {
            setPlaybackRunning(false);
        };
    }, [setPlaybackRunning]);

    useEffect(() => {
        if (!currentTrack?.audioUrl) return;
        if (playbackRunning) {
            if (!player.isPlaying) {
                void player.play().catch(() => undefined);
            }
            return;
        }
        if (player.isPlaying) {
            void player.pause().catch(() => undefined);
        }
    }, [currentTrack?.audioUrl, playbackRunning, player.isPlaying, player.pause, player.play]);

    const handleTogglePlay = () => {
        if (player.isPlaying) {
            void player.pause().catch(() => undefined);
            setPlaybackRunning(false);
            return;
        }
        void player.play().catch(() => undefined);
        setPlaybackRunning(true);
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
                {/* 播放模式按钮 */}
                <button
                    type='button'
                    onClick={cyclePlayMode}
                    className='w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors hover:bg-white/10'
                    aria-label='播放模式'
                >
                    {playModeIcons[playMode]}
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

            {/* 底部：歌名、标签和播放控制 */}
            <div className='w-full max-w-4xl mx-auto flex items-end justify-between pb-safe md:pb-24 pointer-events-auto'>
                {/* 左侧：歌名、标签 */}
                <div className='flex flex-col items-start gap-0.1 max-w-[50%]'>
                    {/* 歌单名 + Icon - 可点击 */}
                    <button
                        type='button'
                        onClick={() => setPlaylistOpen(true)}
                        className='flex items-center gap-1.5 px-2 py-1 transition-all group -ml-2'
                    >
                        <ListMusic size={16} className='text-white/70 group-hover:text-white transition-colors' />
                        <span className='text-sm font-medium text-white/80 group-hover:text-white tracking-wide' style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                            {currentPlaylist?.name || '默认歌单'}
                        </span>
                    </button>

                    <div className='flex flex-col gap-1.5'>
                        {/* 歌名 - 主要 */}
                        <h2 className='text-2xl sm:text-3xl md:text-4xl font-normal tracking-wider text-white truncate' style={{ fontFamily: "'Noto Sans SC', sans-serif", textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                            {trackTitle}
                        </h2>
                        
                        {/* 标签 - 天气-时间-场景 */}
                        <div className='flex items-center flex-wrap gap-2'>
                            {[weather, time, scene].map((tag) => (
                                <span 
                                    key={tag}
                                    className='px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/5 text-[10px] sm:text-xs text-white/70 font-light tracking-wider'
                                    style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        {currentTrack?.poem && currentTrack.poem.length > 0 && (
                            <div className='mt-1 space-y-0.5'>
                                {currentTrack.poem.map((line, i) => (
                                    <p key={i} className='text-white/70 text-xs sm:text-sm tracking-wider' style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                                        {line}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 右侧：播放控制按钮 */}
                <div className='flex items-center gap-2 shrink-0'>
                    {/* 上一首 */}
                    <button
                        type='button'
                        onClick={prevTrack}
                        className='w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors hover:bg-white/10'
                        aria-label='上一首'
                    >
                        <SkipBack size={20} className='sm:w-6 sm:h-6' />
                    </button>
                    {/* 播放/暂停 */}
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
                            <Pause size={24} fill="currentColor" className='sm:w-7 sm:h-7 md:w-8 md:h-8 text-white/90' />
                        ) : (
                            <Play size={24} fill="currentColor" className='ml-0.5 sm:ml-1 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white/90' />
                        )}
                    </button>
                    {/* 下一首 */}
                    <button
                        type='button'
                        onClick={nextTrack}
                        className='w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors hover:bg-white/10'
                        aria-label='下一首'
                    >
                        <SkipForward size={20} className='sm:w-6 sm:h-6' />
                    </button>
                </div>
            </div>
            </motion.div>

            {/* 音频调节面板 */}
            <VolumePanel isOpen={showMixer} onClose={() => setShowMixer(false)} />
            
            {/* 歌单面板 */}
            <PlaylistPanel />
        </>
    );
};
