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

const HomeFlow = () => {
    const { currentStep } = useEnvironmentStore();

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
