import React from 'react';
import type { InputProps } from '../../types';
import { theme } from '../theme';

interface ModernInputProps extends Omit<InputProps, 'className'> {
    version?: 'clean' | 'soft' | 'dynamic';
}

export const Input: React.FC<ModernInputProps> = ({
    label,
    error,
    id,
    version = 'clean',
    ...props
}) => {
    const { colors, spacing, radius } = theme;

    const getStyles = () => {
        const base = `w-full ${spacing.padding} py-2.5 ${radius.default} transition-all duration-200 outline-none block`;
        const border = `border ${error ? colors.border.error : colors.border.default}`;

        if (version === 'soft') {
            return `${base} border-transparent bg-stone-100 focus:bg-white focus:ring-2 focus:ring-stone-200 focus:border-stone-300 text-stone-900 placeholder:text-stone-400`;
        }

        if (version === 'dynamic') {
            return `${base} ${border} bg-white shadow-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 text-stone-900 placeholder:text-stone-400`;
        }

        // clean (default)
        return `${base} ${border} bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-stone-900 placeholder:text-stone-400`;
    };

    return (
        <div className="space-y-1.5">
            {label && (
                <label htmlFor={id} className={`block text-sm font-medium ${colors.text.primary}`}>
                    {label}
                </label>
            )}
            <input
                id={id}
                className={getStyles()}
                {...props}
            />
            {error && (
                <p className={`text-sm ${colors.text.error}`}>{error}</p>
            )}
        </div>
    );
};
