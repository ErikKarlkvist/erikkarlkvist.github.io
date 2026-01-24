import React from 'react';

interface ColorfulCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    version?: 'soft' | 'vibrant' | 'outline';
}

export const Checkbox: React.FC<ColorfulCheckboxProps> = ({
    label,
    // version = 'soft',
    className = '',
    id,
    ...props
}) => {

    const checkboxStyles = `
        h-5 w-5 rounded-lg border-2 border-slate-300 text-orange-500 
        focus:ring-orange-200 focus:ring-offset-0 focus:ring-4
        checked:bg-orange-500 checked:border-orange-500
        transition-all duration-300 cursor-pointer
    `;

    return (
        <label htmlFor={id} className={`inline-flex items-center gap-3 cursor-pointer ${className}`}>
            <input
                id={id}
                type="checkbox"
                className={checkboxStyles}
                {...props}
            />
            <span className="text-sm font-medium text-slate-700">{label}</span>
        </label>
    );
};
