import React from 'react';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { WheelPicker } from '@/components/ui/WheelPicker';
import type { Scene } from '@/types/environment';
import { BookOpen, Users, Wine, Utensils, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SCENE_OPTIONS: { value: Scene; icon: React.ReactNode }[] = [
    { value: '沉浸阅读', icon: <BookOpen size={18} /> },
    { value: '文学聚会', icon: <Users size={18} /> },
    { value: '品酒时光', icon: <Wine size={18} /> },
    { value: '美食盛宴', icon: <Utensils size={18} /> },
];

export const SceneStep: React.FC = () => {
    const { scene, setScene, nextStep, prevStep } = useEnvironmentStore();

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className='flex flex-col w-full max-w-5xl mx-auto'
        >
            <div className='flex w-full max-w-4xl justify-center items-center mb-8 px-16 md:px-24 relative'>
                <h2 className='absolute left-1/2 top-1/2 translate-x-[88px] -translate-y-1/2 text-xl md:text-2xl font-medium tracking-[0.18em] text-white/82 pointer-events-none z-30 px-3'>
                    何处？
                </h2>
                <div className='absolute left-[92px] md:left-[110px] top-1/2 -translate-y-1/2 text-[11px] font-medium text-white/45 tracking-[0.28em] [writing-mode:vertical-rl] [text-orientation:upright]'>
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
                    className='w-full -ml-16 md:-ml-24'
                />
            </div>

            <div className='flex items-center justify-center gap-6'>
                <motion.button
                    type='button'
                    onClick={prevStep}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className='w-16 h-16 rounded-full border border-white/70 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,255,255,0.22)]'
                    aria-label='返回上一步'
                >
                    <ArrowLeft size={24} />
                </motion.button>

                <motion.button
                    type='button'
                    onClick={nextStep}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className='w-16 h-16 rounded-full border border-white/70 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,255,255,0.22)]'
                    aria-label='下一步'
                >
                    <ArrowRight size={24} />
                </motion.button>
            </div>
        </motion.div>
    );
};
