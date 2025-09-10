import { useLocation } from "wouter";
import { ChevronDown, Play, Music, Gamepad2, Video, Radio, Phone, Stethoscope, Brain, Flower, Moon, BookOpen, Save, Pill } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/", label: "Home", testId: "nav-home" },
  { href: "/chat", label: "AI Assistant", testId: "nav-ai-assistant" },
];

const doctorScreeningItems = [
  { href: "/doctor", label: "Doctor", icon: Stethoscope, testId: "nav-doctor" },
  { href: "/screening", label: "Screening", icon: Brain, testId: "nav-screening" },
  { href: "/medicine", label: "Buy Medicine", icon: Pill, testId: "nav-medicine" },
];

const wellnessItems = [
  { href: "/yoga", label: "Yoga", icon: Flower, testId: "nav-yoga" },
  { href: "/sleep", label: "Sleep Cycle Guide", icon: Moon, testId: "nav-sleep-cycle" },
  { href: "/routine", label: "Routine Generator", icon: Play, testId: "nav-routine-generator" },
];

const relaxRefreshItems = [
  { href: "/games", label: "Games", icon: Gamepad2, testId: "nav-games" },
  { href: "/music", label: "Mind Fresh Music", icon: Music, testId: "nav-music" },
  { href: "/videos", label: "Motivation Videos", icon: Video, testId: "nav-videos" },
  { href: "/live", label: "Live Sessions", icon: Radio, testId: "nav-live-sessions" },
];

const communityItems = [
  { href: "/resources", label: "Resources", icon: BookOpen, testId: "nav-resources" },
  { href: "/peer-calling", label: "Peer Call", icon: Phone, testId: "nav-peer-calling" },
];

const mySpaceItems = [
  { href: "/diary", label: "My Diary", icon: BookOpen, testId: "nav-my-diary" },
  { href: "/saved", label: "Saved Content", icon: Save, testId: "nav-saved-content" },
];

export default function Navigation() {
  const [location, setLocation] = useLocation();

  const isDoctorScreeningActive = doctorScreeningItems.some(item => location === item.href);
  const isWellnessActive = wellnessItems.some(item => location === item.href);
  const isRelaxRefreshActive = relaxRefreshItems.some(item => location === item.href);
  const isCommunityActive = communityItems.some(item => location === item.href);
  const isMySpaceActive = mySpaceItems.some(item => location === item.href);

  return (
    <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <button
          key={item.href}
          onClick={() => setLocation(item.href)}
          className={cn(
            "text-foreground hover:text-primary transition-colors whitespace-nowrap text-sm lg:text-base",
            location === item.href && "text-primary font-medium"
          )}
          data-testid={item.testId}
        >
          {item.label}
        </button>
      ))}
      
      {/* Doctor/Screening Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(
          "flex items-center space-x-1 text-foreground hover:text-primary transition-colors focus:outline-none whitespace-nowrap text-sm lg:text-base",
          isDoctorScreeningActive && "text-primary font-medium"
        )}>
          <span>Doctor/Screening</span>
          <ChevronDown className="h-3 w-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {doctorScreeningItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem
                key={item.href}
                onClick={() => setLocation(item.href)}
                className="flex items-center space-x-2 cursor-pointer"
                data-testid={item.testId}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Wellness Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(
          "flex items-center space-x-1 text-foreground hover:text-primary transition-colors focus:outline-none whitespace-nowrap text-sm lg:text-base",
          isWellnessActive && "text-primary font-medium"
        )}>
          <span>Wellness</span>
          <ChevronDown className="h-3 w-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {wellnessItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem
                key={item.href}
                onClick={() => setLocation(item.href)}
                className="flex items-center space-x-2 cursor-pointer"
                data-testid={item.testId}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Relax & Refresh Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(
          "flex items-center space-x-1 text-foreground hover:text-primary transition-colors focus:outline-none whitespace-nowrap text-sm lg:text-base",
          isRelaxRefreshActive && "text-primary font-medium"
        )}>
          <span>Relax & Refresh</span>
          <ChevronDown className="h-3 w-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {relaxRefreshItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem
                key={item.href}
                onClick={() => setLocation(item.href)}
                className="flex items-center space-x-2 cursor-pointer"
                data-testid={item.testId}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Community Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(
          "flex items-center space-x-1 text-foreground hover:text-primary transition-colors focus:outline-none whitespace-nowrap text-sm lg:text-base",
          isCommunityActive && "text-primary font-medium"
        )}>
          <span>Community</span>
          <ChevronDown className="h-3 w-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {communityItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem
                key={item.href}
                onClick={() => setLocation(item.href)}
                className="flex items-center space-x-2 cursor-pointer"
                data-testid={item.testId}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* My Space Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(
          "flex items-center space-x-1 text-foreground hover:text-primary transition-colors focus:outline-none whitespace-nowrap text-sm lg:text-base",
          isMySpaceActive && "text-primary font-medium"
        )}>
          <span>My Space</span>
          <ChevronDown className="h-3 w-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {mySpaceItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem
                key={item.href}
                onClick={() => setLocation(item.href)}
                className="flex items-center space-x-2 cursor-pointer"
                data-testid={item.testId}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
