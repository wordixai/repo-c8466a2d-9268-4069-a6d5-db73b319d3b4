import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, Gift } from 'lucide-react';

const wishes = [
  {
    icon: Heart,
    message: "Wishing you a day filled with love, laughter, and all your heart desires! 💕",
    color: "text-party-pink"
  },
  {
    icon: Star,
    message: "May this new year of life bring you endless joy and amazing adventures! ⭐",
    color: "text-party-yellow"
  },
  {
    icon: Gift,
    message: "Hope your birthday is as special and wonderful as you are! 🎁",
    color: "text-party-purple"
  }
];

export const BirthdayWishes = () => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center gradient-text mb-12">
          Birthday Wishes 🌟
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
            <h3 className="text-2xl font-bold gradient-text mb-6">🎵 Birthday Song 🎵</h3>
            <div className="space-y-2 text-lg">
              <p className="animate-bounce-custom" style={{animationDelay: '0s'}}>🎶 Happy birthday to you! 🎶</p>
              <p className="animate-bounce-custom" style={{animationDelay: '0.5s'}}>🎶 Happy birthday to you! 🎶</p>
              <p className="animate-bounce-custom" style={{animationDelay: '1s'}}>🎶 Happy birthday dear friend! 🎶</p>
              <p className="animate-bounce-custom" style={{animationDelay: '1.5s'}}>🎶 Happy birthday to you! 🎶</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};