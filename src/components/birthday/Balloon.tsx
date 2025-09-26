import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface BalloonProps {
  color: 'pink' | 'blue' | 'yellow' | 'purple' | 'green' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  onFlyAway?: () => void;
}

export const Balloon = ({ color, size = 'md', className, style, onFlyAway }: BalloonProps) => {
  const [isFlying, setIsFlying] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const colorClasses = {
    pink: 'bg-party-pink',
    blue: 'bg-party-blue', 
    yellow: 'bg-party-yellow',
    purple: 'bg-party-purple',
    green: 'bg-party-green',
    orange: 'bg-party-orange'
  };

  const sizeClasses = {
    sm: 'w-12 h-16',
    md: 'w-16 h-20',
    lg: 'w-20 h-24'
  };

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  // Create balloon pop sound
  const playPopSound = () => {
    if (!audioContextRef.current) return;

    try {
      const audioContext = audioContextRef.current;
      
      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Create a pop sound effect
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();
      
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Pop sound: quick frequency sweep
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
      
      // Filter for a more balloon-like sound
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(1000, audioContext.currentTime);
      filterNode.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.15);
      
      // Volume envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
      
      oscillator.type = 'triangle';
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      
    } catch (error) {
      console.log('Audio playback failed:', error);
    }
  };

  // Create whoosh sound for flying
  const playWhooshSound = () => {
    if (!audioContextRef.current) return;

    try {
      const audioContext = audioContextRef.current;
      
      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Create whoosh sound with noise
      const bufferSize = audioContext.sampleRate * 0.8; // 0.8 seconds
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Generate whoosh noise
      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize;
        const envelope = Math.sin(Math.PI * t) * Math.exp(-t * 3);
        data[i] = (Math.random() * 2 - 1) * envelope * 0.3;
      }
      
      const bufferSource = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();
      
      bufferSource.buffer = buffer;
      bufferSource.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // High-pass filter for whoosh effect
      filterNode.type = 'highpass';
      filterNode.frequency.setValueAtTime(200, audioContext.currentTime);
      filterNode.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.8);
      
      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);
      
      bufferSource.start(audioContext.currentTime);
      
    } catch (error) {
      console.log('Whoosh sound failed:', error);
    }
  };

  // Create magical sparkle sounds
  const playSparkleSound = () => {
    if (!audioContextRef.current) return;

    try {
      const audioContext = audioContextRef.current;
      
      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Create multiple sparkle tones
      const frequencies = [800, 1000, 1200, 1500, 1800];
      
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
        }, index * 50);
      });
      
    } catch (error) {
      console.log('Sparkle sound failed:', error);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Balloon clicked!', color);
    
    if (isFlying || isClicked) return;
    
    // Play immediate pop sound
    playPopSound();
    
    setIsClicked(true);
    
    // Play sparkle sounds
    setTimeout(() => {
      playSparkleSound();
    }, 100);
    
    // Start flying animation and whoosh sound
    setTimeout(() => {
      setIsFlying(true);
      playWhooshSound();
      console.log('Starting fly animation with whoosh sound');
    }, 200);
    
    // Call callback after animation completes
    setTimeout(() => {
      console.log('Animation complete, calling onFlyAway');
      onFlyAway?.();
    }, 2500);
  };

  const handleMouseEnter = () => {
    if (isFlying || isClicked) return;
    
    // Play subtle hover sound
    if (!audioContextRef.current) return;

    try {
      const audioContext = audioContextRef.current;
      
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(800, audioContext.currentTime + 0.1);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
      
    } catch (error) {
      console.log('Hover sound failed:', error);
    }
  };

  if (isFlying) {
    return null;
  }

  return (
    <div 
      className={cn(
        "relative cursor-pointer group transition-all duration-300 select-none",
        isClicked && "animate-pulse",
        !isFlying && "hover:scale-110 hover:-translate-y-2 active:scale-95",
        className
      )} 
      style={style}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Balloon */}
      <div 
        className={cn(
          "rounded-full shadow-lg relative transition-all duration-300 select-none",
          colorClasses[color],
          sizeClasses[size],
          "before:content-[''] before:absolute before:top-1 before:left-1/4 before:w-1/3 before:h-1/3 before:bg-white/30 before:rounded-full before:blur-sm",
          isClicked && "animate-bounce scale-110",
          !isFlying && "group-hover:shadow-xl group-hover:shadow-current/30"
        )}
      />
      
      {/* String */}
      <div className={cn(
        "absolute left-1/2 top-full w-px bg-gray-600 transform -translate-x-1/2 transition-all duration-300 select-none",
        isClicked ? "h-32 opacity-50" : "h-20",
        !isFlying && "group-hover:h-24"
      )} />
      
      {/* Highlight effect */}
      <div className={cn(
        "absolute top-2 left-3 w-3 h-4 bg-white/50 rounded-full blur-[1px] transition-all duration-300 select-none pointer-events-none",
        size === 'sm' && "w-2 h-2 top-1 left-2",
        size === 'lg' && "w-4 h-6 top-3 left-4",
        !isFlying && "group-hover:bg-white/70"
      )} />

      {/* Click sparkle effect */}
      {isClicked && (
        <div className="absolute inset-0 pointer-events-none select-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-300 animate-ping"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.6s',
                fontSize: size === 'lg' ? '16px' : size === 'md' ? '14px' : '12px'
              }}
            >
              ✨
            </div>
          ))}
          {/* Sound wave effect */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/50 rounded-full animate-ping" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/30 rounded-full animate-ping" style={{animationDelay: '0.1s'}} />
        </div>
      )}

      {/* Hover tooltip */}
      {!isFlying && !isClicked && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none select-none z-10">
          <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
            🎈 点击放飞气球！🔊
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90" />
        </div>
      )}

      {/* Click feedback */}
      {isClicked && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 pointer-events-none select-none z-10">
          <div className="bg-party-pink/90 text-white text-sm px-3 py-1 rounded-lg animate-bounce">
            🚀 飞走啦！🎵
          </div>
        </div>
      )}

      {/* Audio indicator */}
      {isClicked && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none select-none z-10">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-4 bg-party-blue rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.5s'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};