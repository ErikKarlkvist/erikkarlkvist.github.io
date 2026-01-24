import React from 'react';
import type { FormProps } from '../../types';
import { theme } from '../theme';

interface ModernFormProps extends Omit<FormProps, 'className'> {
    version?: 'clean' | 'soft' | 'dynamic';
}

export const Form: React.FC<ModernFormProps> = ({
    children,
    title,
    onSubmit,
    version = 'clean',
}) => {
    const { colors, spacing, radius } = theme;

    const getStyles = () => {
        const base = `w-full max-w-md ${spacing.padding} ${radius.default} transition-all duration-300`;

        switch (version) {
            case 'soft':
                return `${base} bg-white/90 backdrop-blur-sm border border-stone-100 shadow-lg shadow-stone-500/5`;
            case 'dynamic':
                return `${base} bg-white shadow-xl shadow-stone-200/50 border border-stone-100 hover:shadow-2xl hover:shadow-stone-200/60`;
            default: // clean
                return `${base} bg-white border ${colors.border.default} shadow-sm`;
        }
    };

    return (
        <form onSubmit={onSubmit} className={getStyles()}>
            {title && (
                <div className="mb-6">
                    <h3 className={`text-lg font-semibold ${colors.text.primary}`}>
                        {title}
                    </h3>
                    <div className="h-1 w-10 bg-orange-500 rounded mt-2" />
                </div>
            )}
            <div className="space-y-5">
                {children}
            </div>
        </form>
    );
};
