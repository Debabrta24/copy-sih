import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface BackButtonProps {
  to?: string;
  fallbackTo?: string;
  className?: string;
  children?: React.ReactNode;
}

export function BackButton({ to, fallbackTo = "/", className = "", children = "Back" }: BackButtonProps) {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    // If a specific destination is provided, navigate there
    if (to) {
      setLocation(to);
      return;
    }

    // Try to go back in browser history if there's a history entry and referrer is from same origin
    const sameOriginReferrer = document.referrer && 
      new URL(document.referrer).origin === window.location.origin;
    
    if (window.history.length > 1 && sameOriginReferrer) {
      window.history.back();
    } else {
      // Fallback to specified route if no valid history
      setLocation(fallbackTo);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={`mb-6 ${className}`}
      data-testid="button-back"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {children}
    </Button>
  );
}