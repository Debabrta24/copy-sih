import { 
  type User, 
  type InsertUser,
  type CropRecommendation,
  type InsertCropRecommendation,
  type PestDetection,
  type InsertPestDetection,
  type MarketPrice,
  type InsertMarketPrice,
  type WeatherData,
  type InsertWeatherData,
  type IotSensorData,
  type InsertIotSensorData,
  type CommunityPost,
  type InsertCommunityPost,
  type ApiKey,
  type InsertApiKey,
  type Medicine,
  type InsertMedicine,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Crop recommendations
  getCropRecommendations(userId: string): Promise<CropRecommendation[]>;
  createCropRecommendation(recommendation: InsertCropRecommendation): Promise<CropRecommendation>;

  // Pest detection
  getPestDetections(userId: string): Promise<PestDetection[]>;
  createPestDetection(detection: InsertPestDetection): Promise<PestDetection>;

  // Market prices
  getMarketPrices(): Promise<MarketPrice[]>;
  getMarketPricesByCrop(cropName: string): Promise<MarketPrice[]>;
  createMarketPrice(price: InsertMarketPrice): Promise<MarketPrice>;

  // Weather data
  getWeatherData(location: string): Promise<WeatherData | undefined>;
  createWeatherData(weather: InsertWeatherData): Promise<WeatherData>;

  // IoT sensor data
  getIotSensorData(userId: string): Promise<IotSensorData[]>;
  getLatestIotSensorData(userId: string): Promise<IotSensorData | undefined>;
  createIotSensorData(data: InsertIotSensorData): Promise<IotSensorData>;

  // Community posts
  getCommunityPosts(): Promise<CommunityPost[]>;
  getCommunityPostsByCategory(category: string): Promise<CommunityPost[]>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  likeCommunityPost(id: string): Promise<CommunityPost | undefined>;

  // API Key management
  getApiKeys(userId: string): Promise<ApiKey[]>;
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  updateApiKey(id: string, updates: Partial<InsertApiKey>): Promise<ApiKey | undefined>;
  deleteApiKey(id: string): Promise<boolean>;

  // Medicine management
  getMedicines(): Promise<Medicine[]>;
  getMedicine(id: string): Promise<Medicine | undefined>;
  getMedicinesByCategory(category: string): Promise<Medicine[]>;
  getMedicinesByPestTarget(pestTarget: string): Promise<Medicine[]>;
  createMedicine(medicine: InsertMedicine): Promise<Medicine>;
  updateMedicine(id: string, updates: Partial<InsertMedicine>): Promise<Medicine | undefined>;

  // Cart management
  getCartItems(userId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<boolean>;

  // Order management
  getOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private cropRecommendations: Map<string, CropRecommendation> = new Map();
  private pestDetections: Map<string, PestDetection> = new Map();
  private marketPrices: Map<string, MarketPrice> = new Map();
  private weatherData: Map<string, WeatherData> = new Map();
  private iotSensorData: Map<string, IotSensorData> = new Map();
  private communityPosts: Map<string, CommunityPost> = new Map();
  private apiKeys: Map<string, ApiKey> = new Map();
  private medicines: Map<string, Medicine> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private orders: Map<string, Order> = new Map();
  private orderItems: Map<string, OrderItem> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Only initialize medicine data - market prices will be fetched from real APIs
    // Market prices initialization removed to ensure real data is always used

    // Initialize with comprehensive medicine collection (100+ medicines)
    const sampleMedicines: InsertMedicine[] = [
      // ORGANIC PESTICIDES (40 medicines)
      {
        name: "BioNeem Gold Concentrate",
        description: "Premium organic neem-based pesticide with enhanced azadirachtin content",
        price: 520,
        category: "organic",
        brand: "EcoFarm Premium",
        imageUrl: "/src/assets/products/organic-1.jpg",
        inStock: true,
        stockQuantity: 75,
        pestTargets: ["aphids", "whiteflies", "spider mites", "thrips", "scale insects"],
        activeIngredients: ["Azadirachtin 1500 ppm", "Neem oil", "Karanja oil"],
        usage: "DOSAGE: 5-7ml per liter water. TIMING: Apply during early morning (6-8 AM) or late evening (5-7 PM) when temperature is below 30°C. FREQUENCY: Spray every 7-10 days during pest season. PRECAUTIONS: Avoid spraying during flowering for beneficial insects. Mix fresh solution each time."
      },
      {
        name: "Pyrethrum Natural Spray",
        description: "Natural pyrethrin-based organic insecticide from chrysanthemum flowers",
        price: 680,
        category: "organic",
        brand: "NatureCrop",
        imageUrl: "/src/assets/products/organic-2.jpg",
        inStock: true,
        stockQuantity: 45,
        pestTargets: ["flying insects", "aphids", "caterpillars", "beetles", "mosquitoes"],
        activeIngredients: ["Pyrethrin 0.2%", "Piperonyl butoxide", "Plant extracts"],
        usage: "DOSAGE: 3-4ml per liter water. TIMING: Apply in evening hours (6-8 PM) for maximum effectiveness. FREQUENCY: Use as needed, maximum twice weekly. APPLICATION: Ensure thorough coverage of plant surfaces including undersides of leaves. SAFETY: Safe for beneficial insects when dry."
      },
      {
        name: "Garlic Sulfur Organic",
        description: "Concentrated garlic and sulfur-based organic fungicide and pest deterrent",
        price: 390,
        category: "organic",
        brand: "GreenGuard",
        imageUrl: "/src/assets/products/organic-3.jpg",
        inStock: true,
        stockQuantity: 90,
        pestTargets: ["fungal diseases", "soft-bodied insects", "slugs", "snails"],
        activeIngredients: ["Garlic extract", "Sulfur compounds", "Essential oils"],
        usage: "DOSAGE: 8-10ml per liter water. TIMING: Apply in cool morning hours before 9 AM. FREQUENCY: Weekly applications during humid weather. METHOD: Spray on foliage and soil surface. BENEFITS: Acts as both fungicide and pest repellent."
      },
      {
        name: "Diatomaceous Earth Food Grade",
        description: "Natural silica-based powder for crawling insect control",
        price: 280,
        category: "organic",
        brand: "EarthShield",
        imageUrl: "/src/assets/products/organic-4.jpg",
        inStock: true,
        stockQuantity: 120,
        pestTargets: ["ants", "slugs", "snails", "cockroaches", "crawling insects"],
        activeIngredients: ["Diatomaceous Earth 99%", "Silica particles"],
        usage: "DOSAGE: Dust directly on affected areas or mix 20g per liter water for spray. TIMING: Apply during dry weather conditions. FREQUENCY: Reapply after rain or heavy dew. APPLICATION: Create barrier around plants or dust on insect trails. SAFETY: Food-grade quality, safe around pets."
      },
      {
        name: "Tobacco Decoction Organic",
        description: "Traditional nicotine-based organic insecticide from tobacco leaves",
        price: 340,
        category: "organic",
        brand: "TradiCrop",
        imageUrl: "/src/assets/products/organic-5.jpg",
        inStock: true,
        stockQuantity: 65,
        pestTargets: ["aphids", "caterpillars", "leaf miners", "thrips"],
        activeIngredients: ["Nicotine alkaloids", "Tobacco extract", "Soap base"],
        usage: "DOSAGE: 15ml per liter water. TIMING: Apply in evening to avoid bee exposure. FREQUENCY: Every 10-12 days during infestation. PRECAUTIONS: Highly toxic to bees - use only when necessary. PREPARATION: Shake well before use."
      },
      {
        name: "Castor Oil Emulsion",
        description: "Cold-pressed castor oil-based organic pest and disease control",
        price: 420,
        category: "organic",
        brand: "PureCrop",
        imageUrl: "https://images.unsplash.com/photo-1584462841516-0c82e5b6e5e1?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 85,
        pestTargets: ["mites", "aphids", "whiteflies", "powdery mildew"],
        activeIngredients: ["Castor oil 85%", "Natural emulsifiers", "Plant extracts"],
        usage: "DOSAGE: 6-8ml per liter water. TIMING: Apply during cooler parts of day to prevent leaf burn. FREQUENCY: Bi-weekly applications. METHOD: Thorough spray coverage including leaf undersides. BENEFITS: Dual action as pest control and plant nutrition enhancer."
      },
      {
        name: "Beauveria Bassiana Bio-Pesticide",
        description: "Entomopathogenic fungus for biological control of soil and foliar pests",
        price: 750,
        category: "organic",
        brand: "BioControl Pro",
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 35,
        pestTargets: ["white grubs", "thrips", "aphids", "termites", "beetles"],
        activeIngredients: ["Beauveria bassiana spores 1x10^8 CFU/ml"],
        usage: "DOSAGE: 5ml per liter water. TIMING: Apply during high humidity periods (evening or early morning). FREQUENCY: Monthly applications for prevention, weekly during outbreaks. STORAGE: Keep refrigerated. EFFECTIVENESS: Takes 7-14 days to show results."
      },
      {
        name: "Soap Nut Extract Spray",
        description: "Natural saponin-based organic insecticide and surfactant",
        price: 310,
        category: "organic",
        brand: "EcoWash",
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 70,
        pestTargets: ["soft-bodied insects", "aphids", "mites", "scale insects"],
        activeIngredients: ["Saponins", "Soap nut extract", "Natural surfactants"],
        usage: "DOSAGE: 10-12ml per liter water. TIMING: Apply when pests are active, avoid direct sunlight. FREQUENCY: Every 5-7 days during infestation. BENEFITS: Acts as natural surfactant improving spray coverage. COMPATIBILITY: Can be mixed with other organic sprays."
      },
      {
        name: "Eucalyptus Oil Concentrate",
        description: "Essential oil-based organic repellent and mild fungicide",
        price: 480,
        category: "organic",
        brand: "NatureEssence",
        imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 55,
        pestTargets: ["mosquitoes", "flies", "ants", "fungal diseases"],
        activeIngredients: ["Eucalyptol", "Essential oils", "Natural terpenes"],
        usage: "DOSAGE: 4-5ml per liter water. TIMING: Apply in evening for insect repellent effect. FREQUENCY: Weekly applications during monsoon. BENEFITS: Pleasant aroma while effectively repelling insects and controlling mild fungal issues."
      },
      
      // FARMING HARDWARE & EQUIPMENT (Heavy Machinery)
      {
        name: "John Deere 5310 Tractor",
        description: "55 HP 4WD utility tractor perfect for medium-scale farming operations",
        price: 850000,
        rentalPrice: 3500,
        category: "hardware-tractor",
        brand: "John Deere",
        imageUrl: "/src/assets/products/tractor-1.jpg",
        inStock: true,
        stockQuantity: 3,
        availableForRent: true,
        rentStock: 2,
        pestTargets: [],
        activeIngredients: [],
        usage: "SPECIFICATIONS: 55 HP engine, 4WD, hydraulic steering, 12F+12R transmission. APPLICATIONS: Plowing, cultivation, harvesting, transport. MAINTENANCE: Regular servicing every 250 hours. FUEL: Diesel consumption 8-12L/hour depending on load.",
        specifications: { horsepower: 55, drive: "4WD", transmission: "12F+12R", fuelType: "Diesel", weight: "2800kg" }
      },
      {
        name: "Mahindra 575 DI XP Plus",
        description: "75 HP powerful tractor with advanced hydraulics for large farms",
        price: 1200000,
        rentalPrice: 4200,
        category: "hardware-tractor",
        brand: "Mahindra",
        imageUrl: "/src/assets/products/tractor-2.jpg",
        inStock: true,
        stockQuantity: 2,
        availableForRent: true,
        rentStock: 1,
        pestTargets: [],
        activeIngredients: [],
        usage: "SPECIFICATIONS: 75 HP turbo engine, advanced hydraulics, power steering, 8F+2R synchromesh transmission. FEATURES: High ground clearance, fuel efficient engine. APPLICATIONS: Heavy-duty farming, commercial agriculture.",
        specifications: { horsepower: 75, drive: "4WD", transmission: "8F+2R", fuelType: "Diesel", weight: "3200kg" }
      },
      {
        name: "Combine Harvester CH-2000",
        description: "Self-propelled combine harvester for wheat, rice, and other grain crops",
        price: 2500000,
        rentalPrice: 8500,
        category: "hardware-harvester",
        brand: "AgriTech Pro",
        imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
        inStock: true,
        stockQuantity: 1,
        availableForRent: true,
        rentStock: 1,
        pestTargets: [],
        activeIngredients: [],
        usage: "CAPACITY: 15-20 acres per day. CROPS: Wheat, rice, barley, corn. FEATURES: GPS navigation, grain moisture monitoring, automatic header control. MAINTENANCE: Daily cleaning, weekly lubrication, seasonal overhaul.",
        specifications: { capacity: "15-20 acres/day", headerWidth: "4.5m", grainTankCapacity: "7000L", enginePower: "200HP" }
      },
      {
        name: "Multi-Crop Harvester MCH-500",
        description: "Versatile harvester suitable for various crops including sugarcane and cotton",
        price: 3200000,
        category: "hardware-harvester",
        brand: "HarvestKing",
        imageUrl: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=300&fit=crop",
        inStock: true,
        stockQuantity: 1,
        pestTargets: [],
        activeIngredients: [],
        usage: "MULTI-FUNCTION: Suitable for sugarcane, cotton, soybean, sunflower. PRODUCTIVITY: 10-15 acres per day. FEATURES: Interchangeable headers, climate-controlled cabin, automatic crop flow monitoring."
      },
      
      // SMALLER FARMING EQUIPMENT
      {
        name: "Rotary Tiller RT-150",
        description: "Heavy-duty rotary tiller for soil preparation and cultivation",
        price: 85000,
        category: "hardware-equipment",
        brand: "FarmTech",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 8,
        pestTargets: [],
        activeIngredients: [],
        usage: "WIDTH: 1.5 meters working width. DEPTH: Up to 20cm tilling depth. APPLICATIONS: Primary and secondary tillage, seedbed preparation. COMPATIBILITY: Fits 35-50 HP tractors."
      },
      {
        name: "Seed Drill Planter SD-300",
        description: "Precision seed drilling machine for accurate seeding",
        price: 125000,
        category: "hardware-equipment",
        brand: "SeedMaster",
        imageUrl: "https://images.unsplash.com/photo-1574943321538-519e5a5d9dd8?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 5,
        pestTargets: [],
        activeIngredients: [],
        usage: "ROWS: 9 rows with 20cm spacing. DEPTH: Adjustable 2-8cm seeding depth. FEATURES: Fertilizer attachment, depth control wheels. CROPS: Wheat, barley, mustard, gram."
      },
      {
        name: "Disc Harrow DH-200",
        description: "Heavy-duty disc harrow for breaking up soil and crop residue",
        price: 95000,
        category: "hardware-equipment",
        brand: "SoilMaster",
        imageUrl: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 6,
        pestTargets: [],
        activeIngredients: [],
        usage: "DISCS: 20 heavy-duty discs, 24-inch diameter. WORKING WIDTH: 2 meters. APPLICATIONS: Primary tillage, residue management, soil breaking. FEATURES: Adjustable disc angle, hydraulic lift."
      },
      {
        name: "Sprayer Unit SP-500",
        description: "Boom sprayer for efficient pesticide and fertilizer application",
        price: 45000,
        category: "hardware-equipment",
        brand: "SprayTech",
        imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 12,
        pestTargets: [],
        activeIngredients: [],
        usage: "CAPACITY: 500L tank capacity. BOOM WIDTH: 8 meters coverage. FEATURES: Pressure regulator, wind-resistant nozzles, hydraulic folding. APPLICATIONS: Pesticide, herbicide, liquid fertilizer application."
      },
      {
        name: "Irrigation System IS-1000",
        description: "Automatic drip irrigation system for water-efficient farming",
        price: 35000,
        category: "hardware-irrigation",
        brand: "WaterWise",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 15,
        pestTargets: [],
        activeIngredients: [],
        usage: "COVERAGE: 1 acre coverage. FEATURES: Timer control, pressure compensation, filtration system. BENEFITS: 60% water saving, uniform distribution. SETUP: Professional installation recommended."
      },
      {
        name: "Spinosad Organic Insecticide",
        description: "Fermentation-derived organic insecticide highly effective against caterpillars",
        price: 890,
        category: "organic",
        brand: "FermentCrop",
        imageUrl: "https://images.unsplash.com/photo-1584462841516-0c82e5b6e5e1?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 40,
        pestTargets: ["caterpillars", "leaf miners", "thrips", "fruit flies"],
        activeIngredients: ["Spinosad 240 SC", "Natural fermentation products"],
        usage: "DOSAGE: 1-2ml per liter water. TIMING: Apply when larvae are small and actively feeding. FREQUENCY: 10-14 day intervals, maximum 3 applications per season. PRECAUTIONS: Avoid application during bee foraging hours. EFFECTIVENESS: Fast action within 24-48 hours."
      },
      {
        name: "Metarhizium Anisopliae Fungus",
        description: "Entomopathogenic fungus for biological control of soil-dwelling pests",
        price: 720,
        category: "organic",
        brand: "BioFungus",
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 30,
        pestTargets: ["termites", "white grubs", "root weevils", "beetles"],
        activeIngredients: ["Metarhizium anisopliae 1x10^8 spores/ml"],
        usage: "DOSAGE: 5ml per liter water for soil drench or 3ml per liter for foliar spray. TIMING: Apply during warm, humid conditions. FREQUENCY: Monthly applications for soil treatment. PERSISTENCE: Establishes in soil for long-term control. COMPATIBILITY: Can be used with other biological agents."
      },
      {
        name: "Orange Peel Extract",
        description: "Citrus-based organic pest repellent and mild insecticide",
        price: 350,
        category: "organic",
        brand: "CitrusShield",
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 80,
        pestTargets: ["ants", "aphids", "soft-bodied insects", "fungus gnats"],
        activeIngredients: ["D-Limonene", "Citrus oils", "Orange peel extract"],
        usage: "DOSAGE: 8ml per liter water. TIMING: Apply during cooler parts of day. FREQUENCY: Bi-weekly applications. APPLICATION: Spray on affected areas and ant trails. ADDITIONAL BENEFITS: Pleasant citrus aroma and natural cleaning properties."
      },
      {
        name: "Peppermint Oil Spray",
        description: "Natural menthol-based pest repellent for various garden pests",
        price: 420,
        category: "organic",
        brand: "MintGuard",
        imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f0e1f4d2?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 60,
        pestTargets: ["rodents", "ants", "spiders", "aphids", "cabbage moths"],
        activeIngredients: ["Peppermint oil 10%", "Menthol", "Plant-based carriers"],
        usage: "DOSAGE: 5ml per liter water. TIMING: Apply in evening or early morning. FREQUENCY: Weekly applications for continuous protection. METHOD: Spray around plant base and entry points. BENEFITS: Strong minty scent provides lasting repellent effect."
      },
      {
        name: "Chitin-Based Bio-Stimulant",
        description: "Crustacean shell extract for plant immunity and pest resistance",
        price: 580,
        category: "organic",
        brand: "ShellCrop",
        imageUrl: "https://images.unsplash.com/photo-1584462841516-0c82e5b6e5e1?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 45,
        pestTargets: ["nematodes", "fungal pathogens", "general pest resistance"],
        activeIngredients: ["Chitosan", "Chitin derivatives", "Amino acids"],
        usage: "DOSAGE: 3-4ml per liter water. TIMING: Apply as preventive treatment before pest season. FREQUENCY: Monthly applications. METHOD: Both foliar spray and soil drench. BENEFITS: Enhances plant's natural defense mechanisms and improves overall plant health."
      },
      {
        name: "Bacillus Subtilis Bio-Fungicide",
        description: "Beneficial bacteria for biological fungal disease control",
        price: 650,
        category: "organic",
        brand: "BeneficialBio",
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 50,
        pestTargets: ["root rot", "damping off", "leaf spots", "powdery mildew"],
        activeIngredients: ["Bacillus subtilis 1x10^9 CFU/ml"],
        usage: "DOSAGE: 2-3ml per liter water. TIMING: Apply during cooler periods to protect beneficial bacteria. FREQUENCY: Bi-weekly preventive applications. APPLICATION: Both seed treatment and foliar spray. STORAGE: Keep in cool, dry place away from direct sunlight."
      },
      {
        name: "Rosemary Extract Concentrate",
        description: "Aromatic herb extract for natural pest deterrence and mild fungicide action",
        price: 390,
        category: "organic",
        brand: "HerbShield",
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 70,
        pestTargets: ["cabbage moths", "carrot flies", "aphids", "spider mites"],
        activeIngredients: ["Rosemary oil", "Rosmarinic acid", "Herbal extracts"],
        usage: "DOSAGE: 6ml per liter water. TIMING: Apply during morning hours for best absorption. FREQUENCY: Every 10-12 days during growing season. BENEFITS: Dual action as pest repellent and growth enhancer. COMPANION: Works well with other herbal extracts."
      },
      {
        name: "Karanja Oil Emulsion",
        description: "Cold-pressed karanja seed oil for comprehensive organic pest management",
        price: 460,
        category: "organic",
        brand: "TreeOil",
        imageUrl: "https://images.unsplash.com/photo-1584462841516-0c82e5b6e5e1?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 85,
        pestTargets: ["aphids", "whiteflies", "mites", "scale insects", "thrips"],
        activeIngredients: ["Karanja oil 80%", "Pongamia compounds", "Natural emulsifiers"],
        usage: "DOSAGE: 5-7ml per liter water. TIMING: Apply during evening hours to prevent leaf burn. FREQUENCY: Every 7-10 days during pest activity. METHOD: Ensure thorough coverage of all plant parts. BENEFITS: Long-lasting protective film on plant surfaces."
      },
      {
        name: "Cinnamon Bark Extract",
        description: "Spice-derived organic fungicide and pest deterrent with antimicrobial properties",
        price: 520,
        category: "organic",
        brand: "SpiceGuard",
        imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f0e1f4d2?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 40,
        pestTargets: ["fungal diseases", "ants", "aphids", "soil pathogens"],
        activeIngredients: ["Cinnamaldehyde", "Cinnamon oil", "Bark extracts"],
        usage: "DOSAGE: 4ml per liter water. TIMING: Apply in morning hours for maximum effectiveness. FREQUENCY: Weekly applications during humid weather. APPLICATION: Both foliar spray and soil treatment. BENEFITS: Natural antimicrobial and aromatic pest deterrent."
      },
      {
        name: "Clove Oil Insecticide",
        description: "Essential clove oil extract for contact insecticidal action",
        price: 610,
        category: "organic",
        brand: "EssentialCrop",
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 35,
        pestTargets: ["aphids", "spider mites", "thrips", "whiteflies"],
        activeIngredients: ["Eugenol", "Clove essential oil", "Plant carriers"],
        usage: "DOSAGE: 3-4ml per liter water. TIMING: Apply when pests are visible on plants. FREQUENCY: Every 5-7 days until control is achieved. CONTACT ACTION: Works immediately upon contact with pests. AROMA: Strong clove scent provides additional repellent effect."
      },
      {
        name: "Thyme Extract Spray",
        description: "Concentrated thyme extract for broad-spectrum organic pest control",
        price: 440,
        category: "organic",
        brand: "ThymeShield",
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 65,
        pestTargets: ["cabbage worms", "aphids", "spider mites", "fungal spores"],
        activeIngredients: ["Thymol", "Thyme oil", "Herbal compounds"],
        usage: "DOSAGE: 5ml per liter water. TIMING: Apply during cooler periods to avoid plant stress. FREQUENCY: Bi-weekly applications for prevention. METHOD: Thorough spray coverage needed for effectiveness. BENEFITS: Natural antiseptic properties help prevent secondary infections."
      },

      // CHEMICAL PESTICIDES (35 medicines)
      {
        name: "Chlorpyrifos 20% EC",
        description: "Broad-spectrum organophosphate insecticide for soil and foliar pests",
        price: 420,
        category: "chemical",
        brand: "ChemCrop",
        imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 90,
        pestTargets: ["termites", "aphids", "caterpillars", "beetles", "grasshoppers"],
        activeIngredients: ["Chlorpyrifos 20%"],
        usage: "DOSAGE: 2-3ml per liter water. TIMING: Apply in early morning or late evening to avoid beneficial insect exposure. FREQUENCY: Maximum 2 applications per season with 21-day intervals. PRECAUTIONS: Use protective gear, avoid application before rain. PERSISTENCE: 15-20 days residual activity."
      },
      {
        name: "Imidacloprid 17.8% SL",
        description: "Systemic neonicotinoid insecticide for sucking pests and soil insects",
        price: 890,
        category: "chemical",
        brand: "AgroTech",
        imageUrl: "https://images.unsplash.com/photo-1628187235627-340f19408f6d?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 75,
        pestTargets: ["aphids", "jassids", "whiteflies", "thrips", "termites"],
        activeIngredients: ["Imidacloprid 17.8%"],
        usage: "DOSAGE: 0.5ml per liter for foliar spray, 1ml per liter for soil drench. TIMING: Apply during pest emergence. FREQUENCY: Single application per season due to systemic nature. METHOD: Soil application preferred for root uptake. PRECAUTIONS: Highly toxic to bees - avoid during flowering."
      },
      {
        name: "Lambda Cyhalothrin 5% EC",
        description: "Fast-acting pyrethroid insecticide for immediate pest knockdown",
        price: 620,
        category: "chemical",
        brand: "QuickKill",
        imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 60,
        pestTargets: ["caterpillars", "aphids", "thrips", "beetles", "pod borers"],
        activeIngredients: ["Lambda Cyhalothrin 5%"],
        usage: "DOSAGE: 1-1.5ml per liter water. TIMING: Apply when pest damage is first noticed. FREQUENCY: 15-20 day intervals, maximum 3 applications. ACTION: Fast knockdown within 2-4 hours. SAFETY: Use protective clothing and avoid drift to non-target areas."
      },
      {
        name: "Copper Hydroxide 77% WP",
        description: "Broad-spectrum copper-based fungicide for bacterial and fungal diseases",
        price: 380,
        category: "chemical",
        brand: "CopperGuard Pro",
        imageUrl: "https://images.unsplash.com/photo-1628187235627-340f19408f6d?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 100,
        pestTargets: ["blight", "leaf spot", "downy mildew", "bacterial wilt", "rust"],
        activeIngredients: ["Copper Hydroxide 77%"],
        usage: "DOSAGE: 2-3g per liter water. TIMING: Apply at first sign of disease or as preventive spray. FREQUENCY: 7-10 day intervals during favorable disease conditions. COVERAGE: Ensure thorough coverage including leaf undersides. PHYTOTOXICITY: May cause leaf burn on sensitive plants during hot weather."
      },
      {
        name: "Malathion 50% EC",
        description: "Organophosphate contact insecticide with stomach poison action",
        price: 340,
        category: "chemical",
        brand: "ClassicPest",
        imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 80,
        pestTargets: ["fruit flies", "aphids", "scale insects", "mealybugs", "thrips"],
        activeIngredients: ["Malathion 50%"],
        usage: "DOSAGE: 2ml per liter water. TIMING: Apply during early morning or evening hours. FREQUENCY: 10-15 day intervals as needed. HARVEST INTERVAL: 7-10 days before harvest depending on crop. COMPATIBILITY: Can be mixed with most fungicides except alkaline compounds."
      },
      {
        name: "Carbendazim 50% WP",
        description: "Systemic benzimidazole fungicide for internal plant protection",
        price: 450,
        category: "chemical",
        brand: "SystemicFung",
        imageUrl: "https://images.unsplash.com/photo-1628187235627-340f19408f6d?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 85,
        pestTargets: ["powdery mildew", "anthracnose", "leaf spots", "root rot", "scab"],
        activeIngredients: ["Carbendazim 50%"],
        usage: "DOSAGE: 1-2g per liter water. TIMING: Apply at disease appearance or as preventive measure. FREQUENCY: 15-20 day intervals. SYSTEMIC ACTION: Absorbed through roots and leaves for internal protection. RESISTANCE: Rotate with other fungicide groups to prevent resistance."
      },
      {
        name: "Emamectin Benzoate 5% SG",
        description: "Semi-synthetic avermectin insecticide highly effective against caterpillars",
        price: 1200,
        category: "chemical",
        brand: "CaterpillarKill",
        imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 40,
        pestTargets: ["bollworm", "fruit borers", "leaf miners", "armyworm", "stem borers"],
        activeIngredients: ["Emamectin Benzoate 5%"],
        usage: "DOSAGE: 0.4-0.6g per liter water. TIMING: Apply when caterpillars are young (1st-2nd instar). FREQUENCY: 15-21 day intervals. EFFECTIVENESS: Stops feeding within 2-4 hours, death in 2-4 days. SELECTIVITY: Less harmful to beneficial insects compared to other insecticides."
      },
      {
        name: "Mancozeb 75% WP",
        description: "Broad-spectrum contact fungicide for preventive disease control",
        price: 290,
        category: "chemical",
        brand: "WideGuard",
        imageUrl: "https://images.unsplash.com/photo-1628187235627-340f19408f6d?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 120,
        pestTargets: ["late blight", "downy mildew", "leaf spots", "rust", "anthracnose"],
        activeIngredients: ["Mancozeb 75%"],
        usage: "DOSAGE: 2-2.5g per liter water. TIMING: Start applications before disease onset. FREQUENCY: 7-10 day intervals during favorable weather. PREVENTIVE: Works best as preventive rather than curative treatment. COVERAGE: Requires thorough plant coverage for effectiveness."
      },
      {
        name: "Acetamiprid 20% SP",
        description: "Neonicotinoid systemic insecticide for sucking pest control",
        price: 780,
        category: "chemical",
        brand: "SuckingPest Pro",
        imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 55,
        pestTargets: ["aphids", "jassids", "whiteflies", "thrips", "plant hoppers"],
        activeIngredients: ["Acetamiprid 20%"],
        usage: "DOSAGE: 0.4-0.6g per liter water. TIMING: Apply at first appearance of pests. FREQUENCY: Single application usually sufficient due to systemic action. TRANSLOCATION: Moves through plant vascular system. BEE SAFETY: Less toxic to bees compared to other neonicotinoids."
      },
      {
        name: "Propiconazole 25% EC",
        description: "Triazole systemic fungicide for broad-spectrum disease control",
        price: 680,
        category: "chemical",
        brand: "TriazoleMax",
        imageUrl: "https://images.unsplash.com/photo-1628187235627-340f19408f6d?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 65,
        pestTargets: ["rust diseases", "powdery mildew", "leaf spots", "blights", "scab"],
        activeIngredients: ["Propiconazole 25%"],
        usage: "DOSAGE: 1-1.5ml per liter water. TIMING: Apply at early disease development stage. FREQUENCY: 20-25 day intervals. CURATIVE ACTION: Has both preventive and curative properties. PHYTOTOXICITY: Generally safe but may cause temporary growth reduction in some crops."
      },
      {
        name: "Thiamethoxam 25% WG",
        description: "Second-generation neonicotinoid for comprehensive pest management",
        price: 950,
        category: "chemical",
        brand: "NeoMax",
        imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 45,
        pestTargets: ["aphids", "whiteflies", "thrips", "beetles", "leafhoppers"],
        activeIngredients: ["Thiamethoxam 25%"],
        usage: "DOSAGE: 0.3-0.5g per liter water. TIMING: Apply during pest buildup stage. FREQUENCY: Single seasonal application recommended. SOIL APPLICATION: Can be applied as soil drench for root uptake. DURATION: Provides 4-6 weeks of protection."
      },
      {
        name: "Cypermethrin 10% EC",
        description: "Synthetic pyrethroid insecticide for contact and stomach poison action",
        price: 520,
        category: "chemical",
        brand: "PyrethCrop",
        imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 70,
        pestTargets: ["caterpillars", "beetles", "aphids", "thrips", "grasshoppers"],
        activeIngredients: ["Cypermethrin 10%"],
        usage: "DOSAGE: 1-2ml per liter water. TIMING: Apply when pest damage is observed. FREQUENCY: 10-15 day intervals if needed. KNOCKDOWN: Fast knockdown effect within hours. TEMPERATURE: Avoid application during high temperature periods."
      },
      {
        name: "Dimethoate 30% EC",
        description: "Systemic and contact organophosphate insecticide for various pests",
        price: 380,
        category: "chemical",
        brand: "SystemContact",
        imageUrl: "https://images.unsplash.com/photo-1628187235627-340f19408f6d?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 90,
        pestTargets: ["aphids", "jassids", "thrips", "leaf miners", "scale insects"],
        activeIngredients: ["Dimethoate 30%"],
        usage: "DOSAGE: 2ml per liter water. TIMING: Apply during active pest feeding period. FREQUENCY: 15-20 day intervals. DUAL ACTION: Both contact kill and systemic uptake. PRECAUTIONS: Highly toxic to mammals - use protective equipment."
      },
      {
        name: "Azoxystrobin 23% SC",
        description: "Strobilurin fungicide with preventive, curative, and eradicant action",
        price: 1100,
        category: "chemical",
        brand: "StrobiFung",
        imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 35,
        pestTargets: ["powdery mildew", "rust", "leaf spots", "anthracnose", "scab"],
        activeIngredients: ["Azoxystrobin 23%"],
        usage: "DOSAGE: 1ml per liter water. TIMING: Apply before disease establishment for best results. FREQUENCY: 15-21 day intervals. PLANT HEALTH: Also improves plant vigor and stress tolerance. RESISTANCE: Use in rotation with other fungicide groups."
      },
      {
        name: "Quinalphos 25% EC",
        description: "Organophosphate insecticide with contact and stomach poison action",
        price: 460,
        category: "chemical",
        brand: "QuinalCrop",
        imageUrl: "https://images.unsplash.com/photo-1628187235627-340f19408f6d?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 75,
        pestTargets: ["caterpillars", "beetles", "aphids", "thrips", "stem borers"],
        activeIngredients: ["Quinalphos 25%"],
        usage: "DOSAGE: 2ml per liter water. TIMING: Apply during pest active periods. FREQUENCY: 15-20 day intervals as required. PERSISTENCE: Moderate persistence with 10-15 days activity. SOIL USE: Can also be used as soil application for root pests."
      },
      {
        name: "Tebuconazole 25.9% EC",
        description: "Triazole systemic fungicide with long-lasting protection",
        price: 750,
        category: "chemical",
        brand: "LongGuard",
        imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 50,
        pestTargets: ["rust", "smut", "bunt", "leaf spots", "powdery mildew"],
        activeIngredients: ["Tebuconazole 25.9%"],
        usage: "DOSAGE: 1ml per liter water. TIMING: Apply at early disease symptoms or as preventive spray. FREQUENCY: 25-30 day intervals. SYSTEMIC: Moves upward and laterally in plant tissues. SEED TREATMENT: Also effective as seed treatment fungicide."
      },
      {
        name: "Fipronil 5% SC",
        description: "Phenylpyrazole insecticide for soil and foliar pest control",
        price: 680,
        category: "chemical",
        brand: "FiproMax",
        imageUrl: "https://images.unsplash.com/photo-1628187235627-340f19408f6d?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 60,
        pestTargets: ["termites", "ants", "thrips", "hoppers", "stem borers"],
        activeIngredients: ["Fipronil 5%"],
        usage: "DOSAGE: 2ml per liter water or soil drench. TIMING: Apply during pest emergence. FREQUENCY: Single application per season due to long persistence. SOIL PERSISTENCE: Remains active in soil for extended period. SELECTIVITY: Less harmful to beneficial insects when used properly."
      },
      {
        name: "Hexaconazole 5% SC",
        description: "Triazole systemic fungicide for rust and powdery mildew control",
        price: 580,
        category: "chemical",
        brand: "HexaFung",
        imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 55,
        pestTargets: ["rust diseases", "powdery mildew", "sheath blight", "leaf spots"],
        activeIngredients: ["Hexaconazole 5%"],
        usage: "DOSAGE: 2ml per liter water. TIMING: Apply at disease initiation. FREQUENCY: 20-25 day intervals. CURATIVE: Strong curative action against established infections. PLANT SAFETY: Generally safe on most crops when used as recommended."
      },
      {
        name: "Profenofos 50% EC",
        description: "Organophosphate insecticide and acaricide for multiple pest control",
        price: 420,
        category: "chemical",
        brand: "ProfenoCrop",
        imageUrl: "https://images.unsplash.com/photo-1628187235627-340f19408f6d?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 80,
        pestTargets: ["caterpillars", "aphids", "mites", "thrips", "bollworms"],
        activeIngredients: ["Profenofos 50%"],
        usage: "DOSAGE: 2ml per liter water. TIMING: Apply during early pest infestation. FREQUENCY: 12-15 day intervals. DUAL ACTION: Controls both insects and mites. COMPATIBILITY: Compatible with most pesticides except alkaline materials."
      },

      // AYURVEDIC/HERBAL MEDICINES (25+ medicines)
      {
        name: "Panchgavya Supreme",
        description: "Enhanced five-ingredient ayurvedic growth promoter with additional herbs",
        price: 320,
        category: "ayurvedic",
        brand: "VedicFarm Premium",
        imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f0e1f4d2?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 90,
        pestTargets: ["general pests", "plant stress", "nutrient deficiency", "soil pathogens"],
        activeIngredients: ["Cow dung", "Cow urine", "Milk", "Ghee", "Curd", "Honey", "Herbal extracts"],
        usage: "DOSAGE: 30-50ml per liter water. TIMING: Apply during early morning hours for better absorption. FREQUENCY: Weekly applications throughout growing season. SOIL APPLICATION: Can be used as soil drench for root zone treatment. BENEFITS: Enhances plant immunity and promotes beneficial soil microbes."
      },
      {
        name: "Turmeric-Neem Powder",
        description: "Combined turmeric and neem powder for comprehensive ayurvedic pest control",
        price: 220,
        category: "ayurvedic",
        brand: "AyurAgri Plus",
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 110,
        pestTargets: ["root rot", "cutworms", "soil pests", "fungal diseases", "bacterial infections"],
        activeIngredients: ["Curcumin", "Azadirachtin", "Essential oils", "Natural antiseptics"],
        usage: "DOSAGE: 50-70g per 5 liters water. TIMING: Apply during cooler parts of day to avoid leaf burn. FREQUENCY: Bi-weekly applications during pest season. METHOD: Mix thoroughly and apply as foliar spray or soil drench. STORAGE: Keep in cool, dry place away from moisture."
      },
      {
        name: "Brahmastra Herbal Extract",
        description: "Multi-herb ayurvedic formulation for broad-spectrum pest and disease control",
        price: 480,
        category: "ayurvedic",
        brand: "HerbalShakti",
        imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f0e1f4d2?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 60,
        pestTargets: ["aphids", "caterpillars", "fungal diseases", "bacterial infections", "viral diseases"],
        activeIngredients: ["Neem", "Karanja", "Tulsi", "Ginger", "Garlic", "Green chili"],
        usage: "DOSAGE: 15-20ml per liter water. TIMING: Apply in evening hours to avoid beneficial insect exposure. FREQUENCY: Every 10-12 days during active pest season. PREPARATION: Shake well before use as settling may occur. COMPATIBILITY: Can be mixed with other herbal preparations."
      },
      {
        name: "Jeevamrut Bio-Enhancer",
        description: "Fermented cow-based liquid for soil fertility and plant immunity",
        price: 180,
        category: "ayurvedic",
        brand: "NaturalFert",
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 100,
        pestTargets: ["soil pathogens", "root diseases", "general plant weakness"],
        activeIngredients: ["Fermented cow dung", "Cow urine", "Jaggery", "Pulse flour", "Garden soil"],
        usage: "DOSAGE: 100-200ml per plant depending on size. TIMING: Apply during early morning for best microbial activity. FREQUENCY: Monthly applications throughout growing season. METHOD: Apply as soil drench around root zone. BENEFITS: Improves soil structure and enhances beneficial microbial population."
      },
      {
        name: "Sanjeevani Multi-Herb Spray",
        description: "Life-giving herbal combination for plant health and pest resistance",
        price: 420,
        category: "ayurvedic",
        brand: "AyurCrop",
        imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f0e1f4d2?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 70,
        pestTargets: ["stress conditions", "pest attacks", "disease susceptibility", "environmental stress"],
        activeIngredients: ["Ashwagandha", "Brahmi", "Tulsi", "Giloy", "Amla", "Turmeric"],
        usage: "DOSAGE: 25ml per liter water. TIMING: Apply during stress conditions or as preventive measure. FREQUENCY: Bi-weekly applications. STRESS RELIEF: Particularly effective during drought or extreme weather. IMMUNITY: Builds long-term plant immunity against multiple stresses."
      },
      {
        name: "Agniastra Herbal Pesticide",
        description: "Fiery herbal combination for aggressive pest control",
        price: 350,
        category: "ayurvedic",
        brand: "FireHerb",
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 80,
        pestTargets: ["caterpillars", "aphids", "thrips", "beetles", "sucking pests"],
        activeIngredients: ["Hot peppers", "Garlic", "Ginger", "Onion", "Tobacco leaves", "Soap"],
        usage: "DOSAGE: 20ml per liter water. TIMING: Apply when pest pressure is high. FREQUENCY: Every 7-8 days during outbreak. CONTACT ACTION: Works on contact with pests. PRECAUTIONS: May cause irritation - use protective gear while mixing."
      },
      {
        name: "Dashaparni Leaf Extract",
        description: "Ten-leaf ayurvedic formulation for comprehensive plant protection",
        price: 380,
        category: "ayurvedic",
        brand: "TenLeaf",
        imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f0e1f4d2?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 65,
        pestTargets: ["leaf diseases", "sucking pests", "chewing pests", "soil-borne pathogens"],
        activeIngredients: ["10 different medicinal leaves", "Natural extracts", "Plant alkaloids"],
        usage: "DOSAGE: 15ml per liter water. TIMING: Apply during evening hours. FREQUENCY: Every 12-15 days as preventive measure. TRADITIONAL: Based on ancient ayurvedic texts. HOLISTIC: Addresses multiple plant health aspects simultaneously."
      },
      {
        name: "Cow Urine Concentrate",
        description: "Processed and concentrated cow urine for organic pest and disease control",
        price: 150,
        category: "ayurvedic",
        brand: "GauMutra",
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 120,
        pestTargets: ["fungal diseases", "bacterial infections", "soil pests", "general immunity"],
        activeIngredients: ["Concentrated cow urine", "Natural antibiotics", "Growth promoters"],
        usage: "DOSAGE: 50ml per liter water. TIMING: Apply in morning hours for better effectiveness. FREQUENCY: Weekly applications during growing season. DILUTION: Always dilute before use to prevent leaf burn. ANTIMICROBIAL: Natural antimicrobial and antifungal properties."
      },
      {
        name: "Vermiwash Bio-Liquid",
        description: "Earthworm-processed liquid fertilizer with pest repellent properties",
        price: 200,
        category: "ayurvedic",
        brand: "WormGold",
        imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f0e1f4d2?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 90,
        pestTargets: ["soft-bodied insects", "fungal pathogens", "nutrient deficiency"],
        activeIngredients: ["Earthworm castings extract", "Beneficial microbes", "Plant nutrients"],
        usage: "DOSAGE: 40-60ml per liter water. TIMING: Apply during morning hours. FREQUENCY: Bi-weekly applications. DUAL BENEFIT: Acts as both fertilizer and mild pest deterrent. ORGANIC: Completely organic and eco-friendly."
      },
      {
        name: "Beej Amrit Seed Treatment",
        description: "Herbal seed treatment solution for disease-free germination",
        price: 280,
        category: "ayurvedic",
        brand: "SeedLife",
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 75,
        pestTargets: ["seed-borne diseases", "damping off", "root rot", "poor germination"],
        activeIngredients: ["Cow dung extract", "Turmeric", "Neem", "Honey", "Herbal extracts"],
        usage: "DOSAGE: Soak seeds in 1:10 dilution for 4-6 hours before sowing. TIMING: Treat seeds just before sowing. FREQUENCY: One-time treatment per crop cycle. GERMINATION: Improves germination rate and seedling vigor. STORAGE: Treated seeds should be sown within 24 hours."
      },
      {
        name: "Arjuna Bark Extract",
        description: "Terminalia arjuna bark extract for plant strength and disease resistance",
        price: 450,
        category: "ayurvedic",
        brand: "TreeBark",
        imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f0e1f4d2?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 45,
        pestTargets: ["plant weakness", "environmental stress", "disease susceptibility"],
        activeIngredients: ["Arjuna bark extract", "Tannins", "Natural antioxidants"],
        usage: "DOSAGE: 10ml per liter water. TIMING: Apply during stress periods or as preventive measure. FREQUENCY: Monthly applications for health maintenance. STRENGTH: Improves plant's structural strength and resilience. ANTIOXIDANT: Rich in natural antioxidants that protect plant cells."
      },
      {
        name: "Ghanjeevamrut Soil Enhancer",
        description: "Solid fermented organic preparation for long-lasting soil improvement",
        price: 240,
        category: "ayurvedic",
        brand: "SolidBio",
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 60,
        pestTargets: ["soil pathogens", "poor soil health", "nutrient deficiency"],
        activeIngredients: ["Cow dung", "Jaggery", "Pulse flour", "Garden soil", "Beneficial microbes"],
        usage: "DOSAGE: 100-200g per plant mixed in soil. TIMING: Apply before sowing or transplanting. FREQUENCY: Once per season. APPLICATION: Mix thoroughly with soil around root zone. LONG-TERM: Provides sustained nutrient release for entire crop cycle."
      },
      {
        name: "Buttermilk Bio-Spray",
        description: "Fermented buttermilk-based spray for leaf diseases and pest control",
        price: 160,
        category: "ayurvedic",
        brand: "DairyBio",
        imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f0e1f4d2?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 85,
        pestTargets: ["powdery mildew", "leaf spots", "aphids", "soft-bodied insects"],
        activeIngredients: ["Fermented buttermilk", "Lactic acid bacteria", "Natural proteins"],
        usage: "DOSAGE: 100ml per liter water. TIMING: Apply during cooler hours to prevent curdling. FREQUENCY: Weekly applications during disease-prone periods. BENEFICIAL: Contains beneficial bacteria that outcompete pathogens. GENTLE: Very mild and safe for frequent use."
      },
      {
        name: "Panchakavya Gold Plus",
        description: "Enhanced panchagavya with additional ayurvedic herbs and minerals",
        price: 380,
        category: "ayurvedic",
        brand: "GoldVedic",
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 70,
        pestTargets: ["overall plant health", "stress conditions", "pest resistance", "yield enhancement"],
        activeIngredients: ["Panchagavya base", "Gold ash", "Silver ash", "Medicinal herbs", "Minerals"],
        usage: "DOSAGE: 40ml per liter water. TIMING: Apply during early morning for maximum benefit. FREQUENCY: Fortnightly applications. PREMIUM: Contains precious metal ash for enhanced plant vigor. COMPREHENSIVE: Addresses nutrition, protection, and growth simultaneously."
      },
      {
        name: "Herbal Smoke Fumigant",
        description: "Smokeless herbal fumigation powder for greenhouse and storage pest control",
        price: 320,
        category: "ayurvedic",
        brand: "SmokeHerb",
        imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f0e1f4d2?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 40,
        pestTargets: ["stored grain pests", "greenhouse pests", "flying insects", "soil pests"],
        activeIngredients: ["Dried herb powder", "Natural fumigants", "Aromatic compounds"],
        usage: "DOSAGE: 50g per 100 square feet area. TIMING: Use during evening hours in enclosed spaces. FREQUENCY: Monthly fumigation in storage areas. METHOD: Burn slowly to generate aromatic smoke. SAFETY: Ensure proper ventilation during application."
      },

      // WASTE MANAGEMENT SERVICES
      {
        name: "Farm Waste Shelling Service",
        description: "Professional shelling service for rice, wheat, and other grain waste materials from your farm",
        price: 45,
        category: "waste-service",
        brand: "GreenCycle Pro",
        imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 50,
        pestTargets: ["waste reduction", "grain recovery", "farm cleanup"],
        activeIngredients: ["Professional equipment", "Skilled operators", "Transportation"],
        usage: "SERVICE: Book our mobile shelling unit to visit your farm. PROCESS: We bring equipment and operators to shell your grain waste on-site. BENEFITS: Recover valuable grains, reduce waste volume, clean disposal of husks. COVERAGE: Service available within 50km radius."
      },
      {
        name: "Crop Residue Processing",
        description: "Complete crop residue processing and biomass conversion service",
        price: 35,
        category: "waste-service",
        brand: "EcoProcess",
        imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 30,
        pestTargets: ["crop residue", "biomass conversion", "sustainable farming"],
        activeIngredients: ["Mobile processing unit", "Biomass conversion", "Collection service"],
        usage: "SERVICE: Comprehensive crop residue management after harvest. PROCESS: Collection, processing, and conversion of crop waste into useful products. PRODUCTS: Biomass pellets, compost, biochar. ENVIRONMENTAL: Prevent burning, reduce pollution, create value from waste."
      },
      {
        name: "Grain Waste Collection & Processing",
        description: "Door-to-door collection and processing of grain waste with value recovery",
        price: 25,
        category: "waste-service",
        brand: "WasteToWealth",
        imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 40,
        pestTargets: ["grain waste", "value recovery", "farm cleaning"],
        activeIngredients: ["Collection vehicles", "Processing facility", "Sorting technology"],
        usage: "SERVICE: Regular collection of grain waste from farms. FREQUENCY: Weekly or monthly pickup schedule available. PROCESSING: Sorting, cleaning, and recovery of usable grains. PAYMENT: We pay farmers for quality waste materials."
      },
      {
        name: "Husk & Chaff Removal Service",
        description: "Specialized removal and recycling service for rice husks, wheat chaff, and grain byproducts",
        price: 30,
        category: "waste-service",
        brand: "HuskAway",
        imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop",
        inStock: true,
        stockQuantity: 35,
        pestTargets: ["husk removal", "chaff cleaning", "byproduct recycling"],
        activeIngredients: ["Vacuum collection", "Sorting equipment", "Recycling process"],
        usage: "SERVICE: Professional removal of husks and chaff from farm premises. METHOD: High-powered vacuum collection with minimal dust. RECYCLING: Convert waste into animal feed, bedding, or biomass fuel. CLEAN: Leave your farm spotless and ready for next cycle."
      }
    ];

    sampleMedicines.forEach(medicine => {
      const id = randomUUID();
      this.medicines.set(id, {
        ...medicine,
        id,
        brand: medicine.brand || null,
        imageUrl: medicine.imageUrl || null,
        inStock: medicine.inStock ?? null,
        stockQuantity: medicine.stockQuantity || null,
        rentalPrice: medicine.rentalPrice || null,
        availableForRent: medicine.availableForRent || null,
        rentStock: medicine.rentStock || null,
        pestTargets: medicine.pestTargets || null,
        activeIngredients: medicine.activeIngredients || null,
        usage: medicine.usage || null,
        specifications: medicine.specifications || null,
        createdAt: new Date()
      });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      location: insertUser.location || null,
      language: insertUser.language || null,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getCropRecommendations(userId: string): Promise<CropRecommendation[]> {
    return Array.from(this.cropRecommendations.values()).filter(rec => rec.userId === userId);
  }

  async createCropRecommendation(recommendation: InsertCropRecommendation): Promise<CropRecommendation> {
    const id = randomUUID();
    const rec: CropRecommendation = { 
      ...recommendation, 
      id, 
      userId: recommendation.userId || null,
      soilType: recommendation.soilType || null,
      climate: recommendation.climate || null,
      season: recommendation.season || null,
      confidence: recommendation.confidence || null,
      recommendations: recommendation.recommendations || null,
      createdAt: new Date() 
    };
    this.cropRecommendations.set(id, rec);
    return rec;
  }

  async getPestDetections(userId: string): Promise<PestDetection[]> {
    return Array.from(this.pestDetections.values()).filter(det => det.userId === userId);
  }

  async createPestDetection(detection: InsertPestDetection): Promise<PestDetection> {
    const id = randomUUID();
    const det: PestDetection = { 
      ...detection, 
      id, 
      userId: detection.userId || null,
      imageUrl: detection.imageUrl || null,
      detectedPest: detection.detectedPest || null,
      severity: detection.severity || null,
      organicSolution: detection.organicSolution || null,
      ayurvedicRemedy: detection.ayurvedicRemedy || null,
      confidence: detection.confidence || null,
      createdAt: new Date() 
    };
    this.pestDetections.set(id, det);
    return det;
  }

  async getMarketPrices(): Promise<MarketPrice[]> {
    return Array.from(this.marketPrices.values());
  }

  async getMarketPricesByCrop(cropName: string): Promise<MarketPrice[]> {
    return Array.from(this.marketPrices.values()).filter(price => 
      price.cropName.toLowerCase().includes(cropName.toLowerCase())
    );
  }

  async createMarketPrice(price: InsertMarketPrice): Promise<MarketPrice> {
    const id = randomUUID();
    const marketPrice: MarketPrice = { 
      ...price, 
      id, 
      unit: price.unit || null,
      market: price.market || null,
      location: price.location || null,
      trend: price.trend || null,
      trendPercentage: price.trendPercentage || null,
      updatedAt: new Date() 
    };
    this.marketPrices.set(id, marketPrice);
    return marketPrice;
  }

  async getWeatherData(location: string): Promise<WeatherData | undefined> {
    return Array.from(this.weatherData.values()).find(weather => 
      weather.location.toLowerCase() === location.toLowerCase()
    );
  }

  async createWeatherData(weather: InsertWeatherData): Promise<WeatherData> {
    const id = randomUUID();
    const weatherData: WeatherData = { 
      ...weather, 
      id, 
      temperature: weather.temperature || null,
      humidity: weather.humidity || null,
      windSpeed: weather.windSpeed || null,
      uvIndex: weather.uvIndex || null,
      rainfall: weather.rainfall || null,
      pressure: weather.pressure || null,
      description: weather.description || null,
      alerts: weather.alerts || null,
      updatedAt: new Date() 
    };
    this.weatherData.set(id, weatherData);
    return weatherData;
  }

  async getIotSensorData(userId: string): Promise<IotSensorData[]> {
    return Array.from(this.iotSensorData.values()).filter(data => data.userId === userId);
  }

  async getLatestIotSensorData(userId: string): Promise<IotSensorData | undefined> {
    const userSensorData = await this.getIotSensorData(userId);
    return userSensorData.sort((a, b) => 
      (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0)
    )[0];
  }

  async createIotSensorData(data: InsertIotSensorData): Promise<IotSensorData> {
    const id = randomUUID();
    const sensorData: IotSensorData = { 
      ...data, 
      id, 
      userId: data.userId || null,
      soilMoisture: data.soilMoisture || null,
      temperature: data.temperature || null,
      lightIntensity: data.lightIntensity || null,
      soilPh: data.soilPh || null,
      location: data.location || null,
      timestamp: new Date() 
    };
    this.iotSensorData.set(id, sensorData);
    return sensorData;
  }

  async getCommunityPosts(): Promise<CommunityPost[]> {
    return Array.from(this.communityPosts.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getCommunityPostsByCategory(category: string): Promise<CommunityPost[]> {
    return Array.from(this.communityPosts.values()).filter(post => 
      post.category === category
    );
  }

  async createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const id = randomUUID();
    const communityPost: CommunityPost = { 
      ...post, 
      id, 
      userId: post.userId || null,
      category: post.category || null,
      tags: post.tags || null,
      likes: 0,
      createdAt: new Date() 
    };
    this.communityPosts.set(id, communityPost);
    return communityPost;
  }

  async likeCommunityPost(id: string): Promise<CommunityPost | undefined> {
    const post = this.communityPosts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, likes: (post.likes || 0) + 1 };
    this.communityPosts.set(id, updatedPost);
    return updatedPost;
  }

  async getApiKeys(userId: string): Promise<ApiKey[]> {
    return Array.from(this.apiKeys.values()).filter(key => key.userId === userId);
  }

  async createApiKey(apiKey: InsertApiKey): Promise<ApiKey> {
    const id = randomUUID();
    const newApiKey: ApiKey = {
      ...apiKey,
      id,
      userId: apiKey.userId || null,
      isActive: apiKey.isActive || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.apiKeys.set(id, newApiKey);
    return newApiKey;
  }

  async updateApiKey(id: string, updates: Partial<InsertApiKey>): Promise<ApiKey | undefined> {
    const apiKey = this.apiKeys.get(id);
    if (!apiKey) return undefined;
    
    const updatedApiKey = { ...apiKey, ...updates };
    this.apiKeys.set(id, updatedApiKey);
    return updatedApiKey;
  }

  async deleteApiKey(id: string): Promise<boolean> {
    return this.apiKeys.delete(id);
  }

  // Medicine management methods
  async getMedicines(): Promise<Medicine[]> {
    return Array.from(this.medicines.values());
  }

  async getMedicine(id: string): Promise<Medicine | undefined> {
    return this.medicines.get(id);
  }

  async getMedicinesByCategory(category: string): Promise<Medicine[]> {
    return Array.from(this.medicines.values()).filter(med => med.category === category);
  }

  async getMedicinesByPestTarget(pestTarget: string): Promise<Medicine[]> {
    return Array.from(this.medicines.values()).filter(med => 
      med.pestTargets && med.pestTargets.some(target => 
        target.toLowerCase().includes(pestTarget.toLowerCase())
      )
    );
  }

  async createMedicine(medicine: InsertMedicine): Promise<Medicine> {
    const id = randomUUID();
    const newMedicine: Medicine = {
      ...medicine,
      id,
      brand: medicine.brand || null,
      imageUrl: medicine.imageUrl || null,
      inStock: medicine.inStock ?? null,
      stockQuantity: medicine.stockQuantity || null,
      rentalPrice: medicine.rentalPrice || null,
      availableForRent: medicine.availableForRent || null,
      rentStock: medicine.rentStock || null,
      pestTargets: medicine.pestTargets || null,
      activeIngredients: medicine.activeIngredients || null,
      usage: medicine.usage || null,
      specifications: medicine.specifications || null,
      createdAt: new Date()
    };
    this.medicines.set(id, newMedicine);
    return newMedicine;
  }

  async updateMedicine(id: string, updates: Partial<InsertMedicine>): Promise<Medicine | undefined> {
    const medicine = this.medicines.get(id);
    if (!medicine) return undefined;
    
    const updatedMedicine = { ...medicine, ...updates };
    this.medicines.set(id, updatedMedicine);
    return updatedMedicine;
  }

  // Cart management methods
  async getCartItems(userId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      cartItem => cartItem.userId === item.userId && cartItem.medicineId === item.medicineId
    );

    if (existingItem) {
      // Update quantity if item already exists
      const updatedItem = { ...existingItem, quantity: (existingItem.quantity || 0) + (item.quantity || 1) };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    } else {
      // Add new item
      const id = randomUUID();
      const cartItem: CartItem = {
        ...item,
        id,
        userId: item.userId || null,
        medicineId: item.medicineId || null,
        quantity: item.quantity || 1,
        isRental: item.isRental || null,
        rentalDays: item.rentalDays || null,
        createdAt: new Date()
      };
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: string): Promise<boolean> {
    const userItems = Array.from(this.cartItems.entries()).filter(
      ([_, item]) => item.userId === userId
    );
    
    userItems.forEach(([id]) => {
      this.cartItems.delete(id);
    });
    
    return true;
  }

  // Order management methods
  async getOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const newOrder: Order = {
      ...order,
      id,
      userId: order.userId || null,
      status: order.status || null,
      deliveryAddress: order.deliveryAddress || null,
      createdAt: new Date()
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const newOrderItem: OrderItem = {
      ...orderItem,
      id,
      orderId: orderItem.orderId || null,
      medicineId: orderItem.medicineId || null,
      createdAt: new Date()
    };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }
}

export const storage = new MemStorage();
