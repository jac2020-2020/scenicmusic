import React from 'react';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { WheelPicker } from '@/components/ui/WheelPicker';
import type { Weather, Time } from '@/types/environment';
import { 
    Sun, Cloud, CloudDrizzle, CloudRain, Snowflake, CloudFog,
    Sunrise, SunMedium, Sunset, Moon, MoonStar
} from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const WEATHER_OPTIONS: { value: Weather; icon: React.ReactNode }[] = [
    { value: '晴天', icon: <Sun size={18} /> },
    { value: '多云', icon: <Cloud size={18} /> },
    { value: '阴天', icon: <CloudFog size={18} /> },
    { value: '小雨', icon: <CloudDrizzle size={18} /> },
    { value: '大雨', icon: <CloudRain size={18} /> },
    { value: '雪天', icon: <Snowflake size={18} /> },
];

const TIME_OPTIONS: { value: Time; icon: React.ReactNode }[] = [
    { value: '清晨', icon: <Sunrise size={18} /> },
    { value: '正午', icon: <SunMedium size={18} /> },
    { value: '傍晚', icon: <Sunset size={18} /> },
    { value: '夜晚', icon: <Moon size={18} /> },
    { value: '凌晨', icon: <MoonStar size={18} /> },
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
                className='w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/15 hover:bg-white/25 text-white/90 backdrop-blur-xl border border-white/40 hover:border-white/60 flex items-center justify-center shadow-[0_4px_24px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_32px_rgba(255,255,255,0.2)] transition-all'
                aria-label='下一步'
            >
                <ArrowRight size={22} className='sm:w-6 sm:h-6' />
            </motion.button>
        </motion.div>
    );
};
