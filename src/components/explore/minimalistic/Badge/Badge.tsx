import React from 'react';

interface MinimalisticBadgeProps {
    children: React.ReactNode;
    variant?: 'neutral' | 'inverse' | 'outline';
    version?: 'sharp' | 'rounded' | 'soft';
    className?: string;
}

export const Badge: React.FC<MinimalisticBadgeProps> = ({
    children,
    variant = 'neutral',
    version = 'sharp',
    className = '',
}) => {
    let radius = 'rounded-none';
    if (version === 'rounded') radius = 'rounded';
    if (version === 'soft') radius = 'rounded-full';

    const getVariantStyles = () => {
        switch (variant) {
            case 'inverse':
                return 'bg-neutral-900 text-white';
            case 'outline':
                return 'bg-transparent border border-neutral-900 text-neutral-900';
            default: // neutral
                return 'bg-neutral-100 text-neutral-900';
        }
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${radius} ${getVariantStyles()} ${className}`}>
            {children}
        </span>
    );
};
