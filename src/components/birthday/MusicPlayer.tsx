import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MusicPlayerProps {
  autoPlay?: boolean;
  className?: string;
}

export const MusicPlayer = ({ autoPlay = false, className }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Create audio context for generating birthday melody
  useEffect(() => {
    if (typeof window !== 'undefined' && audioRef.current) {
      // Simple birthday melody notes (frequencies in Hz)
      const melody = [
        { note: 261.63, duration: 0.5 }, // C4 - Hap-
        { note: 261.63, duration: 0.5 }, // C4 - py
        { note: 293.66, duration: 1 },   // D4 - birth-
        { note: 261.63, duration: 1 },   // C4 - day
        { note: 349.23, duration: 1 },   // F4 - to
        { note: 329.63, duration: 2 },   // E4 - you
        
        { note: 261.63, duration: 0.5 }, // C4 - Hap-
        { note: 261.63, duration: 0.5 }, // C4 - py
        { note: 293.66, duration: 1 },   // D4 - birth-
        { note: 261.63, duration: 1 },   // C4 - day
        { note: 392.00, duration: 1 },   // G4 - to
        { note: 349.23, duration: 2 },   // F4 - you
        
        { note: 261.63, duration: 0.5 }, // C4 - Hap-
        { note: 261.63, duration: 0.5 }, // C4 - py
        { note: 523.25, duration: 1 },   // C5 - birth-
        { note: 440.00, duration: 1 },   // A4 - day
        { note: 349.23, duration: 1 },   // F4 - dear
        { note: 329.63, duration: 1 },   // E4 - [name]
        { note: 293.66, duration: 2 },   // D4 - [silence]
        
        { note: 466.16, duration: 0.5 }, // Bb4 - Hap-
        { note: 466.16, duration: 0.5 }, // Bb4 - py
        { note: 440.00, duration: 1 },   // A4 - birth-
        { note: 349.23, duration: 1 },   // F4 - day
        { note: 392.00, duration: 1 },   // G4 - to
        { note: 349.23, duration: 2 },   // F4 - you
      ];

      const createBirthdayAudio = () => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const duration = melody.reduce((acc, note) => acc + note.duration, 0);
        const sampleRate = audioContext.sampleRate;
        const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);

        let currentTime = 0;
        melody.forEach(({ note, duration: noteDuration }) => {
          const startSample = Math.floor(currentTime * sampleRate);
          const endSample = Math.floor((currentTime + noteDuration) * sampleRate);
          
          for (let i = startSample; i < endSample && i < data.length; i++) {
            const t = (i - startSample) / sampleRate;
            const envelope = Math.max(0, 1 - t / noteDuration); // Simple decay envelope
            data[i] += Math.sin(2 * Math.PI * note * t) * envelope * 0.3;
          }
          
          currentTime += noteDuration;
        });

        return buffer;
      };

      // Store the audio buffer creation function
      (audioRef.current as any).createAudio = createBirthdayAudio;
    }
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        setIsPlaying(false);
        if ((audioRef.current as any).source) {
          (audioRef.current as any).source.stop();
        }
      } else {
        // Create new audio context and play
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const buffer = (audioRef.current as any).createAudio();
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        
        source.buffer = buffer;
        gainNode.gain.value = isMuted ? 0 : volume;
        
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        source.start();
        setIsPlaying(true);
        
        // Store source for stopping
        (audioRef.current as any).source = source;
        (audioRef.current as any).gainNode = gainNode;
        
        source.onended = () => {
          setIsPlaying(false);
        };
      }
    } catch (error) {
      console.log('Audio playback failed:', error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if ((audioRef.current as any).gainNode) {
      (audioRef.current as any).gainNode.gain.value = !isMuted ? 0 : volume;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if ((audioRef.current as any).gainNode && !isMuted) {
      (audioRef.current as any).gainNode.gain.value = newVolume;
    }
  };

  useEffect(() => {
    if (autoPlay) {
      setTimeout(() => togglePlay(), 1000);
    }
  }, [autoPlay]);

  return (
    <div className={cn("flex items-center space-x-4 p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl", className)}>
      <audio ref={audioRef} style={{ display: 'none' }} />
      
      {/* Play/Pause Button */}
      <Button
        onClick={togglePlay}
        size="lg"
        className="party-button rounded-full w-16 h-16 flex items-center justify-center hover:scale-110 transition-transform"
      >
        {isPlaying ? (
          <Pause className="h-8 w-8" />
        ) : (
          <Play className="h-8 w-8 ml-1" />
        )}
      </Button>

      {/* Music info */}
      <div className="flex-1">
        <p className="font-semibold text-lg gradient-text">🎵 Happy Birthday Song</p>
        <p className="text-sm text-foreground/70">
          {isPlaying ? '🎶 正在播放...' : '🎵 点击播放生日快乐歌'}
        </p>
      </div>

      {/* Volume controls */}
      <div className="flex items-center space-x-2">
        <Button
          onClick={toggleMute}
          variant="ghost"
          size="sm"
          className="hover:bg-white/20 rounded-full"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-foreground/70" />
          ) : (
            <Volume2 className="h-5 w-5 text-foreground/70" />
          )}
        </Button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="w-20 accent-party-pink"
        />
      </div>

      {/* Visualizer effect */}
      {isPlaying && (
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-party-pink rounded-full animate-pulse"
              style={{
                height: `${Math.random() * 20 + 10}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.5s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};