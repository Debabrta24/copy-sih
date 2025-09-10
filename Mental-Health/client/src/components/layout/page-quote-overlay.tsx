import { useState, useEffect } from "react";
import { Quote, Sparkles } from "lucide-react";

const inspirationalQuotes = [
  "Every moment is a fresh beginning.",
  "You are braver than you believe.",
  "Progress, not perfection.",
  "Your potential is endless.",
  "Today is full of possibilities.",
  "You are stronger than you know.",
  "Believe in your journey.",
  "Small steps lead to big changes.",
  "You are enough, just as you are.",
  "Keep going, you're doing great.",
  "Your story matters.",
  "Embrace the journey ahead.",
  "You have the power to overcome.",
  "Every challenge makes you stronger.",
  "Focus on what you can control.",
  "You are worthy of good things.",
  "Trust the process.",
  "Your resilience is inspiring.",
  "Tomorrow brings new hope.",
  "You are capable of amazing things."
];

interface PageQuoteOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
}

export default function PageQuoteOverlay({ isVisible, onComplete }: PageQuoteOverlayProps) {
  const [currentQuote, setCurrentQuote] = useState("");

  useEffect(() => {
    console.log("PageQuoteOverlay isVisible:", isVisible); // Debug log
    if (isVisible) {
      // Select a random quote when overlay becomes visible
      const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
      setCurrentQuote(randomQuote);
      console.log("Selected quote:", randomQuote); // Debug log

      // Auto-hide after 1.5 seconds
      const timer = setTimeout(() => {
        console.log("Auto-hiding overlay"); // Debug log
        onComplete();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="max-w-md mx-4 p-8 bg-card border border-border rounded-2xl shadow-lg">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping" />
            </div>
          </div>
          
          <div className="space-y-3">
            <Quote className="h-5 w-5 text-primary mx-auto" />
            <p className="text-lg font-medium text-foreground leading-relaxed">
              "{currentQuote}"
            </p>
          </div>
          
          <div className="h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}