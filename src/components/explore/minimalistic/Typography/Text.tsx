import React from 'react';
import { theme } from '../theme';

interface TextProps {
    as?: 'p' | 'span' | 'div' | 'label';
    children: React.ReactNode;
    className?: string;
    variant?: 'body' | 'caption' | 'label';
    htmlFor?: string;
}

export const Text: React.FC<TextProps> = ({
    as: Component = 'p',
    children,
    className = '',
    variant = 'body',
    ...props
}) => {
    const { colors } = theme;

    const variants = {
        body: `text-base font-normal ${colors.text.primary}`,
        caption: `text-sm ${colors.text.secondary}`,
        label: `text-xs uppercase tracking-widest ${colors.text.secondary}`
    };

    return (
        <Component className={`${variants[variant]} ${className}`} {...props}>
            {children}
        </Component>
    );
};
