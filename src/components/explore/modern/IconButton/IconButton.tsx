import React, { type ButtonHTMLAttributes } from 'react';
import { theme } from '../theme';

export const IconButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, onClick, className = '' }) => {
    const { colors, radius } = theme;

    return (
        <button
            onClick={onClick}
            className={`
                p-3 ${radius.full} transition-all duration-300
                ${colors.bg.surface} ${colors.text.primary} border ${colors.border.default} ${colors.shadow.sm}
                hover:${colors.bg.soft} hover:${colors.border.focus} hover:${colors.text.accent} hover:${colors.shadow.md} hover:-translate-y-0.5
                active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
        >
            {children}
        </button>
    );
};
