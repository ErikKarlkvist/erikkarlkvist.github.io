import React from 'react';

interface ColorfulBadgeProps {
    children: React.ReactNode;
    variant?: 'neutral' | 'accent' | 'success';
    version?: 'soft' | 'vibrant' | 'outline';
    className?: string;
}

export const Badge: React.FC<ColorfulBadgeProps> = ({
    children,
    variant = 'neutral',
    version = 'soft',
    className = '',
}) => {

    const getVariantStyles = () => {
        // Outline version overrides
        if (version === 'outline') {
            switch (variant) {
                case 'accent': return 'border-2 border-orange-500 text-orange-600';
                case 'success': return 'border-2 border-green-500 text-green-600';
                default: return 'border-2 border-slate-300 text-slate-600';
            }
        }

        switch (variant) {
            case 'accent':
                return 'bg-orange-100 text-orange-700';
            case 'success':
                return 'bg-green-100 text-green-700';
            default: // neutral
                return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getVariantStyles()} ${className}`}>
            {children}
        </span>
    );
};
