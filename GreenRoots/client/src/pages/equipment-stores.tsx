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
  Store,
  Wrench,
  Truck,
  Shield,
  Package,
  Settings,
  CreditCard
} from "lucide-react";

interface EquipmentStore {
  id: string;
  name: string;
  location: string;
  distance: string;
  type: string;
  rating: number;
  openDays: string;
  openHours: string;
  phone: string;
  categories: string[];
  services: string[];
  equipment: {
    category: string;
    items: string[];
    brands: string[];
    priceRange: string;
  }[];
  verified: boolean;
  authorized: boolean;
  financing: boolean;
  warranty: boolean;
}

const equipmentStores: EquipmentStore[] = [
  {
    id: "1",
    name: "Mahindra Tractor Showroom",
    location: "Pune, Maharashtra",
    distance: "2.1 km",
    type: "Authorized Dealer",
    rating: 4.8,
    openDays: "Mon - Sat",
    openHours: "9:00 AM - 7:00 PM",
    phone: "+91 98765 43210",
    categories: ["Tractors", "Implements", "Spare Parts", "Accessories"],
    services: ["Service Center", "Parts Supply", "Financing", "Insurance", "Training"],
    equipment: [
      { category: "Tractors", items: ["Mahindra JIVO", "Mahindra Novo", "Mahindra Yuvo"], brands: ["Mahindra"], priceRange: "₹3-8 Lakhs" },
      { category: "Implements", items: ["Cultivators", "Harrows", "Ploughs", "Seeders"], brands: ["Mahindra", "Lemken"], priceRange: "₹15K-1.5L" },
      { category: "Harvesting", items: ["Reapers", "Threshers", "Combine Parts"], brands: ["Mahindra"], priceRange: "₹50K-3L" }
    ],
    verified: true,
    authorized: true,
    financing: true,
    warranty: true
  },
  {
    id: "2", 
    name: "Modern Farm Equipment Center",
    location: "Nashik, Maharashtra",
    distance: "5.3 km",
    type: "Multi-Brand Store",
    rating: 4.6,
    openDays: "Daily",
    openHours: "8:00 AM - 8:00 PM",
    phone: "+91 97654 32109",
    categories: ["Hand Tools", "Power Tools", "Irrigation", "Processing Equipment"],
    services: ["Repair Services", "Equipment Rental", "Home Delivery", "Installation"],
    equipment: [
      { category: "Hand Tools", items: ["Sickles", "Hoes", "Spades", "Pruners"], brands: ["Bellota", "Corona", "Falcon"], priceRange: "₹200-2K" },
      { category: "Power Tools", items: ["Brush Cutters", "Sprayers", "Water Pumps"], brands: ["Honda", "Stihl", "Kirloskar"], priceRange: "₹8K-50K" },
      { category: "Irrigation", items: ["Drip Systems", "Sprinklers", "Pipes", "Fittings"], brands: ["Netafim", "Jain", "Finolex"], priceRange: "₹1K-25K" }
    ],
    verified: true,
    authorized: false,
    financing: false,
    warranty: true
  },
  {
    id: "3",
    name: "John Deere Equipment Hub", 
    location: "Aurangabad, Maharashtra",
    distance: "8.7 km",
    type: "Authorized Dealer",
    rating: 4.9,
    openDays: "Mon - Sat",
    openHours: "9:00 AM - 6:00 PM",
    phone: "+91 96543 21098",
    categories: ["Premium Tractors", "Precision Agriculture", "Construction Equipment"],
    services: ["24/7 Support", "Precision Farming Solutions", "Fleet Management", "Training Programs"],
    equipment: [
      { category: "Tractors", items: ["John Deere 3028EN", "John Deere 5036D", "John Deere 5050D"], brands: ["John Deere"], priceRange: "₹6-12 Lakhs" },
      { category: "Precision Tools", items: ["GPS Guidance", "Variable Rate Technology", "Yield Monitors"], brands: ["John Deere"], priceRange: "₹1-5 Lakhs" },
      { category: "Implements", items: ["Precision Planters", "Disc Harrows", "Rotary Tillers"], brands: ["John Deere"], priceRange: "₹50K-4L" }
    ],
    verified: true,
    authorized: true,
    financing: true,
    warranty: true
  },
  {
    id: "4",
    name: "Krishi Yantra Emporium",
    location: "Kolhapur, Maharashtra", 
    distance: "12.4 km",
    type: "Traditional Store",
    rating: 4.4,
    openDays: "Mon - Sat",
    openHours: "9:00 AM - 7:00 PM",
    phone: "+91 95432 10987",
    categories: ["Traditional Tools", "Small Equipment", "Storage Solutions"],
    services: ["Repair Services", "Custom Manufacturing", "Bulk Orders", "Local Delivery"],
    equipment: [
      { category: "Traditional Tools", items: ["Ploughs", "Harrows", "Seed Drills", "Threshing Equipment"], brands: ["Local Manufacturers"], priceRange: "₹5K-80K" },
      { category: "Storage", items: ["Grain Storage", "Warehouse Equipment", "Drying Systems"], brands: ["Various"], priceRange: "₹10K-2L" },
      { category: "Processing", items: ["Grain Cleaners", "Oil Expellers", "Flour Mills"], brands: ["Rajkumar", "Ravi"], priceRange: "₹25K-5L" }
    ],
    verified: false,
    authorized: false,
    financing: false,
    warranty: true
  },
  {
    id: "5",
    name: "Hi-Tech Agriculture Solutions",
    location: "Solapur, Maharashtra",
    distance: "17.2 km",
    type: "Technology Store",
    rating: 4.7,
    openDays: "Tue - Sun", 
    openHours: "10:00 AM - 7:00 PM",
    phone: "+91 94321 09876",
    categories: ["Smart Farming", "IoT Devices", "Drones", "Sensors"],
    services: ["Technical Support", "Installation", "Training", "Software Updates"],
    equipment: [
      { category: "IoT Devices", items: ["Soil Sensors", "Weather Stations", "Smart Irrigation Controllers"], brands: ["Davis", "Onset", "Campbell"], priceRange: "₹5K-50K" },
      { category: "Drones", items: ["Spraying Drones", "Survey Drones", "Mapping Drones"], brands: ["DJI", "XAG", "Mahindra"], priceRange: "₹2-15 Lakhs" },
      { category: "Software", items: ["Farm Management", "Crop Monitoring", "Yield Analysis"], brands: ["Cropio", "FarmERP", "AgriWebb"], priceRange: "₹10K-1L" }
    ],
    verified: true,
    authorized: true,
    financing: true,
    warranty: true
  }
];

