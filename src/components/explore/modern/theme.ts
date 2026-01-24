export const theme = {
    colors: {
        bg: {
            surface: 'bg-white',
            primary: 'bg-slate-800',
            primaryHover: 'hover:bg-stone-800',
            secondary: 'bg-stone-100',
            soft: 'bg-stone-50',
        },
        text: {
            primary: 'text-stone-900',
            secondary: 'text-stone-500',
            inverse: 'text-white',
            accent: 'text-orange-700', // Furniture accent
            error: 'text-red-700',
        },
        border: {
            default: 'border-stone-200',
            focus: 'border-orange-500',
            error: 'border-red-300',
        },
        shadow: {
            sm: 'shadow-sm',
            md: 'shadow-md',
            lg: 'shadow-lg',
            input: 'shadow-sm',
        }
    },
    spacing: {
        padding: 'p-6',
        gap: 'gap-4',
    },
    radius: {
        default: 'rounded-md', // Slightly sharper for furniture/architectural feel
        sm: 'rounded-sm',
        full: 'rounded-full',
    }
};
