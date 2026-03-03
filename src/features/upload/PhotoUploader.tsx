import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Check, RotateCcw, Upload, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PhotoUploaderProps {
    onUpload: (file: File) => void;
    disabled?: boolean;
    onFrameTransitionChange?: (isTransitioning: boolean) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
    onUpload,
    disabled = false,
    onFrameTransitionChange,
}) => {
    const FRAME_ROTATE_DURATION_MS = 450;
    const CONFIRM_PRELUDE_DURATION_MS = 450;
    const MIN_PINCH_SCALE = 1;
    const MAX_PINCH_SCALE = 2.5;
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLandscape, setIsLandscape] = useState(false);
    const [isFrameTransitioning, setIsFrameTransitioning] = useState(false);
    const [isConfirmingUpload, setIsConfirmingUpload] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [contentScale, setContentScale] = useState(1);
    const [isPinching, setIsPinching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const rotateTimerRef = useRef<number | null>(null);
    const confirmTimerRef = useRef<number | null>(null);
    const pinchStartDistanceRef = useRef<number | null>(null);
    const pinchStartScaleRef = useRef(1);
    const hasPinchedRef = useRef(false);
    const previewUrlRef = useRef<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment',
                    },
                    audio: false,
                });

                if (!isMounted) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                }
            } catch {
                setError('无法开启相机，请检查权限');
            }
        };

        startCamera();

        return () => {
            isMounted = false;
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (rotateTimerRef.current !== null) {
                window.clearTimeout(rotateTimerRef.current);
            }
            if (confirmTimerRef.current !== null) {
                window.clearTimeout(confirmTimerRef.current);
            }
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
                previewUrlRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const isTransitioning = isFrameTransitioning || isConfirmingUpload;
        onFrameTransitionChange?.(isTransitioning);
    }, [isConfirmingUpload, isFrameTransitioning, onFrameTransitionChange]);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const setPreviewObjectUrl = (url: string | null) => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }
        previewUrlRef.current = url;
        setPreviewUrl(url);
    };

    const clearPendingSelection = () => {
        setPendingFile(null);
        setPreviewObjectUrl(null);
        setContentScale(1);
    };

    const validateAndPrepare = (file: File) => {
        setError(null);
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            setError('仅支持 JPG/PNG 图片');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('图片大小不能超过 5MB');
            return;
        }

        const url = URL.createObjectURL(file);
        setPreviewObjectUrl(url);
        setPendingFile(file);
        setContentScale(1);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            validateAndPrepare(file);
            e.dataTransfer.clearData();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            validateAndPrepare(file);
        }
        e.target.value = '';
    };

    const handleClick = () => {
        if (disabled) return;
        if (hasPinchedRef.current) {
            hasPinchedRef.current = false;
            return;
        }
        if (pendingFile) return;
        fileInputRef.current?.click();
    };

    const getTouchDistance = (touches: React.TouchList) => {
        if (touches.length < 2) return 0;
        const x = touches[0].clientX - touches[1].clientX;
        const y = touches[0].clientY - touches[1].clientY;
        return Math.sqrt((x * x) + (y * y));
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (disabled) return;
        if (e.touches.length !== 2) return;

        const distance = getTouchDistance(e.touches);
        if (distance <= 0) return;

        pinchStartDistanceRef.current = distance;
        pinchStartScaleRef.current = contentScale;
        setIsPinching(true);
        hasPinchedRef.current = true;

        if (e.cancelable) {
            e.preventDefault();
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isPinching) return;
        if (e.touches.length !== 2 || pinchStartDistanceRef.current === null) return;

        const distance = getTouchDistance(e.touches);
        if (distance <= 0) return;

        const ratio = distance / pinchStartDistanceRef.current;
        const nextScale = pinchStartScaleRef.current * ratio;
        const clampedScale = Math.min(MAX_PINCH_SCALE, Math.max(MIN_PINCH_SCALE, nextScale));
        setContentScale(clampedScale);
        hasPinchedRef.current = true;

        if (e.cancelable) {
            e.preventDefault();
        }
    };

    const handleTouchEnd = () => {
        if (!isPinching) return;
        pinchStartDistanceRef.current = null;
        pinchStartScaleRef.current = contentScale;
        setIsPinching(false);
    };

    const handleUploadClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (disabled) return;
        fileInputRef.current?.click();
    };

    const handleCaptureClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (disabled) return;
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video.videoWidth === 0 || video.videoHeight === 0) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            if (!blob) return;
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            validateAndPrepare(file);
        }, 'image/jpeg', 0.92);
    };

    const handleConfirmSelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (disabled || !pendingFile) return;
        setIsConfirmingUpload(true);
        if (confirmTimerRef.current !== null) {
            window.clearTimeout(confirmTimerRef.current);
        }
        confirmTimerRef.current = window.setTimeout(() => {
            onUpload(pendingFile);
        }, CONFIRM_PRELUDE_DURATION_MS);
    };

    const handleRetrySelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (disabled) return;
        clearPendingSelection();
    };

    const handleRotateFrame = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (disabled) return;
        setIsFrameTransitioning(true);
        setIsLandscape(prev => !prev);
        if (rotateTimerRef.current !== null) {
            window.clearTimeout(rotateTimerRef.current);
        }
        rotateTimerRef.current = window.setTimeout(() => {
            setIsFrameTransitioning(false);
        }, FRAME_ROTATE_DURATION_MS);
    };

    const renderActionButtons = (isInside: boolean) => {
        const wrapperClassName = isInside
            ? 'absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-3'
            : '-mt-24 md:-mt-20 flex items-center justify-center gap-3';

        const buttonBaseClassName =
            'w-11 h-11 rounded-xl bg-white/15 hover:bg-white/25 text-white/90 backdrop-blur-xl ' +
            'border border-white/30 hover:border-white/50 flex items-center justify-center ' +
            'shadow-[0_4px_16px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_24px_rgba(255,255,255,0.18)] transition-all';

        const isConfirmMode = pendingFile !== null;

        return (
            <motion.div
                key={isInside ? 'inside' : 'outside'}
                initial={{ opacity: 0, y: isInside ? 8 : -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: isInside ? -8 : 8, scale: 0.96 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className={wrapperClassName}
            >
                {isConfirmMode ? (
                    <>
                        <motion.button
                            type='button'
                            onClick={handleConfirmSelection}
                            className='w-11 h-11 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/45 text-white backdrop-blur-xl border border-emerald-400/40 hover:border-emerald-400/60 flex items-center justify-center shadow-[0_4px_16px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_24px_rgba(16,185,129,0.35)] transition-all'
                            aria-label='确认上传'
                            whileHover={{ y: -1.5, scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                        >
                            <Check size={18} />
                        </motion.button>
                        <motion.button
                            type='button'
                            onClick={handleRetrySelection}
                            className='w-11 h-11 rounded-xl bg-white/15 hover:bg-white/25 text-white/90 backdrop-blur-xl border border-white/30 hover:border-white/50 flex items-center justify-center shadow-[0_4px_16px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_24px_rgba(255,255,255,0.18)] transition-all'
                            aria-label='重试'
                            whileHover={{ y: -1.5, scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                        >
                            <X size={18} />
                        </motion.button>
                    </>
                ) : (
                    <>
                        <motion.button
                            type='button'
                            onClick={handleUploadClick}
                            className={buttonBaseClassName}
                            aria-label='上传'
                            whileHover={{ y: -1.5, scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                        >
                            <Upload size={18} />
                        </motion.button>
                        <motion.button
                            type='button'
                            onClick={handleCaptureClick}
                            className={buttonBaseClassName}
                            aria-label='拍照'
                            whileHover={{ y: -1.5, scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                        >
                            <Camera size={18} />
                        </motion.button>
                        <motion.button
                            type='button'
                            onClick={handleRotateFrame}
                            className={cn(
                                'w-11 h-11 rounded-xl text-white/90 flex items-center justify-center backdrop-blur-xl border transition-all',
                                isLandscape
                                    ? 'bg-white/30 border-white/50 shadow-[0_4px_20px_rgba(255,255,255,0.2)]'
                                    : 'bg-white/15 border-white/30 hover:bg-white/25 hover:border-white/50 shadow-[0_4px_16px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_24px_rgba(255,255,255,0.18)]'
                            )}
                            aria-label='旋转镜头框'
                            whileHover={{ y: -1.5, scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                        >
                            <RotateCcw size={18} />
                        </motion.button>
                    </>
                )}
            </motion.div>
        );
    };

    return (
        <div className='w-full max-w-xs md:max-w-sm'>
            <motion.div
                className={cn(
                    'relative w-full rounded-3xl border border-white/25 overflow-hidden flex items-center justify-center transition-all duration-500',
                    'aspect-[2/3] md:aspect-[3/4]',
                    isConfirmingUpload ? 'border-white/55 shadow-[0_0_40px_rgba(255,255,255,0.25)]' : '',
                    isDragging ? 'border-white/70' : 'hover:border-white/45',
                    disabled ? 'pointer-events-none opacity-70' : ''
                )}
                style={{
                    transformOrigin: 'center center',
                    touchAction: 'none',
                }}
                animate={{
                    rotate: isLandscape ? 90 : 0,
                    scale: isLandscape ? 0.67 : 1,
                }}
                transition={{ duration: FRAME_ROTATE_DURATION_MS / 1000, ease: 'easeInOut' }}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleClick}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            >
                <input
                    type='file'
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept='image/jpeg, image/png'
                    className='hidden'
                />
                <canvas ref={canvasRef} className='hidden' />

                <motion.div
                    className='absolute inset-0'
                    initial={false}
                    animate={{
                        scale: isConfirmingUpload ? 1.08 : 1,
                        filter: isConfirmingUpload ? 'blur(12px) contrast(1.08)' : 'blur(0px) contrast(1)',
                    }}
                    transition={{ duration: CONFIRM_PRELUDE_DURATION_MS / 1000, ease: 'easeInOut' }}
                >
                    {previewUrl ? (
                        <motion.img
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            src={previewUrl}
                            alt='Preview'
                            className='absolute inset-0 w-full h-full object-cover'
                            style={{
                                transform: `scale(${contentScale})`,
                                transformOrigin: 'center center',
                                transition: isPinching ? 'none' : 'transform 0.18s ease-out',
                            }}
                        />
                    ) : (
                        <video
                            ref={videoRef}
                            className='w-full h-full object-cover'
                            style={{
                                transform: `scale(${contentScale})`,
                                transformOrigin: 'center center',
                                transition: isPinching ? 'none' : 'transform 0.18s ease-out',
                            }}
                            autoPlay
                            muted
                            playsInline
                        />
                    )}
                    {/* 无相机权限时也能看到旋转反馈的占位底纹 */}
                    <div className='absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none' />
                    {/* 非对称取景角标，保证旋转后有明显视觉变化 */}
                    <div className='absolute left-4 top-4 w-10 h-10 border-l-2 border-t-2 border-white/45 rounded-tl-xl pointer-events-none' />
                    <div className='absolute right-4 bottom-4 w-7 h-7 border-r-2 border-b-2 border-white/30 rounded-br-lg pointer-events-none' />
                </motion.div>

                <div className='absolute inset-0 border border-white/12 rounded-3xl pointer-events-none' />
                <AnimatePresence mode='wait'>
                    {!isLandscape && !isFrameTransitioning && !isConfirmingUpload && renderActionButtons(true)}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence mode='wait'>
                {isLandscape && !isFrameTransitioning && !isConfirmingUpload && renderActionButtons(false)}
            </AnimatePresence>

            <AnimatePresence mode='wait'>
                {error && !isFrameTransitioning && !isConfirmingUpload && (
                    <motion.p
                        key='camera-error'
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className='text-red-300 text-sm mt-3 text-center'
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};
