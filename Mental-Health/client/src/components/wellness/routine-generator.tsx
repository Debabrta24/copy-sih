import { useState } from "react";
import { Calendar, Clock, Moon, Sun, Heart, Brain, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface RoutineQuestion {
  id: string;
  question: string;
  options: { value: string; label: string }[];
}

interface GeneratedRoutine {
  morning: string[];
  afternoon: string[];
  evening: string[];
  nighttime: string[];
}

const routineQuestions: RoutineQuestion[] = [
  {
    id: "wake-time",
    question: "What time do you usually wake up?",
    options: [
      { value: "early", label: "6:00 AM - 8:00 AM (Early Bird)" },
      { value: "normal", label: "8:00 AM - 10:00 AM (Regular)" },
      { value: "late", label: "10:00 AM - 12:00 PM (Night Owl)" }
    ]
  },
  {
    id: "energy-level",
    question: "When do you feel most energetic?",
    options: [
      { value: "morning", label: "Morning - I'm a morning person" },
      { value: "afternoon", label: "Afternoon - I peak around midday" },
      { value: "evening", label: "Evening - I'm more active at night" }
    ]
  },
  {
    id: "stress-level",
    question: "How would you rate your current stress level?",
    options: [
      { value: "low", label: "Low - I feel pretty relaxed" },
      { value: "moderate", label: "Moderate - Some stress but manageable" },
      { value: "high", label: "High - I feel overwhelmed often" }
    ]
  },
  {
    id: "goals",
    question: "What's your main wellness goal?",
    options: [
      { value: "stress", label: "Reduce stress and anxiety" },
      { value: "productivity", label: "Improve focus and productivity" },
      { value: "sleep", label: "Better sleep quality" },
      { value: "mood", label: "Boost mood and emotional well-being" }
    ]
  },
  {
    id: "time-availability",
    question: "How much time can you dedicate daily to wellness activities?",
    options: [
      { value: "minimal", label: "15-30 minutes (I'm very busy)" },
      { value: "moderate", label: "30-60 minutes (I can make some time)" },
      { value: "generous", label: "60+ minutes (I can prioritize wellness)" }
    ]
  }
];

export default function RoutineGenerator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generatedRoutine, setGeneratedRoutine] = useState<GeneratedRoutine | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const nextStep = () => {
    if (currentStep < routineQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      generateRoutine();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const generateRoutine = () => {
    const { "wake-time": wakeTime, "energy-level": energy, "stress-level": stress, goals, "time-availability": timeAvail } = answers;
    
    const routines: Record<string, GeneratedRoutine> = {
      // Early bird routines
      "early-morning-low-stress": {
        morning: ["5-minute breathing exercise", "Light stretching", "Gratitude journaling", "Healthy breakfast"],
        afternoon: ["10-minute mindful walk", "Deep breathing break", "Healthy lunch"],
        evening: ["Gentle yoga", "Reflection time", "Prepare for tomorrow"],
        nighttime: ["Reading", "Herbal tea", "Sleep meditation"]
      },
      "early-afternoon-moderate-stress": {
        morning: ["Morning meditation (10 min)", "Exercise routine", "Positive affirmations", "Nutritious breakfast"],
        afternoon: ["Stress-relief breathing", "Mindful lunch break", "Progressive muscle relaxation"],
        evening: ["Evening walk", "Journal writing", "Gentle stretching"],
        nighttime: ["Relaxing bath", "Calming music", "Sleep preparation ritual"]
      },
      // Default comprehensive routine
      default: {
        morning: ["Wake up mindfully", "5-minute meditation", "Light exercise or stretching", "Healthy breakfast", "Set daily intentions"],
        afternoon: ["Mindful lunch break", "10-minute walk", "Breathing exercise", "Hydration check"],
        evening: ["Reflect on the day", "Gentle yoga or stretching", "Digital detox time", "Prepare for tomorrow"],
        nighttime: ["Reading or calm activity", "Sleep hygiene routine", "Gratitude practice", "Deep breathing for sleep"]
      }
    };

    // Customize routine based on answers
    let selectedRoutine = routines.default;
    
    if (goals === "stress" && stress === "high") {
      selectedRoutine = {
        morning: ["10-minute breathing meditation", "Gentle stretching", "Stress-relief affirmations", "Calming breakfast ritual"],
        afternoon: ["Mindfulness break", "Progressive muscle relaxation", "Stress-busting walk", "Healthy snack"],
        evening: ["Stress journal writing", "Calming tea ceremony", "Gentle yoga", "Evening reflection"],
        nighttime: ["Guided relaxation", "Sleep meditation", "Aromatherapy", "Deep breathing exercises"]
      };
    } else if (goals === "productivity") {
      selectedRoutine = {
        morning: ["Morning meditation", "Energy-boosting exercise", "Goal setting", "Brain-healthy breakfast"],
        afternoon: ["Focused breathing", "Power walk", "Mindful eating", "Mental clarity break"],
        evening: ["Review accomplishments", "Light exercise", "Tomorrow's planning", "Relaxation time"],
        nighttime: ["Reading", "Mental wind-down", "Sleep preparation", "Gratitude practice"]
      };
    } else if (goals === "sleep") {
      selectedRoutine = {
        morning: ["Gentle wake-up routine", "Light exposure", "Mindful breakfast", "Energy-setting intentions"],
        afternoon: ["Avoid late caffeine", "Afternoon walk", "Light meal", "Relaxation practice"],
        evening: ["Digital sunset (no screens)", "Calming activities", "Bedroom preparation", "Dim lighting"],
        nighttime: ["Sleep hygiene routine", "Relaxation techniques", "Cool room setup", "Deep sleep meditation"]
      };
    }

    // Adjust for time availability
    if (timeAvail === "minimal") {
      selectedRoutine = {
        morning: selectedRoutine.morning.slice(0, 2),
        afternoon: selectedRoutine.afternoon.slice(0, 2),
        evening: selectedRoutine.evening.slice(0, 2),
        nighttime: selectedRoutine.nighttime.slice(0, 2)
      };
    }

    setGeneratedRoutine(selectedRoutine);
  };

  const resetForm = () => {
    setCurrentStep(0);
    setAnswers({});
    setGeneratedRoutine(null);
  };

  const currentQuestion = routineQuestions[currentStep];
  const isLastStep = currentStep === routineQuestions.length - 1;
  const canProceed = answers[currentQuestion?.id];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-left"
          data-testid="button-routine-generator"
        >
          <Calendar className="h-5 w-5 mr-3" />
          Routine Generator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Personal Wellness Routine Generator
          </DialogTitle>
        </DialogHeader>

        {!generatedRoutine ? (
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {routineQuestions.length}
              </span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${((currentStep + 1) / routineQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current question */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[currentQuestion.id] || ""}
                  onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
                >
                  {currentQuestion.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Navigation buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                onClick={nextStep}
                disabled={!canProceed}
                className="flex items-center gap-2"
              >
                {isLastStep ? "Generate Routine" : "Next"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Your Personalized Wellness Routine</h3>
              <p className="text-sm text-muted-foreground">
                Here's a routine tailored to your preferences and goals
              </p>
            </div>

            <div className="grid gap-4">
              {[
                { key: "morning", title: "Morning", icon: Sun, color: "text-orange-500" },
                { key: "afternoon", title: "Afternoon", icon: Sun, color: "text-yellow-500" },
                { key: "evening", title: "Evening", icon: Moon, color: "text-blue-500" },
                { key: "nighttime", title: "Night", icon: Moon, color: "text-purple-500" }
              ].map(({ key, title, icon: Icon, color }) => (
                <Card key={key}>
                  <CardHeader className="pb-3">
                    <CardTitle className={`text-base flex items-center gap-2 ${color}`}>
                      <Icon className="h-4 w-4" />
                      {title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {generatedRoutine[key as keyof GeneratedRoutine].map((activity, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Heart className="h-3 w-3 text-primary" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={resetForm} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Create New Routine
              </Button>
              <Button onClick={() => setIsOpen(false)} className="flex-1">
                Save & Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}