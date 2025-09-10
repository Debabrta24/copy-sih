import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { enhancedAgricultureAPIs } from "./services/enhanced-agriculture-apis";
import { ServiceSelector, ServiceConfig } from "./services/service-selector";
import { webScraperService } from "./services/web-scraper";
import { 
  getCropRecommendations, 
  analyzePestImage, 
  generateWeatherInsights,
  generateMarketPredictions 
} from "./services/gemini";
import { 
  insertUserSchema,
  insertCropRecommendationSchema,
  insertPestDetectionSchema,
  insertIotSensorDataSchema,
  insertCommunityPostSchema,
  insertApiKeySchema,
  insertMedicineSchema,
  insertCartItemSchema,
  insertOrderSchema,
  insertOrderItemSchema
} from "@shared/schema";

// Helper function to get coordinates from location
async function getCoordinatesForLocation(location: string): Promise<{lat: number, lon: number} | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.length === 0) return null;
    
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon)
    };
  } catch (error: any) {
    console.warn("Geocoding failed:", error.message);
    return null;
  }
}

// Generate recommendations based on user input when APIs fail
async function generateUserInputBasedRecommendations(params: {
  soilType: string;
  climate: string;
  season: string;
  location: string;
  nitrogen?: number;
  phosphorous?: number;
  potassium?: number;
  ph?: number;
  organicMatter?: number;
}): Promise<{
  recommendedCrops: string[];
  fertilizerAdvice: string[];
  maintenanceSchedule: string[];
  seasonalTips: string[];
} | null> {
  try {
    const { soilType, climate, season, location, nitrogen, phosphorous, potassium, ph, organicMatter } = params;
    
    const recommendations = {
      recommendedCrops: [] as string[],
      fertilizerAdvice: [] as string[],
      maintenanceSchedule: [] as string[],
      seasonalTips: [] as string[]
    };

    // Crop recommendations based on user input
    if (season.toLowerCase().includes('monsoon') || season.toLowerCase().includes('kharif')) {
      if (soilType.toLowerCase().includes('clay')) {
        recommendations.recommendedCrops.push("Rice", "Cotton", "Sugarcane");
      } else if (soilType.toLowerCase().includes('sandy')) {
        recommendations.recommendedCrops.push("Corn", "Soybean", "Groundnut");
      } else {
        recommendations.recommendedCrops.push("Rice", "Corn", "Cotton", "Soybean");
      }
    } else if (season.toLowerCase().includes('winter') || season.toLowerCase().includes('rabi')) {
      if (soilType.toLowerCase().includes('loamy')) {
        recommendations.recommendedCrops.push("Wheat", "Barley", "Mustard");
      } else if (soilType.toLowerCase().includes('clay')) {
        recommendations.recommendedCrops.push("Wheat", "Gram", "Pea");
      } else {
        recommendations.recommendedCrops.push("Wheat", "Barley", "Mustard", "Gram");
      }
    } else {
      // Summer crops
      recommendations.recommendedCrops.push("Corn", "Sunflower", "Fodder crops");
    }

    // Climate-based adjustments
    if (climate.toLowerCase().includes('tropical')) {
      recommendations.recommendedCrops.push("Coconut", "Banana", "Spices");
    } else if (climate.toLowerCase().includes('temperate')) {
      recommendations.recommendedCrops.push("Apple", "Potato", "Cabbage");
    }

    // Fertilizer advice based on soil nutrients
    const fertilizerAdvice = [];
    
    if (nitrogen !== undefined && nitrogen < 2) {
      fertilizerAdvice.push("Apply nitrogen-rich fertilizer (Urea 100-150 kg/hectare) to address nitrogen deficiency");
    } else if (nitrogen !== undefined && nitrogen > 4) {
      fertilizerAdvice.push("Reduce nitrogen application as soil is nitrogen-rich. Focus on phosphorous and potassium");
    } else {
      fertilizerAdvice.push("Apply balanced NPK fertilizer as per soil test recommendations");
    }
    
    if (phosphorous !== undefined && phosphorous < 0.5) {
      fertilizerAdvice.push("Apply phosphorous-rich fertilizer (DAP 50-75 kg/hectare) for better root development");
    }
    
    if (potassium !== undefined && potassium < 1) {
      fertilizerAdvice.push("Apply potassium-rich fertilizer (MOP 25-50 kg/hectare) for disease resistance");
    }
    
    if (ph !== undefined) {
      if (ph < 6) {
        fertilizerAdvice.push("Apply lime (500-1000 kg/hectare) to reduce soil acidity");
      } else if (ph > 8) {
        fertilizerAdvice.push("Apply gypsum (250-500 kg/hectare) to reduce soil alkalinity");
      }
    }
    
    if (organicMatter !== undefined && organicMatter < 3) {
      fertilizerAdvice.push("Increase organic matter by applying compost or farmyard manure (8-12 tons/hectare)");
    }
    
    if (fertilizerAdvice.length === 0) {
      fertilizerAdvice.push(
        "Apply organic manure (5-10 tons/hectare) before sowing",
        "Use balanced NPK fertilizer as per crop requirement",
        "Apply nitrogen in split doses for better utilization"
      );
    }
    
    recommendations.fertilizerAdvice.push(...fertilizerAdvice);

    // Maintenance schedule
    recommendations.maintenanceSchedule.push(
      "Regular irrigation as per crop requirement",
      "Weed management - manual/mechanical/herbicide",
      "Integrated pest management practices",
      "Soil testing every 6 months",
      "Proper crop rotation planning"
    );

    // Seasonal tips
    if (season.toLowerCase().includes('monsoon')) {
      recommendations.seasonalTips.push(
        "Ensure proper drainage to prevent waterlogging",
        "Monitor for fungal diseases in humid conditions",
        "Timely sowing to utilize monsoon effectively"
      );
    } else if (season.toLowerCase().includes('winter')) {
      recommendations.seasonalTips.push(
        "Protect crops from frost damage",
        "Reduce irrigation frequency",
        "Apply phosphorus-rich fertilizers"
      );
    }

    return recommendations;
  } catch (error: any) {
    console.error("User input based recommendations failed:", error);
    return null;
  }
}

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // User authentication (fake login for demo)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, username } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Create new user for demo
        const userData = insertUserSchema.parse({
          email,
          username: username || email.split('@')[0],
          language: "en",
        });
        user = await storage.createUser(userData);
      }

      res.json({ user, message: "Login successful" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Get current user
  app.get("/api/auth/me/:userId", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Update user profile
  app.patch("/api/auth/me/:userId", async (req, res) => {
    try {
      const updates = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.userId, updates);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Weather data with real-time updates
  app.get("/api/weather/:location", async (req, res) => {
    try {
      const { location } = req.params;
      const { realtime, serviceConfig } = req.query;
      
      // Check if real-time is requested or if we have fresh cached data
      let weatherData = await storage.getWeatherData(location);
      
      // Force real-time fetch if requested, or if cached data is older than 15 minutes for better real-time experience
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      const shouldFetchRealTime = realtime === 'true' || !weatherData || !weatherData.updatedAt || weatherData.updatedAt < fifteenMinutesAgo;
      
      if (shouldFetchRealTime) {
        let apiData = null;
        
        // Use service configuration if provided
        if (serviceConfig) {
          try {
            const config = typeof serviceConfig === 'string' ? JSON.parse(serviceConfig) : serviceConfig;
            const selector = new ServiceSelector(config);
            
            if (config.selectedService === 'google-search') {
              // Use Google search for weather data
              apiData = await selector.getWeatherFromSearch(location);
            }
          } catch (error) {
            console.error("Service config parsing error:", error);
          }
        }
        
        // Fallback to enhanced API (multiple real sources) if service selector didn't provide data
        if (!apiData) {
          apiData = await enhancedAgricultureAPIs.getWeatherData(location);
        }
        
        if (apiData) {
          weatherData = await storage.createWeatherData({
            location,
            temperature: apiData.temperature,
            humidity: apiData.humidity,
            windSpeed: apiData.windSpeed,
            uvIndex: apiData.uvIndex,
            rainfall: apiData.rainfall,
            pressure: apiData.pressure,
            description: `${apiData.description} (Source: ${apiData.source})`,
            alerts: apiData.alerts
          });
        } else {
          // Use AI service based on default configuration if all real APIs fail
          const defaultConfig = { selectedService: 'gemini' as const, serviceMode: 'realtime' as const, timestamp: Date.now() };
          const selector = new ServiceSelector(defaultConfig);
          
          try {
            const geminiWeather = await generateWeatherInsights(location);
            weatherData = await storage.createWeatherData({
              location,
              ...geminiWeather,
              description: `${geminiWeather.description} (AI-generated due to API failure)`
            });
          } catch (error) {
            console.error("AI weather generation failed:", error);
            // Ultimate fallback with realistic data
            weatherData = await storage.createWeatherData({
              location,
              temperature: 25,
              humidity: 60,
              windSpeed: 10,
              uvIndex: 5,
              rainfall: 0,
              pressure: 1013,
              description: "Weather data temporarily unavailable",
              alerts: []
            });
          }
        }
      }

      res.json(weatherData);
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ message: "Failed to get weather data" });
    }
  });

  // Market prices with real-time service configuration support
  app.get("/api/market-prices", async (req, res) => {
    try {
      const { crop, realtime, serviceConfig } = req.query;
      
      let prices;
      if (crop) {
        prices = await storage.getMarketPricesByCrop(crop as string);
      } else {
        prices = await storage.getMarketPrices();
      }

      // Check if real-time is requested or if we need fresh data
      const shouldFetchRealTime = realtime === 'true' || prices.length === 0;
      
      if (shouldFetchRealTime) {
        const crops = ["wheat", "rice", "corn", "sugarcane", "cotton"];
        let apiPrices = [];
        
        // Use service configuration if provided
        if (serviceConfig) {
          try {
            const config = typeof serviceConfig === 'string' ? JSON.parse(serviceConfig) : serviceConfig;
            const selector = new ServiceSelector(config);
            
            if (config.selectedService === 'google-search') {
              // Use Google search for market analysis
              apiPrices = await selector.getMarketAnalysisFromSearch(crops);
            }
          } catch (error) {
            console.error("Service config parsing error:", error);
          }
        }
        
        // Fallback to enhanced APIs if service selector didn't provide data
        if (!apiPrices || apiPrices.length === 0) {
          apiPrices = await enhancedAgricultureAPIs.getMarketPrices(crops);
        }
        
        if (apiPrices.length > 0) {
          for (const price of apiPrices) {
            await storage.createMarketPrice({
              cropName: price.crop,
              price: price.price,
              unit: price.unit,
              market: `${price.market} (${price.source})`,
              location: price.location,
              trend: price.change > 0 ? "up" : price.change < 0 ? "down" : "stable",
              trendPercentage: price.change
            });
          }
          prices = await storage.getMarketPrices();
        } else {
          // Try web scraping as backup
          const scrapedPrices = await webScraperService.scrapeAgriculturalMarketData(crops);
          
          if (scrapedPrices.length > 0) {
            for (const price of scrapedPrices) {
              await storage.createMarketPrice({
                cropName: price.crop,
                price: price.price,
                unit: price.unit,
                market: `${price.market} (${price.source})`,
                location: price.location,
                trend: price.change > 0 ? "up" : price.change < 0 ? "down" : "stable",
                trendPercentage: price.change
              });
            }
            prices = await storage.getMarketPrices();
          } else {
            // Last resort: Use configured AI service for market predictions
            const defaultConfig = { selectedService: 'gemini' as const, serviceMode: 'realtime' as const, timestamp: Date.now() };
            
            try {
              const predictions = await generateMarketPredictions(crops);
              res.json(predictions.map(p => ({...p, market: `${p.market} (AI-generated due to data unavailability)`})));
              return;
            } catch (error) {
              console.error("AI market prediction failed:", error);
              // Return empty array to indicate no data available
              res.json([]);
              return;
            }
          }
        }
      }

      res.json(prices);
    } catch (error) {
      console.error("Market prices error:", error);
      res.status(500).json({ message: "Failed to get market prices" });
    }
  });

  // Service configuration endpoint
  app.post("/api/service-config", async (req, res) => {
    try {
      const { selectedService, serviceMode } = req.body;
      const config: ServiceConfig = {
        selectedService: selectedService || 'gemini',
        serviceMode: serviceMode || 'realtime',
        timestamp: Date.now()
      };
      
      // In a real app, you'd store this in the database per user
      // For now, we'll just acknowledge the configuration
      res.json({ success: true, config });
    } catch (error) {
      console.error("Service config error:", error);
      res.status(500).json({ message: "Failed to update service configuration" });
    }
  });

  // Get service configuration
  app.get("/api/service-config", async (req, res) => {
    try {
      // In a real app, you'd fetch this from database
      const defaultConfig: ServiceConfig = {
        selectedService: 'gemini',
        serviceMode: 'realtime',
        timestamp: Date.now()
      };
      res.json(defaultConfig);
    } catch (error) {
      console.error("Get service config error:", error);
      res.status(500).json({ message: "Failed to get service configuration" });
    }
  });

  // Crop recommendations with service selection
  app.post("/api/crop-recommendations", async (req, res) => {
    try {
      const { userId, location, soilType, climate, season, nitrogen, phosphorous, potassium, ph, organicMatter, autoDetectSoil, serviceConfig } = req.body;
      
      // Initialize service selector with user's configuration
      const selector = new ServiceSelector(serviceConfig);
      
      // Get real data from enhanced APIs for fallback
      const coordinates = await getCoordinatesForLocation(location);
      const lat = coordinates?.lat || 28.6139; // Default to Delhi
      const lon = coordinates?.lon || 77.2090;
      
      let weatherData, soilData;
      try {
        weatherData = await enhancedAgricultureAPIs.getWeatherData(location);
        soilData = await enhancedAgricultureAPIs.getSoilData(lat, lon);
      } catch (error) {
        console.log("Enhanced API data not available:", error);
      }
      
      console.log("Weather data:", weatherData);
      console.log("Soil data:", soilData);
      
      let recommendations;
      
      // First try the selected service
      try {
        recommendations = await selector.getCropRecommendations({
          soilType,
          climate,
          season,
          location,
          temperature: weatherData?.temperature,
          humidity: weatherData?.humidity,
          rainfall: weatherData?.rainfall,
          nitrogen,
          phosphorous,
          potassium,
          ph,
          organicMatter,
          autoDetectSoil
        });
        console.log("Service selector recommendations:", recommendations);
      } catch (error) {
        console.error("Service selector failed:", error);
      }
      
      // Fallback to enhanced APIs if available
      if ((!recommendations || !recommendations.recommendedCrops?.length) && weatherData && soilData) {
        recommendations = await enhancedAgricultureAPIs.getCropRecommendations(soilData, weatherData, location);
        console.log("Enhanced API recommendations:", recommendations);
      }
      
      // Fallback to user input based recommendations
      if (!recommendations || !recommendations.recommendedCrops?.length) {
        recommendations = await generateUserInputBasedRecommendations({
          soilType,
          climate,
          season,
          location,
          nitrogen,
          phosphorous,
          potassium,
          ph,
          organicMatter
        });
        console.log("User input recommendations:", recommendations);
      }
      
      // Final fallback to basic Gemini
      if (!recommendations || !recommendations.recommendedCrops?.length) {
        recommendations = await getCropRecommendations({
          soilType,
          climate,
          season,
          location,
          temperature: weatherData?.temperature || 25,
          humidity: weatherData?.humidity || 65,
          rainfall: weatherData?.rainfall || 0,
          nitrogen,
          phosphorous,
          potassium,
          ph,
          organicMatter,
          autoDetectSoil
        });
      }

      // Store recommendation
      const cropRec = await storage.createCropRecommendation({
        userId,
        cropType: recommendations.recommendedCrops.join(", "),
        soilType,
        climate,
        season,
        confidence: 0.85,
        recommendations: recommendations
      });

      res.json(cropRec);
    } catch (error) {
      console.error("Crop recommendations error:", error);
      res.status(500).json({ message: "Failed to generate crop recommendations" });
    }
  });

  // Get user's crop recommendations
  app.get("/api/crop-recommendations/:userId", async (req, res) => {
    try {
      const recommendations = await storage.getCropRecommendations(req.params.userId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  // Pest detection with image upload
  app.post("/api/pest-detection", upload.single("image"), async (req, res) => {
    try {
      const { userId, description, serviceConfig } = req.body;
      const imageFile = req.file;

      if (!imageFile) {
        return res.status(400).json({ message: "Image file is required" });
      }

      const imageBase64 = imageFile.buffer.toString('base64');
      
      // Initialize service selector with user's configuration
      const selector = new ServiceSelector(serviceConfig);
      
      let pestData;
      
      // First try the selected service
      try {
        pestData = await selector.analyzePest(imageBase64, description);
      } catch (error) {
        console.error("Service selector pest analysis failed:", error);
      }
      
      // Fallback to Plant.id API if service selector fails
      if (!pestData) {
        pestData = await enhancedAgricultureAPIs.detectPestFromImage(imageBase64);
      }
      
      // Final fallback to Gemini AI
      if (!pestData) {
        pestData = await analyzePestImage(imageBase64, description || "");
      }

      // Store detection result
      const detection = await storage.createPestDetection({
        userId,
        imageUrl: `data:${imageFile.mimetype};base64,${imageBase64.substring(0, 100)}...`, // Store truncated for demo
        detectedPest: pestData.pest,
        severity: pestData.severity,
        organicSolution: pestData.organicSolution,
        ayurvedicRemedy: pestData.ayurvedicRemedy,
        confidence: pestData.confidence
      });

      res.json(detection);
    } catch (error) {
      console.error("Pest detection error:", error);
      res.status(500).json({ message: "Failed to analyze image" });
    }
  });

  // Get user's pest detections
  app.get("/api/pest-detections/:userId", async (req, res) => {
    try {
      const detections = await storage.getPestDetections(req.params.userId);
      res.json(detections);
    } catch (error) {
      res.status(500).json({ message: "Failed to get pest detections" });
    }
  });

  // IoT sensor data
  app.post("/api/iot-data", async (req, res) => {
    try {
      const sensorData = insertIotSensorDataSchema.parse(req.body);
      const data = await storage.createIotSensorData(sensorData);
      res.json(data);
    } catch (error) {
      console.error("IoT data error:", error);
      res.status(400).json({ message: "Invalid sensor data" });
    }
  });

  // Get user's IoT sensor data
  app.get("/api/iot-data/:userId", async (req, res) => {
    try {
      const { limit } = req.query;
      let data = await storage.getIotSensorData(req.params.userId);
      
      if (limit) {
        data = data.slice(0, parseInt(limit as string));
      }
      
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to get IoT data" });
    }
  });

  // Get latest IoT sensor reading
  app.get("/api/iot-data/:userId/latest", async (req, res) => {
    try {
      const data = await storage.getLatestIotSensorData(req.params.userId);
      res.json(data || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to get latest IoT data" });
    }
  });

  // Community posts
  app.get("/api/community", async (req, res) => {
    try {
      const { category } = req.query;
      
      let posts;
      if (category) {
        posts = await storage.getCommunityPostsByCategory(category as string);
      } else {
        posts = await storage.getCommunityPosts();
      }
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get community posts" });
    }
  });

  app.post("/api/community", async (req, res) => {
    try {
      const postData = insertCommunityPostSchema.parse(req.body);
      const post = await storage.createCommunityPost(postData);
      res.json(post);
    } catch (error) {
      console.error("Community post error:", error);
      res.status(400).json({ message: "Invalid post data" });
    }
  });

  app.post("/api/community/:id/like", async (req, res) => {
    try {
      const post = await storage.likeCommunityPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  // API Key management endpoints
  app.get("/api/api-keys/:userId", async (req, res) => {
    try {
      const apiKeys = await storage.getApiKeys(req.params.userId);
      res.json(apiKeys);
    } catch (error) {
      res.status(500).json({ message: "Failed to get API keys" });
    }
  });

  app.post("/api/api-keys", async (req, res) => {
    try {
      const apiKeyData = insertApiKeySchema.parse(req.body);
      const apiKey = await storage.createApiKey(apiKeyData);
      res.json(apiKey);
    } catch (error) {
      console.error("API key creation error:", error);
      res.status(400).json({ message: "Invalid API key data" });
    }
  });

  app.put("/api/api-keys/:id", async (req, res) => {
    try {
      const updates = insertApiKeySchema.partial().parse(req.body);
      const apiKey = await storage.updateApiKey(req.params.id, updates);
      
      if (!apiKey) {
        return res.status(404).json({ message: "API key not found" });
      }
      
      res.json(apiKey);
    } catch (error) {
      res.status(500).json({ message: "Failed to update API key" });
    }
  });

  app.delete("/api/api-keys/:id", async (req, res) => {
    try {
      const success = await storage.deleteApiKey(req.params.id);
      
      if (!success) {
        return res.status(404).json({ message: "API key not found" });
      }
      
      res.json({ message: "API key deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete API key" });
    }
  });

  // Helper function for demo user
  const getCurrentUserId = () => "demo-user-123";

  // Medicine API routes
  app.get("/api/medicines", async (req, res) => {
    try {
      const medicines = await storage.getMedicines();
      res.json(medicines);
    } catch (error) {
      console.error("Fetch medicines error:", error);
      res.status(500).json({ message: "Failed to fetch medicines" });
    }
  });

  app.get("/api/medicines/:id", async (req, res) => {
    try {
      const medicine = await storage.getMedicine(req.params.id);
      if (!medicine) {
        return res.status(404).json({ message: "Medicine not found" });
      }
      res.json(medicine);
    } catch (error) {
      console.error("Fetch medicine error:", error);
      res.status(500).json({ message: "Failed to fetch medicine" });
    }
  });

  app.get("/api/medicines/category/:category", async (req, res) => {
    try {
      const medicines = await storage.getMedicinesByCategory(req.params.category);
      res.json(medicines);
    } catch (error) {
      console.error("Fetch medicines by category error:", error);
      res.status(500).json({ message: "Failed to fetch medicines by category" });
    }
  });

  app.get("/api/medicines/pest/:pestTarget", async (req, res) => {
    try {
      const medicines = await storage.getMedicinesByPestTarget(req.params.pestTarget);
      res.json(medicines);
    } catch (error) {
      console.error("Fetch medicines by pest target error:", error);
      res.status(500).json({ message: "Failed to fetch medicines by pest target" });
    }
  });

  app.post("/api/medicines", async (req, res) => {
    try {
      const medicineData = insertMedicineSchema.parse(req.body);
      const medicine = await storage.createMedicine(medicineData);
      res.status(201).json(medicine);
    } catch (error) {
      console.error("Create medicine error:", error);
      res.status(400).json({ message: "Invalid medicine data" });
    }
  });

  // Cart API routes
  app.get("/api/cart", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const cartItems = await storage.getCartItems(userId);
      
      // Fetch medicine details for each cart item and filter out items where medicine doesn't exist
      const cartItemsWithMedicines = [];
      const invalidCartItemIds = [];
      
      for (const item of cartItems) {
        const medicine = await storage.getMedicine(item.medicineId!);
        if (medicine) {
          cartItemsWithMedicines.push({
            ...item,
            medicine
          });
        } else {
          // Track invalid cart items to remove them
          invalidCartItemIds.push(item.id);
        }
      }
      
      // Remove invalid cart items (where medicine no longer exists)
      for (const invalidId of invalidCartItemIds) {
        await storage.removeFromCart(invalidId);
      }
      
      res.json(cartItemsWithMedicines);
    } catch (error) {
      console.error("Fetch cart error:", error);
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart/add", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const cartData = insertCartItemSchema.parse({
        ...req.body,
        userId
      });
      const cartItem = await storage.addToCart(cartData);
      res.status(201).json(cartItem);
    } catch (error) {
      console.error("Add to cart error:", error);
      res.status(400).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(cartItem);
    } catch (error) {
      console.error("Update cart error:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const success = await storage.removeFromCart(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json({ message: "Item removed from cart successfully" });
    } catch (error) {
      console.error("Remove from cart error:", error);
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const success = await storage.clearCart(userId);
      res.json({ message: "Cart cleared successfully" });
    } catch (error) {
      console.error("Clear cart error:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Order API routes
  app.get("/api/orders", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Fetch orders error:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId
      });
      
      // Create the order
      const order = await storage.createOrder(orderData);
      
      // Get cart items to create order items
      const cartItems = await storage.getCartItems(userId);
      
      // Create order items from cart items
      for (const cartItem of cartItems) {
        const medicine = await storage.getMedicine(cartItem.medicineId!);
        if (medicine) {
          await storage.createOrderItem({
            orderId: order.id,
            medicineId: cartItem.medicineId!,
            quantity: cartItem.quantity,
            price: medicine.price
          });
        }
      }
      
      // Clear the cart after creating order
      await storage.clearCart(userId);
      
      res.status(201).json(order);
    } catch (error) {
      console.error("Create order error:", error);
      res.status(400).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders/:id/items", async (req, res) => {
    try {
      const orderItems = await storage.getOrderItems(req.params.id);
      
      // Fetch medicine details for each order item
      const orderItemsWithMedicines = await Promise.all(
        orderItems.map(async (item) => {
          const medicine = await storage.getMedicine(item.medicineId!);
          return {
            ...item,
            medicine
          };
        })
      );
      
      res.json(orderItemsWithMedicines);
    } catch (error) {
      console.error("Fetch order items error:", error);
      res.status(500).json({ message: "Failed to fetch order items" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
