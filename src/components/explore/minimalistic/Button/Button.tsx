import React from 'react';
import { Loading } from '../Loading/Loading';

interface MinimalisticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    fullWidth?: boolean;
    isLoading?: boolean;
    loadingText?: string;
    version?: 'sharp' | 'rounded' | 'soft';
    className?: string;
}

export const Button: React.FC<MinimalisticButtonProps> = ({
    children,
    variant = 'primary',
    fullWidth = false,
    isLoading = false,
    loadingText,
    version = 'sharp',
    className = '',
    ...props
}) => {
    let radius = 'rounded-none';
    if (version === 'rounded') radius = 'rounded-md';
    if (version === 'soft') radius = 'rounded-full';

    const baseStyles = `
        px-6 py-2.5 font-bold uppercase tracking-wider text-xs transition-all duration-200
        ${radius} border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
    `;

    const variants = {
        primary: 'bg-neutral-900 text-white border-neutral-900 hover:bg-white hover:text-neutral-900',
        secondary: 'bg-white text-neutral-900 border-neutral-200 hover:border-neutral-900',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} disabled:opacity-50`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <Loading />
                    {loadingText && <span>{loadingText}</span>}
                </span>
            ) : children}
        </button>
    );
};
