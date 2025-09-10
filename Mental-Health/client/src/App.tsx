import { Switch, Route, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useAppContext } from "@/context/AppContext";
import { useUsageAnalytics } from "@/lib/usage-analytics";
import { Brain, User, Music, BookOpen, Video, MessageSquare, Gamepad2, Stethoscope, Play, Radio, Flower, Moon, Save, Phone, ChevronDown, ChevronRight, Pill, Heart, AlarmClock } from "lucide-react";
import logoUrl from '@/assets/logo.png';
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import MotivationalQuote from "@/components/layout/motivational-quote";
import PageQuoteOverlay from "@/components/layout/page-quote-overlay";
import RoutineGenerator from "@/components/wellness/routine-generator";
import SleepCycleTool from "@/components/wellness/sleep-cycle-tool";
import QuickActionsFAB from "@/components/quick-actions-fab";
import OnboardingPopup from "@/components/onboarding/onboarding-popup";
import StartupPopup from "@/components/startup-popup";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Chat from "@/pages/chat";
import Screening from "@/pages/screening";
import Resources from "@/pages/resources";
import Community from "@/pages/community";
import Admin from "@/pages/admin";
import Profile from "@/pages/profile";
import PeerCalling from "@/pages/peer-calling";
import MusicPage from "@/pages/music";
import DiaryPage from "@/pages/diary";
import VideosPage from "@/pages/videos";
import Games from "@/pages/games";
import Doctor from "@/pages/doctor";
import Medicine from "@/pages/medicine";
import Entertainment from "@/pages/entertainment";
import Live from "@/pages/live";
import YogaPage from "@/pages/yoga";
import SleepPage from "@/pages/sleep";
import RoutinePage from "@/pages/routine";
import SavedContent from "@/pages/saved";
import MedicineAlarmPage from "@/pages/medicine-alarm";
import Showcase from "@/pages/showcase";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isOnboarding, showStartupPopup, completeOnboarding, closeStartupPopup, showQuoteOverlay, setShowQuoteOverlay, triggerQuoteOverlay } = useAppContext();
  const [location, setLocation] = useLocation();
  const { trackAction, trackPageDuration } = useUsageAnalytics();
  
  // Dropdown states for navigation sections
  const [dropdownStates, setDropdownStates] = useState({
    doctorScreening: false,
    wellness: false,
    relaxRefresh: false,
    community: false,
    mySpace: false
  });
  
  const toggleDropdown = (section: keyof typeof dropdownStates) => {
    setDropdownStates(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Trigger quote overlay on location changes (except first load)
  const [previousLocation, setPreviousLocation] = useState(location);
  
  useEffect(() => {
    console.log("Location changed:", previousLocation, "->", location); // Debug log
    console.log("Auth status:", isAuthenticated, "Onboarding:", isOnboarding); // Debug log
    
    if (previousLocation !== location && isAuthenticated && !isOnboarding) {
      console.log("Triggering quote overlay"); // Debug log
      triggerQuoteOverlay();
    }
    setPreviousLocation(location);
  }, [location, isAuthenticated, isOnboarding, triggerQuoteOverlay, previousLocation]);

  // Track page usage analytics
  useEffect(() => {
    if (isAuthenticated && !isOnboarding) {
      const startTime = Date.now();
      trackAction('page_visit', location);

      return () => {
        const duration = (Date.now() - startTime) / 1000; // Convert to seconds
        trackPageDuration(location, duration);
      };
    }
  }, [location, isAuthenticated, isOnboarding, trackAction, trackPageDuration]);

  // Show startup popup first (if not seen before)
  if (showStartupPopup && !isAuthenticated) {
    return (
      <>
        <Login />
        <StartupPopup 
          isOpen={showStartupPopup} 
          onClose={closeStartupPopup}
        />
      </>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // Show main app with onboarding popup if needed
  return (
    <>
      <div className="flex h-screen">
        {/* Left Sidebar Navigation - Hidden on profile page */}
        <div className={`hidden lg:flex lg:w-72 lg:flex-col ${location === '/profile' ? 'lg:hidden' : ''}`}>
          <div className="flex flex-col h-screen bg-card border-r border-border">
            {/* Logo and branding */}
            <div className="flex items-center p-4 border-b border-border">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img src={logoUrl} alt="Apnamann Logo" className="w-10 h-10 rounded-lg object-cover" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-foreground">ApnaMann</h1>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
              {/* Main Navigation Items */}
              {[
                { href: "/", label: "Home", icon: Brain, testId: "nav-home" },
                { href: "/chat", label: "Assistance", icon: MessageSquare, testId: "nav-ai-assistant" },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => setLocation(item.href)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3",
                      location === item.href && "bg-accent text-accent-foreground font-medium"
                    )}
                    data-testid={item.testId}
                  >
                    <IconComponent className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
              
              {/* Doctor/Screening Section */}
              <div className="pt-4 border-t border-border">
                <button
                  onClick={() => toggleDropdown('doctorScreening')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  <span>Doctor/Screening</span>
                  {dropdownStates.doctorScreening ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {dropdownStates.doctorScreening && (
                  <div className="space-y-1 mt-2">
                    {[
                      { href: "/doctor", label: "Doctor", icon: Stethoscope, testId: "nav-doctor" },
                      { href: "/screening", label: "Screening", icon: Brain, testId: "nav-screening" },
                      { href: "/medicine", label: "Medical Store", icon: Pill, testId: "nav-medicine" },
                      { href: "/medicine-alarm", label: "Medicine Alarm", icon: AlarmClock, testId: "nav-medicine-alarm" },
                    ].map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.href}
                          onClick={() => setLocation(item.href)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3 ml-2",
                            location === item.href && "bg-accent text-accent-foreground font-medium"
                          )}
                          data-testid={item.testId}
                        >
                          <IconComponent className="h-4 w-4" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Wellness Section */}
              <div className="pt-4 border-t border-border">
                <button
                  onClick={() => toggleDropdown('wellness')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  <span>Wellness</span>
                  {dropdownStates.wellness ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {dropdownStates.wellness && (
                  <div className="space-y-1 mt-2">
                    {[
                      { href: "/yoga", label: "Yoga", icon: Flower, testId: "nav-yoga" },
                      { href: "/sleep", label: "Sleep Cycle Guide", icon: Moon, testId: "nav-sleep-cycle" },
                      { href: "/routine", label: "Routine Generator", icon: Play, testId: "nav-routine-generator" },
                    ].map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.href}
                          onClick={() => setLocation(item.href)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3 ml-2",
                            location === item.href && "bg-accent text-accent-foreground font-medium"
                          )}
                          data-testid={item.testId}
                        >
                          <IconComponent className="h-4 w-4" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Relax & Refresh Section */}
              <div className="pt-4 border-t border-border">
                <button
                  onClick={() => toggleDropdown('relaxRefresh')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  <span>Relax & Refresh</span>
                  {dropdownStates.relaxRefresh ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {dropdownStates.relaxRefresh && (
                  <div className="space-y-1 mt-2">
                    {[
                      { href: "/games", label: "Games", icon: Gamepad2, testId: "nav-games" },
                      { href: "/music", label: "Mind Fresh Music", icon: Music, testId: "nav-music" },
                      { href: "/videos", label: "Motivation Videos", icon: Video, testId: "nav-videos" },
                      { href: "/live", label: "Live Sessions", icon: Radio, testId: "nav-live-sessions" },
                    ].map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.href}
                          onClick={() => setLocation(item.href)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3 ml-2",
                            location === item.href && "bg-accent text-accent-foreground font-medium"
                          )}
                          data-testid={item.testId}
                        >
                          <IconComponent className="h-4 w-4" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Community Section */}
              <div className="pt-4 border-t border-border">
                <button
                  onClick={() => toggleDropdown('community')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  <span>Community</span>
                  {dropdownStates.community ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {dropdownStates.community && (
                  <div className="space-y-1 mt-2">
                    {[
                      { href: "/resources", label: "Resources", icon: BookOpen, testId: "nav-resources" },
                      { href: "/peer-calling", label: "Peer Call", icon: Phone, testId: "nav-peer-call" },
                      { href: "/showcase", label: "Showcase", icon: Play, testId: "nav-showcase" },
                    ].map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.href}
                          onClick={() => setLocation(item.href)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3 ml-2",
                            location === item.href && "bg-accent text-accent-foreground font-medium"
                          )}
                          data-testid={item.testId}
                        >
                          <IconComponent className="h-4 w-4" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* My Space Section */}
              <div className="pt-4 border-t border-border">
                <button
                  onClick={() => toggleDropdown('mySpace')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  <span>My Space</span>
                  {dropdownStates.mySpace ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {dropdownStates.mySpace && (
                  <div className="space-y-1 mt-2">
                    {[
                      { href: "/diary", label: "My Diary", icon: BookOpen, testId: "nav-my-diary" },
                      { href: "/saved", label: "Saved Content", icon: Save, testId: "nav-saved-content" },
                    ].map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.href}
                          onClick={() => setLocation(item.href)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3 ml-2",
                            location === item.href && "bg-accent text-accent-foreground font-medium"
                          )}
                          data-testid={item.testId}
                        >
                          <IconComponent className="h-4 w-4" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
            
            {/* Motivational Quote */}
            <div className="p-4">
              <MotivationalQuote />
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <Header />
          <main className="flex-1 overflow-auto">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/chat" component={Chat} />
              <Route path="/screening" component={Screening} />
              <Route path="/games" component={Games} />
              <Route path="/music" component={MusicPage} />
              <Route path="/diary" component={DiaryPage} />
              <Route path="/videos" component={VideosPage} />
              <Route path="/resources" component={Resources} />
              <Route path="/community" component={Community} />
              <Route path="/peer-calling" component={PeerCalling} />
              <Route path="/showcase" component={Showcase} />
              <Route path="/doctor" component={Doctor} />
              <Route path="/medicine" component={Medicine} />
              <Route path="/entertainment" component={Entertainment} />
              <Route path="/live" component={Live} />
              <Route path="/yoga" component={YogaPage} />
              <Route path="/sleep" component={SleepPage} />
              <Route path="/routine" component={RoutinePage} />
              <Route path="/saved" component={SavedContent} />
              <Route path="/medicine-alarm" component={MedicineAlarmPage} />
              <Route path="/admin" component={Admin} />
              <Route path="/profile" component={Profile} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
      
      <QuickActionsFAB />
      <OnboardingPopup 
        isOpen={isOnboarding} 
        onComplete={completeOnboarding}
      />
      <PageQuoteOverlay
        isVisible={showQuoteOverlay}
        onComplete={() => setShowQuoteOverlay(false)}
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <AppProvider>
            <Router />
          </AppProvider>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
