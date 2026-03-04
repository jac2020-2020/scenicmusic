import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, CloudRain, BookOpen, Music, Sun, Cloud, CloudFog, CloudDrizzle, Snowflake, Sunrise, SunMedium, Sunset, Moon, MoonStar, Users, Wine, Utensils } from 'lucide-react';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import type { Weather, Time, Scene } from '@/types/environment';

interface VolumePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const ALL_WEATHERS: { value: Weather; icon: React.ReactNode; label: string }[] = [
    { value: '晴天', icon: <Sun size={18} />, label: '晴天' },
    { value: '多云', icon: <Cloud size={18} />, label: '多云' },
    { value: '阴天', icon: <CloudFog size={18} />, label: '阴天' },
    { value: '小雨', icon: <CloudDrizzle size={18} />, label: '小雨' },
    { value: '大雨', icon: <CloudRain size={18} />, label: '大雨' },
    { value: '雪天', icon: <Snowflake size={18} />, label: '雪天' },
];

const ALL_TIMES: { value: Time; icon: React.ReactNode; label: string }[] = [
    { value: '清晨', icon: <Sunrise size={18} />, label: '清晨' },
    { value: '正午', icon: <SunMedium size={18} />, label: '正午' },
    { value: '傍晚', icon: <Sunset size={18} />, label: '傍晚' },
    { value: '夜晚', icon: <Moon size={18} />, label: '夜晚' },
    { value: '凌晨', icon: <MoonStar size={18} />, label: '凌晨' },
];

const ALL_SCENES: { value: Scene; icon: React.ReactNode; label: string }[] = [
    { value: '沉浸阅读', icon: <BookOpen size={18} />, label: '沉浸阅读' },
    { value: '读书聚会', icon: <Users size={18} />, label: '读书聚会' },
    { value: '品酒时光', icon: <Wine size={18} />, label: '品酒时光' },
    { value: '美食享受', icon: <Utensils size={18} />, label: '美食享受' },
];

