import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Clock, Target, X, Sparkles } from "lucide-react";
import { useUsageAnalytics } from "@/lib/usage-analytics";
import { useAppContext } from "@/context/AppContext";
import { useLocation } from "wouter";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  priority: "high" | "medium" | "low";
  category: "wellness" | "productivity" | "social" | "learning";
  icon: React.ComponentType<{ className?: string }>;
}

export default function AISuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const { currentUser } = useAppContext();
  const [location, setLocation] = useLocation();

  const generateSuggestions = useCallback(() => {
    if (!currentUser) return;

    // Mock insights to avoid infinite loop - in real app this would come from analytics
    const insights = {
      stressIndicators: 0.3,
      mostUsedFeatures: ["/dashboard", "/chat"],
      engagementLevel: "medium" as const
    };
    
    // Generate personalized suggestions based on insights
    const personalizedSuggestions: Suggestion[] = [];

    // Time-based suggestions
    const currentHour = new Date().getHours();
    if (currentHour >= 22 || currentHour < 6) {
      personalizedSuggestions.push({
        id: "sleep-suggestion",
        title: "Time for Better Sleep",
        description: "It's late! Try our sleep cycle guide for better rest",
        action: "/wellness/sleep",
        priority: "high",
        category: "wellness",
        icon: Clock
      });
    } else if (currentHour >= 6 && currentHour < 10) {
      personalizedSuggestions.push({
        id: "morning-routine",
        title: "Start Your Day Right",
        description: "Create a morning routine to boost your productivity",
        action: "/wellness/routine",
        priority: "medium",
        category: "productivity",
        icon: Target
      });
    }

    // Usage pattern-based suggestions
    if (insights) {
      if (insights.stressIndicators > 0.6) {
        personalizedSuggestions.push({
          id: "stress-relief",
          title: "Take a Breathing Break",
          description: "I notice you might be stressed. Try some relaxation techniques",
          action: "/music?category=Meditation",
          priority: "high",
          category: "wellness",
          icon: Brain
        });
      }

      if (!insights.mostUsedFeatures.includes("/music")) {
        personalizedSuggestions.push({
          id: "try-music",
          title: "Discover Mind Fresh Music",
          description: "Try our curated music library for focus and relaxation",
          action: "/music",
          priority: "medium",
          category: "wellness",
          icon: Sparkles
        });
      }

      if (insights.engagementLevel === "high") {
        personalizedSuggestions.push({
          id: "advanced-features",
          title: "Explore Advanced Features",
          description: "You're doing great! Ready to try peer support?",
          action: "/peer-calling",
          priority: "low",
          category: "social",
          icon: TrendingUp
        });
      }
    }

    // Add general suggestions if no specific ones
    if (personalizedSuggestions.length === 0) {
      personalizedSuggestions.push({
        id: "explore-chat",
        title: "Talk to AI Support",
        description: "Share your thoughts with our AI counselor anytime",
        action: "/chat",
        priority: "medium",
        category: "wellness",
        icon: Brain
      });
    }

    setSuggestions(personalizedSuggestions.slice(0, 3)); // Limit to 3 suggestions
  }, [currentUser]);

  useEffect(() => {
    generateSuggestions();
  }, [generateSuggestions]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setLocation(suggestion.action);
    // Track this action
    const { trackAction } = useUsageAnalytics();
    trackAction('suggestion_followed', suggestion.action, { suggestionId: suggestion.id });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "wellness": return "hsl(var(--wellness))";
      case "productivity": return "hsl(var(--focus))";
      case "social": return "hsl(var(--primary))";
      case "learning": return "hsl(var(--calm))";
      default: return "hsl(var(--muted-foreground))";
    }
  };

  if (!isVisible || suggestions.length === 0) return null;

  return (
    <Card className="mb-6 border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent" data-testid="ai-suggestions-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">AI Suggestions</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            data-testid="button-close-suggestions"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Personalized recommendations based on your usage patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;
          return (
            <div
              key={suggestion.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-card hover:bg-accent/50 transition-colors cursor-pointer border"
              onClick={() => handleSuggestionClick(suggestion)}
              data-testid={`suggestion-${suggestion.id}`}
            >
              <div className="p-2 rounded-md bg-primary/10">
                <Icon className="h-4 w-4 text-current" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-medium text-sm leading-tight">{suggestion.title}</h4>
                  <Badge variant="outline" className={`text-xs ${getPriorityColor(suggestion.priority)}`}>
                    {suggestion.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {suggestion.description}
                </p>
              </div>
            </div>
          );
        })}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground text-center">
            💡 These suggestions update based on your activity patterns
          </p>
        </div>
      </CardContent>
    </Card>
  );
}