export default function EquipmentStores() {
  const [searchQuery, setSearchQuery] = useState("");
  const [storeType, setStoreType] = useState<string>("all");
  const [filteredStores, setFilteredStores] = useState(equipmentStores);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterStores(query, storeType);
  };

  const handleTypeFilter = (type: string) => {
    setStoreType(type);
    filterStores(searchQuery, type);
  };

  const filterStores = (query: string, type: string) => {
    let filtered = equipmentStores;

    if (query.trim() !== "") {
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(query.toLowerCase()) ||
        store.location.toLowerCase().includes(query.toLowerCase()) ||
        store.categories.some(category => 
          category.toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    if (type !== "all") {
      filtered = filtered.filter(store =>
        store.type.toLowerCase().includes(type.toLowerCase())
      );
    }

    setFilteredStores(filtered);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Farm Equipment Stores
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find authorized dealers and stores for tractors, farming tools, and agricultural equipment
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
                  placeholder="Search stores, equipment, or locations..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 h-12"
                  data-testid="search-equipment-stores"
                />
              </div>
              <Select value={storeType} onValueChange={handleTypeFilter}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Store Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  <SelectItem value="authorized">Authorized Dealers</SelectItem>
                  <SelectItem value="multi-brand">Multi-Brand Stores</SelectItem>
                  <SelectItem value="traditional">Traditional Stores</SelectItem>
                  <SelectItem value="technology">Technology Stores</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Found {filteredStores.length} equipment stores near you
          </p>
        </div>

        {/* Stores Grid */}
        <div className="grid gap-6">
          {filteredStores.map((store) => (
            <Card key={store.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{store.name}</CardTitle>
                      <Badge variant="default">{store.type}</Badge>
                      {store.authorized && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Shield className="h-3 w-3 mr-1" />
                          Authorized
                        </Badge>
                      )}
                      {store.verified && (
                        <Badge variant="secondary">Verified</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{store.location} • {store.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{store.rating}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        {store.financing && (
                          <div className="flex items-center space-x-1">
                            <CreditCard className="h-4 w-4 text-blue-600" />
                            <span>Financing</span>
                          </div>
                        )}
                        {store.warranty && (
                          <div className="flex items-center space-x-1">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span>Warranty</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Store Info */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Operating Hours</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{store.openDays}</p>
                      <p className="text-sm text-muted-foreground">{store.openHours}</p>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Store className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Categories</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {store.categories.map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Settings className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium">Services</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {store.services.map((service, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Equipment */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-2 mb-4">
                      <Wrench className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Available Equipment</h3>
                    </div>
                    <div className="grid gap-4">
                      {store.equipment.map((category, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">{category.category}</h4>
                            <Badge variant="outline">{category.priceRange}</Badge>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs text-muted-foreground">Items:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {category.items.map((item, itemIndex) => (
                                  <span key={itemIndex} className="text-xs bg-muted px-2 py-1 rounded">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">Brands:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {category.brands.map((brand, brandIndex) => (
                                  <span key={brandIndex} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                    {brand}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6 pt-4 border-t">
                  <Button className="flex-1" data-testid={`contact-${store.id}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Store
                  </Button>
                  <Button variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Visit Store
                  </Button>
                  {store.financing && (
                    <Button variant="outline">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Get Financing
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No equipment stores found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or check back later for new stores in your area.
            </p>
          </div>
        )}

        {/* Buying Guide */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wrench className="h-5 w-5 text-primary" />
              <span>Equipment Buying Guide</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Authorized Dealers</h3>
                <p className="text-sm text-muted-foreground">
                  Buy from authorized dealers for genuine products and warranty support
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Financing Options</h3>
                <p className="text-sm text-muted-foreground">
                  Explore financing and EMI options for expensive farming equipment
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Service Support</h3>
                <p className="text-sm text-muted-foreground">
                  Ensure availability of service centers and spare parts in your area
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}