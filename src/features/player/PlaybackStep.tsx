import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useFocusTimer } from '@/hooks/useFocusTimer';
import { matchMusicTrack, type MusicTrack } from '@/utils/musicMap';
import { resolveEmotionTags } from '@/utils/emotionMap';
import { MusicPlayer } from './MusicPlayer';
import { EmotionTags } from './EmotionTags';
import { FocusTimer } from './FocusTimer';

export const PlaybackStep = () => {
    const { weather, time, scene, tags, prevStep } = useEnvironmentStore();

    const initialTrack = useMemo(() => {
        return matchMusicTrack({
            weather,
            time,
            scene,
            tags,
        });
    }, [scene, tags, time, weather]);

    const [track, setTrack] = useState<MusicTrack>(initialTrack);
    const [shouldAutoPlayAfterSwitch, setShouldAutoPlayAfterSwitch] = useState(false);
    const player = useAudioPlayer({
        src: track.audioUrl,
    });
    const { formatted } = useFocusTimer(player.isPlaying);

    useEffect(() => {
        setTrack(initialTrack);
    }, [initialTrack]);

    useEffect(() => {
        if (!shouldAutoPlayAfterSwitch) return;
        void player.play();
        setShouldAutoPlayAfterSwitch(false);
    }, [player.play, shouldAutoPlayAfterSwitch, track.id]);

    const emotionTags = useMemo(() => {
        return resolveEmotionTags({
            weather,
            time,
            scene,
            tags,
        });
    }, [scene, tags, time, weather]);

    const handleTogglePlay = () => {
        if (player.isPlaying) {
            void player.pause();
            return;
        }
        void player.play();
    };

    const handleNextTrack = () => {
        setShouldAutoPlayAfterSwitch(player.isPlaying);
        const nextTrack = matchMusicTrack({
            weather,
            time,
            scene,
            tags,
            excludeTrackIds: [track.id],
        });
        setTrack(nextTrack);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className='w-full max-w-2xl mx-auto flex flex-col items-center text-center'
        >
            <h2 className='text-2xl md:text-3xl tracking-[0.16em] font-light'>你的专属旋律</h2>
            <p className='mt-2 text-sm text-white/70 tracking-wide'>
                {weather} · {time} · {scene}
            </p>

            <div className='mt-4'>
                <FocusTimer formattedTime={formatted} />
            </div>

            <div className='w-full mt-6'>
                <MusicPlayer
                    track={track}
                    isPlaying={player.isPlaying}
                    currentTime={player.currentTime}
                    duration={player.duration}
                    volume={player.volume}
                    onTogglePlay={handleTogglePlay}
                    onSeek={player.seek}
                    onVolumeChange={player.setVolume}
                    onNextTrack={handleNextTrack}
                />
            </div>

            <EmotionTags tags={emotionTags} />

            <button
                type='button'
                onClick={prevStep}
                className='mt-7 inline-flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors'
            >
                <ArrowLeft size={16} />
                返回上一步
            </button>
        </motion.div>
    );
};
