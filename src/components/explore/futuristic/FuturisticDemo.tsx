import React, { useState } from 'react';
import { Button } from './Button/Button';
import { Input } from './Input/Input';
import { Form } from './Form/Form';
import { Heading } from './Typography/Heading';

export const FuturisticDemo = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="mb-8 z-10 text-center">
                <Heading variant="display" className="text-cyan-400">Secure Protocol</Heading>
            </div>

            <Form title="System Access" onSubmit={handleSubmit}>
                <Input
                    label="User ID"
                    placeholder="ENTER ID..."
                    required
                />
                <Input
                    label="Access Code"
                    type="password"
                    placeholder="••••••••"
                    required
                />
                <div className="pt-4 flex justify-end">
                    <Button type="submit" isLoading={isLoading}>
                        Initialize
                    </Button>
                </div>
            </Form>
        </div>
    );
};
