import React, { useState, useEffect } from 'react';
import { IconButton as MinimalisticIconButton } from './minimalistic/IconButton/IconButton';
import { IconButton as ModernIconButton } from './modern/IconButton/IconButton';
import { IconButton as ColorfulIconButton } from './colorful/IconButton/IconButton';

// Simple SVG replacements
const ChevronLeftIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6" /></svg>
);
const ChevronRightIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
);

type ThemeType = 'minimalistic' | 'modern' | 'colorful';

interface CarouselProps {
    items: {
        id: string;
        component: React.ReactNode;
        theme: ThemeType;
    }[];
}

export const Carousel: React.FC<CarouselProps> = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const next = React.useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
            setIsTransitioning(false);
        }, 500);
    }, [isTransitioning, items.length]);

    const prev = React.useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
            setIsTransitioning(false);
        }, 500);
    }, [isTransitioning, items.length]);

    const currentItem = items[currentIndex];

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [next, prev]);

    const renderNavButtons = () => {
        const NavButton = ({ onClick, direction }: { onClick: () => void, direction: 'left' | 'right' }) => {
            const Icon = direction === 'left' ? ChevronLeftIcon : ChevronRightIcon;

            if (currentItem.theme === 'minimalistic') {
                return <MinimalisticIconButton onClick={onClick}><Icon className="w-6 h-6" /></MinimalisticIconButton>
            } else if (currentItem.theme === 'modern') {
                return <ModernIconButton onClick={onClick}><Icon className="w-6 h-6" /></ModernIconButton>
            } else {
                return <ColorfulIconButton onClick={onClick}><Icon className="w-6 h-6" /></ColorfulIconButton>
            }
        }

        return (
            <div className="absolute inset-x-0 bottom-8 flex justify-center gap-4 pointer-events-none md:pointer-events-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:justify-between md:px-8">
                <div className="pointer-events-auto">
                    <NavButton onClick={prev} direction="left" />
                </div>
                <div className="pointer-events-auto">
                    <NavButton onClick={next} direction="right" />
                </div>
            </div>
        );
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Content Container */}
            <div
                className={`w-full h-full transition-all duration-500 ease-in-out transform ${isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
                    }`}
            >
                {currentItem.component}
            </div>

            {/* Navigation */}
            {renderNavButtons()}

            {/* Indicator Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {items.map((_, idx) => (
                    <div
                        key={idx}
                        className={`
                            h-1.5 rounded-full transition-all duration-300 
                            ${idx === currentIndex ? 'w-8' : 'w-1.5'}
                            ${currentItem.theme === 'minimalistic' ? (idx === currentIndex ? 'bg-neutral-900' : 'bg-neutral-300') : ''}
                            ${currentItem.theme === 'modern' ? (idx === currentIndex ? 'bg-indigo-600' : 'bg-slate-300') : ''}
                            ${currentItem.theme === 'colorful' ? (idx === currentIndex ? 'bg-white' : 'bg-white/40') : ''}
                        `}
                    />
                ))}
            </div>

            {/* Theme Label */}
            <div className={`
                absolute top-4 left-4 text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded z-50
                ${currentItem.theme === 'minimalistic' ? 'text-neutral-900 bg-white border border-neutral-200 shadow-sm' : ''}
                ${currentItem.theme === 'modern' ? 'text-indigo-600 bg-white/80 border border-indigo-100 shadow-sm backdrop-blur' : ''}
                ${currentItem.theme === 'colorful' ? 'text-white bg-black/20 backdrop-blur border border-white/20' : ''}
            `}>
                {currentItem.theme}
            </div>
        </div>
    );
};
