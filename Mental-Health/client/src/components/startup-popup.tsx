import { useState } from "react";
import { Brain, Heart, Users, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StartupPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StartupPopup({ isOpen, onClose }: StartupPopupProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Brain,
      title: "Welcome to Apnamann",
      subtitle: "Mental Health Support Platform",
      description: "Your comprehensive mental health support platform designed specifically for Indian college students.",
      color: "text-blue-500"
    },
    {
      icon: Heart,
      title: "AI-Powered Support",
      subtitle: "24/7 Mental Health Assistance",
      description: "Get instant psychological first aid and support through our AI chatbot, available whenever you need it.",
      color: "text-red-500"
    },
    {
      icon: Users,
      title: "Community & Counselors",
      subtitle: "Connect with Peers & Professionals",
      description: "Join peer support forums and book appointments with qualified counselors for personalized care.",
      color: "text-green-500"
    },
    {
      icon: Shield,
      title: "Safe & Confidential",
      subtitle: "Your Privacy is Our Priority",
      description: "All conversations and data are confidential, encrypted, and follow strict privacy guidelines.",
      color: "text-purple-500"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = slides[currentSlide];
  const IconComponent = currentSlideData.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <IconComponent className={`h-6 w-6 mr-2 ${currentSlideData.color}`} />
            {currentSlideData.title}
          </DialogTitle>
          <DialogDescription className="text-lg font-medium">
            {currentSlideData.subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="border-2">
            <CardHeader className="pb-4">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-muted ${currentSlideData.color}`}>
                <IconComponent className="h-8 w-8 text-background" />
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground leading-relaxed">
                {currentSlideData.description}
              </p>
            </CardContent>
          </Card>

          {/* Progress indicators */}
          <div className="flex items-center justify-center space-x-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSlide === 0}
              data-testid="button-previous-slide"
            >
              Previous
            </Button>

            {currentSlide < slides.length - 1 ? (
              <Button onClick={handleNext} data-testid="button-next-slide">
                Next
              </Button>
            ) : (
              <Button onClick={onClose} data-testid="button-get-started">
                Get Started
              </Button>
            )}
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Step {currentSlide + 1} of {slides.length}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}