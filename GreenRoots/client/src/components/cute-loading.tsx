import { useEffect, useState } from "react";
import { Leaf, Sparkles, Heart } from "lucide-react";

interface CuteLoadingProps {
  onComplete: () => void;
  duration?: number;
}

export function CuteLoading({ onComplete, duration = 3000 }: CuteLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  const loadingMessages = [
    "🌱 Preparing your medicine garden...",
    "🔍 Finding the best remedies...",
    "🌿 Gathering organic solutions...",
    "✨ Almost ready!"
  ];

  const hearts = Array.from({ length: 6 }, (_, i) => i);
  const sparkles = Array.from({ length: 8 }, (_, i) => i);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 200);
          return 100;
        }
        return prev + (100 / (duration / 50));
      });
    }, 50);

    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % loadingMessages.length);
    }, duration / 4);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [duration, onComplete, loadingMessages.length]);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950 dark:via-blue-950 dark:to-purple-950 backdrop-blur-sm z-[9999] flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Hearts */}
        {hearts.map((heart) => (
          <Heart
            key={`heart-${heart}`}
            className={`absolute text-pink-300 dark:text-pink-600 animate-pulse
              ${heart % 2 === 0 ? 'animate-bounce' : 'animate-pulse'}
            `}
            size={20 + (heart * 4)}
            style={{
              left: `${10 + (heart * 15)}%`,
              top: `${20 + (heart * 10)}%`,
              animationDelay: `${heart * 0.3}s`,
              animationDuration: `${2 + (heart * 0.2)}s`,
            }}
          />
        ))}

        {/* Floating Sparkles */}
        {sparkles.map((sparkle) => (
          <Sparkles
            key={`sparkle-${sparkle}`}
            className="absolute text-yellow-400 dark:text-yellow-500 animate-spin"
            size={16 + (sparkle * 2)}
            style={{
              left: `${15 + (sparkle * 10)}%`,
              top: `${15 + (sparkle * 12)}%`,
              animationDelay: `${sparkle * 0.4}s`,
              animationDuration: `${3 + (sparkle * 0.1)}s`,
            }}
          />
        ))}
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center space-y-8">
        {/* Animated Logo */}
        <div className="relative">
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <Leaf 
                className="w-20 h-20 text-green-500 dark:text-green-400 animate-pulse transform transition-transform duration-1000"
                style={{
                  transform: `rotate(${progress * 3.6}deg) scale(${1 + (progress / 200)})`,
                }}
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
            </div>
            <div className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-green-400 dark:via-blue-400 dark:to-purple-400">
                AgreeGrow
              </span>
            </div>
          </div>
          
          {/* Cute orbiting elements */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
            <div className="w-32 h-32 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-400 rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full"></div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-pink-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-80 bg-white/20 dark:bg-black/20 rounded-full h-4 backdrop-blur-sm shadow-inner overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-white/50 animate-slide"></div>
          </div>
        </div>

        {/* Loading Messages */}
        <div className="space-y-2">
          <p className="text-2xl font-semibold text-green-700 dark:text-green-300 animate-bounce">
            {loadingMessages[currentMessage]}
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {Math.round(progress)}% Complete
          </p>
        </div>

        {/* Cute Dancing Elements */}
        <div className="flex justify-center space-x-4 mt-6">
          <div className="w-4 h-4 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

    </div>
  );
}