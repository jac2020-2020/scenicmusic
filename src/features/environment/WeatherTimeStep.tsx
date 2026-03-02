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
            <div className='flex w-full max-w-4xl justify-between items-center gap-2 mb-8 px-16 md:px-24 relative'>
                <h2 className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl md:text-2xl font-medium tracking-[0.18em] text-white/75 pointer-events-none z-10'>
                    何时？
                </h2>
                <div className='absolute left-[68px] md:left-[92px] top-1/2 -translate-y-1/2 text-[11px] font-medium text-white/45 tracking-[0.28em] [writing-mode:vertical-rl] [text-orientation:upright]'>
                    WEATHER
                </div>
                <div className='absolute right-[68px] md:right-[92px] top-1/2 -translate-y-1/2 text-[11px] font-medium text-white/45 tracking-[0.28em] [writing-mode:vertical-rl] [text-orientation:upright]'>
                    TIME
                </div>

                <WheelPicker
                    title='WEATHER'
                    showTitle={false}
                    iconPosition='left'
                    options={WEATHER_OPTIONS}
                    value={weather}
                    onChange={setWeather}
                    className='flex-1 -ml-16 md:-ml-24'
                />

                <WheelPicker
                    title='TIME'
                    showTitle={false}
                    iconPosition='right'
                    options={TIME_OPTIONS}
                    value={time}
                    onChange={setTime}
                    className='flex-1 -mr-16 md:-mr-24'
                />
            </div>

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
        </motion.div>
    );
};
