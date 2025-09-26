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
    alert('开始庆祝按钮被点击了！'); // Immediate feedback
    
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
      alert('启动庆祝时出错: ' + error);
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

  // Force re-render test
  const [renderCount, setRenderCount] = useState(0);
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  }, [isPartyMode, showConfetti, showMusicPlayer, showBarrage]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Debug Panel - Always visible */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-black/80 text-white p-2 text-xs">
        <div>🔍 Debug Info - Render: {renderCount}</div>
        <div>Party Mode: {isPartyMode ? '✅' : '❌'} | Confetti: {showConfetti ? '✅' : '❌'} | Music: {showMusicPlayer ? '✅' : '❌'} | Barrage: {showBarrage ? '✅' : '❌'}</div>
      </div>

      {/* Background balloons */}
      <div className="absolute inset-0 z-20">
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
                zIndex: 25
              }}
              onFlyAway={() => handleBalloonFlyAway(balloon.id)}
            />
          )
        ))}
      </div>

      {/* TEST: Always show confetti for testing */}
      {(showConfetti || isPartyMode) && (
        <div className="fixed inset-0 z-30">
          <Confetti />
          <div className="fixed top-20 left-4 bg-green-500 text-white p-2 rounded">
            🎊 CONFETTI ACTIVE!
          </div>
        </div>
      )}

      {/* TEST: Always show barrage for testing */}
      {(showBarrage || isPartyMode) && (
        <div className="fixed inset-0 z-25">
          <BarrageSystem isActive={true} />
          <div className="fixed top-32 left-4 bg-blue-500 text-white p-2 rounded">
            💬 BARRAGE ACTIVE!
          </div>
        </div>
      )}

      {/* TEST: Always show music player for testing */}
      {(showMusicPlayer || isPartyMode) && (
        <div className="fixed top-4 right-4 z-50">
          <MusicPlayer 
            autoPlay={false} 
            onPlayStateChange={handlePlayStateChange}
            onSongEnd={handleSongEnd}
          />
          <div className="absolute -bottom-10 right-0 bg-purple-500 text-white p-1 rounded text-xs">
            🎵 MUSIC ACTIVE!
          </div>
        </div>
      )}

      {/* Lyrics Display */}
      {showLyrics && (
        <LyricsDisplay 
          isPlaying={isPlaying} 
          onLyricsEnd={handleLyricsEnd}
        />
      )}

      {/* Balloon reset button */}
      {!hasVisibleBalloons && (
        <div className="fixed top-16 left-4 z-50">
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
        <div className="fixed top-16 left-4 z-40">
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

      {/* Main content */}
      <div className="text-center space-y-8 z-10 max-w-4xl mx-auto mt-16">
        {/* Sparkles decoration */}
        <div className="relative">
          <h1 className="text-6xl md:text-8xl font-bold gradient-text mb-4 animate-bounce-custom">
            🎉 Happy Birthday! 🎂
          </h1>
        </div>

        {/* Name input */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="输入生日人的名字..."
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

        {/* Party button - Multiple test versions */}
        <div className="flex flex-col items-center space-y-4">
          {/* Main button */}
          <Button
            onClick={startParty}
            size="lg"
            className="party-button text-2xl px-12 py-6 rounded-full hover:scale-105 transform transition-all duration-300 shadow-2xl"
          >
            <Gift className="mr-3 h-8 w-8" />
            {isPartyMode ? "🎉 庆祝中..." : "开始庆祝！🎵"}
            <Music className="ml-3 h-8 w-8" />
          </Button>

          {/* Test button with direct state change */}
          <button
            onClick={() => {
              console.log('🧪 TEST BUTTON CLICKED');
              setIsPartyMode(true);
              setShowConfetti(true);
              setShowMusicPlayer(true);
              setShowBarrage(true);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            🧪 测试按钮 (直接设置状态)
          </button>

          {/* Simple state toggle for testing */}
          <div className="flex space-x-2">
            <button
              onClick={() => setShowConfetti(!showConfetti)}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              🎊 切换礼花: {showConfetti ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setShowBarrage(!showBarrage)}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm"
            >
              💬 切换弹幕: {showBarrage ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setShowMusicPlayer(!showMusicPlayer)}
              className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
            >
              🎵 切换音乐: {showMusicPlayer ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Status display */}
        <div className="mt-8 p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-xl">
          <h3 className="text-xl font-bold mb-4">🔍 当前状态</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>庆祝模式: {isPartyMode ? '🟢 开启' : '🔴 关闭'}</div>
            <div>礼花效果: {showConfetti ? '🟢 显示' : '🔴 隐藏'}</div>
            <div>音乐播放器: {showMusicPlayer ? '🟢 显示' : '🔴 隐藏'}</div>
            <div>弹幕系统: {showBarrage ? '🟢 开启' : '🔴 关闭'}</div>
            <div>歌词显示: {showLyrics ? '🟢 显示' : '🔴 隐藏'}</div>
            <div>音乐播放: {isPlaying ? '🟢 播放中' : '🔴 已暂停'}</div>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-party-pink/20 to-transparent pointer-events-none" />
    </div>
  );
};