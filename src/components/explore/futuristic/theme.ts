export const theme = {
    colors: {
        text: {
            primary: 'text-cyan-100',
            label: 'text-cyan-300',
            error: 'text-red-500',
        },
        border: {
            primary: 'border-cyan-500/30',
            secondary: 'border-cyan-900/50',
            glow: 'border-cyan-400',
        },
        background: {
            panel: 'bg-slate-950',
            input: 'bg-slate-900/50',
            overlay: 'bg-cyan-950/50',
        },
        shadow: {
            glow: 'shadow-[0_0_10px_#22d3ee]',
            inputFocus: 'shadow-[0_0_15px_rgba(34,211,238,0.2)]',
        }
    },
    shapes: {
        clipPath: {
            button: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)",
            input: "polygon(0 0, 100% 0, 100% 85%, 98% 100%, 0 100%)",
            form: "polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)",
        }
    },
    typography: {
        button: 'uppercase tracking-wider text-sm font-bold',
        label: 'uppercase tracking-widest text-xs',
        heading: 'uppercase tracking-widest text-xl font-bold',
        textShadow: 'text-shadow-neon',
    }
};
