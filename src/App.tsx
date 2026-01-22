function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-slate-700 text-center relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient pointer-events-none" />

        {/* Title */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Eriks hemsida
        </h1>

        {/* Divider */}
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-6 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />

        {/* Subtitle */}
        <p className="text-slate-300 text-lg font-light tracking-wide mb-8">
          Under konstruktion
        </p>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150 shadow-[0_0_8px_rgba(192,132,252,0.6)]" />
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-300 shadow-[0_0_8px_rgba(244,114,182,0.6)]" />
        </div>
      </div>
    </div>
  )
}

export default App
