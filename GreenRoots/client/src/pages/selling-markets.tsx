import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Search, 
  Star, 
  TrendingUp,
  TrendingDown,
  Store,
  DollarSign,
  Calendar,
  Users
} from "lucide-react";

interface Market {
  id: string;
  name: string;
  location: string;
  distance: string;
  type: string;
  rating: number;
  openDays: string;
  openHours: string;
  phone: string;
  specialties: string[];
  priceRange: string;
  facilities: string[];
  currentPrices: {
    crop: string;
    price: number;
    unit: string;
    trend: "up" | "down" | "stable";
  }[];
  verified: boolean;
}

const sellingMarkets: Market[] = [
  {
    id: "1",
    name: "Pune Agricultural Market",
    location: "Pune, Maharashtra",
    distance: "3.2 km",
    type: "Wholesale",
    rating: 4.7,
    openDays: "Mon - Sat",
    openHours: "5:00 AM - 6:00 PM",
    phone: "+91 98765 43210",
    specialties: ["Grains", "Vegetables", "Fruits"],
    priceRange: "High",
    facilities: ["Cold Storage", "Loading/Unloading", "Weighing", "Packaging"],
    currentPrices: [
      { crop: "Wheat", price: 2150, unit: "per quintal", trend: "up" },
      { crop: "Rice", price: 3200, unit: "per quintal", trend: "stable" },
      { crop: "Onion", price: 45, unit: "per kg", trend: "down" }
    ],
    verified: true
  },
  {
    id: "2",
    name: "Nashik Fruit Market",
    location: "Nashik, Maharashtra",
    distance: "6.8 km",
    type: "Retail & Wholesale",
    rating: 4.5,
    openDays: "Daily",
    openHours: "4:00 AM - 8:00 PM",
    phone: "+91 97654 32109",
    specialties: ["Grapes", "Pomegranate", "Citrus"],
    priceRange: "Medium",
    facilities: ["Cold Storage", "Quality Grading", "Export Services"],
    currentPrices: [
      { crop: "Grapes", price: 80, unit: "per kg", trend: "up" },
      { crop: "Pomegranate", price: 120, unit: "per kg", trend: "up" },
      { crop: "Orange", price: 40, unit: "per kg", trend: "stable" }
    ],
    verified: true
  },
  {
    id: "3",
    name: "Local Vegetable Mandi",
    location: "Aurangabad, Maharashtra",
    distance: "9.4 km",
    type: "Wholesale",
    rating: 4.3,
    openDays: "Mon - Sat",
    openHours: "6:00 AM - 2:00 PM",
    phone: "+91 96543 21098",
    specialties: ["Leafy Vegetables", "Root Vegetables", "Seasonal Crops"],
    priceRange: "Low",
    facilities: ["Open Storage", "Basic Weighing"],
    currentPrices: [
      { crop: "Tomato", price: 25, unit: "per kg", trend: "down" },
      { crop: "Potato", price: 18, unit: "per kg", trend: "stable" },
      { crop: "Cabbage", price: 15, unit: "per kg", trend: "up" }
    ],
    verified: false
  },
  {
    id: "4",
    name: "Organic Farmers Market",
    location: "Kolhapur, Maharashtra",
    distance: "14.7 km",
    type: "Retail",
    rating: 4.9,
    openDays: "Tue, Thu, Sat",
    openHours: "7:00 AM - 12:00 PM",
    phone: "+91 95432 10987",
    specialties: ["Organic Vegetables", "Organic Grains", "Spices"],
    priceRange: "Premium",
    facilities: ["Organic Certification", "Direct Sale", "Quality Testing"],
    currentPrices: [
      { crop: "Organic Rice", price: 4500, unit: "per quintal", trend: "stable" },
      { crop: "Organic Wheat", price: 3200, unit: "per quintal", trend: "up" },
      { crop: "Turmeric", price: 180, unit: "per kg", trend: "up" }
    ],
    verified: true
  },
  {
    id: "5",
    name: "Cotton & Cash Crop Market",
    location: "Solapur, Maharashtra",
    distance: "18.2 km",
    type: "Wholesale",
    rating: 4.4,
    openDays: "Mon - Fri",
    openHours: "9:00 AM - 5:00 PM",
    phone: "+91 94321 09876",
    specialties: ["Cotton", "Sugarcane", "Soybean"],
    priceRange: "High",
    facilities: ["Quality Testing", "Bulk Storage", "Transport Arrangement"],
    currentPrices: [
      { crop: "Cotton", price: 5800, unit: "per quintal", trend: "up" },
      { crop: "Soybean", price: 4200, unit: "per quintal", trend: "stable" },
      { crop: "Sugarcane", price: 320, unit: "per quintal", trend: "down" }
    ],
    verified: true
  }
];

