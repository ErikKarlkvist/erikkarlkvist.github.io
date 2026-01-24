import React from 'react';
import type { FormProps } from '../../types';
import { theme } from '../theme';
import { Heading } from '../Typography/Heading';

interface MinimalisticFormProps extends Omit<FormProps, 'className'> {
    version?: 'sharp' | 'rounded' | 'soft';
}

export const Form: React.FC<MinimalisticFormProps> = ({
    children,
    title,
    onSubmit,
    version = 'sharp',
}) => {
    const { colors, borders } = theme;

    const getVersionStyles = () => {
        switch (version) {
            case 'rounded':
                return 'rounded-2xl border';
            case 'soft':
                return 'rounded-xl shadow-sm border-0 bg-white/50 backdrop-blur-sm';
            default: // sharp
                return `${borders.default} rounded-none`;
        }
    };

    return (
        <form
            onSubmit={onSubmit}
            className={`w-full max-w-md p-8 ${colors.bg.surface} ${colors.border.default} ${getVersionStyles()}`}
        >
            {title && (
                <Heading as="h2" variant="section">
                    {title}
                </Heading>
            )}
            <div className="space-y-6">
                {children}
            </div>
        </form>
    );
};
