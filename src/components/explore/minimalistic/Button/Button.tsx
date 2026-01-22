import React from 'react';
import type { ButtonProps } from '../../types';
import { theme } from '../theme';
import { Loading } from '../Loading/Loading';

interface MinimalisticButtonProps extends Omit<ButtonProps, 'className'> {
    loadingText?: string;
}

export const Button: React.FC<MinimalisticButtonProps> = ({
    children,
    variant = 'primary',
    isLoading,
    loadingText,
    ...props
}) => {
    const { colors, borders } = theme;

    const baseStyles = `px-6 py-2 uppercase tracking-widest text-xs transition-all duration-300 ${borders.default} ${borders.radius} focus:outline-none focus:ring-1 focus:ring-neutral-400`;

    const variantStyles = {
        primary: `${colors.border.focus} ${colors.text.primary} bg-transparent hover:${colors.bg.primary} hover:${colors.text.inverse}`,
        secondary: `${colors.border.transparent} ${colors.text.secondary} hover:${colors.text.primary}`,
        accent: `${colors.border.focus} ${colors.text.inverse} ${colors.bg.primary} hover:bg-neutral-700`
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} disabled:opacity-50`}
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
