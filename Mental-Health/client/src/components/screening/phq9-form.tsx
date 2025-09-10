import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Heart, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ScreeningQuestion, ScreeningResult } from "@/types";

export default function PHQ9Form() {
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<ScreeningResult | null>(null);

  const { data: questionsData } = useQuery({
    queryKey: ["/api/screening/questions/PHQ9"],
  });

  const { data: history } = useQuery({
    queryKey: ["/api/screening/history", currentUser?.id],
    select: (data: any) => data?.filter?.((item: any) => item.type === "PHQ9"),
  });

  const submitMutation = useMutation({
    mutationFn: async (assessmentData: any) => {
      return await apiRequest("POST", "/api/screening/submit", assessmentData);
    },
    onSuccess: (data: any) => {
      setResult(data.result);
      setIsCompleted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/screening/history"] });
      
      toast({
        title: "Assessment completed",
        description: "Your PHQ-9 screening has been saved securely.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const questions = (questionsData as any)?.questions || [];
  const responseOptions = (questionsData as any)?.options || [];
  
  const handleResponseChange = (value: string) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = parseInt(value);
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit assessment
      submitMutation.mutate({
        userId: currentUser?.id,
        type: "PHQ9",
        responses,
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setResponses([]);
    setIsCompleted(false);
    setResult(null);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const canProceed = responses[currentQuestion] !== undefined;

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading assessment questions...</p>
        </CardContent>
      </Card>
    );
  }

  if (isCompleted && result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-secondary">
            <CheckCircle className="h-6 w-6 mr-2" />
            PHQ-9 Assessment Complete
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {result.totalScore}/27
            </div>
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              result.riskLevel === "minimal" ? "bg-green-100 text-green-800" :
              result.riskLevel === "mild" ? "bg-yellow-100 text-yellow-800" :
              result.riskLevel === "moderate" ? "bg-orange-100 text-orange-800" :
              "bg-red-100 text-red-800"
            }`}>
              {result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1)} Depression Symptoms
            </div>
          </div>

          <div>
            <h4 className="font-medium text-card-foreground mb-3">Recommendations:</h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {result.isHighRisk && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-destructive font-medium">
                Your responses suggest you may benefit from professional support. 
                Please consider speaking with a counselor or mental health professional.
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <Button onClick={handleRestart} variant="outline" data-testid="button-retake-assessment">
              Take Again
            </Button>
            <Button data-testid="button-book-counseling">
              Book Counseling Session
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Heart className="text-primary h-6 w-6" />
          </div>
          <div>
            <CardTitle>PHQ-9 Depression Screening</CardTitle>
            <p className="text-sm text-muted-foreground">
              Over the last 2 weeks, how often have you been bothered by the following?
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="text-center text-muted-foreground text-sm">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-card-foreground">
            {questions[currentQuestion]?.text}
          </h3>

          <RadioGroup
            value={responses[currentQuestion]?.toString() || ""}
            onValueChange={handleResponseChange}
          >
            <div className="grid grid-cols-1 gap-3">
              {responseOptions.map((option: any) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`option-${option.value}`}
                    data-testid={`radio-option-${option.value}`}
                  />
                  <Label
                    htmlFor={`option-${option.value}`}
                    className="flex-1 cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            data-testid="button-previous"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed || submitMutation.isPending}
            data-testid="button-next"
          >
            {currentQuestion === questions.length - 1 ? (
              submitMutation.isPending ? "Submitting..." : "Complete Assessment"
            ) : (
              <>
                Next Question
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
