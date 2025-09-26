import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, Gift } from 'lucide-react';

const wishes = [
  {
    icon: Heart,
    message: "愿你的生日充满爱意、欢声笑语和心中所有的美好愿望！💕",
    color: "text-party-pink"
  },
  {
    icon: Star,
    message: "愿这新的一岁带给你无尽的快乐和精彩的冒险！⭐",
    color: "text-party-yellow"
  },
  {
    icon: Gift,
    message: "希望你的生日像你一样特别而美好！🎁",
    color: "text-party-purple"
  }
];

export const BirthdayWishes = () => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center gradient-text mb-12">
          生日祝福 🌟
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {wishes.map((wish, index) => (
            <Card key={index} className="group hover:scale-105 transition-all duration-300 bg-white/20 backdrop-blur-md border-white/30 shadow-xl">
              <CardContent className="p-8 text-center space-y-4">
                <div className="flex justify-center">
                  <wish.icon className={`h-12 w-12 ${wish.color} group-hover:animate-bounce-custom`} />
                </div>
                <p className="text-lg leading-relaxed text-foreground/80">
                  {wish.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Interactive birthday song */}
        <div className="mt-16 text-center">
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-xl">
            <h3 className="text-2xl font-bold gradient-text mb-6">🎵 生日快乐歌 🎵</h3>
            <div className="space-y-2 text-lg">
              <p className="animate-bounce-custom" style={{animationDelay: '0s'}}>🎶 祝你生日快乐！🎶</p>
              <p className="animate-bounce-custom" style={{animationDelay: '0.5s'}}>🎶 祝你生日快乐！🎶</p>
              <p className="animate-bounce-custom" style={{animationDelay: '1s'}}>🎶 祝你生日快乐！🎶</p>
              <p className="animate-bounce-custom" style={{animationDelay: '1.5s'}}>🎶 祝你幸福安康！🎶</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};