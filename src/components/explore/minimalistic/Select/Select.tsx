import React from 'react';

interface MinimalisticSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    version?: 'sharp' | 'rounded' | 'soft';
    options: { value: string; label: string }[];
}

export const Select: React.FC<MinimalisticSelectProps> = ({
    label,
    error,
    version = 'sharp',
    className = '',
    options,
    id,
    ...props
}) => {

    const getStyles = () => {
        // More padding (py-3 px-4), cleaner border (1px instead of 2px)
        const base = `w-full py-3 px-4 border transition-all duration-200 outline-none block appearance-none bg-no-repeat bg-[right_1rem_center]`;

        let radius = 'rounded-none';
        if (version === 'rounded') radius = 'rounded-md';
        if (version === 'soft') radius = 'rounded-xl';

        const border = error ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900';

        return `${base} ${radius} ${border} bg-white text-neutral-900`;
    };

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-neutral-900">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    id={id}
                    className={getStyles()}
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23171717' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")" }}
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
                <p className="text-xs text-red-500 font-medium">{error}</p>
            )}
        </div>
    );
};
