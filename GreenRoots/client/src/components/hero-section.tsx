import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "./language-provider";

interface HeroSectionProps {
  onStartFarming: () => void;
  onWatchDemo: () => void;
}

export function HeroSection({ onStartFarming, onWatchDemo }: HeroSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="gradient-bg text-primary-foreground py-12 sm:py-16 lg:py-20 text-optimize">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {t("hero.title")}<br />
              <span className="text-secondary">{t("hero.subtitle")}</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-primary-foreground/90">
              {t("hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 touch-button min-h-[48px]"
                onClick={onStartFarming}
                data-testid="button-start-farming"
              >
                {t("hero.start")}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-black/30 text-black hover:bg-black/10 dark:border-white/50 dark:text-white dark:hover:bg-white/20 dark:hover:text-white touch-button min-h-[48px]"
                onClick={onWatchDemo}
                data-testid="button-watch-demo"
              >
                {t("hero.demo")}
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-secondary flex-shrink-0" />
                <span className="text-sm">{t("hero.aiPowered")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-secondary flex-shrink-0" />
                <span className="text-sm">{t("hero.iotIntegration")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-secondary flex-shrink-0" />
                <span className="text-sm">{t("hero.multiLanguage")}</span>
              </div>
            </div>
          </div>
          <div className="relative mt-8 lg:mt-0">
            <img 
              src="/Smart_farming_IoT_hero_c0d92fad.png" 
              alt="Smart farming with IoT technology" 
              className="rounded-xl shadow-2xl animate-float w-full h-auto max-w-md mx-auto lg:max-w-none"
              loading="lazy"
            />
            <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 bg-card p-2 sm:p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-accent rounded-full"></div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-card-foreground">24°C</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">{t("weather.temperature")}</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-card p-2 sm:p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full"></div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-card-foreground">68%</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">{t("iot.soilMoisture")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
