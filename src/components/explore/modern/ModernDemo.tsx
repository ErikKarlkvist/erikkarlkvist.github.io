import React, { useState } from 'react';
import { Button } from './Button/Button';
import { Input } from './Input/Input';
import { Form } from './Form/Form';
import { Select } from './Select/Select';
import { Radio } from './Radio/Radio';
import { Checkbox } from './Checkbox/Checkbox';
import { Toggle } from './Toggle/Toggle';
import { Badge } from './Badge/Badge';
import { Card } from './Card/Card';

export const ModernDemo = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [version, setVersion] = useState<'clean' | 'soft' | 'dynamic'>('clean');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    const versions = [
        { id: 'clean', label: 'Clean' },
        { id: 'soft', label: 'Soft' },
        { id: 'dynamic', label: 'Dynamic' },
    ] as const;

    const getBackground = () => {
        switch (version) {
            case 'soft':
                return 'bg-gradient-to-br from-stone-50 to-orange-50';
            case 'dynamic':
                return 'bg-stone-50';
            default: // clean
                return 'bg-white';
        }
    };

    return (
        <div className={`w-full h-full flex flex-col p-6 relative transition-colors duration-500 overflow-y-auto ${getBackground()}`}>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 mt-12 px-4 max-w-6xl mx-auto w-full">
                <div className="text-center md:text-left mb-6 md:mb-0">
                    <h2 className="text-3xl font-bold text-stone-900 mb-2 tracking-tight">
                        Modern Living
                    </h2>
                    <p className="text-stone-500 max-w-md">
                        Warm, earthy, and sophisticated. A design system crafted for premium furniture and interior brands.
                    </p>
                </div>

                {/* Version Switcher */}
                <div className="inline-flex bg-white border border-stone-200 p-1 gap-1 rounded-lg shadow-sm">
                    {versions.map((v) => (
                        <button
                            key={v.id}
                            onClick={() => setVersion(v.id)}
                            className={`
                                px-4 py-2 text-xs font-medium rounded-md transition-all duration-200
                                ${version === v.id
                                    ? 'bg-stone-800 text-white shadow-md'
                                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                                }
                            `}
                        >
                            {v.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto w-full px-4 pb-12">

                {/* Left Column: Form & Inputs */}
                <div className="lg:col-span-4 space-y-8">
                    <Form title="Checkout" onSubmit={handleSubmit} version={version}>
                        <div className="space-y-4">
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
                                required
                                version={version}
                            />
                            <Select
                                label="Shipping Method"
                                options={[
                                    { value: 'standard', label: 'Standard Delivery (3-5 days)' },
                                    { value: 'express', label: 'Express Delivery (1-2 days)' },
                                ]}
                                version={version}
                            />
                            <div className="pt-2 space-y-3">
                                <label className="block text-sm font-medium text-stone-900">Payment</label>
                                <div className="flex gap-4">
                                    <Radio id="card" name="payment" label="Card" defaultChecked version={version} />
                                    <Radio id="paypal" name="payment" label="PayPal" version={version} />
                                </div>
                            </div>
                            <div className="pt-2">
                                <Checkbox id="terms" label="I agree to terms" version={version} />
                            </div>
                        </div>
                        <div className="pt-4 flex gap-3">
                            <Button variant="secondary" type="button" className="flex-1" version={version}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" isLoading={isLoading} loadingText="Processing..." version={version} className="flex-1">
                                Pay Now
                            </Button>
                        </div>
                    </Form>

                    {/* Settings Panel */}
                    <div className={`p-6 rounded-lg border ${version === 'clean' ? 'bg-white border-stone-200' : 'bg-white/50 border-white/50 shadow-sm'}`}>
                        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">Preferences</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-stone-700">Notifications</span>
                                <Toggle id="notif" defaultChecked version={version} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-stone-700">Dark Mode</span>
                                <Toggle id="dark" version={version} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Collection & Card */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Card */}
                        <div className="flex justify-center">
                            <Card
                                image="/chair.webp"
                                title="Eames Lounge Chair"
                                price="$799.00"
                                version={version}
                            />
                        </div>

                        {/* Component Showcase */}
                        <div className="space-y-6">
                            <div className={`p-6 rounded-lg h-full border flex flex-col justify-center gap-6 ${version === 'clean' ? 'bg-white border-stone-200' : 'bg-stone-800 border-stone-700 text-white'}`}>
                                <div>
                                    <h3 className={`text-xl font-bold mb-2 ${version === 'clean' ? 'text-stone-900' : 'text-white'}`}>New Arrivals</h3>
                                    <p className={`text-sm mb-6 ${version === 'clean' ? 'text-stone-500' : 'text-stone-400'}`}>Check out our latest collection of mid-century modern furniture.</p>
                                    <div className="flex gap-2">
                                        <Badge variant="accent" version={version}>New</Badge>
                                        <Badge variant="success" version={version}>In Stock</Badge>
                                        <Badge variant="neutral" version={version}>Limited</Badge>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Button variant="primary" className="w-full" version={version}>View Collection</Button>
                                    <Button variant="secondary" className={`w-full ${version !== 'clean' ? '!bg-transparent !text-white !border-stone-600 hover:!bg-stone-700' : ''}`} version={version}>Download Catalog</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
