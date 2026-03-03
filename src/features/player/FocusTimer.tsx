import { Clock3 } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';

interface FocusTimerProps {
    formattedTime: string;
}

export const FocusTimer = ({ formattedTime }: FocusTimerProps) => {
    return (
        <GlassPanel className='inline-flex items-center gap-2 px-3 py-2 border-white/30 bg-white/10 rounded-xl'>
            <Clock3 size={14} className='text-white/80' />
            <span className='text-sm tracking-wider text-white/90 tabular-nums'>{formattedTime}</span>
        </GlassPanel>
    );
};
