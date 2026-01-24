import React from 'react';

interface MinimalisticCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    version?: 'sharp' | 'rounded' | 'soft';
}

export const Checkbox: React.FC<MinimalisticCheckboxProps> = ({
    label,
    version = 'sharp',
    className = '',
    id,
    ...props
}) => {
    let radius = 'rounded-none';
    if (version === 'rounded') radius = 'rounded';
    if (version === 'soft') radius = 'rounded-md';

    const checkboxStyles = `
        h-5 w-5 ${radius} border-2 border-neutral-300 text-neutral-900 
        focus:ring-offset-0 focus:ring-1 focus:ring-neutral-900
        checked:bg-neutral-900 checked:border-neutral-900
        transition-all duration-200 cursor-pointer
    `;

    return (
        <label htmlFor={id} className={`inline-flex items-center gap-3 cursor-pointer ${className}`}>
            <input
                id={id}
                type="checkbox"
                className={checkboxStyles}
                {...props}
            />
            <span className="text-sm font-medium text-neutral-900">{label}</span>
        </label>
    );
};
