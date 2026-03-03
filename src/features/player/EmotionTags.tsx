import { motion } from 'framer-motion';

interface EmotionTagsProps {
    tags: string[];
}

export const EmotionTags = ({ tags }: EmotionTagsProps) => {
    return (
        <div className='flex flex-wrap justify-center gap-3 mt-5'>
            {tags.map((tag, index) => (
                <motion.span
                    key={`${tag}-${index}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{
                        opacity: 1,
                        y: [0, -4, 0],
                    }}
                    transition={{
                        opacity: { duration: 0.35, delay: index * 0.08 },
                        y: {
                            duration: 2.4 + index * 0.3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: 'easeInOut',
                        },
                    }}
                    className='px-3 py-1.5 rounded-full text-xs tracking-wide border border-white/35 bg-white/12 backdrop-blur-sm'
                >
                    {tag}
                </motion.span>
            ))}
        </div>
    );
};
