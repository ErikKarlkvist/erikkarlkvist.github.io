import React from 'react';

interface ModernBadgeProps {
    children: React.ReactNode;
    variant?: 'neutral' | 'accent' | 'success';
    version?: 'clean' | 'soft' | 'dynamic';
    className?: string;
}

export const Badge: React.FC<ModernBadgeProps> = ({
    children,
    variant = 'neutral',
    // version = 'clean',
    className = '',
}) => {
    // const { radius } = theme; 

    const getVariantStyles = () => {
        switch (variant) {
            case 'accent':
                return 'bg-orange-100 text-orange-800';
            case 'success':
                return 'bg-green-100 text-green-800';
            default: // neutral
                return 'bg-stone-100 text-stone-800';
        }
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVariantStyles()} ${className}`}>
            {children}
        </span>
    );
};
