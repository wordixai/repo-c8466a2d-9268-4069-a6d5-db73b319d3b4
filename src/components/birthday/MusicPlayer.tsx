import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, SkipBack, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MusicPlayerProps {
  autoPlay?: boolean;
  className?: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onSongEnd?: () => void;
}

export const MusicPlayer = ({ autoPlay = false, className, onPlayStateChange, onSongEnd }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const songDuration = 22; // Total song duration in seconds

  // Create audio context for generating birthday melody
  useEffect(() => {
    if (typeof window !== 'undefined' && audioRef.current) {
      // Extended birthday melody with more verses
      const melody = [
        // First verse: 祝你生日快乐
        { note: 261.63, duration: 0.5 }, // C4 - 祝
        { note: 261.63, duration: 0.5 }, // C4 - 你
        { note: 293.66, duration: 1 },   // D4 - 生日
        { note: 261.63, duration: 1 },   // C4 - 快
        { note: 349.23, duration: 1 },   // F4 - 乐
        { note: 329.63, duration: 2 },   // E4 - ！
        
        // Second verse: 祝你生日快乐
        { note: 261.63, duration: 0.5 }, // C4 - 祝
        { note: 261.63, duration: 0.5 }, // C4 - 你
        { note: 293.66, duration: 1 },   // D4 - 生日
        { note: 261.63, duration: 1 },   // C4 - 快
        { note: 392.00, duration: 1 },   // G4 - 乐
        { note: 349.23, duration: 2 },   // F4 - ！
        
        // Third verse: 祝你生日快乐
        { note: 261.63, duration: 0.5 }, // C4 - 祝
        { note: 261.63, duration: 0.5 }, // C4 - 你
        { note: 523.25, duration: 1 },   // C5 - 生日
        { note: 440.00, duration: 1 },   // A4 - 快
        { note: 349.23, duration: 1 },   // F4 - 乐
        { note: 329.63, duration: 1 },   // E4 - ！
        { note: 293.66, duration: 2 },   // D4 - 
        
        // Fourth verse: 祝你幸福安康
        { note: 466.16, duration: 0.5 }, // Bb4 - 祝
        { note: 466.16, duration: 0.5 }, // Bb4 - 你
        { note: 440.00, duration: 1 },   // A4 - 幸福
        { note: 349.23, duration: 1 },   // F4 - 安
        { note: 392.00, duration: 1 },   // G4 - 康
        { note: 349.23, duration: 2 },   // F4 - ！
      ];

      const createBirthdayAudio = () => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const duration = songDuration;
        const sampleRate = audioContext.sampleRate;
        const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);

        let currentTime = 0;
        melody.forEach(({ note, duration: noteDuration }) => {
          const startSample = Math.floor(currentTime * sampleRate);
          const endSample = Math.floor((currentTime + noteDuration) * sampleRate);
          
          for (let i = startSample; i < endSample && i < data.length; i++) {
            const t = (i - startSample) / sampleRate;
            const envelope = Math.max(0, 1 - t / noteDuration * 0.8); // Gentler decay
            // Add some harmony with aharmonizing tone
            data[i] += Math.sin(2 * Math.PI * note * t) * envelope * 0.2;
            // Add some harmony
            data[i] += Math.sin(2 * Math.PI * note * t * 1.5) * envelope * 0.1;
          }
          
          currentTime += noteDuration;
        });

        return buffer;
      };

      // Store the audio buffer creation function
      (audioRef.current as any).createAudio = createBirthdayAudio;
    }
  }, []);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    if (isPlaying) {
      const startTime = Date.now();
      progressInterval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const newProgress = Math.min(100, (elapsed / songDuration) * 100);
        setProgress(newProgress);
        
        if (elapsed >= songDuration) {
          setIsPlaying(false);
          setProgress(0);
          onSongEnd?.();
          clearInterval(progressInterval);
        }
      }, 100);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isPlaying, songDuration, onSongEnd]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        setIsPlaying(false);
        setProgress(0);
        if ((audioRef.current as any).source) {
          (audioRef.current as any).source.stop();
        }
        onPlayStateChange?.(false);
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
        setProgress(0);
        onPlayStateChange?.(true);
        
        // Store source for stopping
        (audioRef.current as any).source = source;
        (audioRef.current as any).gainNode = gainNode;
        
        source.onended = () => {
          setIsPlaying(false);
          setProgress(0);
          onPlayStateChange?.(false);
          onSongEnd?.();
        };
      }
    } catch (error) {
      console.log('Audio playback failed:', error);
    }
  };

  const restartSong = () => {
    if (isPlaying) {
      if ((audioRef.current as any).source) {
        (audioRef.current as any).source.stop();
      }
      setProgress(0);
      // Restart after a short delay
      setTimeout(() => togglePlay(), 100);
    } else {
      setProgress(0);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("flex flex-col space-y-3 p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl min-w-[320px]", className)}>
      <audio ref={audioRef} style={{ display: 'none' }} />
      
      {/* Song info and controls */}
      <div className="flex items-center space-x-4">
        {/* Play/Pause Button */}
        <Button
          onClick={togglePlay}
          size="lg"
          className="party-button rounded-full w-14 h-14 flex items-center justify-center hover:scale-110 transition-transform"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </Button>

        {/* Restart Button */}
        <Button
          onClick={restartSong}
          variant="ghost"
          size="sm"
          className="hover:bg-white/20 rounded-full w-10 h-10"
        >
          <RotateCcw className="h-4 w-4 text-foreground/70" />
        </Button>

        {/* Music info */}
        <div className="flex-1">
          <p className="font-semibold text-lg gradient-text">🎵 生日快乐歌</p>
          <p className="text-sm text-foreground/70">
            {isPlaying ? '🎶 正在播放...' : '🎵 点击播放生日快乐歌'}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-party-pink via-party-yellow to-party-blue transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-foreground/60">
          <span>{formatTime((progress / 100) * songDuration)}</span>
          <span>{formatTime(songDuration)}</span>
        </div>
      </div>

      {/* Volume controls */}
      <div className="flex items-center space-x-3">
        <Button
          onClick={toggleMute}
          variant="ghost"
          size="sm"
          className="hover:bg-white/20 rounded-full w-8 h-8"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4 text-foreground/70" />
          ) : (
            <Volume2 className="h-4 w-4 text-foreground/70" />
          )}
        </Button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 accent-party-pink"
        />

        {/* Visualizer effect */}
        {isPlaying && (
          <div className="flex items-center space-x-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-party-pink rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 16 + 8}px`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.6s'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};