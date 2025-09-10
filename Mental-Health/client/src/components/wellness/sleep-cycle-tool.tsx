import { useState } from "react";
import { Moon, Sun, Clock, Lightbulb, ChevronRight, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface SleepQuestion {
  id: string;
  question: string;
  options: { value: string; label: string }[];
}

interface SleepRecommendation {
  bedtime: string;
  wakeTime: string;
  sleepDuration: string;
  recommendations: string[];
  tips: string[];
  schedule: Array<{ time: string; activity: string; icon: string }>;
}

const sleepQuestions: SleepQuestion[] = [
  {
    id: "current-bedtime",
    question: "What time do you usually go to bed?",
    options: [
      { value: "early", label: "9:00 PM - 10:30 PM" },
      { value: "normal", label: "10:30 PM - 12:00 AM" },
      { value: "late", label: "12:00 AM - 2:00 AM" },
      { value: "very-late", label: "After 2:00 AM" }
    ]
  },
  {
    id: "wake-time",
    question: "What time do you need to wake up?",
    options: [
      { value: "very-early", label: "5:00 AM - 6:30 AM" },
      { value: "early", label: "6:30 AM - 8:00 AM" },
      { value: "normal", label: "8:00 AM - 9:30 AM" },
      { value: "late", label: "After 9:30 AM" }
    ]
  },
  {
    id: "sleep-quality",
    question: "How would you rate your current sleep quality?",
    options: [
      { value: "poor", label: "Poor - I often feel tired after sleeping" },
      { value: "fair", label: "Fair - Sometimes I feel rested" },
      { value: "good", label: "Good - I usually feel rested" },
      { value: "excellent", label: "Excellent - I always wake up refreshed" }
    ]
  },
  {
    id: "sleep-issues",
    question: "What's your biggest sleep challenge?",
    options: [
      { value: "falling-asleep", label: "Difficulty falling asleep" },
      { value: "staying-asleep", label: "Waking up during the night" },
      { value: "waking-early", label: "Waking up too early" },
      { value: "feeling-tired", label: "Feeling tired despite adequate sleep" }
    ]
  },
  {
    id: "age-group",
    question: "What's your age group?",
    options: [
      { value: "teen", label: "14-17 years (Need 8-10 hours)" },
      { value: "young-adult", label: "18-25 years (Need 7-9 hours)" },
      { value: "adult", label: "26-64 years (Need 7-9 hours)" },
      { value: "older", label: "65+ years (Need 7-8 hours)" }
    ]
  }
];

export default function SleepCycleTool() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState<SleepRecommendation | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const nextStep = () => {
    if (currentStep < sleepQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      generateRecommendation();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculateOptimalSleep = (wakeTime: string, ageGroup: string) => {
    const sleepHours = ageGroup === "teen" ? 9 : ageGroup === "older" ? 7.5 : 8;
    
    const wakeHours: Record<string, number> = {
      "very-early": 5.75, // 5:45 AM
      "early": 7.25,      // 7:15 AM  
      "normal": 8.75,     // 8:45 AM
      "late": 10          // 10:00 AM
    };

    const wakeHour = wakeHours[wakeTime] || 8;
    const bedtimeHour = wakeHour - sleepHours;
    
    const formatTime = (hour: number) => {
      const adjustedHour = hour < 0 ? hour + 24 : hour;
      const hours = Math.floor(adjustedHour);
      const minutes = Math.round((adjustedHour - hours) * 60);
      const period = hours >= 12 ? "PM" : "AM";
      const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    return {
      bedtime: formatTime(bedtimeHour),
      wakeTime: formatTime(wakeHour),
      duration: `${sleepHours} hours`
    };
  };

  const generateRecommendation = () => {
    const { "wake-time": wakeTime, "age-group": ageGroup, "sleep-quality": quality, "sleep-issues": issues } = answers;
    
    const optimal = calculateOptimalSleep(wakeTime, ageGroup);
    
    const baseRecommendations = [
      "Maintain a consistent sleep schedule, even on weekends",
      "Create a relaxing bedtime routine 30-60 minutes before sleep",
      "Keep your bedroom cool, dark, and quiet",
      "Avoid caffeine 6 hours before bedtime",
      "Limit screen time 1 hour before bed"
    ];

    const issueSpecificTips: Record<string, string[]> = {
      "falling-asleep": [
        "Try progressive muscle relaxation",
        "Practice deep breathing exercises",
        "Use white noise or earplugs",
        "Try reading a book in dim light"
      ],
      "staying-asleep": [
        "Avoid large meals 3 hours before bed",
        "Keep a sleep diary to identify triggers",
        "Consider blackout curtains",
        "Practice meditation before sleep"
      ],
      "waking-early": [
        "Avoid bright lights in the evening",
        "Try a later bedtime gradually",
        "Use an eye mask",
        "Limit afternoon naps"
      ],
      "feeling-tired": [
        "Evaluate your sleep environment",
        "Consider talking to a healthcare provider",
        "Track your sleep patterns",
        "Ensure you're getting enough physical activity"
      ]
    };

    const schedule = [
      { time: "2 hours before bed", activity: "Stop eating large meals", icon: "🍽️" },
      { time: "1 hour before bed", activity: "Start wind-down routine", icon: "📱" },
      { time: "30 minutes before", activity: "Dim lights, relaxing activities", icon: "💡" },
      { time: optimal.bedtime, activity: "Lights out, time to sleep", icon: "🌙" },
      { time: optimal.wakeTime, activity: "Wake up consistently", icon: "☀️" },
      { time: "Within 30 minutes", activity: "Get natural light exposure", icon: "🌅" }
    ];

    setRecommendation({
      bedtime: optimal.bedtime,
      wakeTime: optimal.wakeTime,
      sleepDuration: optimal.duration,
      recommendations: baseRecommendations,
      tips: issueSpecificTips[issues] || issueSpecificTips["falling-asleep"],
      schedule
    });
  };

  const resetForm = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendation(null);
  };

  const currentQuestion = sleepQuestions[currentStep];
  const isLastStep = currentStep === sleepQuestions.length - 1;
  const canProceed = answers[currentQuestion?.id];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-left"
          data-testid="button-sleep-cycle-tool"
        >
          <Moon className="h-5 w-5 mr-3" />
          Sleep Cycle Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Personalized Sleep Cycle Recommendations
          </DialogTitle>
        </DialogHeader>

        {!recommendation ? (
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {sleepQuestions.length}
              </span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${((currentStep + 1) / sleepQuestions.length) * 100}%` }}
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
                {isLastStep ? "Get My Sleep Plan" : "Next"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Sleep schedule summary */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Bed className="h-5 w-5" />
                  Your Optimal Sleep Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{recommendation.bedtime}</div>
                    <div className="text-sm text-muted-foreground">Bedtime</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{recommendation.sleepDuration}</div>
                    <div className="text-sm text-muted-foreground">Sleep Duration</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{recommendation.wakeTime}</div>
                    <div className="text-sm text-muted-foreground">Wake Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Daily Sleep Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendation.schedule.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{item.time}</div>
                        <div className="text-sm text-muted-foreground">{item.activity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* General recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Sleep Hygiene Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendation.recommendations.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">
                        {index + 1}
                      </Badge>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Personalized tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Personalized Tips for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendation.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={resetForm} className="flex-1">
                Create New Plan
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