import React, { useState } from 'react';
import { Button } from './Button/Button';
import { Input } from './Input/Input';
import { Form } from './Form/Form';
import { theme } from './theme';

export const ColorfulDemo = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { colors } = theme;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-orange-50/50 p-4 relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className={`absolute top-1/4 left-1/4 w-64 h-64 ${colors.bg.decorative.blob1} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob`} />
            <div className={`absolute top-1/3 right-1/4 w-64 h-64 ${colors.bg.decorative.blob2} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000`} />

            <Form title="Join the Fun" onSubmit={handleSubmit}>
                <Input
                    label="Username"
                    placeholder="@coolcat"
                    required
                />
                <Input
                    label="Magic Word"
                    type="password"
                    placeholder="••••••••"
                    required
                />
                <div className="pt-2">
                    <Button type="submit" variant="primary" isLoading={isLoading} loadingText="Wait...">
                        Let's Go!
                    </Button>
                </div>
            </Form>
        </div>
    );
};
