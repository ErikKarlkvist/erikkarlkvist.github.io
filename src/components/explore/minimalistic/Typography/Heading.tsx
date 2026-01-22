import React from 'react';
import { theme } from '../theme';

interface HeadingProps {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    children: React.ReactNode;
    className?: string;
    variant?: 'display' | 'section' | 'subsection';
}

export const Heading: React.FC<HeadingProps> = ({
    as: Component = 'h2',
    children,
    className = '',
    variant = 'section'
}) => {
    const { colors } = theme;

    const variants = {
        display: "text-4xl font-light tracking-tight mb-6",
        section: "text-2xl font-light tracking-tight mb-4",
        subsection: "text-lg font-normal tracking-wide mb-2 uppercase"
    };

    return (
        <Component className={`${variants[variant]} ${colors.text.primary} ${className}`}>
            {children}
        </Component>
    );
};
