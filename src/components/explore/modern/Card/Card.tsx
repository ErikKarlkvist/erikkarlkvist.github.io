import React from 'react';
import { theme } from '../theme';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';

interface ModernCardProps {
    image: string;
    title: string;
    price: string;
    version?: 'clean' | 'soft' | 'dynamic';
}

export const Card: React.FC<ModernCardProps> = ({
    image,
    title,
    price,
    version = 'clean',
}) => {
    const { colors, radius } = theme;

    const getCardStyles = () => {
        const base = `group relative max-w-sm ${radius.default} overflow-hidden transition-all duration-300`;

        switch (version) {
            case 'soft':
                return `${base} bg-white border border-transparent hover:bg-white hover:shadow-lg`;
            case 'dynamic':
                return `${base} bg-white shadow-lg hover:shadow-xl hover:-translate-y-1`;
            default: // clean
                return `${base} bg-white border ${colors.border.default}`;
        }
    };

    return (
        <div className={getCardStyles()}>
            <div className="aspect-[4/5] w-full overflow-hidden bg-stone-100 relative">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                    <Badge variant="accent" version={version}>New</Badge>
                </div>
            </div>
            <div className={`p-4 bg-white`}>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-medium text-stone-900">{title}</h3>
                        <p className="mt-1 text-sm text-stone-500">Lounge Chair</p>
                    </div>
                    <p className="text-lg font-bold text-orange-700">{price}</p>
                </div>
                <Button variant="secondary" className="w-full mt-2" version={version}>
                    Add to Cart
                </Button>
            </div>
        </div>
    );
};
