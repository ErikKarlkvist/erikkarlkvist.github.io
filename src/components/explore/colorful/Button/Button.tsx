import React from 'react';
import type { ButtonProps } from '../../types';
import { theme } from '../theme';
import { Loading } from '../Loading/Loading';

interface ColorfulButtonProps extends Omit<ButtonProps, 'className'> {
    loadingText?: string;
}

export const Button: React.FC<ColorfulButtonProps> = ({
    children,
    variant = 'primary',
    isLoading,
    loadingText,
    ...props
}) => {
    const { colors, spacing } = theme;

    const baseStyles = `${spacing.padding.button} ${spacing.radius.button} font-semibold transition-all duration-300 transform active:scale-95 ${colors.shadow.button}`;

    const variantStyles = {
        primary: `${colors.gradient.primary} ${colors.text.inverse} border-none hover:-translate-y-0.5`,
        secondary: `${colors.bg.surface} ${colors.text.accent} border-2 border-orange-100 hover:border-orange-200`,
        accent: `${colors.bg.primary} ${colors.text.inverse} ${colors.bg.primaryHover}`
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]}`}
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
