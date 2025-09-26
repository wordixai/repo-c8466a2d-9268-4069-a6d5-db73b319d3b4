import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Heart, Star, Gift, Sparkles, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BarrageMessage {
  id: string;
  text: string;
  author: string;
  color: string;
  speed: number;
  size: 'sm' | 'md' | 'lg';
  icon?: string;
  timestamp: number;
}

interface BarrageSystemProps {
  isActive: boolean;
  className?: string;
}

const predefinedWishes = [
  { text: "🎉 生日快乐！愿你永远开心！", author: "小明", icon: "🎂" },
  { text: "🌟 Happy Birthday! 祝你心想事成！", author: "小红", icon: "✨" },
  { text: "🎁 愿你的每一天都充满惊喜和快乐！", author: "小李", icon: "🎈" },
  { text: "💕 生日快乐！友谊万岁！", author: "小张", icon: "💖" },
  { text: "🎊 祝你生日快乐，工作顺利，身体健康！", author: "小王", icon: "🌈" },
  { text: "🍰 Happy Birthday! 今天是你的主场！", author: "小刘", icon: "👑" },
  { text: "🎵 愿你的生活像音乐一样美妙！", author: "小陈", icon: "🎼" },
  { text: "🌸 生日快乐！愿你如花般美丽绽放！", author: "小赵", icon: "🌺" },
  { text: "🚀 祝你在新的一岁里飞得更高！", author: "小孙", icon: "⭐" },
  { text: "🎭 Happy Birthday! 愿你的人生精彩纷呈！", author: "小周", icon: "🎪" },
];

const colors = [
  'text-party-pink',
  'text-party-blue', 
  'text-party-yellow',
  'text-party-purple',
  'text-party-green',
  'text-party-orange',
  'text-white',
  'text-red-400',
  'text-cyan-400',
  'text-emerald-400'
];

export const BarrageSystem = ({ isActive, className }: BarrageSystemProps) => {
  const [messages, setMessages] = useState<BarrageMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);

  // Auto-generate predefined wishes
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const randomWish = predefinedWishes[Math.floor(Math.random() * predefinedWishes.length)];
      addMessage(randomWish.text, randomWish.author, randomWish.icon);
    }, 3000 + Math.random() * 4000); // Random interval between 3-7 seconds

    return () => clearInterval(interval);
  }, [isActive]);

  // Clean up old messages
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setMessages(prev => prev.filter(msg => now - msg.timestamp < 15000)); // Remove after 15 seconds
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  const addMessage = (text: string, author: string, icon?: string) => {
    const newMsg: BarrageMessage = {
      id: `msg-${messageIdRef.current++}`,
      text: icon ? `${icon} ${text}` : text,
      author,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 30 + Math.random() * 20, // 30-50 seconds to cross screen
      size: Math.random() > 0.7 ? 'lg' : Math.random() > 0.3 ? 'md' : 'sm',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMsg]);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const author = authorName.trim() || '匿名朋友';
    const icons = ['🎉', '🎂', '🎈', '🎁', '💕', '✨', '🌟', '🎊'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    
    addMessage(newMessage.trim(), author, randomIcon);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isActive) return null;

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-30 overflow-hidden", className)}>
      {/* Barrage container */}
      <div ref={containerRef} className="relative w-full h-full">
        {messages.map((message, index) => (
          <BarrageMessage 
            key={message.id} 
            message={message} 
            containerHeight={containerRef.current?.clientHeight || 800}
            index={index}
          />
        ))}
      </div>

      {/* Input panel */}
      <div className="fixed bottom-4 left-4 pointer-events-auto z-40">
        {!showInput ? (
          <Button
            onClick={() => setShowInput(true)}
            className="party-button rounded-full shadow-2xl hover:scale-105 transition-transform"
            size="lg"
          >
            <MessageCircle className="h-6 w-6 mr-2" />
            发送祝福弹幕
            <Sparkles className="h-6 w-6 ml-2" />
          </Button>
        ) : (
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-xl space-y-3 min-w-[300px]">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold gradient-text">🎉 发送生日祝福</h3>
              <Button
                onClick={() => setShowInput(false)}
                variant="ghost"
                size="sm"
                className="hover:bg-white/20 rounded-full"
              >
                ✕
              </Button>
            </div>
            
            <Input
              placeholder="你的名字（可选）"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="bg-white/80 border-party-pink"
            />
            
            <div className="flex space-x-2">
              <Input
                placeholder="输入祝福语..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-white/80 border-party-blue"
                maxLength={50}
              />
              <Button
                onClick={handleSendMessage}
                className="party-button hover:scale-105 transition-transform"
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-xs text-foreground/60">
              💡 你的祝福将以弹幕形式飞过屏幕！
            </p>
          </div>
        )}
      </div>

      {/* Quick wish buttons */}
      {showInput && (
        <div className="fixed bottom-24 left-4 pointer-events-auto z-40">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/30 shadow-xl">
            <p className="text-sm font-medium mb-2 gradient-text">快速祝福：</p>
            <div className="flex flex-wrap gap-2">
              {[
                "生日快乐！🎂",
                "心想事成！✨", 
                "身体健康！💪",
                "工作顺利！🌟",
                "永远开心！😊"
              ].map((wish, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    setNewMessage(wish);
                    setTimeout(handleSendMessage, 100);
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-xs hover:bg-white/20 rounded-full border border-white/30"
                >
                  {wish}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Individual barrage message component
const BarrageMessage = ({ 
  message, 
  containerHeight, 
  index 
}: { 
  message: BarrageMessage; 
  containerHeight: number;
  index: number;
}) => {
  const [position, setPosition] = useState({ x: window.innerWidth, y: 0 });

  useEffect(() => {
    // Calculate random Y position with some spacing
    const lanes = Math.floor(containerHeight / 60); // 60px per lane
    const lane = (index % lanes);
    const y = 100 + (lane * 60) + Math.random() * 20; // Add some randomness
    
    setPosition({ x: window.innerWidth, y });

    // Animate across screen
    const duration = message.speed * 1000; // Convert to milliseconds
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1) return; // Animation complete
      
      const newX = window.innerWidth - (window.innerWidth + 500) * progress; // Extra 500px to fully exit
      setPosition(prev => ({ ...prev, x: newX }));
      
      requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, [message, containerHeight, index]);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold'
  };

  return (
    <div
      className={cn(
        "absolute whitespace-nowrap pointer-events-none z-30 transition-none",
        message.color,
        sizeClasses[message.size]
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.3)'
      }}
    >
      <span className="bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
        <strong className="text-white/90">{message.author}:</strong> {message.text}
      </span>
    </div>
  );
};