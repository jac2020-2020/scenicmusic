import { useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, Users, UtensilsCrossed, Wine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { getRecords } from '@/services/record';
import { formatDurationNatural } from '@/hooks/useFocusTimer';
import type { GetRecordsResult, PlayRecord } from '@/types/record';
import type { Scene } from '@/types/environment';

const PAGE_SIZE = 8;

const SCENE_META: Record<Scene, { icon: ReactElement; label: string }> = {
    '沉浸阅读': {
        icon: <BookOpen size={16} />,
        label: '阅读',
    },
    '读书聚会': {
        icon: <Users size={16} />,
        label: '聚会',
    },
    '品酒时光': {
        icon: <Wine size={16} />,
        label: '品酒',
    },
    '美食享受': {
        icon: <UtensilsCrossed size={16} />,
        label: '美食',
    },
};

const formatDateTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '未知时间';
    return date.toLocaleString('zh-CN', {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const RecordList = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState<PlayRecord[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const loadPage = async (targetPage: number, append: boolean) => {
        setLoading(true);
        setLoadError(null);
        try {
            const result: GetRecordsResult = await getRecords({
                page: targetPage,
                pageSize: PAGE_SIZE,
            });
            const list = Array.isArray(result.list) ? result.list : [];
            setRecords(prev => (append ? [...prev, ...list] : list));
            setTotal(result.total);
            setHasMore(result.hasMore);
            setPage(targetPage);
        } catch {
            setLoadError('加载记录失败，请稍后重试。');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadPage(1, false);
    }, []);

    const empty = useMemo(
        () => !loading && (!records || records.length === 0),
        [loading, records],
    );

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className='record-page-zh w-full max-w-3xl mx-auto'
        >
            <GlassPanel className='p-5 sm:p-6 md:p-8 bg-white/10 border-white/25'>
                <div className='flex items-center justify-between mb-5'>
                    <button
                        type='button'
                        onClick={() => navigate('/')}
                        className='w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors'
                        aria-label='返回播放页'
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className='text-lg sm:text-xl tracking-wider text-white/90'>历史记录</h2>
                    <span className='text-xs sm:text-sm text-white/60'>共 {total} 条</span>
                </div>

                {empty && (
                    <div className='h-44 flex items-center justify-center text-white/60 text-sm'>
                        还没有记录，去播放页保存一条吧。
                    </div>
                )}

                {loadError && (
                    <p className='text-sm text-red-300 mb-4'>{loadError}</p>
                )}

                {records && records.length > 0 && (
                    <div className='space-y-3'>
                        {records.map(record => {
                            const sceneMeta = SCENE_META[record.scene];
                            return (
                                <motion.article
                                    key={record.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                    className='rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md overflow-hidden'
                                >
                                    <div className='flex gap-4 p-4'>
                                        {record.photoUrl && (
                                            <img
                                                src={record.photoUrl}
                                                alt=''
                                                className='w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-white/15'
                                            />
                                        )}
                                        <div className='flex-1 min-w-0'>
                                            <div className='flex items-start justify-between gap-3'>
                                                <div>
                                                    <p className='text-white/90 text-sm sm:text-base truncate'>{record.songName}</p>
                                                    <p className='text-white/55 text-xs mt-1'>{formatDateTime(record.createdAt)}</p>
                                                </div>
                                                <div className='flex items-center gap-2 text-xs text-white/70 shrink-0'>
                                                    {sceneMeta.icon}
                                                    <span>{sceneMeta.label}</span>
                                                </div>
                                            </div>
                                            <p className='mt-2 text-xs text-white/70'>
                                                时长：{formatDurationNatural(record.focusDuration)}
                                            </p>
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                )}

                {hasMore && (
                    <div className='mt-5 flex justify-center'>
                        <button
                            type='button'
                            onClick={() => void loadPage(page + 1, true)}
                            disabled={loading}
                            className='px-4 py-2 text-sm rounded-full border border-white/30 bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-60'
                        >
                            {loading ? '加载中...' : '加载更多'}
                        </button>
                    </div>
                )}
            </GlassPanel>
        </motion.section>
    );
};
