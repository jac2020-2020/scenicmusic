import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/utils/cn';

interface WheelPickerProps<T> {
    options: { value: T; label?: string; icon?: React.ReactNode }[];
    value: T;
    onChange: (val: T) => void;
    title?: string;
    showTitle?: boolean;
    iconPosition?: 'left' | 'right';
    arcSide?: 'left' | 'right';
    className?: string;
}

export function WheelPicker<T extends string>({
    options,
    value,
    onChange,
    title,
    showTitle = true,
    iconPosition = 'left',
    arcSide,
    className,
}: WheelPickerProps<T>) {
    const ITEM_HEIGHT = 64;
    const VIEWPORT_HEIGHT = 420;
    const RADIUS = 280;
    const SPACER_HEIGHT = (VIEWPORT_HEIGHT - ITEM_HEIGHT) / 2;
    const CYCLE_COUNT = 9;
    const MID_CYCLE = Math.floor(CYCLE_COUNT / 2);
    const isLeftWheel = arcSide ? arcSide === 'left' : title === 'WEATHER';

    const baseCount = options.length;
    const safeBaseCount = Math.max(1, baseCount);
    const totalItems = safeBaseCount * CYCLE_COUNT;
    const baseIndexFromValue = Math.max(0, options.findIndex(o => o.value === value));

    const renderedItems = useMemo(() => {
        const list: Array<{ option: WheelPickerProps<T>['options'][number]; baseIndex: number; globalIndex: number }> = [];
        for (let cycle = 0; cycle < CYCLE_COUNT; cycle++) {
            for (let baseIndex = 0; baseIndex < safeBaseCount; baseIndex++) {
                const option = options[baseIndex];
                if (!option) continue;
                list.push({
                    option,
                    baseIndex,
                    globalIndex: (cycle * safeBaseCount) + baseIndex,
                });
            }
        }
        return list;
    }, [options, safeBaseCount]);

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const snapTimerRef = useRef<number | null>(null);
    const [scrollTop, setScrollTop] = useState(0);

    const normalizeBaseIndex = useCallback((index: number) => {
        if (safeBaseCount <= 0) return 0;
        const mod = index % safeBaseCount;
        return mod >= 0 ? mod : mod + safeBaseCount;
    }, [safeBaseCount]);

    const scrollToGlobalIndex = useCallback((globalIndex: number, behavior: ScrollBehavior, emitChange: boolean) => {
        const container = scrollRef.current;
        if (!container || options.length === 0) return;

        const clamped = Math.max(0, Math.min(globalIndex, totalItems - 1));
        container.scrollTo({
            top: clamped * ITEM_HEIGHT,
            behavior,
        });

        if (emitChange) {
            const base = normalizeBaseIndex(clamped);
            const picked = options[base];
            if (picked) {
                onChange(picked.value);
            }
        }
    }, [ITEM_HEIGHT, normalizeBaseIndex, onChange, options, totalItems]);

    const scrollToNearestBaseIndex = useCallback((baseIndex: number, behavior: ScrollBehavior, emitChange: boolean) => {
        const container = scrollRef.current;
        if (!container || options.length === 0) return;

        const currentCenter = container.scrollTop / ITEM_HEIGHT;
        const centerCycle = Math.floor(currentCenter / safeBaseCount);
        const candidates = [centerCycle - 1, centerCycle, centerCycle + 1]
            .map(cycle => (cycle * safeBaseCount) + baseIndex)
            .filter(index => index >= 0 && index < totalItems);

        const best = candidates.reduce((prev, curr) => {
            const prevDist = Math.abs(prev - currentCenter);
            const currDist = Math.abs(curr - currentCenter);
            return currDist < prevDist ? curr : prev;
        }, candidates[0] ?? ((MID_CYCLE * safeBaseCount) + baseIndex));

        scrollToGlobalIndex(best, behavior, emitChange);
    }, [ITEM_HEIGHT, MID_CYCLE, safeBaseCount, scrollToGlobalIndex, totalItems, options.length]);

    const handleScroll = useCallback(() => {
        const container = scrollRef.current;
        if (!container || options.length === 0) return;

        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
        }

        rafRef.current = requestAnimationFrame(() => {
            const top = container.scrollTop;
            setScrollTop(top);

            const rawCenter = top / ITEM_HEIGHT;
            const nearestGlobal = Math.round(rawCenter);
            const nearestBase = normalizeBaseIndex(nearestGlobal);

            if (snapTimerRef.current !== null) {
                window.clearTimeout(snapTimerRef.current);
            }

            snapTimerRef.current = window.setTimeout(() => {
                scrollToNearestBaseIndex(nearestBase, 'smooth', true);
            }, 90);

            // Keep scroll position near middle cycle for infinite effect.
            if (nearestGlobal < safeBaseCount || nearestGlobal > (totalItems - safeBaseCount - 1)) {
                const recenteredGlobal = (MID_CYCLE * safeBaseCount) + nearestBase;
                container.scrollTo({
                    top: recenteredGlobal * ITEM_HEIGHT,
                    behavior: 'auto',
                });
                setScrollTop(recenteredGlobal * ITEM_HEIGHT);
            }
        });
    }, [
        ITEM_HEIGHT,
        MID_CYCLE,
        normalizeBaseIndex,
        options.length,
        safeBaseCount,
        scrollToNearestBaseIndex,
        totalItems,
    ]);

    useEffect(() => {
        if (options.length === 0) return;
        const initialGlobal = (MID_CYCLE * safeBaseCount) + baseIndexFromValue;
        scrollToGlobalIndex(initialGlobal, 'auto', false);
        setScrollTop(initialGlobal * ITEM_HEIGHT);
    }, [ITEM_HEIGHT, MID_CYCLE, baseIndexFromValue, safeBaseCount, scrollToGlobalIndex, options.length]);

    useEffect(() => {
        if (options.length === 0) return;
        scrollToNearestBaseIndex(baseIndexFromValue, 'auto', false);
    }, [baseIndexFromValue, scrollToNearestBaseIndex, options.length]);

    useEffect(() => {
        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
            }
            if (snapTimerRef.current !== null) {
                window.clearTimeout(snapTimerRef.current);
            }
        };
    }, []);

    const virtualCenter = useMemo(() => scrollTop / ITEM_HEIGHT, [scrollTop, ITEM_HEIGHT]);

    return (
        <div className={cn('flex flex-col items-center', className)}>
            {title && showTitle && <div className='text-xs font-medium text-white/30 mb-6 tracking-widest'>{title}</div>}

            <div
                className='relative w-64'
                style={{ height: VIEWPORT_HEIGHT }}
            >
                <div
                    ref={scrollRef}
                    className='h-full overflow-y-auto scrollbar-hide touch-pan-y'
                    style={{
                        scrollSnapType: 'y mandatory',
                        maskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
                    }}
                    onScroll={handleScroll}
                >
                    <div style={{ height: SPACER_HEIGHT }} />
                    {renderedItems.map(({ option, baseIndex, globalIndex }) => {
                        const relative = globalIndex - virtualCenter;
                        const absRelative = Math.abs(relative);
                        const y = Math.min(Math.abs(relative * ITEM_HEIGHT), RADIUS - 1);
                        const circleDepth = RADIUS - Math.sqrt(Math.max((RADIUS * RADIUS) - (y * y), 0));
                        const arcOffset = circleDepth * 2.1;
                        const translateX = isLeftWheel ? arcOffset : -arcOffset;
                        const rotateY = isLeftWheel ? (absRelative * 11) : -(absRelative * 11);
                        const scale = Math.max(0.6, 1 - (absRelative * 0.11));
                        const opacity = Math.max(0.18, 1 - (absRelative * 0.22));
                        const blur = Math.min(4, absRelative * 1.15);
                        const isActive = absRelative < 0.45;

                        return (
                            <div
                                key={`${option.value}-${globalIndex}`}
                                className='w-full flex items-center justify-center'
                                style={{
                                    height: ITEM_HEIGHT,
                                    scrollSnapAlign: 'center',
                                }}
                            >
                                <div
                                    className='w-full h-full flex items-center justify-center cursor-pointer select-none'
                                    onClick={() => scrollToNearestBaseIndex(baseIndex, 'smooth', true)}
                                    style={{
                                        opacity,
                                        transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                                        transformOrigin: isLeftWheel ? 'left center' : 'right center',
                                        filter: `blur(${blur}px)`,
                                    }}
                                >
                                    <div className='flex items-center gap-3'>
                                        {option.icon && iconPosition === 'left' && (
                                            <span className={cn(isActive ? 'scale-125' : 'scale-90')}>
                                                {option.icon}
                                            </span>
                                        )}
                                        <span
                                            className={cn(
                                                'font-serif',
                                                isActive ? 'text-4xl tracking-wide font-semibold' : 'text-xl tracking-normal font-light',
                                            )}
                                            style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.45)' }}
                                        >
                                            {option.label || option.value}
                                        </span>
                                        {option.icon && iconPosition === 'right' && (
                                            <span className={cn(isActive ? 'scale-125' : 'scale-90')}>
                                                {option.icon}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div style={{ height: SPACER_HEIGHT }} />
                </div>
            </div>
        </div>
    );
}
