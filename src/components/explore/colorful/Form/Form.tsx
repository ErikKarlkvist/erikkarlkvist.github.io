import React from 'react';
import type { FormProps } from '../../types';
import { theme } from '../theme';
import { Heading } from '../Typography/Heading';

interface ColorfulFormProps extends Omit<FormProps, 'className'> {
    version?: 'soft' | 'vibrant' | 'outline';
}

export const Form: React.FC<ColorfulFormProps> = ({
    children,
    title,
    onSubmit,
    version = 'soft',
}) => {
    const { colors, spacing } = theme;

    const getVersionStyles = () => {
        switch (version) {
            case 'vibrant':
                return `bg-white shadow-xl shadow-orange-500/10 border-orange-100`;
            case 'outline':
                return `bg-white/50 border-slate-200 backdrop-blur-sm`;
            default: // soft
                return `${colors.bg.surface} ${colors.shadow.card} ${colors.border.default}`;
        }
    };

    return (
        <form
            onSubmit={onSubmit}
            className={`w-full max-w-md ${spacing.padding.card} ${spacing.radius.card} border transition-all duration-500 ${getVersionStyles()}`}
        >
            {title && (
                <div className="mb-8 text-center">
                    <Heading variant="section">
                        {title}
                    </Heading>
                    <div className="w-12 h-1.5 bg-orange-200 rounded-full mx-auto mt-2" />
                </div>
            )}
            <div className="space-y-6">
                {children}
            </div>
        </form>
    );
};
