import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, Pause, ListOrdered, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import type { PlayMode } from '@/types/environment';

const playModeIcons: Record<PlayMode, React.ReactNode> = {
    list: <ListOrdered size={20} />,
    shuffle: <Shuffle size={20} />,
    loop: <Repeat size={20} />,
    single: <Repeat1 size={20} />,
};

const playModeLabels: Record<PlayMode, string> = {
    list: '列表播放',
    shuffle: '随机播放',
    loop: '列表循环',
    single: '单曲循环',
};

export const PlaylistPanel = () => {
    const {
        isPlaylistOpen,
        setPlaylistOpen,
        currentPlaylist,
        currentTrackIndex,
        setCurrentTrackIndex,
        playMode,
        cyclePlayMode,
    } = useEnvironmentStore();

    const handleTrackClick = (index: number) => {
        setCurrentTrackIndex(index);
    };

    const handleClose = () => {
        setPlaylistOpen(false);
    };

    // 点击背景关闭
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <AnimatePresence>
            {isPlaylistOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-end justify-center"
                    onClick={handleBackdropClick}
                >
                    {/* 背景遮罩 */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                    {/* 面板内容 - 玻璃拟态 */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-2xl max-h-[80vh] rounded-t-3xl overflow-hidden border-t border-white/10"
                        style={{
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
                            backdropFilter: 'blur(40px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                            boxShadow: '0 -8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
                        }}
                    >
                        {/* 拖拽把手 */}
                        <div className="flex justify-center py-3">
                            <div className="w-12 h-1.5 rounded-full bg-white/20" />
                        </div>

                        {/* 头部 */}
                        <div className="flex items-center justify-between px-6 pb-4">
                            <div className="flex items-center gap-3">
                                <Music size={24} className="text-white/70" />
                                <h2 className="text-xl font-medium text-white" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                                    {currentPlaylist?.name || '歌单'}
                                </h2>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* 播放模式按钮 */}
                                <button
                                    type="button"
                                    onClick={cyclePlayMode}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                                    title={playModeLabels[playMode]}
                                >
                                    {playModeIcons[playMode]}
                                </button>
                                {/* 关闭按钮 */}
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* 歌曲列表 */}
                        <div className="px-4 pb-6 overflow-y-auto max-h-[50vh]">
                            {currentPlaylist?.tracks.map((track, index) => (
                                <motion.button
                                    key={track.id}
                                    type="button"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleTrackClick(index)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors text-left ${
                                        index === currentTrackIndex 
                                            ? 'bg-white/15' 
                                            : 'hover:bg-white/5'
                                    }`}
                                >
                                    {/* 序号/播放图标 */}
                                    <div className="w-8 flex-shrink-0">
                                        {index === currentTrackIndex ? (
                                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                                <Pause size={14} className="text-white" />
                                            </div>
                                        ) : (
                                            <span className="text-white/40 text-sm">{String(index + 1).padStart(2, '0')}</span>
                                        )}
                                    </div>

                                    {/* 歌曲信息 */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`text-base truncate ${index === currentTrackIndex ? 'text-white' : 'text-white/80'}`} style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                                            {track.name}
                                        </h3>
                                        <p className="text-sm text-white/50 truncate" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                                            {track.artist} · {track.description}
                                        </p>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
