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
        body: `text-base ${colors.text.primary}`,
        label: `${typography.label} ${colors.text.secondary}`,
        error: `text-sm ${colors.text.error} font-medium mt-1 ml-1`
    };

    return (
        <Component className={`${variants[variant]} ${className}`} {...props}>
            {children}
        </Component>
    );
};
