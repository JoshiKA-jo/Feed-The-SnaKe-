import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="mb-12 text-center z-10">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
            NEON SNAKE
          </span>
          <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"> SYNTH</span>
        </h1>
        <p className="text-neutral-400 max-w-lg mx-auto">
          Immerse yourself in a retro-futuristic arcade environment. Eat, grow, and ride the synthwave.
        </p>
      </header>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 items-start">
        {/* Left Side: Music Player */}
        <div className="lg:col-span-4 flex flex-col justify-center">
          <MusicPlayer />
          
          <div className="mt-8 border border-neutral-800 bg-neutral-900/40 p-5 rounded-2xl backdrop-blur-sm">
            <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              SYSTEM STATUS
            </h3>
            <ul className="text-sm text-neutral-400 space-y-2">
              <li className="flex justify-between">
                <span>Audio Engine:</span> <span className="text-fuchsia-400 tracking-wider">ONLINE</span>
              </li>
              <li className="flex justify-between">
                <span>Game Loop:</span> <span className="text-fuchsia-400 tracking-wider">ACTIVE</span>
              </li>
              <li className="flex justify-between">
                <span>Aesthetic Core:</span> <span className="text-cyan-400 tracking-wider">NEON</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right/Center Side: Game Board */}
        <div className="lg:col-span-8 flex justify-center">
          <SnakeGame />
        </div>
      </div>
    </div>
  );
}
