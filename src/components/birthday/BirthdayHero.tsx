import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Balloon } from './Balloon';
import { Confetti } from './Confetti';
import { Cake } from './Cake';
import { MusicPlayer } from './MusicPlayer';
import { LyricsDisplay } from './LyricsDisplay';
import { BarrageSystem } from './BarrageSystem';
import { cn } from '@/lib/utils';
import { Gift, Sparkles, Music, RotateCcw, Volume2 } from 'lucide-react';

interface BalloonState {
  id: string;
  color: 'pink' | 'blue' | 'yellow' | 'purple' | 'green' | 'orange';
  size: 'sm' | 'md' | 'lg';
  position: { top?: string; left?: string; right?: string; bottom?: string };
  animationDelay: string;
  isVisible: boolean;
}

const initialBalloons: BalloonState[] = [
  { id: 'balloon-1', color: 'pink', size: 'lg', position: { top: '15%', left: '8%' }, animationDelay: '0s', isVisible: true },
  { id: 'balloon-2', color: 'blue', size: 'md', position: { top: '25%', right: '15%' }, animationDelay: '1s', isVisible: true },
  { id: 'balloon-3', color: 'yellow', size: 'lg', position: { bottom: '35%', left: '12%' }, animationDelay: '2s', isVisible: true },
  { id: 'balloon-4', color: 'purple', size: 'md', position: { bottom: '15%', right: '8%' }, animationDelay: '0.5s', isVisible: true },
  { id: 'balloon-5', color: 'green', size: 'sm', position: { top: '45%', left: '25%' }, animationDelay: '1.5s', isVisible: true },
  { id: 'balloon-6', color: 'orange', size: 'md', position: { top: '30%', right: '25%' }, animationDelay: '2.5s', isVisible: true },
];

