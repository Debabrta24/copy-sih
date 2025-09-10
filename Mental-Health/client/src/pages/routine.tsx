import { BackButton } from "@/components/ui/back-button";
import RoutineGenerator from "@/components/wellness/routine-generator";

export default function RoutinePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <BackButton />
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Routine Generator</h1>
        <p className="text-muted-foreground">
          Create personalized daily routines to support your mental wellness and productivity
        </p>
      </div>
      
      <RoutineGenerator />
    </div>
  );
}