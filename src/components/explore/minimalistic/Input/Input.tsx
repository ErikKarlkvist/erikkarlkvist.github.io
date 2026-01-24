import React from 'react';
import type { InputProps } from '../../types';
import { theme } from '../theme';
import { Text } from '../Typography/Text';

interface MinimalisticInputProps extends Omit<InputProps, 'className'> {
    version?: 'sharp' | 'rounded' | 'soft';
}

export const Input: React.FC<MinimalisticInputProps> = ({
    label,
    error,
    id,
    version = 'sharp',
    ...props
}) => {
    const { colors, borders } = theme;

    const getVersionStyles = () => {
        switch (version) {
            case 'rounded':
                return `border rounded-md px-3`;
            case 'soft':
                return `bg-neutral-100 border-transparent rounded-md px-3 focus:bg-white focus:ring-1 focus:ring-neutral-200`;
            default: // sharp
                return `bg-transparent ${borders.thin} px-0`;
        }
    };

    return (
        <div className="flex flex-col gap-1 w-full relative">
            {label && (
                <Text as="label" variant="label" htmlFor={id} className="mb-1">
                    {label}
                </Text>
            )}
            <input
                id={id}
                className={`
                    ${colors.border.default} py-2
                    ${colors.text.primary} placeholder-neutral-300
                    focus:outline-none focus:${colors.border.focus}
                    transition-colors duration-300
                    ${error ? colors.border.error : ''}
                    w-full
                    ${getVersionStyles()}
                `}
                {...props}
            />
            {error && <Text variant="caption" className={colors.text.error}>{error}</Text>}
        </div>
    );
};
