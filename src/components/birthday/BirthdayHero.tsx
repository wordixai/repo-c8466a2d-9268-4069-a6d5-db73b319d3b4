import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Balloon } from './Balloon';
import { Confetti } from './Confetti';
import { Cake } from './Cake';
import { Gift, Sparkles, Music } from 'lucide-react';

export const BirthdayHero = () => {
  const [isPartyMode, setIsPartyMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [name, setName] = useState('');

  const startParty = () => {
    setIsPartyMode(true);
    setShowConfetti(true);
    // Stop confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Background balloons */}
      <div className="absolute inset-0 pointer-events-none">
        <Balloon color="pink" size="lg" className="absolute top-20 left-10 animate-float" style={{animationDelay: '0s'}} />
        <Balloon color="blue" size="md" className="absolute top-32 right-20 animate-float" style={{animationDelay: '1s'}} />
        <Balloon color="yellow" size="lg" className="absolute bottom-40 left-20 animate-float" style={{animationDelay: '2s'}} />
        <Balloon color="purple" size="md" className="absolute bottom-20 right-10 animate-float" style={{animationDelay: '0.5s'}} />
        <Balloon color="green" size="sm" className="absolute top-1/2 left-1/3 animate-float" style={{animationDelay: '1.5s'}} />
        <Balloon color="orange" size="md" className="absolute top-1/3 right-1/3 animate-float" style={{animationDelay: '2.5s'}} />
      </div>

      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* Main content */}
      <div className="text-center space-y-8 z-10 max-w-4xl mx-auto">
        {/* Sparkles decoration */}
        <div className="relative">
          <Sparkles className="absolute -top-4 -left-4 text-party-yellow animate-sparkle" style={{animationDelay: '0s'}} />
          <Sparkles className="absolute -top-2 -right-6 text-party-pink animate-sparkle" style={{animationDelay: '0.5s'}} />
          <Sparkles className="absolute -bottom-4 left-8 text-party-blue animate-sparkle" style={{animationDelay: '1s'}} />
          
          <h1 className="text-6xl md:text-8xl font-bold gradient-text mb-4 animate-bounce-custom">
            🎉 Happy Birthday! 🎂
          </h1>
        </div>

        {/* Name input */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter the birthday person's name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-6 py-3 text-xl rounded-full border-2 border-party-pink text-center bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-party-pink/50 focus:border-party-purple transition-all"
          />
          {name && (
            <p className="text-3xl md:text-4xl font-semibold gradient-text animate-bounce-custom">
              🎈 {name}! 🎈
            </p>
          )}
        </div>

        {/* Cake */}
        <div className="flex justify-center my-8">
          <Cake isAnimated={isPartyMode} />
        </div>

        {/* Party button */}
        <Button
          onClick={startParty}
          size="lg"
          className="party-button text-2xl px-12 py-6 rounded-full hover:scale-105 transform transition-all duration-300 shadow-2xl"
        >
          <Gift className="mr-3 h-8 w-8" />
          Start the Celebration!
          <Music className="ml-3 h-8 w-8" />
        </Button>

        {/* Birthday message */}
        <div className="mt-8 p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-xl">
          <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed">
            🌟 May your special day be filled with happiness, laughter, and all your favorite things! 🌟
          </p>
          <div className="flex justify-center space-x-4 mt-4 text-3xl">
            <span className="animate-bounce-custom" style={{animationDelay: '0s'}}>🎂</span>
            <span className="animate-bounce-custom" style={{animationDelay: '0.2s'}}>🎈</span>
            <span className="animate-bounce-custom" style={{animationDelay: '0.4s'}}>🎁</span>
            <span className="animate-bounce-custom" style={{animationDelay: '0.6s'}}>🎉</span>
            <span className="animate-bounce-custom" style={{animationDelay: '0.8s'}}>✨</span>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-party-pink/20 to-transparent pointer-events-none" />
    </div>
  );
};