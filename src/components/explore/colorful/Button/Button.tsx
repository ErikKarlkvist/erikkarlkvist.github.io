import React from 'react';
import { theme } from '../theme';
import { Loading } from '../Loading/Loading';

interface ColorfulButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent';
    fullWidth?: boolean;
    isLoading?: boolean;
    loadingText?: string;
    version?: 'soft' | 'vibrant' | 'outline';
    className?: string;
}

export const Button: React.FC<ColorfulButtonProps> = ({
    children,
    variant = 'primary',
    fullWidth = false,
    isLoading = false,
    loadingText,
    version = 'soft',
    className = '',
    ...props
}) => {
    const { colors } = theme;

    const baseStyles = `
        px-6 py-2.5 font-bold uppercase tracking-wider text-xs transition-all duration-300
        rounded-full focus:outline-none focus:ring-4 focus:ring-orange-200
        disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95
        flex items-center justify-center gap-2
    `;

    const getVariantStyles = () => {
        if (version === 'vibrant') {
            switch (variant) {
                case 'secondary': return 'bg-white text-orange-600 border-2 border-orange-100 hover:border-orange-500';
                case 'accent': return 'bg-violet-600 text-white hover:bg-violet-700';
                default: return 'bg-orange-500 text-white shadow-[0_10px_20px_-10px_rgba(249,115,22,0.5)] hover:bg-orange-600 hover:shadow-[0_15px_30px_-10px_rgba(249,115,22,0.6)]';
            }
        }

        if (version === 'outline') {
            switch (variant) {
                case 'secondary': return 'bg-transparent text-slate-600 border-2 border-slate-200 hover:border-slate-400';
                case 'accent': return 'bg-transparent text-violet-600 border-2 border-violet-500 hover:bg-violet-50';
                default: return 'bg-transparent text-orange-600 border-2 border-orange-500 hover:bg-orange-50';
            }
        }

        // soft (default)
        switch (variant) {
            case 'secondary': return `${colors.bg.surface} ${colors.text.accent} border-2 border-orange-100 hover:border-orange-200`;
            case 'accent': return `${colors.bg.primary} ${colors.text.inverse} ${colors.bg.primaryHover}`;
            default: return `${colors.gradient.primary} ${colors.text.inverse} border-none hover:-translate-y-0.5 ${colors.shadow.button}`;
        }
    };

    return (
        <button
            className={`
                ${baseStyles}
                ${getVariantStyles()}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <Loading />
                    {loadingText && <span>{loadingText}</span>}
                </div>
            ) : children}
        </button>
    );
};
