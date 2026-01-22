import React from 'react';
import type { InputProps } from '../../types';
import { theme } from '../theme';
import { Text } from '../Typography/Text';

type FuturisticInputProps = Omit<InputProps, 'className'>;

export const Input: React.FC<FuturisticInputProps> = ({
    label,
    error,
    id,
    ...props
}) => {
    const { colors, shapes } = theme;

    return (
        <div className="relative group w-full">
            {label && (
                <Text as="label" variant="label" htmlFor={id} className="block mb-2">
                    {label}
                </Text>
            )}
            <div className="relative">
                <input
                    id={id}
                    className={`
                        w-full ${colors.background.input} border ${colors.border.secondary} p-4 ${colors.text.primary}
                        focus:outline-none focus:${colors.border.glow} focus:${colors.shadow.inputFocus}
                        placeholder-cyan-900/50
                        transition-all duration-300
                    `}
                    style={{ clipPath: shapes.clipPath.input }}
                    {...props}
                />
                <div className="absolute bottom-0 right-0 w-4 h-[1px] bg-cyan-400" />
            </div>
            {error && <Text variant="error">{`>> ERROR: ${error}`}</Text>}
        </div>
    );
};
