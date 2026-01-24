import React from 'react';
import type { ButtonProps } from '../../types';
import { theme } from '../theme';

interface ModernButtonProps extends Omit<ButtonProps, 'className'> {
    loadingText?: string;
    version?: 'clean' | 'soft' | 'dynamic';
    className?: string;
}

export const Button: React.FC<ModernButtonProps> = ({
    children,
    variant = 'primary',
    isLoading,
    loadingText,
    version = 'clean',
    className = '',
    ...props
}) => {
    const { colors, spacing, radius } = theme;

    const baseStyles = `
        ${spacing.padding} py-2.5 font-medium text-sm transition-all duration-200 
        ${radius.default} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
        disabled:opacity-60 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
    `;

    const getVariantStyles = () => {
        // Dynamic version supports shadow interactions but NO translation
        const shadow = version === 'dynamic' ? 'shadow-md hover:shadow-lg' : 'shadow-sm hover:shadow';
        const flat = version === 'clean' ? 'shadow-none' : shadow;

        switch (variant) {
            case 'primary':
                return `${colors.bg.primary} ${colors.bg.primaryHover} ${colors.text.inverse} ${flat}`;
            case 'secondary':
                return `${colors.bg.surface} hover:bg-stone-50 ${colors.text.primary} border ${colors.border.default} ${flat === 'shadow-none' ? '' : 'shadow-sm'}`;
            case 'accent':
                return `${colors.bg.soft} hover:bg-stone-200 ${colors.text.accent} border-transparent ${flat === 'shadow-none' ? '' : 'shadow-sm'}`;
            default:
                return '';
        }
    };

    return (
        <button
            className={`${baseStyles} ${getVariantStyles()} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            {isLoading && loadingText ? loadingText : children}
        </button>
    );
};
