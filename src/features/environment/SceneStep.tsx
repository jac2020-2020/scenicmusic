import React from 'react';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { WheelPicker } from '@/components/ui/WheelPicker';
import type { Scene } from '@/types/environment';
import { BookOpen, Users, Wine, Utensils, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SCENE_OPTIONS: { value: Scene; icon: React.ReactNode }[] = [
    { value: '阅读', icon: <BookOpen size={18} /> },
    { value: '诗会', icon: <Users size={18} /> },
    { value: '小酌', icon: <Wine size={18} /> },
    { value: '美食', icon: <Utensils size={18} /> },
];

export const SceneStep: React.FC = () => {
    const { scene, setScene, nextStep, prevStep } = useEnvironmentStore();

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className='flex flex-col w-full max-w-5xl mx-auto items-center'
        >
            {/* 所有屏幕：并排布局 */}
            <div className='flex w-full max-w-4xl justify-center items-center mb-6 md:mb-8 px-4 sm:px-8 md:px-24 relative'>
                <div className='absolute left-1 sm:left-4 md:left-[80px] top-1/2 -translate-y-1/2 text-[9px] sm:text-[10px] md:text-[11px] font-medium text-white/45 tracking-[0.2em] sm:tracking-[0.28em] [writing-mode:vertical-rl] [text-orientation:upright]'>
                    SCENE
                </div>

                <WheelPicker
                    title='SCENE'
                    showTitle={false}
                    iconPosition='left'
                    arcSide='left'
                    options={SCENE_OPTIONS}
                    value={scene}
                    onChange={setScene}
                    className='w-full scale-[0.8] sm:scale-90 md:scale-100 -ml-8 sm:-ml-16 md:-ml-24'
                />

                {/* 此刻文字 - 纵排，上下有小竖线 */}
                <div className='ml-2 sm:ml-4 md:ml-8 pointer-events-none flex flex-col items-center'>
                    <div className='w-px h-4 bg-white/40 mb-3' />
                    <span className='hetian-font text-base sm:text-lg md:text-xl text-white/80 [writing-mode:vertical-rl] tracking-widest'>此刻</span>
                    <div className='w-px h-4 bg-white/40 mt-3' />
                </div>
            </div>

            <div className='flex items-center justify-center gap-6'>
                <motion.button
                    type='button'
                    onClick={prevStep}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className='w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all'
                    style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 100%)',
                        backdropFilter: 'blur(16px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(16px) saturate(150%)',
                        border: '0.5px solid rgba(255,255,255,0.2)',
                        boxShadow: 'inset 0 0.5px 0.5px rgba(255,255,255,0.35), 0 2px 8px rgba(0,0,0,0.08)',
                    }}
                    aria-label='返回上一步'
                >
                    <ArrowLeft size={22} className='sm:w-6 sm:h-6 text-white/90' />
                </motion.button>

                <motion.button
                    type='button'
                    onClick={nextStep}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className='w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all'
                    style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 100%)',
                        backdropFilter: 'blur(16px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(16px) saturate(150%)',
                        border: '0.5px solid rgba(255,255,255,0.2)',
                        boxShadow: 'inset 0 0.5px 0.5px rgba(255,255,255,0.35), 0 2px 8px rgba(0,0,0,0.08)',
                    }}
                    aria-label='下一步'
                >
                    <ArrowRight size={22} className='sm:w-6 sm:h-6' />
                </motion.button>
            </div>
        </motion.div>
    );
};
