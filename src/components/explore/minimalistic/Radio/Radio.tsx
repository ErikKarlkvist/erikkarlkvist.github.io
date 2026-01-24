import React from 'react';

interface MinimalisticRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    version?: 'sharp' | 'rounded' | 'soft';
}

export const Radio: React.FC<MinimalisticRadioProps> = ({
    label,
    version = 'sharp',
    className = '',
    id,
    ...props
}) => {
    return (
        <label htmlFor={id} className={`inline-flex items-center gap-3 cursor-pointer ${className}`}>
            <input
                id={id}
                type="radio"
                className="
                    h-5 w-5 border-2 border-neutral-300 text-neutral-900 
                    focus:ring-1 focus:ring-neutral-900 focus:ring-offset-0
                    checked:border-neutral-900 checked:bg-neutral-900
                    cursor-pointer transition-all duration-200
                "
                {...props}
            />
            <span className="text-sm font-medium text-neutral-900">{label}</span>
        </label>
    );
};
