function App() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 text-center selection:bg-neutral-800 selection:text-white">
      <main className="space-y-6 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-light text-neutral-100 tracking-tight">
          karlkvist.se
        </h1>

        <p className="text-neutral-500 text-sm md:text-base font-normal tracking-wide uppercase">
          Under konstruktion
        </p>
      </main>

      <footer className="absolute bottom-8 text-neutral-800 text-xs tracking-widest uppercase">
        2026
      </footer>
    </div>
  )
}

export default App
