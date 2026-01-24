import React from 'react';
import { theme } from '../theme';

interface ModernCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    version?: 'clean' | 'soft' | 'dynamic';
}

export const Checkbox: React.FC<ModernCheckboxProps> = ({
    label,
    version = 'clean',
    className = '',
    id,
    ...props
}) => {
    const { colors } = theme;

    const checkboxStyles = `
        h-4 w-4 rounded border-stone-300 text-orange-600 focus:ring-orange-500 focus:ring-offset-0
        transition-all duration-200 cursor-pointer
        ${version === 'soft' ? 'bg-stone-100 border-none' : ''}
    `;

    return (
        <label htmlFor={id} className={`inline-flex items-center gap-2 cursor-pointer ${className}`}>
            <input
                id={id}
                type="checkbox"
                className={checkboxStyles}
                {...props}
            />
            <span className={`text-sm font-medium ${colors.text.primary}`}>{label}</span>
        </label>
    );
};
