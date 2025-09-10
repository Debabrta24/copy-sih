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
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  Package,
  Leaf
} from "lucide-react";

interface MedicineShop {
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
  services: string[];
  products: {
    category: string;
    items: string[];
    priceRange: string;
  }[];
  verified: boolean;
  licensed: boolean;
  delivery: boolean;
}

const medicineShops: MedicineShop[] = [
  {
    id: "1",
    name: "Green Agriculture Store",
    location: "Pune, Maharashtra",
    distance: "1.8 km",
    type: "Agricultural Medicines",
    rating: 4.8,
    openDays: "Mon - Sat",
    openHours: "8:00 AM - 7:00 PM",
    phone: "+91 98765 43210",
    specialties: ["Pesticides", "Fertilizers", "Seeds", "Growth Regulators"],
    services: ["Home Delivery", "Bulk Orders", "Expert Consultation", "Soil Testing"],
    products: [
      { category: "Pesticides", items: ["Insecticides", "Fungicides", "Herbicides"], priceRange: "₹200-2000" },
      { category: "Fertilizers", items: ["NPK", "Organic Compost", "Micronutrients"], priceRange: "₹500-1500" },
      { category: "Seeds", items: ["Hybrid Seeds", "Organic Seeds", "Treated Seeds"], priceRange: "₹100-800" }
    ],
    verified: true,
    licensed: true,
    delivery: true
  },
  {
    id: "2",
    name: "Krishi Seva Kendra",
    location: "Nashik, Maharashtra", 
    distance: "4.2 km",
    type: "Government Licensed",
    rating: 4.6,
    openDays: "Mon - Sat",
    openHours: "9:00 AM - 6:00 PM",
    phone: "+91 97654 32109",
    specialties: ["Bio-fertilizers", "Organic Pesticides", "Soil Conditioners"],
    services: ["Technical Support", "Training Programs", "Quality Testing"],
    products: [
      { category: "Bio-products", items: ["Bio-fertilizers", "Bio-pesticides", "Growth Promoters"], priceRange: "₹150-1200" },
      { category: "Equipment", items: ["Sprayers", "Tools", "Irrigation Supplies"], priceRange: "₹300-5000" },
      { category: "Animal Feed", items: ["Cattle Feed", "Poultry Feed", "Fish Feed"], priceRange: "₹800-2000" }
    ],
    verified: true,
    licensed: true,
    delivery: false
  },
  {
    id: "3",
    name: "Modern Agri Solutions", 
    location: "Aurangabad, Maharashtra",
    distance: "7.5 km",
    type: "Premium Store",
    rating: 4.7,
    openDays: "Daily",
    openHours: "7:00 AM - 8:00 PM",
    phone: "+91 96543 21098",
    specialties: ["Advanced Fertilizers", "Disease Management", "Precision Agriculture"],
    services: ["Drone Spraying", "Crop Monitoring", "Digital Consultation", "Lab Testing"],
    products: [
      { category: "Precision Tools", items: ["pH Meters", "Moisture Sensors", "EC Meters"], priceRange: "₹1000-8000" },
      { category: "Specialty Products", items: ["Adjuvants", "Surfactants", "Chelated Nutrients"], priceRange: "₹400-3000" },
      { category: "Biologicals", items: ["Beneficial Microbes", "Enzymes", "Plant Extracts"], priceRange: "₹250-1800" }
    ],
    verified: true,
    licensed: true,
    delivery: true
  },
  {
    id: "4",
    name: "Organic Farm Supplies",
    location: "Kolhapur, Maharashtra",
    distance: "11.3 km", 
    type: "Organic Specialist",
    rating: 4.9,
    openDays: "Tue - Sun",
    openHours: "8:00 AM - 6:00 PM",
    phone: "+91 95432 10987",
    specialties: ["Organic Fertilizers", "Natural Pesticides", "Composting Materials"],
    services: ["Organic Certification Support", "Composting Training", "Natural Solutions"],
    products: [
      { category: "Organic Inputs", items: ["Neem Products", "Vermicompost", "Rock Phosphate"], priceRange: "₹100-1000" },
      { category: "Natural Pest Control", items: ["Pheromone Traps", "Sticky Traps", "Botanical Extracts"], priceRange: "₹50-500" },
      { category: "Soil Amendments", items: ["Biochar", "Humic Acid", "Mycorrhiza"], priceRange: "₹200-1200" }
    ],
    verified: true,
    licensed: true,
    delivery: true
  },
  {
    id: "5",
    name: "Village Agri Store",
    location: "Solapur, Maharashtra",
    distance: "16.8 km",
    type: "Local Store", 
    rating: 4.2,
    openDays: "Mon - Sat",
    openHours: "9:00 AM - 7:00 PM",
    phone: "+91 94321 09876",
    specialties: ["Basic Fertilizers", "Common Pesticides", "Farm Tools"],
    services: ["Local Delivery", "Credit Facility", "Seasonal Discounts"],
    products: [
      { category: "Basic Inputs", items: ["DAP", "Urea", "Potash"], priceRange: "₹800-1500" },
      { category: "Tools", items: ["Hand Tools", "Sprayers", "Irrigation"], priceRange: "₹100-2000" },
      { category: "General Items", items: ["Plastic Items", "Ropes", "Covers"], priceRange: "₹50-800" }
    ],
    verified: false,
    licensed: true,
    delivery: true
  }
];

