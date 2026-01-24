import React from 'react';

interface MinimalisticToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    version?: 'sharp' | 'rounded' | 'soft';
}

export const Toggle: React.FC<MinimalisticToggleProps> = ({
    label,
    version = 'sharp',
    className = '',
    checked,
    id,
    ...props
}) => {
    let radius = 'rounded-none';
    let knobRadius = 'rounded-none';

    if (version === 'rounded') {
        radius = 'rounded-full';
        knobRadius = 'rounded-full';
    }
    if (version === 'soft') {
        radius = 'rounded-full';
        knobRadius = 'rounded-full';
    }

    return (
        <label htmlFor={id} className={`inline-flex items-center gap-3 cursor-pointer ${className}`}>
            <div className="relative">
                <input
                    id={id}
                    type="checkbox"
                    className="sr-only peer"
                    checked={checked}
                    {...props}
                />
                <div className={`
                    w-12 h-6 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-neutral-900 peer-focus:ring-offset-2
                    peer-checked:after:translate-x-[1.5rem] peer-checked:after:border-white 
                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                    after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all
                    peer-checked:bg-neutral-900
                    ${radius} after:${knobRadius}
                `}></div>
            </div>
            {label && <span className="text-sm font-medium text-neutral-900">{label}</span>}
        </label>
    );
};
