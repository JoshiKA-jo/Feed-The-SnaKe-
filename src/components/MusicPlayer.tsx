import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Drive',
    artist: 'AI Synth Algo',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'Cybernetic Pulse',
    artist: 'AI Synth Algo',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'Digital Horizon',
    artist: 'AI Synth Algo',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.url);
      audioRef.current.volume = 0.5;
    } else {
      audioRef.current.src = currentTrack.url;
    }

    const audio = audioRef.current;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audio.play().catch(console.error);
    }

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  }, []);

  return (
    <div className="flex flex-col border border-fuchsia-500/50 bg-neutral-900/80 p-6 rounded-2xl shadow-[0_0_20px_theme('colors.fuchsia.500/0.2')] backdrop-blur-md">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-fuchsia-600 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_theme('colors.fuchsia.500/0.5')] animate-pulse">
          <Music className="text-white w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-300">
            {currentTrack.title}
          </h2>
          <p className="text-sm text-fuchsia-200/60">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="w-full bg-neutral-800 h-2 rounded-full mb-6 overflow-hidden border border-neutral-700">
        <div
          className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 shadow-[0_0_10px_theme('colors.fuchsia.500')]"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={toggleMute}
          className="p-2 text-neutral-400 hover:text-cyan-400 transition-colors"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            className="p-3 bg-neutral-800 border border-neutral-700 rounded-full hover:border-cyan-400 hover:shadow-[0_0_15px_theme('colors.cyan.500/0.3')] text-cyan-400 transition-all"
          >
            <SkipBack className="w-5 h-5" fill="currentColor" />
          </button>
          <button
            onClick={togglePlay}
            className="p-4 bg-fuchsia-600 rounded-full hover:bg-fuchsia-500 hover:shadow-[0_0_20px_theme('colors.fuchsia.500/0.6')] text-white transition-all transform hover:scale-105 active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" fill="currentColor" />
            ) : (
              <Play className="w-6 h-6" fill="currentColor" className="ml-1" />
            )}
          </button>
          <button
            onClick={handleNext}
            className="p-3 bg-neutral-800 border border-neutral-700 rounded-full hover:border-cyan-400 hover:shadow-[0_0_15px_theme('colors.cyan.500/0.3')] text-cyan-400 transition-all"
          >
            <SkipForward className="w-5 h-5" fill="currentColor" />
          </button>
        </div>
        
        <div className="w-9"></div> {/* Spacer for alignment */}
      </div>
    </div>
  );
}
