import React from 'react';
import type { FormProps } from '../../types';
import { theme } from '../theme';
import { Heading } from '../Typography/Heading';

type ColorfulFormProps = Omit<FormProps, 'className'>;

export const Form: React.FC<ColorfulFormProps> = ({
    children,
    title,
    onSubmit,
}) => {
    const { colors, spacing } = theme;

    return (
        <form
            onSubmit={onSubmit}
            className={`w-full max-w-md ${spacing.padding.card} ${colors.bg.surface} ${spacing.radius.card} ${colors.shadow.card} border ${colors.border.default}`}
        >
            {title && (
                <div className="mb-8 text-center">
                    <Heading variant="section">
                        {title}
                    </Heading>
                    <div className="w-12 h-1.5 bg-orange-200 rounded-full mx-auto mt-2" />
                </div>
            )}
            <div className="space-y-6">
                {children}
            </div>
        </form>
    );
};
