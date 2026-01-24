import React from 'react';

interface ModernToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    version?: 'clean' | 'soft' | 'dynamic';
}

export const Toggle: React.FC<ModernToggleProps> = ({
    label,
    // version = 'clean',
    className = '',
    checked,
    id,
    ...props
}) => {
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
                    w-11 h-6 bg-stone-200 rounded-full peer 
                    peer-focus:ring-2 peer-focus:ring-orange-500 peer-focus:ring-offset-2
                    peer-checked:after:translate-x-full peer-checked:after:border-white 
                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                    after:bg-white after:border-gray-300 after:border after:rounded-full 
                    after:h-5 after:w-5 after:transition-all 
                    peer-checked:bg-orange-600
                `}></div>
            </div>
            {label && <span className="text-sm font-medium text-stone-900">{label}</span>}
        </label>
    );
};
