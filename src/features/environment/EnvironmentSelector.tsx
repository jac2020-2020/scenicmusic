import React from 'react';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { cn } from '@/utils/cn';
import type { Weather, Time, Scene } from '@/types/environment';
import {
    Sun, Cloud, CloudRain,
    Sunrise, SunMedium, Sunset, Moon,
    BookOpen, Users, Wine, Utensils
} from 'lucide-react';
import { motion } from 'framer-motion';

const WEATHER_OPTIONS: { value: Weather; icon: React.ReactNode }[] = [
    { value: '晴天', icon: <Sun size={20} /> },
    { value: '多云', icon: <Cloud size={20} /> },
    { value: '雨天', icon: <CloudRain size={20} /> },
];

const TIME_OPTIONS: { value: Time; icon: React.ReactNode }[] = [
    { value: '清晨', icon: <Sunrise size={20} /> },
    { value: '午后', icon: <SunMedium size={20} /> },
    { value: '傍晚', icon: <Sunset size={20} /> },
    { value: '夜晚', icon: <Moon size={20} /> },
];

const SCENE_OPTIONS: { value: Scene; icon: React.ReactNode }[] = [
    { value: '阅读', icon: <BookOpen size={20} /> },
    { value: '诗会', icon: <Users size={20} /> },
    { value: '小酌', icon: <Wine size={20} /> },
    { value: '美食', icon: <Utensils size={20} /> },
];

interface OptionGroupProps<T> {
    title: string;
    options: { value: T; icon: React.ReactNode }[];
    currentValue: T;
    onChange: (value: T) => void;
}

function OptionGroup<T extends string>({ title, options, currentValue, onChange }: OptionGroupProps<T>) {
    return (
        <div className="space-y-3">
            <h3 className="text-sm text-white/60 font-medium pl-1">{title}</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {options.map((opt) => {
                    const isSelected = currentValue === opt.value;
                    return (
                        <motion.button
                            key={opt.value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onChange(opt.value)}
                            className={cn(
                                'flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300',
                                isSelected
                                    ? 'bg-white/30 border border-white/40 text-white shadow-lg shadow-white/10'
                                    : 'bg-white/5 border border-transparent text-white/50 hover:bg-white/10'
                            )}
                        >
                            <div className="mb-1">{opt.icon}</div>
                            <span className="text-[10px]">{opt.value}</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

export const EnvironmentSelector: React.FC = () => {
    const { weather, time, scene, setWeather, setTime, setScene } = useEnvironmentStore();

    return (
        <GlassPanel className="p-6 md:w-80 space-y-6">
            <OptionGroup
                title="天气"
                options={WEATHER_OPTIONS}
                currentValue={weather}
                onChange={setWeather}
            />
            <OptionGroup
                title="时间"
                options={TIME_OPTIONS}
                currentValue={time}
                onChange={setTime}
            />
            <OptionGroup
                title="场景"
                options={SCENE_OPTIONS}
                currentValue={scene}
                onChange={setScene}
            />
        </GlassPanel>
    );
};
