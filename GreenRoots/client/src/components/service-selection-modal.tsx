import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bot, Zap, Key, Globe, Brain, MessageSquare } from "lucide-react";
import { useLanguage } from "./language-provider";
import { useToast } from "@/hooks/use-toast";
import { ServiceConfigManager } from "@/lib/service-config";
import type { ServiceConfig } from "@/lib/service-config";

interface ServiceSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceSelectionModal({ open, onOpenChange }: ServiceSelectionModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [selectedService, setSelectedService] = useState("gemini");
  const [serviceMode, setServiceMode] = useState<"api" | "realtime">("realtime");
  const [loading, setLoading] = useState(false);

  // Load current configuration when modal opens
  const loadCurrentConfig = () => {
    const currentConfig = ServiceConfigManager.getCurrentConfig();
    setSelectedService(currentConfig.selectedService);
    setServiceMode(currentConfig.serviceMode);
  };

  // Load configuration when modal opens
  if (open && selectedService === "gemini" && serviceMode === "realtime") {
    loadCurrentConfig();
  }

  const aiServices = [
    {
      id: "gemini",
      name: "Google Gemini",
      icon: <Brain className="w-5 h-5" />,
      description: "Advanced multimodal AI for crop recommendations and analysis",
      supportsRealtime: true,
      supportsAPI: true,
      features: ["Text Analysis", "Image Recognition", "Crop Recommendations", "Pest Detection"]
    },
    {
      id: "chatgpt",
      name: "ChatGPT (OpenAI)",
      icon: <MessageSquare className="w-5 h-5" />,
      description: "Conversational AI for agricultural insights and advice",
      supportsRealtime: true,
      supportsAPI: true,
      features: ["Text Analysis", "Agricultural Advice", "Market Insights", "Problem Solving"]
    },
    {
      id: "google-search",
      name: "Google Real-time Search",
      icon: <Globe className="w-5 h-5" />,
      description: "Live web search for latest agricultural trends and data",
      supportsRealtime: true,
      supportsAPI: false,
      features: ["Market Prices", "Weather Data", "Agricultural News", "Research Papers"]
    }
  ];

  const handleSaveSelection = async () => {
    setLoading(true);
    try {
      const config: ServiceConfig = {
        selectedService: selectedService as 'gemini' | 'chatgpt' | 'google-search',
        serviceMode,
        timestamp: Date.now()
      };
      
      // Save to backend and localStorage
      const success = await ServiceConfigManager.saveConfigToBackend(config);
      
      if (success) {
        const serviceName = ServiceConfigManager.getServiceDisplayName(selectedService);
        const modeName = ServiceConfigManager.getModeDisplayName(serviceMode);
        
        toast({
          title: "Service Configuration Saved",
          description: `${serviceName} configured for ${modeName}`,
        });
        
        onOpenChange(false);
      } else {
        toast({
          title: "Configuration Error",
          description: "Failed to save service configuration to server",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Configuration Error",
        description: "Failed to save service configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedServiceData = aiServices.find(s => s.id === selectedService);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span>AI Service Configuration</span>
          </DialogTitle>
          <DialogDescription>
            Choose your preferred AI service and operating mode for the best agricultural experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Selection */}
          <div>
            <h3 className="text-lg font-medium mb-3">Choose AI Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiServices.map((service) => (
                <Card 
                  key={service.id}
                  className={`cursor-pointer transition-all ${
                    selectedService === service.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedService(service.id)}
                  data-testid={`service-card-${service.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {service.icon}
                        <CardTitle className="text-base">{service.name}</CardTitle>
                      </div>
                      {selectedService === service.id && (
                        <Badge variant="default">Selected</Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {service.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="flex items-center space-x-1">
                        <Key className="w-3 h-3" />
                        <span className={service.supportsAPI ? "text-green-600" : "text-gray-400"}>
                          API
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span className={service.supportsRealtime ? "text-green-600" : "text-gray-400"}>
                          Real-time
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Mode Selection */}
          {selectedServiceData && (
            <div>
              <h3 className="text-lg font-medium mb-3">Operating Mode</h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="mode-toggle" className="text-base">
                          Service Mode
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          {serviceMode === "api" 
                            ? "Uses your API keys for personalized, high-quality responses"
                            : "Uses real-time web services for instant, up-to-date information"
                          }
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm ${serviceMode === "realtime" ? "font-medium" : "text-muted-foreground"}`}>
                          Real-time
                        </span>
                        <Switch
                          id="mode-toggle"
                          checked={serviceMode === "api"}
                          onCheckedChange={(checked) => setServiceMode(checked ? "api" : "realtime")}
                          disabled={serviceMode === "api" && !selectedServiceData.supportsAPI}
                          data-testid="service-mode-toggle"
                        />
                        <span className={`text-sm ${serviceMode === "api" ? "font-medium" : "text-muted-foreground"}`}>
                          API Mode
                        </span>
                      </div>
                    </div>

                    {/* Mode Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className={`p-4 rounded-lg border ${serviceMode === "realtime" ? "bg-primary/5 border-primary" : "bg-muted"}`}>
                        <h4 className="font-medium flex items-center space-x-2 mb-2">
                          <Zap className="w-4 h-4" />
                          <span>Real-time Mode</span>
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• No API keys required</li>
                          <li>• Live web data integration</li>
                          <li>• Instant setup</li>
                          <li>• Current market prices</li>
                        </ul>
                      </div>
                      
                      <div className={`p-4 rounded-lg border ${serviceMode === "api" ? "bg-primary/5 border-primary" : "bg-muted"}`}>
                        <h4 className="font-medium flex items-center space-x-2 mb-2">
                          <Key className="w-4 h-4" />
                          <span>API Mode</span>
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Higher quality responses</li>
                          <li>• Personalized recommendations</li>
                          <li>• Advanced AI features</li>
                          <li>• Rate limit control</li>
                        </ul>
                      </div>
                    </div>
                    
                    {serviceMode === "api" && !selectedServiceData.supportsAPI && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-sm text-amber-800">
                          This service doesn't support API mode. Please select a different service or use real-time mode.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <Separator />
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSelection}
            disabled={loading || (serviceMode === "api" && !selectedServiceData?.supportsAPI)}
            data-testid="button-save-config"
          >
            {loading ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}