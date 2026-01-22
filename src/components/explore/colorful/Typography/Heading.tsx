import React from 'react';
import { theme } from '../theme';

interface HeadingProps {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    children: React.ReactNode;
    className?: string;
    variant?: 'display' | 'section';
}

export const Heading: React.FC<HeadingProps> = ({
    as: Component = 'h2',
    children,
    className = '',
    variant = 'section'
}) => {
    const { colors, typography } = theme;

    // Base styles
    const base = `${typography.heading} ${variant === 'section' ? 'text-3xl' : 'text-4xl'}`;
    const colorClass = variant === 'display' ? colors.gradient.text : colors.gradient.text;

    return (
        <Component className={`${base} ${colorClass} ${className}`}>
            {children}
        </Component>
    );
};
