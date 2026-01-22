export const theme = {
    colors: {
        bg: {
            surface: 'bg-white',
            primary: 'bg-violet-500',
            primaryHover: 'hover:bg-violet-600',
            decorative: {
                blob1: 'bg-pink-200',
                blob2: 'bg-orange-200',
            }
        },
        gradient: {
            primary: 'bg-gradient-to-r from-orange-400 to-pink-500',
            text: 'bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent',
        },
        text: {
            primary: 'text-slate-700',
            secondary: 'text-slate-600',
            placeholder: 'placeholder-slate-400',
            inverse: 'text-white',
            accent: 'text-orange-500',
            error: 'text-red-500',
        },
        border: {
            default: 'border-orange-50',
            focus: 'border-orange-300',
            error: 'border-red-300',
            transparent: 'border-transparent',
        },
        shadow: {
            card: 'shadow-[0_20px_40px_rgba(249,115,22,0.1)]',
            button: 'shadow-lg hover:shadow-xl',
            focus: 'focus:shadow-lg focus:shadow-orange-100',
        }
    },
    spacing: {
        radius: {
            button: 'rounded-2xl',
            input: 'rounded-2xl',
            card: 'rounded-[2rem]',
        },
        padding: {
            button: 'px-6 py-3',
            input: 'px-5 py-3',
            card: 'p-8',
        }
    },
    typography: {
        heading: 'font-bold tracking-tight',
        label: 'font-medium text-sm',
    }
};
