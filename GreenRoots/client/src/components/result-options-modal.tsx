import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Separator } from "@/components/ui/separator";
import { Globe, Key, Save, Eye, EyeOff, Zap } from "lucide-react";
import { useLanguage } from "./language-provider";
import { useToast } from "@/hooks/use-toast";

interface ResultOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResultOptionsModal({ open, onOpenChange }: ResultOptionsModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [selectedOption, setSelectedOption] = useState<"realtime" | "api" | null>(null);
  const [loading, setLoading] = useState(false);

  // API keys state
  const [apiKeys, setApiKeys] = useState({
    gemini: "",
    openai: "",
    weather: "",
    plantId: "",
    nasa: "",
    soilGrids: "",
    googleMaps: "",
    openWeather: "",
  });

  const [showKeys, setShowKeys] = useState({
    gemini: false,
    openai: false,
    weather: false,
    plantId: false,
    nasa: false,
    soilGrids: false,
    googleMaps: false,
    openWeather: false,
  });

  const allApiKeys = [
    { 
      key: "gemini" as const, 
      label: "Google Gemini AI", 
      description: "AI-powered crop recommendations and analysis" 
    },
    { 
      key: "openai" as const, 
      label: "OpenAI (ChatGPT)", 
      description: "Advanced conversational AI for farming insights" 
    },
    { 
      key: "weather" as const, 
      label: "Weather API", 
      description: "Real-time weather data for accurate predictions" 
    },
    { 
      key: "plantId" as const, 
      label: "Plant.id", 
      description: "Plant identification and disease detection" 
    },
    { 
      key: "nasa" as const, 
      label: "NASA APIs", 
      description: "Satellite data and environmental information" 
    },
    { 
      key: "soilGrids" as const, 
      label: "SoilGrids", 
      description: "Global soil information and analysis" 
    },
    { 
      key: "googleMaps" as const, 
      label: "Google Maps", 
      description: "Location services and mapping data" 
    },
    { 
      key: "openWeather" as const, 
      label: "OpenWeather", 
      description: "Comprehensive weather forecasting" 
    },
  ];

  const handleKeyChange = (keyType: keyof typeof apiKeys, value: string) => {
    setApiKeys(prev => ({ ...prev, [keyType]: value }));
  };

  const toggleShowKey = (keyType: keyof typeof showKeys) => {
    setShowKeys(prev => ({ ...prev, [keyType]: !prev[keyType] }));
  };

  const handleRealtimeOption = async () => {
    setLoading(true);
    try {
      // Save realtime configuration
      const config = {
        mode: "realtime",
        timestamp: Date.now()
      };
      localStorage.setItem("agreeGrowResultMode", JSON.stringify(config));
      
      toast({
        title: "Configuration Saved",
        description: "System will now get results using realtime internet data automatically by location.",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Configuration Error",
        description: "Failed to save realtime configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApiOption = () => {
    setSelectedOption("api");
  };

  const handleSaveApiKeys = async () => {
    setLoading(true);
    try {
      // Save API configuration
      const config = {
        mode: "api",
        keys: apiKeys,
        timestamp: Date.now()
      };
      localStorage.setItem("agreeGrowResultMode", JSON.stringify(config));
      
      const filledKeys = Object.entries(apiKeys).filter(([_, value]) => value.trim()).length;
      
      toast({
        title: "API Configuration Saved",
        description: `${filledKeys} API keys configured. System will use API-based results.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Configuration Error",
        description: "Failed to save API configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedOption(null);
  };

  if (selectedOption === "api") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5" />
                  <span>API Configuration</span>
                </DialogTitle>
                <DialogDescription>
                  Enter your API keys below. All fields are optional - only add keys you have access to.
                </DialogDescription>
              </div>
              <Button variant="ghost" onClick={handleBack} size="sm">
                ← Back
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> All API keys are optional. The system will work with whatever keys you provide and fall back to free alternatives for missing ones.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allApiKeys.map((apiType) => (
                <Card key={apiType.key} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{apiType.label}</CardTitle>
                        <CardDescription className="text-sm">
                          {apiType.description}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Optional
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <div className="flex-1 relative">
                          <Input
                            type={showKeys[apiType.key] ? "text" : "password"}
                            placeholder="Enter API key (optional)"
                            value={apiKeys[apiType.key]}
                            onChange={(e) => handleKeyChange(apiType.key, e.target.value)}
                            data-testid={`input-api-key-${apiType.key}`}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-7 w-7 p-0"
                            onClick={() => toggleShowKey(apiType.key)}
                            data-testid={`button-toggle-visibility-${apiType.key}`}
                          >
                            {showKeys[apiType.key] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
              onClick={handleSaveApiKeys}
              disabled={loading}
              data-testid="button-save-api-config"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save API Configuration"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Choose Result Method</span>
          </DialogTitle>
          <DialogDescription>
            Select how you want to get agricultural data and recommendations
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Realtime Internet Option */}
          <Card 
            className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-primary/50"
            onClick={handleRealtimeOption}
            data-testid="realtime-option-card"
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="flex items-center justify-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Realtime Internet</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="mb-4">
                Automatically get all agricultural data using your location and real-time internet sources
              </CardDescription>
              <div className="space-y-2 text-sm text-left">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Auto location detection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Live weather data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Current market prices</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>No API keys needed</span>
                </div>
              </div>
              <Button className="w-full mt-4" disabled={loading}>
                {loading ? "Setting up..." : "Use Realtime Data"}
              </Button>
            </CardContent>
          </Card>

          {/* API Input Option */}
          <Card 
            className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-primary/50"
            onClick={handleApiOption}
            data-testid="api-option-card"
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Key className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="flex items-center justify-center space-x-2">
                <Key className="w-4 h-4" />
                <span>Input APIs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="mb-4">
                Configure your own API keys for premium features and more accurate results
              </CardDescription>
              <div className="space-y-2 text-sm text-left">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Premium AI features</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Higher accuracy data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>All APIs optional</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Custom configurations</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Configure APIs
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>You can change this setting anytime from the footer</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}