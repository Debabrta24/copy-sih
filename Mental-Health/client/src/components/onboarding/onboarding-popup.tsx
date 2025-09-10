import { useState } from "react";
import { User, GraduationCap, Heart, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

interface OnboardingData {
  firstName: string;
  lastName: string;
  institution: string;
  course: string;
  year: number;
  language: string;
  // Screening questions
  mood: string;
  stress: string;
  sleep: string;
  support: string;
  previousHelp: string;
}

interface OnboardingPopupProps {
  isOpen: boolean;
  onComplete: (data: OnboardingData) => void;
}

export default function OnboardingPopup({ isOpen, onComplete }: OnboardingPopupProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    institution: "",
    course: "",
    year: 1,
    language: "en",
    mood: "",
    stress: "",
    sleep: "",
    support: "",
    previousHelp: "",
  });
  const { toast } = useToast();

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step === 1) {
      if (!data.firstName || !data.lastName) {
        toast({
          title: "Missing information",
          description: "Please enter your first and last name",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 2) {
      if (!data.institution || !data.course) {
        toast({
          title: "Missing information", 
          description: "Please complete your academic information",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    if (!data.mood || !data.stress || !data.sleep) {
      toast({
        title: "Missing information",
        description: "Please answer all screening questions",
        variant: "destructive",
      });
      return;
    }
    
    onComplete(data);
  };

  const updateData = (field: keyof OnboardingData, value: string | number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Welcome! Let's get you started
          </DialogTitle>
          <DialogDescription>
            We need some information to personalize your experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={data.firstName}
                      onChange={(e) => updateData("firstName", e.target.value)}
                      data-testid="input-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      value={data.lastName}
                      onChange={(e) => updateData("lastName", e.target.value)}
                      data-testid="input-last-name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Language</Label>
                  <Select value={data.language} onValueChange={(value) => updateData("language", value)}>
                    <SelectTrigger data-testid="select-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                      <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Academic Information */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    placeholder="e.g., IIT Delhi, Delhi University"
                    value={data.institution}
                    onChange={(e) => updateData("institution", e.target.value)}
                    data-testid="input-institution"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Course/Major</Label>
                  <Input
                    id="course"
                    placeholder="e.g., Computer Science, Psychology"
                    value={data.course}
                    onChange={(e) => updateData("course", e.target.value)}
                    data-testid="input-course"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Year of Study</Label>
                  <Select value={data.year.toString()} onValueChange={(value) => updateData("year", parseInt(value))}>
                    <SelectTrigger data-testid="select-year">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                      <SelectItem value="5">5th Year</SelectItem>
                      <SelectItem value="6">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Initial Screening Questions */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Quick Wellness Check
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  These questions help us understand how to best support you
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">How has your mood been lately?</Label>
                  <RadioGroup value={data.mood} onValueChange={(value) => updateData("mood", value)}>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excellent" id="mood-excellent" />
                        <Label htmlFor="mood-excellent" className="text-sm">Excellent</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="good" id="mood-good" />
                        <Label htmlFor="mood-good" className="text-sm">Good</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fair" id="mood-fair" />
                        <Label htmlFor="mood-fair" className="text-sm">Fair</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="poor" id="mood-poor" />
                        <Label htmlFor="mood-poor" className="text-sm">Poor</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">How would you rate your current stress level?</Label>
                  <RadioGroup value={data.stress} onValueChange={(value) => updateData("stress", value)}>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="stress-low" />
                        <Label htmlFor="stress-low" className="text-sm">Low</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="stress-moderate" />
                        <Label htmlFor="stress-moderate" className="text-sm">Moderate</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high" id="stress-high" />
                        <Label htmlFor="stress-high" className="text-sm">High</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="very-high" id="stress-very-high" />
                        <Label htmlFor="stress-very-high" className="text-sm">Very High</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">How has your sleep been?</Label>
                  <RadioGroup value={data.sleep} onValueChange={(value) => updateData("sleep", value)}>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excellent" id="sleep-excellent" />
                        <Label htmlFor="sleep-excellent" className="text-sm">Excellent</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="good" id="sleep-good" />
                        <Label htmlFor="sleep-good" className="text-sm">Good</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fair" id="sleep-fair" />
                        <Label htmlFor="sleep-fair" className="text-sm">Fair</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="poor" id="sleep-poor" />
                        <Label htmlFor="sleep-poor" className="text-sm">Poor</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Have you sought mental health support before?</Label>
                  <RadioGroup value={data.previousHelp} onValueChange={(value) => updateData("previousHelp", value)}>
                    <div className="grid grid-cols-1 gap-2 sm:gap-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="help-yes" />
                        <Label htmlFor="help-yes" className="text-sm">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="help-no" />
                        <Label htmlFor="help-no" className="text-sm">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="prefer-not-to-say" id="help-prefer-not" />
                        <Label htmlFor="help-prefer-not" className="text-sm">Prefer not to say</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={step === 1}
              data-testid="button-previous"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {step < totalSteps ? (
              <Button onClick={handleNext} data-testid="button-next">
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} data-testid="button-complete">
                Complete Setup
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}