export const VolumePanel: React.FC<VolumePanelProps> = ({ isOpen, onClose }) => {
    const { 
        volumes, setVolume,
        musicVolume, setMusicVolume,
        weather, time, scene 
    } = useEnvironmentStore();

    const panelRef = useRef<HTMLDivElement>(null);
    const canUsePortal = typeof document !== 'undefined' && !!document.body;
    // 点击外部关闭
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const getVolume = (id: string, isCurrent: boolean) => {
        if (volumes[id] !== undefined) return volumes[id];
        return isCurrent ? 1 : 0;
    };

    const panelContent = (
        <>
            {/* 背景遮罩 */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-sm"
            />

            {/* 面板 */}
            <div className='fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4'>
                <motion.div
                    ref={panelRef}
                    initial={{ opacity: 0, y: 24, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 24, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className='volume-panel-zh relative flex w-[min(96vw,740px)] flex-col rounded-3xl shadow-2xl overflow-hidden max-h-[calc(100dvh-16px)]'
                    style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.6) 100%)',
                        backdropFilter: 'blur(20px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                        border: '1px solid rgba(255,255,255,0.5)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.8)',
                        fontFamily: '\'Source Han Sans SC\', \'Source Han Sans CN\', sans-serif',
                    }}
                >
                        <button
                            onClick={onClose}
                            className='absolute right-3 top-3 sm:right-4 sm:top-4 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100/50 hover:bg-gray-200/80 text-gray-600 transition-colors'
                        >
                            <X size={18} />
                        </button>

                        <div className="p-3 pt-12 sm:p-4 sm:pt-14 space-y-3.5 sm:space-y-4 overflow-hidden">
                            {/* 专属音乐 */}
                            <div className="space-y-2">
                                <h4 className="volume-en-title text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-1">Music</h4>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <span className="p-1.5 bg-white/50 rounded-md shadow-sm border border-white/60 text-gray-600">
                                                <Music size={18} />
                                            </span>
                                            <span className="text-sm font-medium">专属音乐</span>
                                        </div>
                                        <span className="text-xs text-gray-500 font-mono">
                                            {Math.round(musicVolume * 100)}%
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={musicVolume}
                                        onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                                        className="volume-slider w-full h-1.5 bg-gray-200/80 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400/30"
                                        style={{
                                            backgroundImage: `linear-gradient(to right, rgba(148,163,184,0.85) ${musicVolume * 100}%, transparent ${musicVolume * 100}%)`,
                                            backgroundRepeat: 'no-repeat',
                                        }}
                                    />
                                </div>
                            </div>

                            {/* 天气音效 */}
                            <div className="space-y-2">
                                <h4 className="volume-en-title text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-1">Weather</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {ALL_WEATHERS.map(item => {
                                        const id = `weather_${item.value}`;
                                        const vol = getVolume(id, weather === item.value);
                                        return (
                                            <div key={id} className="rounded-xl bg-white/20 border border-white/35 px-1.5 py-1.5">
                                                <div className="flex items-center justify-between text-gray-700 mb-1">
                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                        <span className="p-1 bg-white/30 rounded-md border border-white/40 text-gray-600 shrink-0">
                                                            {item.icon}
                                                        </span>
                                                        <span className="text-[11px] truncate">{item.label}</span>
                                                    </div>
                                                    <span className="hidden sm:inline text-[10px] text-gray-400 font-mono shrink-0">
                                                        {Math.round(vol * 100)}%
                                                    </span>
                                                </div>
                                                <input
                                                    type="range" min="0" max="1" step="0.01" value={vol}
                                                    onChange={(e) => setVolume(id, parseFloat(e.target.value))}
                                                    className="volume-slider w-full h-1 bg-gray-200/50 rounded-full appearance-none cursor-pointer focus:outline-none"
                                                    style={{ backgroundImage: `linear-gradient(to right, rgba(148,163,184,0.85) ${vol * 100}%, transparent ${vol * 100}%)`, backgroundRepeat: 'no-repeat' }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 时段音效 */}
                            <div className="space-y-2">
                                <h4 className="volume-en-title text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-1">Time</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {ALL_TIMES.map(item => {
                                        const id = `time_${item.value}`;
                                        const vol = getVolume(id, time === item.value);
                                        return (
                                            <div key={id} className="rounded-xl bg-white/20 border border-white/35 px-1.5 py-1.5">
                                                <div className="flex items-center justify-between text-gray-700 mb-1">
                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                        <span className="p-1 bg-white/30 rounded-md border border-white/40 text-gray-600 shrink-0">
                                                            {item.icon}
                                                        </span>
                                                        <span className="text-[11px] truncate">{item.label}</span>
                                                    </div>
                                                    <span className="hidden sm:inline text-[10px] text-gray-400 font-mono shrink-0">
                                                        {Math.round(vol * 100)}%
                                                    </span>
                                                </div>
                                                <input
                                                    type="range" min="0" max="1" step="0.01" value={vol}
                                                    onChange={(e) => setVolume(id, parseFloat(e.target.value))}
                                                    className="volume-slider w-full h-1 bg-gray-200/50 rounded-full appearance-none cursor-pointer focus:outline-none"
                                                    style={{ backgroundImage: `linear-gradient(to right, rgba(148,163,184,0.85) ${vol * 100}%, transparent ${vol * 100}%)`, backgroundRepeat: 'no-repeat' }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 场景音效 */}
                            <div className="space-y-2">
                                <h4 className="volume-en-title text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-1">Scene</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {ALL_SCENES.map(item => {
                                        const id = `scene_${item.value}`;
                                        const vol = getVolume(id, scene === item.value);
                                        return (
                                            <div key={id} className="rounded-xl bg-white/20 border border-white/35 px-1.5 py-1.5">
                                                <div className="flex items-center justify-between text-gray-700 mb-1">
                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                        <span className="p-1 bg-white/30 rounded-md border border-white/40 text-gray-600 shrink-0">
                                                            {item.icon}
                                                        </span>
                                                        <span className="text-[11px] truncate">{item.label}</span>
                                                    </div>
                                                    <span className="hidden sm:inline text-[10px] text-gray-400 font-mono shrink-0">
                                                        {Math.round(vol * 100)}%
                                                    </span>
                                                </div>
                                                <input
                                                    type="range" min="0" max="1" step="0.01" value={vol}
                                                    onChange={(e) => setVolume(id, parseFloat(e.target.value))}
                                                    className="volume-slider w-full h-1 bg-gray-200/50 rounded-full appearance-none cursor-pointer focus:outline-none"
                                                    style={{ backgroundImage: `linear-gradient(to right, rgba(148,163,184,0.85) ${vol * 100}%, transparent ${vol * 100}%)`, backgroundRepeat: 'no-repeat' }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                </motion.div>
            </div>
        </>
    );

    if (!isOpen || !canUsePortal) {
        return null;
    }

    return createPortal(panelContent, document.body);
};