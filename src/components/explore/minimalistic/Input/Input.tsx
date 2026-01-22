import React from 'react';
import type { InputProps } from '../../types';
import { theme } from '../theme';
import { Text } from '../Typography/Text';

type MinimalisticInputProps = Omit<InputProps, 'className'>;

export const Input: React.FC<MinimalisticInputProps> = ({
    label,
    error,
    id,
    ...props
}) => {
    const { colors, borders } = theme;

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
                    bg-transparent ${borders.thin} ${colors.border.default} py-2
                    ${colors.text.primary} placeholder-neutral-300
                    focus:outline-none focus:${colors.border.focus}
                    transition-colors duration-300
                    ${error ? colors.border.error : ''}
                    w-full
                `}
                {...props}
            />
            {error && <Text variant="caption" className={colors.text.error}>{error}</Text>}
        </div>
    );
};
