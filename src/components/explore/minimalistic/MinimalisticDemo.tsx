import React, { useState } from 'react';
import { Button } from './Button/Button';
import { Input } from './Input/Input';
import { Form } from './Form/Form';
import { Heading } from './Typography/Heading';
import { Text } from './Typography/Text';

export const MinimalisticDemo = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-50 p-4">
            <div className="mb-8 text-center">
                <Heading variant="display">Minimalism</Heading>
                <Text variant="body" className="max-w-md text-neutral-500">
                    Less is more. A focus on typography, spacing, and contrast.
                </Text>
            </div>

            <Form title="Contact Us" onSubmit={handleSubmit}>
                <Input
                    label="Email"
                    type="email"
                    placeholder="email@example.com"
                    required
                />
                <Input
                    label="Subject"
                    placeholder="Brief description..."
                    required
                />
                <div className="pt-4 flex justify-end">
                    <Button type="submit" isLoading={isLoading} variant="primary">
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    );
};
