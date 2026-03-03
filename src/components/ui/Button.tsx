import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ButtonProps extends HTMLMotionProps<'button'> {
    variant?: 'primary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-xl font-normal transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none';

        const variants = {
            primary: 'bg-white/15 hover:bg-white/25 text-white/90 hover:text-white backdrop-blur-md border border-white/30 shadow-[0_4px_24px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_32px_rgba(255,255,255,0.15)]',
            ghost: 'bg-white/5 hover:bg-white/15 text-white/70 hover:text-white backdrop-blur-sm border border-white/10 hover:border-white/20',
            outline: 'bg-transparent hover:bg-white/10 text-white/80 hover:text-white border border-white/40 hover:border-white/60 backdrop-blur-sm',
        };

        const sizes = {
            sm: 'h-9 px-4 text-sm',
            md: 'h-11 px-6 text-base',
            lg: 'h-14 px-8 text-lg',
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';
