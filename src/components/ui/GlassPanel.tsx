import React from 'react';
import { cn } from '@/utils/cn';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className, ...props }) => {
    return (
        <div
            className={cn('bg-white/10 backdrop-blur-xl border border-white/25 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]', className)}
            {...props}
        >
            {children}
        </div>
    );
};
