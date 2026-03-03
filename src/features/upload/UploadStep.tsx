import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { PhotoUploader } from './PhotoUploader.tsx';
import { UploadLoading } from './UploadLoading.tsx';
import { uploadImageAndRecognize } from '@/services/upload';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const UploadStep: React.FC = () => {
    const { nextStep, prevStep, setPhotoUrl, setTags } = useEnvironmentStore();
    const [isUploading, setIsUploading] = useState(false);
    const [isUploadResolved, setIsUploadResolved] = useState(false);
    const [isFrameTransitioning, setIsFrameTransitioning] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleUpload = async (file: File) => {
        setIsUploading(true);
        setIsUploadResolved(false);
        setUploadError(null);

        try {
            // Mock upload and recognition process
            const mockUrl = URL.createObjectURL(file);
            setPhotoUrl(mockUrl);

            // Simulate network request
            const tags = await uploadImageAndRecognize(file);

            // Mock tags
            setTags(tags);
            setIsUploadResolved(true);
        } catch (error) {
            setUploadError('上传失败，请重试');
            setIsUploading(false);
            setIsUploadResolved(false);
        }
    };

    const handleLoadingReady = () => {
        if (!isUploadResolved) return;
        nextStep();
    };

    return (
        <div className='w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center'>
            <AnimatePresence mode="wait">
                {isUploading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full"
                    >
                        <UploadLoading
                            isResolved={isUploadResolved}
                            onReadyToContinue={handleLoadingReady}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="uploader"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        layout
                        transition={{
                            layout: {
                                duration: 0.45,
                                ease: [0.22, 1, 0.36, 1],
                            },
                        }}
                        className="w-full flex flex-col items-center"
                    >
                        {/* 此景文字 - 左右有小横线 */}
                        <div className="flex items-center gap-5 mb-6 relative">
                            <div className='w-6 h-px bg-white/40' />
                            <h2 className="hetian-font text-base sm:text-lg md:text-xl tracking-wider text-white/90">此景</h2>
                            <div className='w-6 h-px bg-white/40' />
                        </div>

                        <motion.div
                            layout
                            transition={{
                                layout: {
                                    duration: 0.45,
                                    ease: [0.22, 1, 0.36, 1],
                                },
                            }}
                            className='w-full max-w-xs md:max-w-sm flex justify-center'
                        >
                            <PhotoUploader
                                onUpload={handleUpload}
                                onFrameTransitionChange={setIsFrameTransitioning}
                            />
                        </motion.div>

                        {uploadError && (
                            <p className="text-red-400 mt-4 text-sm">{uploadError}</p>
                        )}

                        <AnimatePresence mode='wait'>
                            {!isFrameTransitioning && (
                                <motion.div
                                    key='step-actions'
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    transition={{ duration: 0.25, ease: 'easeOut' }}
                                    className='w-full max-w-xs md:max-w-sm flex items-center justify-center mt-4 md:mt-5'
                                >
                                    <div className='flex items-center justify-center gap-6'>
                                        <motion.button
                                            type='button'
                                            onClick={prevStep}
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.96 }}
                                            className='w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/15 hover:bg-white/25 text-white/90 backdrop-blur-xl border border-white/40 hover:border-white/60 flex items-center justify-center shadow-[0_4px_24px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_32px_rgba(255,255,255,0.2)] transition-all'
                                            aria-label='返回上一步'
                                        >
                                            <ArrowLeft size={22} className='sm:w-6 sm:h-6' />
                                        </motion.button>
                                        <motion.button
                                            type='button'
                                            onClick={nextStep}
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.96 }}
                                            className='w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/15 hover:bg-white/25 text-white/90 backdrop-blur-xl border border-white/40 hover:border-white/60 flex items-center justify-center shadow-[0_4px_24px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_32px_rgba(255,255,255,0.2)] transition-all'
                                            aria-label='跳过上传并下一步'
                                        >
                                            <ArrowRight size={22} className='sm:w-6 sm:h-6' />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
