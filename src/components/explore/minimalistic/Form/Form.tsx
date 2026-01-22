import React from 'react';
import type { FormProps } from '../../types';
import { theme } from '../theme';
import { Heading } from '../Typography/Heading';

type MinimalisticFormProps = Omit<FormProps, 'className'>;

export const Form: React.FC<MinimalisticFormProps> = ({
    children,
    title,
    onSubmit,
}) => {
    const { colors, borders } = theme;

    return (
        <form
            onSubmit={onSubmit}
            className={`w-full max-w-md p-8 ${colors.bg.surface} ${borders.default} ${colors.border.default} shadow-sm`}
        >
            {title && (
                <Heading as="h2" variant="section">
                    {title}
                </Heading>
            )}
            <div className="space-y-6">
                {children}
            </div>
        </form>
    );
};
