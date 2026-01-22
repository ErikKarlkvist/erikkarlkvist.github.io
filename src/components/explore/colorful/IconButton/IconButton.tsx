import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({ children, ...props }) => {
    return (
        <button
            className={`
                p-4 rounded-full transition-all duration-300 z-50
                text-white bg-black/20 hover:bg-black/30 backdrop-blur-md shadow-lg border border-white/30
            `}
            {...props}
        >
            {children}
        </button>
    );
};
