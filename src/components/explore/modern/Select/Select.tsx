import React from 'react';
import type { BaseProps } from '../../types';
import { theme } from '../theme';

interface ModernSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, BaseProps {
    label?: string;
    error?: string;
    version?: 'clean' | 'soft' | 'dynamic';
    options: { value: string; label: string }[];
}

export const Select: React.FC<ModernSelectProps> = ({
    label,
    error,
    version = 'clean',
    className = '',
    options,
    id,
    ...props
}) => {
    const { colors, spacing, radius } = theme;

    const getStyles = () => {
        const base = `w-full ${spacing.padding} py-2.5 ${radius.default} transition-all duration-200 outline-none block appearance-none bg-no-repeat bg-[right_1rem_center]`;
        const border = `border ${error ? colors.border.error : colors.border.default}`;


        if (version === 'soft') {
            return `${base} border-transparent bg-stone-100 focus:bg-white focus:ring-2 focus:ring-stone-200 focus:border-stone-300 text-stone-900`;
        }

        if (version === 'dynamic') {
            return `${base} ${border} bg-white shadow-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 text-stone-900`;
        }

        // clean
        return `${base} ${border} bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-stone-900`;
    };

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label htmlFor={id} className={`block text-sm font-medium ${colors.text.primary}`}>
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    id={id}
                    className={getStyles()}
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")" }}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            {error && (
                <p className={`text-sm ${colors.text.error}`}>{error}</p>
            )}
        </div>
    );
};
