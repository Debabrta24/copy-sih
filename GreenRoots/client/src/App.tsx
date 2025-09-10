import { Switch, Route } from "wouter";
import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { Navigation } from "@/components/navigation";
import { LoginModal } from "@/components/login-modal";
import { LanguageModal } from "@/components/language-modal";
import { FloatingChatbotButton } from "@/components/floating-chatbot-button";
import Home from "@/pages/home";
import CropDoctor from "@/pages/crop-doctor";
import PriceTracker from "@/pages/price-tracker";
import WeatherShield from "@/pages/weather-shield";
import IoTDashboard from "@/pages/iot-dashboard";
import ProfitCalculator from "@/pages/profit-calculator";
import CropAdvisor from "@/pages/crop-advisor";
import About from "@/pages/about";
import ProjectIdea from "@/pages/project-idea";
import Community from "@/pages/community";
import Medicine from "@/pages/medicine";
import ExpertSolutions from "@/pages/expert-solutions";
import LoanScamInfo from "@/pages/loan-scam-info";
import NearbyFarmers from "@/pages/nearby-farmers";
import SellingMarkets from "@/pages/selling-markets";
import MedicineShops from "@/pages/medicine-shops";
import EquipmentStores from "@/pages/equipment-stores";
import TransportationServices from "@/pages/transportation-services";
import LocalServices from "@/pages/local-services";
import AgriLibrary from "@/pages/agri-library";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/crop-doctor" component={CropDoctor} />
      <Route path="/price-tracker" component={PriceTracker} />
      <Route path="/weather-shield" component={WeatherShield} />
      <Route path="/iot-dashboard" component={IoTDashboard} />
      <Route path="/profit-calculator" component={ProfitCalculator} />
      <Route path="/crop-advisor" component={CropAdvisor} />
      <Route path="/about" component={About} />
      <Route path="/project-idea" component={ProjectIdea} />
      <Route path="/community" component={Community} />
      <Route path="/medicine" component={Medicine} />
      <Route path="/medicines" component={Medicine} />
      <Route path="/expert-solutions" component={ExpertSolutions} />
      <Route path="/loan-scam-info" component={LoanScamInfo} />
      <Route path="/nearby/nearby-farmers" component={NearbyFarmers} />
      <Route path="/nearby/selling-markets" component={SellingMarkets} />
      <Route path="/nearby/medicine-shops" component={MedicineShops} />
      <Route path="/nearby/equipment-stores" component={EquipmentStores} />
      <Route path="/nearby/transportation" component={TransportationServices} />
      <Route path="/nearby/local-services" component={LocalServices} />
      <Route path="/agri-library" component={AgriLibrary} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    // Show login modal after a short delay on first visit
    const hasVisited = localStorage.getItem("agreegrow-visited");
    if (!hasVisited) {
      setTimeout(() => {
        setShowLoginModal(true);
      }, 1000);
      localStorage.setItem("agreegrow-visited", "true");
    }
  }, []);

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    // Show language selection after successful login
    setTimeout(() => {
      setShowLanguageModal(true);
    }, 500);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="agreegrow-theme">
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <div className="min-h-screen bg-background">
              <Navigation user={user} />
              <Router />
              <FloatingChatbotButton />
              <Toaster />
              
              <LoginModal
                open={showLoginModal}
                onOpenChange={setShowLoginModal}
                onSuccess={handleLoginSuccess}
              />
              
              <LanguageModal
                open={showLanguageModal}
                onOpenChange={setShowLanguageModal}
              />
            </div>
          </TooltipProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
