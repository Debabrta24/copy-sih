import { BackButton } from "@/components/ui/back-button";
import SleepCycleTool from "@/components/wellness/sleep-cycle-tool";

export default function SleepPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <BackButton />
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Sleep Cycle Guide</h1>
        <p className="text-muted-foreground">
          Optimize your sleep schedule for better mental health and academic performance
        </p>
      </div>
      
      <SleepCycleTool />
    </div>
  );
}