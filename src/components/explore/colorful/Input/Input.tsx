import React from 'react';
import type { InputProps } from '../../types';
import { theme } from '../theme';
import { Text } from '../Typography/Text';

interface ColorfulInputProps extends Omit<InputProps, 'className'> {
    version?: 'soft' | 'vibrant' | 'outline';
}

export const Input: React.FC<ColorfulInputProps> = ({
    label,
    error,
    id,
    version = 'soft',
    ...props
}) => {
    const { colors, spacing } = theme;

    const getVersionStyles = () => {
        switch (version) {
            case 'vibrant':
                return `bg-white border-2 border-orange-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10`;
            case 'outline':
                return `bg-transparent border-2 border-slate-200 focus:border-orange-500`;
            default: // soft
                return `bg-slate-50 border-2 ${colors.border.transparent} focus:${colors.border.focus} focus:bg-white ${colors.shadow.focus}`;
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <Text as="label" variant="label" htmlFor={id} className="ml-1">
                    {label}
                </Text>
            )}
            <input
                id={id}
                className={`
                    w-full ${spacing.padding.input} ${spacing.radius.input}
                    ${colors.text.primary} ${colors.text.placeholder} text-base
                    focus:outline-none 
                    transition-all duration-300
                    ${error ? `${colors.border.error} bg-red-50` : ''}
                    ${getVersionStyles()}
                `}
                {...props}
            />
            {error && <Text variant="error">{error}</Text>}
        </div>
    );
};
