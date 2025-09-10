import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import AISuggestions from "@/components/ai-suggestions";
import CrisisAlert from "@/components/dashboard/crisis-alert";
import MoodTracker from "@/components/dashboard/mood-tracker";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Calendar, Users, ArrowRight, Phone, Shield } from "lucide-react";
import { useLocation } from "wouter";

interface DashboardStats {
  recentActivities: Array<{
    id: string;
    title: string;
    timestamp: string;
    result?: string;
    duration?: string;
    type: "screening" | "chat" | "appointment";
  }>;
  nextAppointment?: {
    date: string;
    time: string;
    counselor: string;
  };
}

export default function Dashboard() {
  const { currentUser } = useAppContext();
  const [, setLocation] = useLocation();

  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics"],
    enabled: currentUser?.isAdmin || false,
  });

  const { data: userAppointments } = useQuery({
    queryKey: ["/api/appointments/user", currentUser?.id],
    enabled: !!currentUser?.id,
  });

  const { data: screeningHistory } = useQuery({
    queryKey: ["/api/screening/history", currentUser?.id],
    enabled: !!currentUser?.id,
  });

  const { data: moodHistory } = useQuery({
    queryKey: ["/api/mood/history", currentUser?.id],
    enabled: !!currentUser?.id,
  });

  const { data: crisisResources } = useQuery({
    queryKey: ["/api/crisis/resources"],
  });

  const recentActivities = [
    {
      id: "1",
      title: "Completed GAD-7 Screening",
      timestamp: "2 hours ago",
      result: "Low Risk",
      type: "screening" as const,
    },
    {
      id: "2",
      title: "Chat Session with AI",
      timestamp: "Yesterday",
      duration: "15 min",
      type: "chat" as const,
    },
    {
      id: "3",
      title: "Scheduled Counseling Session",
      timestamp: "Tomorrow, 2:00 PM",
      result: "Upcoming",
      type: "appointment" as const,
    },
  ];

  const quickActions = [
    {
      icon: Brain,
      title: "AI Support Chat",
      description: "Get instant support and coping strategies",
      action: () => setLocation("/chat"),
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Heart,
      title: "Wellness Screening",
      description: "Check your mental health with PHQ-9 & GAD-7",
      action: () => setLocation("/screening"),
      color: "bg-secondary/10 text-secondary",
    },
    {
      icon: Calendar,
      title: "Book Counseling",
      description: "Schedule confidential sessions",
      action: () => setLocation("/chat"), // Would open booking modal
      color: "bg-accent/10 text-accent",
    },
    {
      icon: Users,
      title: "Peer Support",
      description: "Connect with fellow students anonymously",
      action: () => setLocation("/community"),
      color: "bg-chart-4/10 text-chart-4",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CrisisAlert />

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-primary-foreground mb-8">
        <h2 className="text-3xl font-bold mb-2">
          Welcome back, {currentUser?.firstName || "Student"}
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-4">
          How are you feeling today? Remember, taking care of your mental health is just as important as your physical health.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => setLocation("/chat")}
            className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
            data-testid="button-start-chat"
          >
            <Brain className="mr-2 h-4 w-4" />
            Talk to AI Helper
          </Button>
          <Button
            onClick={() => setLocation("/screening")}
            className="bg-white/90 hover:bg-white text-primary border-0"
            data-testid="button-start-screening"
          >
            <Heart className="mr-2 h-4 w-4" />
            Quick Wellness Check
          </Button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <Card
            key={index}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={action.action}
            data-testid={`card-action-${index}`}
          >
            <CardContent className="p-6">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${action.color}`}>
                <action.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-card-foreground mb-2">{action.title}</h3>
              <p className="text-muted-foreground text-sm">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Insights */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold text-card-foreground mb-6">Your Wellness Journey</h3>
          
          {/* Mood Tracking */}
          <MoodTracker moodHistory={moodHistory as any} />

          {/* Recent Activities */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h4 className="text-lg font-medium text-card-foreground mb-4">Recent Activities</h4>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg"
                    data-testid={`activity-${activity.id}`}
                  >
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      {activity.type === "screening" && <Heart className="h-5 w-5 text-secondary" />}
                      {activity.type === "chat" && <Brain className="h-5 w-5 text-primary" />}
                      {activity.type === "appointment" && <Calendar className="h-5 w-5 text-accent" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                    <div className="text-sm font-medium text-secondary">
                      {activity.result || activity.duration}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          {/* AI-Powered Suggestions */}
          <AISuggestions />
          
          {/* Today's Recommendations */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h4 className="text-lg font-medium text-card-foreground mb-4">Recommended for You</h4>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg border">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-secondary rounded-full" />
                    </div>
                    <span className="text-sm font-medium text-card-foreground">5-Minute Breathing Exercise</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Perfect for exam stress relief</p>
                  <Button 
                    size="sm" 
                    className="w-full" 
                    onClick={() => setLocation("/chat")}
                    data-testid="button-breathing-exercise"
                  >
                    Start Exercise
                  </Button>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg border">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full" />
                    </div>
                    <span className="text-sm font-medium text-card-foreground">Sleep Hygiene Guide</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Improve your sleep quality</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setLocation("/resources")}
                    data-testid="button-sleep-guide"
                  >
                    Read Guide
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crisis Resources */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-6">
              <h4 className="text-lg font-medium text-destructive mb-4">
                <Phone className="inline mr-2 h-5 w-5" />
                Crisis Support
              </h4>
              <div className="space-y-3">
                {(crisisResources as any)?.immediateHelp?.slice(0, 3).map((resource: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-destructive/80">{resource.name}</span>
                    <a 
                      href={`tel:${resource.phone}`} 
                      className="text-sm font-medium text-destructive hover:underline"
                      data-testid={`link-crisis-${index}`}
                    >
                      Call Now
                    </a>
                  </div>
                ))}
              </div>
              <p className="text-xs text-destructive/60 mt-4">
                <Shield className="inline mr-1 h-3 w-3" />
                All conversations are completely confidential
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
