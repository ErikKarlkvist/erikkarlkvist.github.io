import React from 'react';

interface ColorfulToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    version?: 'soft' | 'vibrant' | 'outline';
}

export const Toggle: React.FC<ColorfulToggleProps> = ({
    label,
    version = 'soft',
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
                    w-12 h-7 bg-slate-200 rounded-full peer 
                    peer-focus:ring-4 peer-focus:ring-violet-200 
                    peer-checked:after:translate-x-full peer-checked:after:border-white 
                    after:content-[''] after:absolute after:top-[4px] after:left-[4px] 
                    after:bg-white after:rounded-full
                    after:h-5 after:w-5 after:transition-all after:shadow-sm
                    peer-checked:bg-gradient-to-r peer-checked:from-orange-400 peer-checked:to-orange-500
                `}></div>
            </div>
            {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
        </label>
    );
};
