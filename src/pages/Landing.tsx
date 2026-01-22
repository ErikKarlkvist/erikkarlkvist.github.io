import { Link } from 'react-router-dom';

export default function Landing() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center selection:bg-neutral-800 selection:text-white">
            <main className="space-y-6 animate-fade-in">
                <h1 className="text-3xl md:text-4xl text-neutral-900 tracking-tight">
                    Erik Karlkvist
                </h1>

                <p className="text-neutral-500 text-sm md:text-base font-normal tracking-wide uppercase">
                    Under konstruktion
                </p>

                <div className="pt-8 opacity-0 animate-[fade-in_1s_ease-out_0.5s_forwards]">
                    <Link
                        to="/explore-components"
                        className="text-neutral-600 hover:text-neutral-400 text-xs tracking-widest uppercase transition-colors border-b border-transparent hover:border-neutral-800 pb-1"
                    >
                        Explore Components
                    </Link>
                </div>
            </main>

            <footer className="absolute bottom-8 text-neutral-800 text-xs tracking-widest uppercase">
                2026
            </footer>
        </div>
    )
}
