import { useState } from "react";
import { Plus, MessageCircle, Heart, Calendar, Users, Phone, X, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  action: () => void;
  color: string;
  urgent?: boolean;
}

export default function QuickActionsFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();

  const quickActions: QuickAction[] = [
    {
      id: "chat",
      label: "AI Support Chat",
      icon: MessageCircle,
      action: () => {
        setLocation("/chat");
        setIsOpen(false);
      },
      color: "bg-primary hover:bg-primary/90 text-primary-foreground",
    },
    {
      id: "screening",
      label: "Mental Health Screening",
      icon: Heart,
      action: () => {
        setLocation("/screening");
        setIsOpen(false);
      },
      color: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
    },
    {
      id: "peer-calling",
      label: "Peer Calling",
      icon: Video,
      action: () => {
        setLocation("/peer-calling");
        setIsOpen(false);
      },
      color: "bg-green-600 hover:bg-green-700 text-white",
    },
    {
      id: "community",
      label: "Peer Support",
      icon: Users,
      action: () => {
        setLocation("/community");
        setIsOpen(false);
      },
      color: "bg-accent hover:bg-accent/90 text-accent-foreground",
    },
    {
      id: "crisis",
      label: "Crisis Helpline",
      icon: Phone,
      action: () => {
        // In a real app, this would open crisis resources or dial emergency
        window.open("tel:988", "_self"); // Mental Health Crisis Lifeline
        setIsOpen(false);
      },
      color: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
      urgent: true,
    },
  ];

  const toggleFAB = () => {
    setIsOpen(!isOpen);
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50">
        {/* Quick Action Buttons */}
        <div className={cn(
          "flex flex-col-reverse space-y-3 space-y-reverse mb-3 transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}>
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Tooltip key={action.id}>
                <TooltipTrigger asChild>
                  <Button
                    size="lg"
                    className={cn(
                      "w-14 h-14 rounded-full shadow-lg transition-all duration-200 delay-[${index * 50}ms]",
                      action.color,
                      action.urgent && "animate-pulse"
                    )}
                    onClick={action.action}
                    data-testid={`fab-action-${action.id}`}
                  >
                    <IconComponent className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="mr-2">
                  <p>{action.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Main FAB Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="lg"
              className={cn(
                "w-16 h-16 rounded-full shadow-lg transition-all duration-300 ease-in-out",
                "bg-primary hover:bg-primary/90 text-primary-foreground",
                isOpen && "rotate-45"
              )}
              onClick={toggleFAB}
              data-testid="fab-main-button"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Plus className="h-6 w-6" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="mr-2">
            <p>{isOpen ? "Close quick actions" : "Quick actions"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Background overlay for mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/20 -z-10 md:hidden"
            onClick={() => setIsOpen(false)}
            data-testid="fab-overlay"
          />
        )}
      </div>
    </TooltipProvider>
  );
}