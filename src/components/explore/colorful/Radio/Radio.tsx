import React from 'react';

interface ColorfulRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    version?: 'soft' | 'vibrant' | 'outline';
}

export const Radio: React.FC<ColorfulRadioProps> = ({
    label,
    // version = 'soft',
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
                    h-5 w-5 border-2 border-slate-300 text-orange-500 
                    focus:ring-4 focus:ring-orange-200 focus:ring-offset-0
                    checked:border-orange-500 checked:bg-orange-500
                    cursor-pointer transition-all duration-300
                "
                {...props}
            />
            <span className="text-sm font-medium text-slate-700">{label}</span>
        </label>
    );
};
