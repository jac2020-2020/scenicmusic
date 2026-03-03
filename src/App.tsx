import { DynamicBackground } from '@/features/environment/DynamicBackground';
import { SceneForeground } from '@/features/environment/SceneForeground';
import { WeatherTimeStep } from '@/features/environment/WeatherTimeStep';
import { SceneStep } from '@/features/environment/SceneStep';
import { UploadStep } from '@/features/upload/UploadStep';
import { PlaybackStep } from '@/features/player/PlaybackStep';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
    const { currentStep } = useEnvironmentStore();

    return (
        <div className="relative min-h-screen w-full text-white overflow-hidden selection:bg-white/30">
            {/* 视觉层 */}
            <DynamicBackground />
            {currentStep >= 2 && <SceneForeground />}

            {/* 交互层 */}
            <main className="relative z-10 h-full w-full flex flex-col p-6 md:p-12 justify-between">
                
                {/* 顶部：标题 */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="mt-8 md:mt-0 text-center md:text-left"
                >
                    <h1 className="text-3xl md:text-5xl font-light tracking-wider mb-2 font-serif italic">Scenic Music</h1>
                    <p className="text-white/60 text-xs md:text-sm font-light tracking-wide">
                        让环境与情绪，谱写你的专属旋律。
                    </p>
                </motion.div>

                {/* 底部/中部：步骤流内容 */}
                <div className="flex-1 flex flex-col justify-end md:justify-center mt-12 pb-8 md:pb-0">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div key="step1" className="w-full">
                                <WeatherTimeStep />
                            </motion.div>
                        )}
                        {currentStep === 2 && (
                            <motion.div key="step2" className="w-full">
                                <SceneStep />
                            </motion.div>
                        )}
                        {currentStep === 3 && (
                            <motion.div 
                                key="step3" 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full"
                            >
                                <UploadStep />
                            </motion.div>
                        )}
                        {currentStep === 4 && (
                            <motion.div 
                                key="step4" 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full"
                            >
                                <PlaybackStep />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
            </main>
        </div>
    );
}

export default App;