export default function MedicineShops() {
  const [searchQuery, setSearchQuery] = useState("");
  const [shopType, setShopType] = useState<string>("all");
  const [filteredShops, setFilteredShops] = useState(medicineShops);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterShops(query, shopType);
  };

  const handleTypeFilter = (type: string) => {
    setShopType(type);
    filterShops(searchQuery, type);
  };

  const filterShops = (query: string, type: string) => {
    let filtered = medicineShops;

    if (query.trim() !== "") {
      filtered = filtered.filter(shop =>
        shop.name.toLowerCase().includes(query.toLowerCase()) ||
        shop.location.toLowerCase().includes(query.toLowerCase()) ||
        shop.specialties.some(specialty => 
          specialty.toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    if (type !== "all") {
      filtered = filtered.filter(shop =>
        shop.type.toLowerCase().includes(type.toLowerCase())
      );
    }

    setFilteredShops(filtered);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Agricultural Medicine Shops
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find licensed agricultural medicine stores, fertilizers, pesticides, and farming supplies near you
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
                  placeholder="Search shops, products, or locations..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 h-12"
                  data-testid="search-medicine-shops"
                />
              </div>
              <Select value={shopType} onValueChange={handleTypeFilter}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Shop Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shops</SelectItem>
                  <SelectItem value="agricultural">Agricultural Medicines</SelectItem>
                  <SelectItem value="government">Government Licensed</SelectItem>
                  <SelectItem value="organic">Organic Specialist</SelectItem>
                  <SelectItem value="premium">Premium Store</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Found {filteredShops.length} agricultural medicine shops near you
          </p>
        </div>

        {/* Shops Grid */}
        <div className="grid gap-6">
          {filteredShops.map((shop) => (
            <Card key={shop.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{shop.name}</CardTitle>
                      <Badge variant="default">{shop.type}</Badge>
                      {shop.licensed && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Shield className="h-3 w-3 mr-1" />
                          Licensed
                        </Badge>
                      )}
                      {shop.verified && (
                        <Badge variant="secondary">Verified</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{shop.location} • {shop.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{shop.rating}</span>
                      </div>
                      {shop.delivery && (
                        <div className="flex items-center space-x-1">
                          <Truck className="h-4 w-4 text-green-600" />
                          <span>Delivery Available</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Shop Info */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Operating Hours</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{shop.openDays}</p>
                      <p className="text-sm text-muted-foreground">{shop.openHours}</p>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Heart className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Specialties</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {shop.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Package className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium">Services</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {shop.services.map((service, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-2 mb-4">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Available Products</h3>
                    </div>
                    <div className="grid gap-4">
                      {shop.products.map((category, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{category.category}</h4>
                            <Badge variant="outline">{category.priceRange}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {category.items.map((item, itemIndex) => (
                              <span key={itemIndex} className="text-xs bg-muted px-2 py-1 rounded">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6 pt-4 border-t">
                  <Button className="flex-1" data-testid={`contact-${shop.id}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Shop
                  </Button>
                  <Button variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                  {shop.delivery && (
                    <Button variant="outline">
                      <Truck className="h-4 w-4 mr-2" />
                      Order Online
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredShops.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No medicine shops found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or check back later for new shops in your area.
            </p>
          </div>
        )}

        {/* Safety Guidelines */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Safety Guidelines</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Licensed Dealers</h3>
                <p className="text-sm text-muted-foreground">
                  Only buy from licensed agricultural medicine dealers for quality assurance
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Leaf className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Proper Usage</h3>
                <p className="text-sm text-muted-foreground">
                  Follow dosage instructions and safety protocols for pesticide application
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Quality Check</h3>
                <p className="text-sm text-muted-foreground">
                  Verify expiry dates and batch numbers before purchasing medicines
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}