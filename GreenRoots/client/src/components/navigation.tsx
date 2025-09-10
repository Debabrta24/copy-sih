import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Leaf, Moon, Sun, Menu, Settings, Bot, Bell, Users, Mail, Chrome } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useLanguage } from "./language-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { CuteLoading } from "./cute-loading";

const languages = [
  { code: "en", name: "🇺🇸 EN" },
  { code: "hi", name: "🇮🇳 हिंदी" },
  { code: "bn", name: "🇧🇩 বাংলা" },
  { code: "ta", name: "🇮🇳 தமிழ்" },
];

interface NavigationProps {
  user?: any;
}

export function Navigation({ user }: NavigationProps) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [location, navigate] = useLocation();
  const isMobile = useIsMobile();
  const [showMedicineLoading, setShowMedicineLoading] = useState(false);

  const navItems = [
    { path: "/", label: t("nav.home") },
    { path: "/project-idea", label: t("nav.project") },
    { path: "/about", label: t("nav.about") },
    { path: "/medicine", label: "Store" },
    { path: "/community", label: "Community" },
  ];

  const handleMedicineClick = (e: React.MouseEvent, onItemClick?: () => void) => {
    e.preventDefault();
    setShowMedicineLoading(true);
    if (onItemClick) onItemClick();
  };

  const handleLoadingComplete = () => {
    setShowMedicineLoading(false);
    navigate("/medicine");
  };

  const NavItems = ({ className = "", onItemClick, isMobileNav = false }: { className?: string; onItemClick?: () => void; isMobileNav?: boolean }) => (
    <div className={`${isMobileNav ? "flex flex-col space-y-4" : "flex space-x-6"} ${className}`}>
      {navItems.map((item) => {
        if (item.path === "/medicine") {
          return (
            <button
              key={item.path}
              className={`${isMobileNav ? "w-full text-left px-4 py-2 rounded-lg" : ""} text-muted-foreground hover:text-primary transition-colors ${
                location === item.path ? "text-primary font-medium bg-primary/10" : ""
              } ${isMobileNav ? "hover:bg-accent" : ""}`}
              onClick={(e) => handleMedicineClick(e, onItemClick)}
              data-testid={`nav-link-${item.path.replace("/", "") || "home"}`}
            >
              {item.label}
            </button>
          );
        }
        
        return (
          <Link key={item.path} href={item.path}>
            <button
              className={`${isMobileNav ? "w-full text-left px-4 py-2 rounded-lg" : ""} text-muted-foreground hover:text-primary transition-colors ${
                location === item.path ? "text-primary font-medium bg-primary/10" : ""
              } ${isMobileNav ? "hover:bg-accent" : ""}`}
              onClick={onItemClick}
              data-testid={`nav-link-${item.path.replace("/", "") || "home"}`}
            >
              {item.label}
            </button>
          </Link>
        );
      })}
    </div>
  );

  return (
    <nav className="bg-card/95 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 min-h-[56px] sm:min-h-[64px]"> {/* Responsive height */}
          <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 flex-1">
            <Link href="/">
              <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer" data-testid="logo">
                <img 
                  src="/Green_root_logo_design_709e7c12.png" 
                  alt="GreenRoots" 
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain bg-transparent"
                />
                <span className="text-base sm:text-lg md:text-xl font-bold text-card-foreground hidden xs:block">GreenRoots</span>
              </div>
            </Link>
            <div className="hidden md:block">
              <NavItems />
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4"> {/* Progressive spacing */}
            
            {/* Notifications */}
            {!isMobile && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="min-w-[40px] min-h-[40px] p-2 relative" 
                    data-testid="notifications-button"
                  >
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white min-w-[1.2rem] h-5 flex items-center justify-center text-xs px-1">
                      3
                    </Badge>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notifications
                    </DialogTitle>
                  </DialogHeader>
                  <div className="py-4 space-y-4 max-h-80 overflow-y-auto">
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">New Pest Alert</p>
                      <p className="text-xs text-muted-foreground mt-1">Aphid infestation detected in your tomato field. Check your crops and apply organic neem spray.</p>
                      <p className="text-xs text-blue-600 mt-2">2 hours ago</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">Weather Update</p>
                      <p className="text-xs text-muted-foreground mt-1">Heavy rain expected tomorrow. Consider harvesting mature crops and protecting seedlings.</p>
                      <p className="text-xs text-blue-600 mt-2">5 hours ago</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">Market Price Alert</p>
                      <p className="text-xs text-muted-foreground mt-1">Wheat prices increased by 12% this week. Good time to sell your harvest!</p>
                      <p className="text-xs text-blue-600 mt-2">1 day ago</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Authentication Options */}
            {!isMobile && (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="min-w-[80px] min-h-[40px] px-3" 
                    data-testid="login-button"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-w-[80px] min-h-[40px] px-3" 
                    data-testid="signup-button"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Language Dropdown - Hidden on mobile, shown in sidebar */}
            {!isMobile && (
              <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
                <SelectTrigger className="w-auto min-w-[100px] h-9 bg-background border-border hover:bg-accent" data-testid="language-selector">
                  <SelectValue>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">{languages.find(l => l.code === language)?.name || "🇺🇸 EN"}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} data-testid={`lang-option-${lang.code}`}>
                      <div className="flex items-center space-x-2">
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Theme Toggle - Hidden on mobile */}
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="min-w-[40px] min-h-[40px] p-2" 
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                data-testid="theme-toggle"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Mobile/Tablet Menu - Show on screens smaller than md */}
            <div className="block md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] p-2" data-testid="mobile-menu-trigger">
                    <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px] md:w-[400px]">
                  <div className="flex flex-col space-y-6 mt-8">
                    {/* Mobile Language Selector */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Language</label>
                      <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            <div className="flex items-center space-x-2">
                              <span>{languages.find(l => l.code === language)?.name || "🇺🇸 EN"}</span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              <div className="flex items-center space-x-2">
                                <span>{lang.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Navigation Items */}
                    <NavItems 
                      isMobileNav={true}
                      onItemClick={() => {
                        // Close sheet after navigation
                        document.body.click();
                      }}
                    />
                    
                    {/* Notifications for Mobile */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start min-h-[48px] relative"
                        >
                          <Bell className="h-5 w-5 mr-2" />
                          Notifications
                          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white min-w-[1.2rem] h-5 flex items-center justify-center text-xs px-1">
                            3
                          </Badge>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5" />
                            Notifications
                          </DialogTitle>
                        </DialogHeader>
                        <div className="py-4 space-y-4 max-h-80 overflow-y-auto">
                          <div className="p-3 border rounded-lg">
                            <p className="font-medium text-sm">New Pest Alert</p>
                            <p className="text-xs text-muted-foreground mt-1">Aphid infestation detected in your tomato field. Check your crops and apply organic neem spray.</p>
                            <p className="text-xs text-blue-600 mt-2">2 hours ago</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <p className="font-medium text-sm">Weather Update</p>
                            <p className="text-xs text-muted-foreground mt-1">Heavy rain expected tomorrow. Consider harvesting mature crops and protecting seedlings.</p>
                            <p className="text-xs text-blue-600 mt-2">5 hours ago</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <p className="font-medium text-sm">Market Price Alert</p>
                            <p className="text-xs text-muted-foreground mt-1">Wheat prices increased by 12% this week. Good time to sell your harvest!</p>
                            <p className="text-xs text-blue-600 mt-2">1 day ago</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Authentication for Mobile */}
                    <div className="space-y-3">
                      <Link href="/login">
                        <Button
                          variant="outline"
                          className="w-full justify-start min-h-[48px]"
                          onClick={() => document.body.click()}
                        >
                          <Users className="h-5 w-5 mr-2" />
                          Login
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button
                          variant="default"
                          className="w-full justify-start min-h-[48px]"
                          onClick={() => document.body.click()}
                        >
                          <Users className="h-5 w-5 mr-2" />
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                    
                    {/* Theme Toggle for Mobile */}
                    <Button
                      variant="outline"
                      className="w-full justify-start min-h-[48px]"
                      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    >
                      {theme === "light" ? (
                        <><Moon className="h-5 w-5 mr-2" /> Dark Mode</>
                      ) : (
                        <><Sun className="h-5 w-5 mr-2" /> Light Mode</>
                      )}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cute Loading Screen */}
      {showMedicineLoading && (
        <CuteLoading 
          onComplete={handleLoadingComplete}
          duration={3000}
        />
      )}
    </nav>
  );
}
