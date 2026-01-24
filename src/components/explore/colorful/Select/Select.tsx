import React from 'react';
import { theme } from '../theme';

interface ColorfulSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    version?: 'soft' | 'vibrant' | 'outline';
    options: { value: string; label: string }[];
}

export const Select: React.FC<ColorfulSelectProps> = ({
    label,
    error,
    version = 'soft',
    className = '',
    options,
    id,
    ...props
}) => {
    const { spacing } = theme;

    const getStyles = () => {
        const base = `w-full ${spacing.padding.input} ${spacing.radius.input} transition-all duration-300 outline-none block appearance-none bg-no-repeat bg-[right_1rem_center]`;

        if (version === 'vibrant') {
            return `${base} bg-white border-2 border-orange-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 text-slate-800`;
        }

        if (version === 'outline') {
            return `${base} bg-transparent border-2 border-slate-200 focus:border-orange-500 text-slate-800`;
        }

        // soft
        return `${base} bg-slate-50 border-2 border-transparent focus:border-orange-200 focus:bg-white focus:shadow-sm text-slate-800`;
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-sm font-semibold text-slate-700 ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    id={id}
                    className={getStyles()}
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ea580c' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")" }}
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
                <p className="text-sm text-red-500 font-medium ml-1">{error}</p>
            )}
        </div>
    );
};
