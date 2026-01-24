import React, { useState } from 'react';
import { theme } from './theme';
import { Button } from './Button/Button';
import { Input } from './Input/Input';
import { Form } from './Form/Form';
import { Select } from './Select/Select';
import { Radio } from './Radio/Radio';
import { Checkbox } from './Checkbox/Checkbox';
import { Toggle } from './Toggle/Toggle';
import { Badge } from './Badge/Badge';
import { Card } from './Card/Card';

export const ColorfulDemo = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [version, setVersion] = useState<'soft' | 'vibrant' | 'outline'>('outline');
    const { colors } = theme;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    const versions = [
        { id: 'soft', label: 'Soft' },
        { id: 'vibrant', label: 'Vibrant' },
        { id: 'outline', label: 'Outline' },
    ] as const;

    const getBackground = () => {
        switch (version) {
            case 'vibrant':
                return 'bg-orange-100';
            case 'outline':
                return 'bg-white';
            default: // soft
                return 'bg-orange-50/50';
        }
    };

    return (
        <div className={`w-full h-full flex flex-col p-6 relative transition-colors duration-500 overflow-y-auto ${getBackground()}`}>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 mt-12 px-4 max-w-6xl mx-auto w-full">
                <div className="text-center md:text-left mb-6 md:mb-0">
                    <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
                        <span className="text-orange-500">Play</span>ful.
                    </h2>
                    <p className="text-slate-500 font-medium max-w-md text-lg">
                        Vibrant colors. Soft shadows. A joyful interface.
                    </p>
                </div>

                {/* Version Switcher */}
                <div className="inline-flex bg-white/50 backdrop-blur-md border border-white/50 p-1 gap-1 rounded-full shadow-sm">
                    {versions.map((v) => (
                        <button
                            key={v.id}
                            onClick={() => setVersion(v.id)}
                            className={`
                                px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-full
                                ${version === v.id
                                    ? 'bg-orange-500 text-white shadow-md transform scale-105'
                                    : 'text-slate-500 hover:text-orange-600 hover:bg-white/50'
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
                    <Form title="Join the Fun" onSubmit={handleSubmit} version={version}>
                        <div className="space-y-5">
                            <Input
                                label="Username"
                                placeholder="@coolcat"
                                required
                                version={version}
                            />
                            <Select
                                label="Favorite Color"
                                options={[
                                    { value: 'orange', label: 'Orange Sunset' },
                                    { value: 'violet', label: 'Violet Dreams' },
                                ]}
                                version={version}
                            />
                            <div className="pt-2 space-y-3">
                                <label className="block text-sm font-semibold text-slate-700 ml-1">Choose Plan</label>
                                <div className="flex gap-4">
                                    <Radio id="free" name="plan" label="Free" defaultChecked version={version} />
                                    <Radio id="pro" name="plan" label="Pro" version={version} />
                                </div>
                            </div>
                            <div className="pt-2">
                                <Checkbox id="newsletter" label="Send me gifs" version={version} />
                            </div>
                        </div>
                        <div className="pt-4 flex gap-3">
                            <Button variant="secondary" type="button" className="flex-1" version={version}>
                                Nah
                            </Button>
                            <Button type="submit" variant="primary" isLoading={isLoading} loadingText="Wait..." version={version} className="flex-1">
                                Let's Go!
                            </Button>
                        </div>
                    </Form>

                    {/* Settings Panel */}
                    <div className={`p-6 rounded-3xl ${version === 'outline' ? 'border-2 border-slate-200' : 'bg-white/60 backdrop-blur-sm shadow-lg'}`}>
                        <h3 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-6">Magic Settings</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-700">Rainbow Mode</span>
                                <Toggle id="rainbow" defaultChecked version={version} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-700">Unicorns</span>
                                <Toggle id="unicorns" version={version} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Collection & Card */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Product Card */}
                        <div className="flex justify-center">
                            <Card
                                image="/chair.webp"
                                title="Comfy Cloud"
                                price="$799"
                                version={version}
                            />
                        </div>

                        {/* Component Showcase */}
                        <div className="space-y-8">
                            <div className={`
                                p-8 h-full rounded-3xl flex flex-col justify-center gap-8
                                ${version === 'outline' ? 'border-2 border-slate-200' : 'bg-gradient-to-br from-violet-400 to-fuchsia-400 text-white shadow-xl'}
                            `}>
                                <div>
                                    <h3 className={`text-3xl font-black mb-2 ${version === 'outline' ? 'text-slate-900' : 'text-white'}`}>New Stuff!</h3>
                                    <p className={`font-medium mb-6 ${version === 'outline' ? 'text-slate-500' : 'text-white/80'}`}>Check out these amazing badges.</p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="accent" version={version}>New</Badge>
                                        <Badge variant="success" version={version}>Fresh</Badge>
                                        <Badge variant="neutral" version={version}>Cool</Badge>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Button variant="primary" className={`w-full ${version !== 'outline' ? '!bg-white !text-violet-600 hover:!bg-slate-50' : ''}`} version={version}>Explore</Button>
                                    <Button variant="secondary" className={`w-full ${version !== 'outline' ? '!bg-transparent !text-white !border-white/50 hover:!bg-white/10' : ''}`} version={version}>Save for Later</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
