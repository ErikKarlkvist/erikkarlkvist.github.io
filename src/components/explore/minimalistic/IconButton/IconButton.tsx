import React from 'react';
import { theme } from '../theme';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({ children, ...props }) => {
    const { colors, borders } = theme;
    return (
        <button
            className={`
                p-4 rounded-full transition-all duration-300 z-50
                ${colors.text.primary} bg-white ${borders.default} ${colors.border.default} shadow-sm hover:bg-neutral-100
            `}
            {...props}
        >
            {children}
        </button>
    );
};
