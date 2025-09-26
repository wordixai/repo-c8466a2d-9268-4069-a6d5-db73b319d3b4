import { useState, useEffect } from 'react';
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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Balloon clicked!', color); // Debug log
    
    if (isFlying || isClicked) return;
    
    setIsClicked(true);
    
    // Start flying animation after a short delay
    setTimeout(() => {
      setIsFlying(true);
      console.log('Starting fly animation'); // Debug log
    }, 200);
    
    // Call callback after animation completes
    setTimeout(() => {
      console.log('Animation complete, calling onFlyAway'); // Debug log
      onFlyAway?.();
    }, 2500);
  };

  // Debug effect
  useEffect(() => {
    console.log('Balloon state:', { color, isFlying, isClicked });
  }, [color, isFlying, isClicked]);

  if (isFlying) {
    return null; // Remove from DOM after flying starts
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
        </div>
      )}

      {/* Hover tooltip */}
      {!isFlying && !isClicked && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none select-none z-10">
          <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
            🎈 点击放飞气球！
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90" />
        </div>
      )}

      {/* Click feedback */}
      {isClicked && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 pointer-events-none select-none z-10">
          <div className="bg-party-pink/90 text-white text-sm px-3 py-1 rounded-lg animate-bounce">
            🚀 飞走啦！
          </div>
        </div>
      )}
    </div>
  );
};