import React from 'react';
import type { InputProps } from '../../types';
import { theme } from '../theme';
import { Text } from '../Typography/Text';

type ColorfulInputProps = Omit<InputProps, 'className'>;

export const Input: React.FC<ColorfulInputProps> = ({
    label,
    error,
    id,
    ...props
}) => {
    const { colors, spacing } = theme;

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
                    bg-slate-50 border-2 ${colors.border.transparent}
                    ${colors.text.primary} ${colors.text.placeholder} text-base
                    focus:outline-none focus:${colors.border.focus} focus:bg-white ${colors.shadow.focus}
                    transition-all duration-300
                    ${error ? `${colors.border.error} bg-red-50` : ''}
                `}
                {...props}
            />
            {error && <Text variant="error">{error}</Text>}
        </div>
    );
};
