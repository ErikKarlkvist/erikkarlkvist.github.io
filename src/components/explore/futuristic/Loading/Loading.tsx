import React from 'react';
import { theme } from '../theme';

export const Loading: React.FC = () => {
    const { typography } = theme;
    return (
        <span className={`flex items-center gap-1 ${typography.textShadow}`}>
            <span className="animate-[pulse_1s_ease-in-out_infinite] opacity-50">/</span>
            <span className="animate-[pulse_1s_ease-in-out_0.2s_infinite]">/</span>
            <span className="animate-[pulse_1s_ease-in-out_0.4s_infinite] opacity-50">/</span>
        </span>
    );
};
