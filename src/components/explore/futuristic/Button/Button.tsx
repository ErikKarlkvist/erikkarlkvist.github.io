import React from 'react';
import type { ButtonProps } from '../../types';
import { theme } from '../theme';
import { Loading } from '../Loading/Loading';

interface FuturisticButtonProps extends Omit<ButtonProps, 'className'> {
    loadingText?: string;
}

export const Button: React.FC<FuturisticButtonProps> = ({
    children,
    variant = 'primary',
    isLoading,
    loadingText,
    ...props
}) => {
    const { colors, shapes, typography } = theme;

    // Base styles
    const baseStyles = `relative px-8 py-3 ${typography.button} transition-all duration-300 overflow-hidden group text-cyan-400 hover:text-white`;

    return (
        <button
            className={baseStyles}
            disabled={isLoading || props.disabled}
            style={{ clipPath: shapes.clipPath.button }}
            {...props}
        >
            <div className={`absolute inset-0 ${colors.background.overlay} ${colors.border.primary} border group-hover:bg-cyan-600/20 transition-colors`} />
            <div className={`absolute bottom-0 right-0 w-2 h-2 bg-cyan-400 ${colors.shadow.glow}`} />
            <div className={`absolute top-0 left-0 w-2 h-2 bg-cyan-400 ${colors.shadow.glow}`} />

            <span className={`relative z-10 flex items-center gap-2 ${typography.textShadow}`}>
                {isLoading ? (
                    <>
                        <Loading />
                        {loadingText && <span>{loadingText}</span>}
                    </>
                ) : children}
            </span>
        </button>
    );
};
