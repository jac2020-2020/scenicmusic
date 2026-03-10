import { useEffect, useRef, useState } from 'react';
import { DynamicBackground } from '@/features/environment/DynamicBackground';
import { SceneForeground } from '@/features/environment/SceneForeground';
import { WeatherTimeStep } from '@/features/environment/WeatherTimeStep';
import { SceneStep } from '@/features/environment/SceneStep';
import { PlaybackStep } from '@/features/player/PlaybackStep';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { useAmbientLayers } from '@/hooks/useAmbientLayers';
import { AudioUnlockOverlay } from '@/components/AudioUnlockOverlay';
import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ListMusic } from 'lucide-react';
import { getPlaylist } from '@/data/playlists';

const HomeFlow = () => {
    const { currentStep, setWeather, setTime, setScene, setStep, setCurrentPlaylist } = useEnvironmentStore();
    const [isQuickOpen, setIsQuickOpen] = useState(false);
    const quickRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (quickRef.current && !quickRef.current.contains(e.target as Node)) {
                setIsQuickOpen(false);
            }
        };
        if (isQuickOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isQuickOpen]);

    const jumpToPlaylist = (key: 'rain-read' | 'evening-food' | 'night-drink') => {
        const mapping = {
            'rain-read': { weather: '雨天', time: '午后', scene: '阅读' },
            'evening-food': { weather: '晴天', time: '傍晚', scene: '美食' },
            'night-drink': { weather: '晴天', time: '夜晚', scene: '小酌' },
        } as const;

        const target = mapping[key];
        setWeather(target.weather);
        setTime(target.time);
        setScene(target.scene);
        const playlist = getPlaylist(target.weather, target.time, target.scene);
        if (playlist) {
            setCurrentPlaylist(playlist);
        }
        setStep(3);
        setIsQuickOpen(false);
    };

    return (
        <>
            {currentStep >= 3 && <SceneForeground />}
            <main className='relative z-10 h-full w-full flex flex-col p-6 md:p-12 justify-between'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className='mt-4 md:mt-0 text-center shrink-0 relative flex items-center justify-center'
                    style={{ height: '80px' }}
                >
                    <p
                        className='absolute text-white/30 text-xl sm:text-2xl md:text-3xl font-serif tracking-[0.4em] select-none pointer-events-none'
                        style={{
                            maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                        }}
                    >
                        SCENE
                    </p>
                    <h1 className='hetian-font text-4xl sm:text-5xl md:text-7xl tracking-wider relative z-10'>境</h1>
                    {currentStep < 3 && (
                        <div ref={quickRef} className='absolute top-full mt-5 left-1/2 -translate-x-1/2 pointer-events-auto z-50'>
                            <button
                                type='button'
                                onClick={() => setIsQuickOpen(v => !v)}
                                className='flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white/75 hover:text-white transition-colors border border-white/15 bg-white/5 hover:bg-white/10 backdrop-blur-md'
                                aria-label='快速歌单'
                            >
                                <ListMusic size={16} className='text-white/70' />
                                <span className='text-xs sm:text-sm tracking-wide' style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                                    快速歌单
                                </span>
                            </button>
                            <AnimatePresence>
                                {isQuickOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                        transition={{ duration: 0.18, ease: 'easeOut' }}
                                        className='absolute left-1/2 -translate-x-1/2 mt-2 w-48 rounded-2xl overflow-hidden border border-white/15 z-50'
                                        style={{
                                            background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.08) 100%)',
                                            backdropFilter: 'blur(20px) saturate(160%)',
                                            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
                                        }}
                                    >
                                        <div className='p-2 flex flex-col gap-1'>
                                            <button
                                                type='button'
                                                onClick={() => jumpToPlaylist('rain-read')}
                                                className='w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/85'
                                                style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                                            >
                                                雨声伴读
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => jumpToPlaylist('evening-food')}
                                                className='w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/85'
                                                style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                                            >
                                                晚风佳肴
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => jumpToPlaylist('night-drink')}
                                                className='w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/85'
                                                style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                                            >
                                                夜间小酌
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>

                <div className='flex-1 flex flex-col justify-center mt-12 sm:mt-16 md:mt-24 pb-8 md:pb-0'>
                    <AnimatePresence mode='wait'>
                        {currentStep === 1 && (
                            <motion.div key='step1' className='w-full'>
                                <WeatherTimeStep />
                            </motion.div>
                        )}
                        {currentStep === 2 && (
                            <motion.div key='step2' className='w-full'>
                                <SceneStep />
                            </motion.div>
                        )}
                        {currentStep === 3 && (
                            <motion.div
                                key='step3'
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className='w-full'
                            >
                                <PlaybackStep />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </>
    );
};

function App() {
    const location = useLocation();
    useAmbientLayers();

    return (
        <div className='relative min-h-screen w-full text-white overflow-hidden selection:bg-white/30'>
            <DynamicBackground />
            <AnimatePresence mode='wait'>
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.32, ease: 'easeInOut' }}
                    className='min-h-screen'
                >
                    <Routes location={location}>
                        <Route path='/' element={<HomeFlow />} />
                    </Routes>
                </motion.div>
            </AnimatePresence>
            <AudioUnlockOverlay />
        </div>
    );
}

export default App;
