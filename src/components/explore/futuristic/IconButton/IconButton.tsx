import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({ children, ...props }) => {
    return (
        <button
            className={`
                p-4 transition-all duration-300 z-50
                text-cyan-400 border border-cyan-500/50 bg-slate-900/80 hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.2)] backdrop-blur
            `}
            style={{ clipPath: "polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)" }}
            {...props}
        >
            {children}
        </button>
    );
};
