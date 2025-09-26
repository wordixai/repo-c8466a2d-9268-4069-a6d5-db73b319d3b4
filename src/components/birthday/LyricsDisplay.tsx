import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LyricsDisplayProps {
  isPlaying: boolean;
  onLyricsEnd?: () => void;
  className?: string;
}

const lyricsData = [
  { text: "🎵 祝你生日快乐 🎵", time: 0, duration: 2000 },
  { text: "🎶 祝你生日快乐 🎶", time: 2000, duration: 2000 },
  { text: "🎵 祝你生日快乐 🎵", time: 4000, duration: 2000 },
  { text: "🎉 祝你幸福安康 🎉", time: 6000, duration: 2000 },
  { text: "", time: 8000, duration: 1000 },
  { text: "🎵 Happy Birthday to You 🎵", time: 9000, duration: 2000 },
  { text: "🎶 Happy Birthday to You 🎶", time: 11000, duration: 2000 },
  { text: "🎵 Happy Birthday Dear Friend 🎵", time: 13000, duration: 2000 },
  { text: "🎉 Happy Birthday to You 🎉", time: 15000, duration: 2000 },
  { text: "", time: 17000, duration: 1000 },
  { text: "✨ 愿你永远快乐！✨", time: 18000, duration: 2000 },
  { text: "🌟 May all your dreams come true! 🌟", time: 20000, duration: 2000 },
];

export const LyricsDisplay = ({ isPlaying, onLyricsEnd, className }: LyricsDisplayProps) => {
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (isPlaying && !startTime) {
      setStartTime(Date.now());
      setCurrentLyricIndex(0);
    } else if (!isPlaying) {
      setStartTime(null);
      setCurrentLyricIndex(-1);
    }
  }, [isPlaying, startTime]);

  useEffect(() => {
    if (!isPlaying || !startTime) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      // Find current lyric
      const currentIndex = lyricsData.findIndex((lyric, index) => {
        const nextLyric = lyricsData[index + 1];
        return elapsed >= lyric.time && (!nextLyric || elapsed < nextLyric.time);
      });

      if (currentIndex !== -1 && currentIndex !== currentLyricIndex) {
        setCurrentLyricIndex(currentIndex);
      }

      // Check if lyrics ended
      if (elapsed > lyricsData[lyricsData.length - 1].time + lyricsData[lyricsData.length - 1].duration) {
        onLyricsEnd?.();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, startTime, currentLyricIndex, onLyricsEnd]);

  if (!isPlaying || currentLyricIndex === -1) {
    return null;
  }

  const currentLyric = lyricsData[currentLyricIndex];
  const previousLyrics = lyricsData.slice(Math.max(0, currentLyricIndex - 2), currentLyricIndex);
  const nextLyrics = lyricsData.slice(currentLyricIndex + 1, currentLyricIndex + 3);

  return (
    <div className={cn(
      "fixed inset-0 flex items-center justify-center pointer-events-none z-40",
      className
    )}>
      <div className="bg-black/60 backdrop-blur-md rounded-3xl p-8 max-w-2xl mx-4 border border-white/20">
        {/* Previous lyrics */}
        <div className="space-y-2 mb-4">
          {previousLyrics.map((lyric, index) => (
            lyric.text && (
              <div
                key={`prev-${index}`}
                className="text-center text-white/40 text-lg transition-all duration-500 transform translate-y-0"
              >
                {lyric.text}
              </div>
            )
          ))}
        </div>

        {/* Current lyric */}
        {currentLyric.text && (
          <div className="text-center mb-4">
            <div className="text-3xl md:text-4xl font-bold gradient-text animate-pulse transform scale-110 transition-all duration-500">
              {currentLyric.text}
            </div>
            {/* Karaoke-style progress bar */}
            <div className="mt-4 w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-party-pink via-party-yellow to-party-blue transition-all duration-100 ease-linear"
                style={{
                  width: `${Math.min(100, ((Date.now() - (startTime || 0) - currentLyric.time) / currentLyric.duration) * 100)}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Next lyrics preview */}
        <div className="space-y-2">
          {nextLyrics.map((lyric, index) => (
            lyric.text && (
              <div
                key={`next-${index}`}
                className="text-center text-white/30 text-sm transition-all duration-500"
              >
                {lyric.text}
              </div>
            )
          ))}
        </div>

        {/* Floating musical notes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl opacity-60 animate-float"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + Math.random()}s`
              }}
            >
              {['🎵', '🎶', '♪', '♫', '🎼', '🎤'][i]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};