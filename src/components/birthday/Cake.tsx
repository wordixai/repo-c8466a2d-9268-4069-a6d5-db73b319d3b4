import { cn } from '@/lib/utils';

interface CakeProps {
  isAnimated?: boolean;
  className?: string;
}

export const Cake = ({ isAnimated = false, className }: CakeProps) => {
  return (
    <div className={cn("relative", className)}>
      {/* Cake base */}
      <div className="relative">
        {/* Bottom layer */}
        <div className="w-32 h-16 cake-gradient rounded-lg shadow-lg border-2 border-party-orange/30" />
        
        {/* Middle layer */}
        <div className="absolute -top-6 left-2 w-28 h-12 bg-gradient-to-b from-party-purple to-party-pink rounded-lg shadow-lg border-2 border-party-pink/30" />
        
        {/* Top layer */}
        <div className="absolute -top-10 left-4 w-24 h-8 bg-gradient-to-b from-party-blue to-party-purple rounded-lg shadow-lg border-2 border-party-blue/30" />
        
        {/* Candles */}
        <div className="absolute -top-16 left-6 flex space-x-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="relative">
              {/* Candle stick */}
              <div className="w-1 h-6 bg-yellow-200 rounded-sm" />
              
              {/* Flame */}
              <div className={cn(
                "absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-gradient-to-t from-party-orange to-party-yellow rounded-full",
                isAnimated && "animate-candle-flicker"
              )} />
              
              {/* Glow effect */}
              {isAnimated && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-party-yellow/30 rounded-full blur-sm animate-pulse" />
              )}
            </div>
          ))}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-2 left-4 w-2 h-2 bg-party-pink rounded-full animate-pulse" />
        <div className="absolute top-4 right-4 w-2 h-2 bg-party-blue rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
        <div className="absolute bottom-3 left-6 w-1.5 h-1.5 bg-party-yellow rounded-full animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-2 right-6 w-1.5 h-1.5 bg-party-green rounded-full animate-pulse" style={{animationDelay: '1.5s'}} />
        
        {/* Cake text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold text-center">
          🎂
        </div>
      </div>
      
      {/* Plate */}
      <div className="absolute -bottom-2 -left-4 w-40 h-4 bg-gradient-to-b from-gray-200 to-gray-300 rounded-full shadow-lg border border-gray-400" />
    </div>
  );
};