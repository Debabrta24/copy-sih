import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  ClipboardCheck, 
  Calendar, 
  AlertTriangle,
  TrendingUp,
  Clock,
  Activity,
  BarChart3
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { BackButton } from "@/components/ui/back-button";

export default function Admin() {
  const { currentUser } = useAppContext();
  
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/analytics"],
    enabled: currentUser?.isAdmin || false,
  });

  const { data: crisisAlerts } = useQuery({
    queryKey: ["/api/crisis/alerts"],
    enabled: currentUser?.isAdmin || false,
  });

  if (!currentUser?.isAdmin) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-card-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access the admin dashboard.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  const riskDistribution = (analytics as any)?.riskDistribution || [];
  const totalScreenings = riskDistribution.reduce((sum: number, item: any) => sum + item.count, 0);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Mental Health Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Anonymized insights for institutional decision-making
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="text-primary h-6 w-6" />
              <div>
                <p className="text-2xl font-bold text-card-foreground" data-testid="metric-active-users">
                  {(analytics as any)?.activeUsers?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
            <p className="text-xs text-secondary">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-2">
              <ClipboardCheck className="text-secondary h-6 w-6" />
              <div>
                <p className="text-2xl font-bold text-card-foreground" data-testid="metric-screenings">
                  {(analytics as any)?.screeningsCompleted?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-muted-foreground">Screenings This Month</p>
              </div>
            </div>
            <p className="text-xs text-accent">+18% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className="text-accent h-6 w-6" />
              <div>
                <p className="text-2xl font-bold text-card-foreground" data-testid="metric-sessions">
                  {(analytics as any)?.counselingSessions?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-muted-foreground">Sessions Booked</p>
              </div>
            </div>
            <p className="text-xs text-primary">+25% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-2">
              <AlertTriangle className="text-destructive h-6 w-6" />
              <div>
                <p className="text-2xl font-bold text-card-foreground" data-testid="metric-alerts">
                  {(analytics as any)?.highRiskAlerts?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-muted-foreground">High-Risk Alerts</p>
              </div>
            </div>
            <p className="text-xs text-destructive">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Mental Health Risk Levels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Mental Health Risk Levels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskDistribution.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No screening data available</p>
            ) : (
              riskDistribution.map((item: any) => {
                const percentage = totalScreenings > 0 ? (item.count / totalScreenings) * 100 : 0;
                const colors = {
                  minimal: "bg-secondary",
                  mild: "bg-accent", 
                  moderate: "bg-chart-4",
                  "moderately-severe": "bg-destructive",
                  severe: "bg-destructive"
                };
                
                return (
                  <div key={item.riskLevel} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground capitalize">
                      {item.riskLevel.replace('-', ' ')} Risk
                    </span>
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={percentage} 
                        className="w-32 h-2"
                        data-testid={`progress-${item.riskLevel}`}
                      />
                      <span className="text-sm font-medium text-card-foreground w-12 text-right">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Usage Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Platform Usage Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Peak Usage Times */}
            <div>
              <h5 className="font-medium text-card-foreground mb-3">Peak Usage Hours</h5>
              <div className="flex justify-between items-end h-12">
                {[
                  { hour: "10PM", height: 20 },
                  { hour: "11PM", height: 35 }, 
                  { hour: "12AM", height: 15 },
                  { hour: "2PM", height: 25 }
                ].map((time, index) => (
                  <div key={index} className="text-center">
                    <div 
                      className="w-2 bg-primary rounded-full mx-auto mb-1"
                      style={{ height: `${time.height}px` }}
                      data-testid={`usage-bar-${index}`}
                    ></div>
                    <span className="text-xs text-muted-foreground">{time.hour}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Used Features */}
            <div>
              <h5 className="font-medium text-card-foreground mb-3">Popular Features</h5>
              <div className="space-y-2">
                {[
                  { feature: "AI Chat Support", percentage: 68 },
                  { feature: "Resource Library", percentage: 45 },
                  { feature: "Peer Forum", percentage: 32 },
                  { feature: "Counselor Booking", percentage: 28 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.feature}</span>
                    <span className="text-card-foreground font-medium">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items for Institution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Recommended Institutional Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <h5 className="font-medium text-accent mb-2">
                <Clock className="inline h-4 w-4 mr-2" />
                Increase Counselor Hours
              </h5>
              <p className="text-sm text-accent/80">
                Booking demand is 40% higher than capacity during exam periods
              </p>
            </div>
            
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h5 className="font-medium text-primary mb-2">
                <Calendar className="inline h-4 w-4 mr-2" />
                Sleep Workshop Series
              </h5>
              <p className="text-sm text-primary/80">
                High engagement with sleep-related resources suggests need for structured programs
              </p>
            </div>
            
            <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
              <h5 className="font-medium text-secondary mb-2">
                <Users className="inline h-4 w-4 mr-2" />
                Peer Support Training
              </h5>
              <p className="text-sm text-secondary/80">
                Community engagement shows potential for expanding peer moderator program
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