export const BirthdayHero = () => {
  const [isPartyMode, setIsPartyMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showBarrage, setShowBarrage] = useState(false);
  const [balloons, setBalloons] = useState<BalloonState[]>(initialBalloons);
  const [balloonsPopped, setBalloonsPopped] = useState(0);
  const [name, setName] = useState('');

  const startParty = () => {
    console.log('🎉 START PARTY CLICKED!');
    
    try {
      console.log('Setting party states...');
      setIsPartyMode(true);
      setShowConfetti(true);
      setShowMusicPlayer(true);
      setShowBarrage(true);
      
      console.log('✅ All states set successfully');
      
      // Stop confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
        console.log('Confetti stopped after 5 seconds');
      }, 5000);
    } catch (error) {
      console.error('❌ Error starting party:', error);
    }
  };

  const handlePlayStateChange = (playing: boolean) => {
    console.log('🎵 Play state changed:', playing);
    setIsPlaying(playing);
    setShowLyrics(playing);
  };

  const handleLyricsEnd = () => {
    setShowLyrics(false);
  };

  const handleSongEnd = () => {
    setIsPlaying(false);
    setShowLyrics(false);
  };

  const handleBalloonFlyAway = (balloonId: string) => {
    console.log('🎈 Balloon flying away:', balloonId);
    setBalloons(prev => {
      const newBalloons = prev.map(balloon => 
        balloon.id === balloonId 
          ? { ...balloon, isVisible: false }
          : balloon
      );
      return newBalloons;
    });
    setBalloonsPopped(prev => prev + 1);
  };

  const resetBalloons = () => {
    console.log('🔄 Resetting balloons');
    setBalloons(initialBalloons.map(balloon => ({ ...balloon, isVisible: true })));
    setBalloonsPopped(0);
  };

  const visibleBalloons = balloons.filter(balloon => balloon.isVisible);
  const hasVisibleBalloons = visibleBalloons.length > 0;

  // Debug effect to monitor all state changes
  useEffect(() => {
    console.log('🔍 State Update:', {
      isPartyMode,
      showConfetti,
      showMusicPlayer,
      showBarrage,
      showLyrics,
      isPlaying,
      visibleBalloons: visibleBalloons.length
    });
  }, [isPartyMode, showConfetti, showMusicPlayer, showBarrage, showLyrics, isPlaying, visibleBalloons.length]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Background balloons - Lower Z-Index */}
      <div className="absolute inset-0 z-10">
        {balloons.map((balloon) => (
          balloon.isVisible && (
            <Balloon 
              key={balloon.id}
              color={balloon.color} 
              size={balloon.size} 
              className="absolute animate-float" 
              style={{
                ...balloon.position,
                animationDelay: balloon.animationDelay,
                zIndex: 10
              }}
              onFlyAway={() => handleBalloonFlyAway(balloon.id)}
            />
          )
        ))}
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-30 pointer-events-none">
          <Confetti />
        </div>
      )}

      {/* Barrage System */}
      {showBarrage && (
        <div className="fixed inset-0 z-35">
          <BarrageSystem isActive={showBarrage} />
        </div>
      )}

      {/* Lyrics Display */}
      {showLyrics && (
        <div className="fixed inset-0 z-40">
          <LyricsDisplay 
            isPlaying={isPlaying} 
            onLyricsEnd={handleLyricsEnd}
          />
        </div>
      )}

      {/* Music Player - Fixed position */}
      {showMusicPlayer && (
        <div className="fixed top-4 right-4 z-50 animate-bounce-custom">
          <MusicPlayer 
            autoPlay={true} 
            onPlayStateChange={handlePlayStateChange}
            onSongEnd={handleSongEnd}
          />
        </div>
      )}

      {/* Balloon reset button */}
      {!hasVisibleBalloons && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            onClick={resetBalloons}
            className="party-button rounded-full shadow-2xl hover:scale-105 transition-transform"
            size="lg"
          >
            <RotateCcw className="h-6 w-6 mr-2" />
            重新放置气球
            <Sparkles className="h-6 w-6 ml-2" />
          </Button>
        </div>
      )}

      {/* Balloon counter */}
      {hasVisibleBalloons && (
        <div className="fixed top-4 left-4 z-45">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/30 shadow-xl">
            <p className="text-sm font-semibold gradient-text">
              🎈 剩余气球: {visibleBalloons.length}/6
            </p>
            <p className="text-xs text-foreground/70 mt-1 flex items-center">
              <Volume2 className="h-3 w-3 mr-1" />
              点击气球听声音！
            </p>
          </div>
        </div>
      )}

      {/* Balloons popped counter */}
      {balloonsPopped > 0 && (
        <div className="fixed top-24 left-4 z-45">
          <div className="bg-party-pink/20 backdrop-blur-md rounded-2xl p-3 border border-party-pink/30 shadow-xl">
            <p className="text-sm font-semibold text-party-pink">
              🎊 已放飞: {balloonsPopped} 个气球
            </p>
            {balloonsPopped >= 3 && (
              <p className="text-xs text-party-pink/80 mt-1">
                🌟 棒极了！继续加油！
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main content - Higher Z-Index than balloons */}
      <div className="relative text-center space-y-8 z-20 max-w-4xl mx-auto">
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
        <div className="space-y-4 relative z-25">
          <input
            type="text"
            placeholder="输入生日人的名字..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-6 py-3 text-xl rounded-full border-2 border-party-pink text-center bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-party-pink/50 focus:border-party-purple transition-all relative z-25"
          />
          {name && (
            <p className="text-3xl md:text-4xl font-semibold gradient-text animate-bounce-custom">
              🎈 {name}! 🎈
            </p>
          )}
        </div>

        {/* Cake */}
        <div className="flex justify-center my-8 relative z-25">
          <Cake isAnimated={isPartyMode} />
        </div>

        {/* Party button - Highest Z-Index */}
        <div className="flex justify-center relative z-50">
          <Button
            onClick={startParty}
            disabled={isPartyMode}
            size="lg"
            className={`party-button text-2xl px-12 py-6 rounded-full hover:scale-105 transform transition-all duration-300 shadow-2xl relative z-50 ${
              isPartyMode ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            style={{ zIndex: 50 }}
          >
            <Gift className="mr-3 h-8 w-8" />
            {isPartyMode ? "🎉 庆祝中..." : "开始庆祝！🎵"}
            <Music className="ml-3 h-8 w-8" />
          </Button>
        </div>

        {/* Birthday message */}
        <div className="mt-8 p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-xl relative z-25">
          <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed">
            🌟 愿你的特别日子充满快乐、欢声笑语和所有你喜欢的事物！🌟
          </p>
          <div className="flex justify-center space-x-4 mt-4 text-3xl">
            <span className="animate-bounce-custom" style={{animationDelay: '0s'}}>🎂</span>
            <span className="animate-bounce-custom" style={{animationDelay: '0.2s'}}>🎈</span>
            <span className="animate-bounce-custom" style={{animationDelay: '0.4s'}}>🎁</span>
            <span className="animate-bounce-custom" style={{animationDelay: '0.6s'}}>🎉</span>
            <span className="animate-bounce-custom" style={{animationDelay: '0.8s'}}>✨</span>
          </div>
        </div>

        {/* Feature info */}
        {!showMusicPlayer && (
          <div className="mt-6 space-y-3 relative z-25">
            <div className="p-4 bg-party-pink/20 backdrop-blur-md rounded-2xl border border-party-pink/30">
              <p className="text-lg text-party-pink font-semibold">
                🎵 点击"开始庆祝"解锁全部功能！🎵
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-party-blue/20 backdrop-blur-md rounded-xl border border-party-blue/30">
                <p className="text-party-blue font-medium">🎶 生日快乐歌</p>
              </div>
              <div className="p-3 bg-party-purple/20 backdrop-blur-md rounded-xl border border-party-purple/30">
                <p className="text-party-purple font-medium">📺 同步字幕</p>
              </div>
              <div className="p-3 bg-party-green/20 backdrop-blur-md rounded-xl border border-party-green/30">
                <p className="text-party-green font-medium">💬 祝福弹幕</p>
              </div>
              <div className="p-3 bg-party-yellow/20 backdrop-blur-md rounded-xl border border-party-yellow/30">
                <p className="text-party-yellow font-medium">🎈 声效气球</p>
              </div>
            </div>
            <div className="p-3 bg-party-orange/20 backdrop-blur-md rounded-xl border border-party-orange/30">
              <p className="text-party-orange font-medium text-sm flex items-center justify-center">
                <Volume2 className="h-4 w-4 mr-2" />
                💡 小贴士：点击屏幕上的彩色气球享受音效体验！
              </p>
            </div>
          </div>
        )}

        {showBarrage && hasVisibleBalloons && (
          <div className="mt-6 p-4 bg-party-orange/20 backdrop-blur-md rounded-2xl border border-party-orange/30 relative z-25">
            <p className="text-lg text-party-orange font-semibold flex items-center justify-center">
              <Volume2 className="h-5 w-5 mr-2" />
              🎈 点击气球听音效！💬 朋友们的祝福正在飞过屏幕！
            </p>
          </div>
        )}

        {!hasVisibleBalloons && showBarrage && (
          <div className="mt-6 p-4 bg-party-pink/20 backdrop-blur-md rounded-2xl border border-party-pink/30 relative z-25">
            <p className="text-lg text-party-pink font-semibold">
              🎊 所有气球都飞走了！🎵 总共听到了 {balloonsPopped} 个音效！
            </p>
            <p className="text-sm text-party-pink/80 mt-2">
              点击左上角按钮重新放置气球继续玩！
            </p>
          </div>
        )}
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-party-pink/20 to-transparent pointer-events-none z-5" />
    </div>
  );
};