import React from 'react';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';

interface MinimalisticCardProps {
    image: string;
    title: string;
    price: string;
    version?: 'sharp' | 'rounded' | 'soft';
}

export const Card: React.FC<MinimalisticCardProps> = ({
    image,
    title,
    price,
    version = 'sharp',
}) => {
    // const { spacing } = theme;

    let radius = 'rounded-none';
    if (version === 'rounded') radius = 'rounded-lg';
    if (version === 'soft') radius = 'rounded-xl';

    return (
        <div className={`group relative max-w-sm bg-white border border-neutral-200 ${radius} overflow-hidden transition-all duration-300 hover:shadow-xl`}>
            <div className="aspect-[4/5] w-full overflow-hidden bg-neutral-50 relative">
                <img
                    src={image}
                    alt={title}
                    className={`h-full w-full object-cover object-center transition-all duration-500`}
                />
                <div className="absolute top-4 left-4">
                    <Badge variant="inverse" version={version}>New</Badge>
                </div>
            </div>
            <div className={`p-6 border-t border-neutral-100`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900 uppercase tracking-tight">{title}</h3>
                        <p className="mt-1 text-xs text-neutral-500 uppercase tracking-widest">Furniture</p>
                    </div>
                    <p className="text-lg font-medium text-neutral-900">{price}</p>
                </div>
                <Button variant="secondary" className="w-full" version={version}>
                    Add to Cart
                </Button>
            </div>
        </div>
    );
};
