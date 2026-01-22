import React from 'react';
import type { FormProps } from '../../types';
import { theme } from '../theme';
import { Heading } from '../Typography/Heading';

type FuturisticFormProps = Omit<FormProps, 'className'>;

export const Form: React.FC<FuturisticFormProps> = ({
    children,
    title,
    onSubmit,
}) => {
    const { colors, shapes } = theme;

    return (
        <form
            onSubmit={onSubmit}
            className="relative w-full max-w-md p-1 bg-gradient-to-br from-cyan-500/20 to-purple-500/20"
            style={{ clipPath: shapes.clipPath.form }}
        >
            <div className={`${colors.background.panel} p-8 h-full w-full backdrop-blur-xl border border-white/5`}>
                {title && (
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-500" />
                        <Heading as="h2">{title}</Heading>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-500" />
                    </div>
                )}
                <div className="space-y-6">
                    {children}
                </div>
            </div>
        </form>
    );
};
