import React from 'react';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { WheelPicker } from '@/components/ui/WheelPicker';
import type { Weather, Time } from '@/types/environment';
import {
    Sun, Cloud, CloudRain,
    Sunrise, SunMedium, Sunset, Moon
} from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const WEATHER_OPTIONS: { value: Weather; icon: React.ReactNode; label: string }[] = [
    { value: '晴天', icon: <Sun size={18} />, label: '晴天' },
    { value: '多云', icon: <Cloud size={18} />, label: '阴天' },
    { value: '雨天', icon: <CloudRain size={18} />, label: '雨天' },
];

const TIME_OPTIONS: { value: Time; icon: React.ReactNode }[] = [
    { value: '清晨', icon: <Sunrise size={18} /> },
    { value: '午后', icon: <SunMedium size={18} /> },
    { value: '傍晚', icon: <Sunset size={18} /> },
    { value: '夜晚', icon: <Moon size={18} /> },
];

export const WeatherTimeStep: React.FC = () => {
    const { weather, time, setWeather, setTime, nextStep } = useEnvironmentStore();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className='flex flex-col items-center w-full max-w-5xl mx-auto'
        >
            {/* 所有屏幕：并排布局 */}
            <div className='flex w-full max-w-4xl justify-center items-center gap-1 sm:gap-2 mb-6 md:mb-8 px-2 sm:px-8 md:px-24 relative'>
                <div className='absolute left-1 sm:left-4 md:left-[92px] top-1/2 -translate-y-1/2 text-[9px] sm:text-[11px] font-medium text-white/45 tracking-[0.2em] sm:tracking-[0.28em] [writing-mode:vertical-rl] [text-orientation:upright]'>
                    WEATHER
                </div>
                <div className='absolute right-1 sm:right-4 md:right-[92px] top-1/2 -translate-y-1/2 text-[9px] sm:text-[11px] font-medium text-white/45 tracking-[0.2em] sm:tracking-[0.28em] [writing-mode:vertical-rl] [text-orientation:upright]'>
                    TIME
                </div>

                <WheelPicker
                    title='WEATHER'
                    showTitle={false}
                    iconPosition='left'
                    options={WEATHER_OPTIONS}
                    value={weather}
                    onChange={setWeather}
                    className='flex-1 scale-[0.75] sm:scale-90 md:scale-100 -ml-10 sm:-ml-8 md:-ml-24'
                />

                <WheelPicker
                    title='TIME'
                    showTitle={false}
                    iconPosition='right'
                    options={TIME_OPTIONS}
                    value={time}
                    onChange={setTime}
                    className='flex-1 scale-[0.75] sm:scale-90 md:scale-100 -mr-10 sm:-mr-8 md:-mr-24'
                />

                {/* 此时文字 - 纵排，上下有小竖线 */}
                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center'>
                    <div className='w-px h-4 bg-white/40 mb-3' />
                    <span className='hetian-font text-base sm:text-lg md:text-xl text-white/80 [writing-mode:vertical-rl] tracking-widest'>此时</span>
                    <div className='w-px h-4 bg-white/40 mt-3' />
                </div>
            </div>

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
        </motion.div>
    );
};
