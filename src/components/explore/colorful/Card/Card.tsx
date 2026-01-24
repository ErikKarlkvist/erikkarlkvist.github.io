import React from 'react';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';
import { theme } from '../theme';

interface ColorfulCardProps {
    image: string;
    title: string;
    price: string;
    version?: 'soft' | 'vibrant' | 'outline';
}

export const Card: React.FC<ColorfulCardProps> = ({
    image,
    title,
    price,
    version = 'soft',
}) => {
    const { spacing } = theme;

    const getCardStyles = () => {
        const base = `group relative max-w-sm ${spacing.radius.card} overflow-hidden transition-all duration-300`;

        switch (version) {
            case 'vibrant':
                return `${base} bg-white shadow-xl shadow-orange-500/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/20`;
            case 'outline':
                return `${base} bg-white border-2 border-slate-100 hover:border-orange-200`;
            default: // soft
                return `${base} bg-white backdrop-blur-sm shadow-lg hover:-translate-y-1`;
        }
    };

    return (
        <div className={getCardStyles()}>
            <div className="aspect-[4/5] w-full overflow-hidden bg-orange-50 relative">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                    <Badge variant="accent" version={version}>New</Badge>
                </div>
            </div>
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                        <p className="text-sm font-medium text-orange-500/80 uppercase tracking-widest mt-1">Furniture</p>
                    </div>
                    <p className="text-xl font-black text-slate-900">{price}</p>
                </div>
                <div className="mt-6 flex gap-3">
                    <Button variant="primary" className="flex-1" version={version}>
                        Buy Now
                    </Button>
                    <button className="p-3 text-orange-500 hover:bg-orange-50 rounded-2xl transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
