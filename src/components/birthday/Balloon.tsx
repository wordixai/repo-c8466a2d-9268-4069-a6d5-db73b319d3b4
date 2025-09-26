import { cn } from '@/lib/utils';

interface BalloonProps {
  color: 'pink' | 'blue' | 'yellow' | 'purple' | 'green' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const Balloon = ({ color, size = 'md', className, style }: BalloonProps) => {
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

  return (
    <div className={cn("relative", className)} style={style}>
      {/* Balloon */}
      <div 
        className={cn(
          "rounded-full shadow-lg relative",
          colorClasses[color],
          sizeClasses[size],
          "before:content-[''] before:absolute before:top-1 before:left-1/4 before:w-1/3 before:h-1/3 before:bg-white/30 before:rounded-full before:blur-sm"
        )}
      />
      
      {/* String */}
      <div className="absolute left-1/2 top-full w-px h-20 bg-gray-600 transform -translate-x-1/2" />
      
      {/* Highlight effect */}
      <div className={cn(
        "absolute top-2 left-3 w-3 h-4 bg-white/50 rounded-full blur-[1px]",
        size === 'sm' && "w-2 h-2 top-1 left-2",
        size === 'lg' && "w-4 h-6 top-3 left-4"
      )} />
    </div>
  );
};