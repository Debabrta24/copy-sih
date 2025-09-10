import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown, Plus } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { MoodEntry } from "@/types";

interface MoodTrackerProps {
  moodHistory?: MoodEntry[];
}

const moodIcons = {
  5: { icon: Smile, color: "text-green-500 bg-green-100", label: "Great" },
  4: { icon: Smile, color: "text-green-400 bg-green-50", label: "Good" },
  3: { icon: Meh, color: "text-yellow-500 bg-yellow-100", label: "Okay" },
  2: { icon: Frown, color: "text-orange-500 bg-orange-100", label: "Poor" },
  1: { icon: Frown, color: "text-red-500 bg-red-100", label: "Terrible" },
};

export default function MoodTracker({ moodHistory }: MoodTrackerProps) {
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [localMoodHistory, setLocalMoodHistory] = useState<MoodEntry[]>([]);

  // Load mood history from localStorage on component mount
  useEffect(() => {
    const loadMoodHistory = () => {
      try {
        const stored = localStorage.getItem('moodHistory');
        if (stored) {
          const parsed = JSON.parse(stored);
          const moodsWithDates = parsed.map((mood: any) => ({
            ...mood,
            date: new Date(mood.date)
          }));
          setLocalMoodHistory(moodsWithDates);
        }
      } catch (error) {
        console.error('Error loading mood history:', error);
      }
    };
    
    loadMoodHistory();
  }, []);

  const addMoodMutation = useMutation({
    mutationFn: async (moodData: { moodLevel: number; moodType: string; notes?: string }) => {
      // Use local storage instead of API for mood tracking
      const moodEntry = {
        id: Date.now().toString(),
        userId: currentUser?.id || 'default',
        moodLevel: moodData.moodLevel,
        moodType: moodData.moodType,
        notes: moodData.notes,
        date: new Date()
      };
      
      const existingMoods = JSON.parse(localStorage.getItem('moodHistory') || '[]');
      const updatedMoods = [...existingMoods, moodEntry];
      localStorage.setItem('moodHistory', JSON.stringify(updatedMoods));
      
      return moodEntry;
    },
    onSuccess: () => {
      toast({
        title: "Mood recorded",
        description: "Your mood has been tracked successfully.",
      });
      // Update local state and force re-render
      const stored = localStorage.getItem('moodHistory');
      if (stored) {
        const parsed = JSON.parse(stored);
        const moodsWithDates = parsed.map((mood: any) => ({
          ...mood,
          date: new Date(mood.date)
        }));
        setLocalMoodHistory(moodsWithDates);
      }
    },
    onError: (error) => {
      toast({
        title: "Error", 
        description: "Failed to record mood. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleMoodEntry = (moodLevel: number) => {
    const moodType = moodLevel >= 4 ? "happy" : moodLevel === 3 ? "neutral" : "sad";
    addMoodMutation.mutate({ moodLevel, moodType });
  };

  // Generate last 7 days for display
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const getMoodForDate = (date: Date) => {
    // Use local mood history instead of prop
    const historyToUse = localMoodHistory.length > 0 ? localMoodHistory : (moodHistory || []);
    return historyToUse.find(mood => {
      const moodDate = new Date(mood.date);
      return moodDate.toDateString() === date.toDateString();
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-card-foreground">Recent Mood Check-ins</h4>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80"
            data-testid="button-add-mood"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Entry
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {last7Days.map((date, index) => {
            const mood = getMoodForDate(date);
            const dayName = date.toLocaleDateString('en', { weekday: 'short' });
            
            return (
              <div key={index} className="text-center" data-testid={`mood-day-${index}`}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2">
                  {mood ? (
                    <div className={`w-full h-full rounded-full flex items-center justify-center ${moodIcons[mood.moodLevel as keyof typeof moodIcons].color}`}>
                      {(() => {
                        const MoodIcon = moodIcons[mood.moodLevel as keyof typeof moodIcons].icon;
                        return <MoodIcon className="h-6 w-6" />;
                      })()}
                    </div>
                  ) : index === 6 ? (
                    <div className="w-full h-full bg-border rounded-full flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted transition-colors">
                      <Plus className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-muted/30 rounded-full"></div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{dayName}</div>
              </div>
            );
          })}
        </div>

        {/* Mood Entry Buttons for Today */}
        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground mb-3">How are you feeling today?</p>
          <div className="flex justify-center space-x-2">
            {Object.entries(moodIcons).reverse().map(([level, config]) => (
              <Button
                key={level}
                variant="ghost"
                size="sm"
                onClick={() => handleMoodEntry(parseInt(level))}
                className={`p-2 ${config.color} hover:opacity-80`}
                disabled={addMoodMutation.isPending}
                data-testid={`button-mood-${level}`}
              >
                <config.icon className="h-5 w-5" />
              </Button>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          {localMoodHistory.length > 0
            ? "Your mood has been mostly positive this week. Keep up the good self-care practices!"
            : "Start tracking your mood to get personalized insights and recommendations."}
        </p>
      </CardContent>
    </Card>
  );
}
