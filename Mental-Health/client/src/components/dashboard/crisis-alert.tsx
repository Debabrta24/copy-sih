import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";

export default function CrisisAlert() {
  const { currentUser } = useAppContext();

  const { data: crisisAlerts } = useQuery({
    queryKey: ["/api/crisis/alerts"],
    enabled: !!currentUser?.id,
  });

  const { data: crisisResources } = useQuery({
    queryKey: ["/api/crisis/resources"],
  });

  // Check if user has active crisis alerts or high-risk screening
  const hasActiveCrisis = (crisisAlerts as any)?.some?.((alert: any) => 
    alert.userId === currentUser?.id && !alert.isResolved
  );

  if (!hasActiveCrisis) {
    return null;
  }

  return (
    <div 
      className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6"
      data-testid="alert-crisis"
    >
      <div className="flex items-center space-x-3">
        <AlertTriangle className="text-destructive h-6 w-6" />
        <div className="flex-1">
          <h3 className="text-destructive font-semibold">Immediate Support Available</h3>
          <p className="text-sm text-destructive/80">
            We're here to help. Please consider reaching out to our counselors or calling the crisis helpline: 
            <strong className="ml-1">+91-9876543210</strong>
          </p>
        </div>
        <Button 
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          data-testid="button-get-help"
        >
          Get Help Now
        </Button>
      </div>
    </div>
  );
}
