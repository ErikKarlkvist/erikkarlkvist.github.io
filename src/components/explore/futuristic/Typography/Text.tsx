import React from 'react';
import { theme } from '../theme';

interface TextProps {
    as?: 'p' | 'span' | 'div' | 'label';
    children: React.ReactNode;
    className?: string;
    variant?: 'body' | 'label' | 'error';
    htmlFor?: string;
}

export const Text: React.FC<TextProps> = ({
    as: Component = 'p',
    children,
    className = '',
    variant = 'body',
    ...props
}) => {
    const { colors, typography } = theme;

    const variants = {
        body: `text-base ${colors.text.primary} ${typography.textShadow}`,
        label: `text-xs ${colors.text.label} ${typography.label} ${typography.textShadow}`,
        error: `text-xs ${colors.text.error} font-mono mt-1`
    };

    return (
        <Component className={`${variants[variant]} ${className}`} {...props}>
            {children}
        </Component>
    );
};