export default function SellingMarkets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [marketType, setMarketType] = useState<string>("all");
  const [filteredMarkets, setFilteredMarkets] = useState(sellingMarkets);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterMarkets(query, marketType);
  };

  const handleTypeFilter = (type: string) => {
    setMarketType(type);
    filterMarkets(searchQuery, type);
  };

  const filterMarkets = (query: string, type: string) => {
    let filtered = sellingMarkets;

    if (query.trim() !== "") {
      filtered = filtered.filter(market =>
        market.name.toLowerCase().includes(query.toLowerCase()) ||
        market.location.toLowerCase().includes(query.toLowerCase()) ||
        market.specialties.some(specialty => 
          specialty.toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    if (type !== "all") {
      filtered = filtered.filter(market =>
        market.type.toLowerCase() === type.toLowerCase()
      );
    }

    setFilteredMarkets(filtered);
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <DollarSign className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Selling Markets
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the best local markets to sell your crops at competitive prices with current market rates
          </p>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search markets, locations, or crops..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 h-12"
                  data-testid="search-markets"
                />
              </div>
              <Select value={marketType} onValueChange={handleTypeFilter}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Market Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Markets</SelectItem>
                  <SelectItem value="wholesale">Wholesale</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="retail & wholesale">Retail & Wholesale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Found {filteredMarkets.length} markets near you
          </p>
        </div>

        {/* Markets Grid */}
        <div className="grid gap-6">
          {filteredMarkets.map((market) => (
            <Card key={market.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{market.name}</CardTitle>
                      <Badge variant={market.type === "Wholesale" ? "default" : "secondary"}>
                        {market.type}
                      </Badge>
                      {market.verified && (
                        <Badge variant="outline" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{market.location} • {market.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{market.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className={
                    market.priceRange === "High" ? "text-green-600" :
                    market.priceRange === "Premium" ? "text-purple-600" :
                    market.priceRange === "Medium" ? "text-blue-600" : "text-orange-600"
                  }>
                    {market.priceRange} Prices
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Market Info */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Operating Hours</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{market.openDays}</p>
                      <p className="text-sm text-muted-foreground">{market.openHours}</p>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Store className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Specialties</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {market.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Facilities</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {market.facilities.map((facility, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Current Prices */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-2 mb-4">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Current Market Prices</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {market.currentPrices.map((price, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{price.crop}</span>
                            {getTrendIcon(price.trend)}
                          </div>
                          <div className="text-lg font-bold text-primary">
                            ₹{price.price.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {price.unit}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6 pt-4 border-t">
                  <Button className="flex-1" data-testid={`contact-${market.id}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Market
                  </Button>
                  <Button variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Price History
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMarkets.length === 0 && (
          <div className="text-center py-12">
            <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No markets found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or check back later for new markets.
            </p>
          </div>
        )}

        {/* Price Alert Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Market Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Price Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Get notifications when crop prices reach your target levels
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Store className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Market Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  View detailed market trends and price history for better decisions
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Best Selling Times</h3>
                <p className="text-sm text-muted-foreground">
                  Learn optimal timing for selling different crops throughout the year
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}