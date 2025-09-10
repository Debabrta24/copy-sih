import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, TrendingUp, CloudRain, Activity, Calculator, Sprout, GraduationCap, Shield, MapPin, Users, ShoppingCart, Heart, Store, Truck, BookOpen } from "lucide-react";
import { useLanguage } from "./language-provider";
import { useLocation } from "wouter";

const tools = [
  {
    id: "crop-doctor",
    icon: Camera,
    titleKey: "tools.cropDoctor",
    descriptionKey: "tools.cropDoctorDesc",
    color: "primary",
    route: "/crop-doctor"
  },
  {
    id: "price-tracker", 
    icon: TrendingUp,
    titleKey: "tools.priceTracker",
    descriptionKey: "tools.priceTrackerDesc",
    color: "secondary",
    route: "/price-tracker"
  },
  {
    id: "weather-shield",
    icon: CloudRain,
    titleKey: "tools.weatherShield",
    descriptionKey: "tools.weatherShieldDesc",
    color: "accent",
    route: "/weather-shield"
  },
  {
    id: "iot-dashboard",
    icon: Activity,
    titleKey: "tools.iotDashboard",
    descriptionKey: "tools.iotDashboardDesc",
    color: "primary",
    route: "/iot-dashboard"
  },
  {
    id: "profit-calculator",
    icon: Calculator,
    titleKey: "tools.profitCalculator",
    descriptionKey: "tools.profitCalculatorDesc",
    color: "secondary",
    route: "/profit-calculator"
  },
  {
    id: "crop-advisor",
    icon: Sprout,
    titleKey: "tools.cropAdvisor",
    descriptionKey: "tools.cropAdvisorDesc",
    color: "accent",
    route: "/crop-advisor"
  },
  {
    id: "expert-solutions",
    icon: GraduationCap,
    titleKey: "tools.expertSolutions",
    descriptionKey: "tools.expertSolutionsDesc", 
    color: "primary",
    route: "/expert-solutions"
  },
  {
    id: "loan-scam-info",
    icon: Shield,
    titleKey: "tools.loanScamInfo",
    descriptionKey: "tools.loanScamInfoDesc",
    color: "secondary", 
    route: "/loan-scam-info"
  },
  {
    id: "agri-library",
    icon: BookOpen,
    titleKey: "tools.agriLibrary",
    descriptionKey: "tools.agriLibraryDesc",
    color: "accent",
    route: "/agri-library"
  }
];

const nearbyServices = [
  {
    id: "nearby-farmers",
    icon: Users,
    title: "Nearby Farmers",
    description: "Connect with local farmers in your area for collaboration and knowledge sharing",
    color: "primary"
  },
  {
    id: "selling-markets",
    icon: ShoppingCart,
    title: "Selling Markets",
    description: "Find the best local markets to sell your crops at competitive prices",
    color: "secondary"
  },
  {
    id: "medicine-shops",
    icon: Heart,
    title: "Medicine Shops",
    description: "Locate nearby agricultural medicine and fertilizer stores",
    color: "accent"
  },
  {
    id: "equipment-stores",
    icon: Store,
    title: "Equipment Stores",
    description: "Find local shops for farming tools and equipment",
    color: "primary"
  },
  {
    id: "transportation",
    icon: Truck,
    title: "Transportation Services",
    description: "Connect with logistics providers for crop transportation",
    color: "secondary"
  },
  {
    id: "local-services",
    icon: MapPin,
    title: "Other Local Services",
    description: "Discover additional agricultural services in your vicinity",
    color: "accent"
  }
];

export function SmartTools() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return {
          icon: "bg-primary/10 text-primary",
          button: "bg-primary text-primary-foreground hover:bg-primary/90"
        };
      case "secondary":
        return {
          icon: "bg-secondary/10 text-secondary",
          button: "bg-secondary text-secondary-foreground hover:bg-secondary/90"
        };
      case "accent":
        return {
          icon: "bg-accent/10 text-accent",
          button: "bg-accent text-accent-foreground hover:bg-accent/90"
        };
      default:
        return {
          icon: "bg-primary/10 text-primary",
          button: "bg-primary text-primary-foreground hover:bg-primary/90"
        };
    }
  };

  return (
    <section id="tools" className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t("tools.title")}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
            {t("tools.description")}
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const colors = getColorClasses(tool.color);
            
            return (
              <Card key={tool.id} className="hover:shadow-xl transition-all duration-300 touch-button">
                <CardContent className="p-4 sm:p-6">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 ${colors.icon}`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-2 sm:mb-3">
                    {t(tool.titleKey)}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                    {t(tool.descriptionKey)}
                  </p>
                  <Button 
                    className={`w-full ${colors.button} touch-button min-h-[44px]`}
                    onClick={() => setLocation(tool.route)}
                    data-testid={`button-${tool.id}`}
                  >
                    {t("common.viewMore")}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Nearby Services Section */}
        <div className="mt-16 sm:mt-20 lg:mt-24">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Nearby Agricultural Services
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Discover local farmers, markets, medicine shops, and other essential services in your area
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {nearbyServices.map((service) => {
              const Icon = service.icon;
              const colors = getColorClasses(service.color);
              
              return (
                <Card key={service.id} className="hover:shadow-xl transition-all duration-300 touch-button">
                  <CardContent className="p-4 sm:p-6">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 ${colors.icon}`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-2 sm:mb-3">
                      {service.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                      {service.description}
                    </p>
                    <Button 
                      className={`w-full ${colors.button} touch-button min-h-[44px]`}
                      onClick={() => setLocation(`/nearby/${service.id}`)}
                      data-testid={`button-${service.id}`}
                    >
                      Find Nearby
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
