import React from 'react';
import { cn } from '@/utils/cn';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className, ...props }) => {
    return (
        <div
            className={cn('bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl', className)}
            {...props}
        >
            {children}
        </div>
    );
};
