import React from 'react';
import { theme } from '../theme';

interface ModernRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    version?: 'clean' | 'soft' | 'dynamic';
}

export const Radio: React.FC<ModernRadioProps> = ({
    label,
    // version = 'clean',
    className = '',
    id,
    ...props
}) => {
    const { colors } = theme;

    return (
        <label htmlFor={id} className={`inline-flex items-center gap-2 cursor-pointer ${className}`}>
            <input
                id={id}
                type="radio"
                className="
                    h-4 w-4 border-stone-300 text-orange-600 focus:ring-orange-500
                    cursor-pointer transition-all duration-200
                "
                {...props}
            />
            <span className={`text-sm font-medium ${colors.text.primary}`}>{label}</span>
        </label>
    );
};
