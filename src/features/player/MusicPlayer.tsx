import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, SkipForward, Volume2 } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import type { MusicTrack } from '@/utils/musicMap';

interface MusicPlayerProps {
    track: MusicTrack;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    onTogglePlay: () => void;
    onSeek: (value: number) => void;
    onVolumeChange: (value: number) => void;
    onNextTrack: () => void;
}

const formatAudioTime = (timeInSeconds: number) => {
    if (!Number.isFinite(timeInSeconds)) return '00:00';
    const safe = Math.max(0, Math.floor(timeInSeconds));
    const minutes = Math.floor(safe / 60);
    const seconds = safe % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const MusicPlayer = ({
    track,
    isPlaying,
    currentTime,
    duration,
    volume,
    onTogglePlay,
    onSeek,
    onVolumeChange,
    onNextTrack,
}: MusicPlayerProps) => {
    const progressMax = duration > 0 ? duration : 1;

    return (
        <GlassPanel className='w-full max-w-xl p-5 md:p-6 bg-white/12 border-white/30'>
            <div className='flex items-center gap-4'>
                <AnimatePresence mode='wait'>
                    <motion.img
                        key={track.id}
                        src={track.coverUrl}
                        alt={track.title}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.04 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className='w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border border-white/30'
                    />
                </AnimatePresence>

                <div className='min-w-0 flex-1'>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={`${track.id}-meta`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.28, ease: 'easeOut' }}
                        >
                            <p className='text-base md:text-lg tracking-wide truncate'>{track.title}</p>
                            <p className='text-white/70 text-sm tracking-wide truncate'>{track.artist}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <div className='mt-5'>
                <input
                    type='range'
                    min={0}
                    max={progressMax}
                    step={0.1}
                    value={Math.min(currentTime, progressMax)}
                    onChange={event => onSeek(Number(event.target.value))}
                    className='w-full accent-white cursor-pointer'
                    aria-label='播放进度'
                />
                <div className='mt-2 flex items-center justify-between text-xs text-white/70 tabular-nums'>
                    <span>{formatAudioTime(currentTime)}</span>
                    <span>{formatAudioTime(duration)}</span>
                </div>
            </div>

            <div className='mt-5 flex items-center justify-between gap-3'>
                <div className='flex items-center gap-3'>
                    <motion.button
                        type='button'
                        onClick={onTogglePlay}
                        whileTap={{ scale: 0.95 }}
                        className='w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border border-white/40 flex items-center justify-center'
                        aria-label={isPlaying ? '暂停' : '播放'}
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </motion.button>
                    <motion.button
                        type='button'
                        onClick={onNextTrack}
                        whileTap={{ scale: 0.95 }}
                        className='w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 border border-white/35 flex items-center justify-center'
                        aria-label='下一首推荐'
                    >
                        <SkipForward size={19} />
                    </motion.button>
                </div>

                <div className='flex items-center gap-2 min-w-36'>
                    <Volume2 size={16} className='text-white/80' />
                    <input
                        type='range'
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={event => onVolumeChange(Number(event.target.value))}
                        className='w-full accent-white cursor-pointer'
                        aria-label='音量'
                    />
                </div>
            </div>
        </GlassPanel>
    );
};
