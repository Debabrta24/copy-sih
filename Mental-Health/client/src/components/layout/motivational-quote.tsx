import { useState, useEffect } from "react";
import { Quote, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const motivationalQuotes = [
  "You are stronger than you think and more capable than you imagine.",
  "Every small step forward is progress. Keep going.",
  "Your mental health matters. You matter.",
  "It's okay to not be okay. Seeking help is a sign of strength.",
  "You've survived 100% of your difficult days so far. You're doing great.",
  "Self-care isn't selfish. It's necessary.",
  "You are worthy of love, kindness, and compassion - especially from yourself.",
  "Healing isn't linear. Be patient with yourself.",
  "You don't have to be perfect. You just have to be you.",
  "Tomorrow is a fresh start with new possibilities.",
  "Your feelings are valid, and you have the right to feel them.",
  "Progress, not perfection, is what matters.",
  "You are not alone in this journey.",
  "Every breath you take is a victory. Keep breathing.",
  "Your story isn't over yet. Keep writing.",
  "Be gentle with yourself. You're doing the best you can.",
  "Storms don't last forever. Neither do the tough times.",
  "You have the power to create positive changes in your life.",
  "Rest is not a luxury; it's a necessity for your well-being.",
  "You are enough, exactly as you are right now."
];

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
  };

  const refreshQuote = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCurrentQuote(getRandomQuote());
      setIsRefreshing(false);
    }, 300);
  };

  useEffect(() => {
    // Set initial quote on component mount
    setCurrentQuote(getRandomQuote());
    
    // Auto-refresh quote every 30 minutes
    const interval = setInterval(() => {
      setCurrentQuote(getRandomQuote());
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="mx-4 mb-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Quote className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-foreground leading-relaxed italic">
              "{currentQuote}"
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshQuote}
            disabled={isRefreshing}
            className="h-8 w-8 p-0 text-primary hover:text-primary-foreground hover:bg-primary"
            data-testid="button-refresh-quote"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}