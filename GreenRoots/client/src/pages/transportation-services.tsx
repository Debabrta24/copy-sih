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
  Truck,
  Package,
  Shield,
  DollarSign,
  Calendar,
  Navigation,
  Users
} from "lucide-react";

interface TransportService {
  id: string;
  name: string;
  location: string;
  distance: string;
  type: string;
  rating: number;
  phone: string;
  services: string[];
  vehicles: {
    type: string;
    capacity: string;
    rate: string;
  }[];
  coverage: string[];
  specialFeatures: string[];
  verified: boolean;
  insurance: boolean;
  gpsTracking: boolean;
  availability: string;
}

const transportServices: TransportService[] = [
  {
    id: "1",
    name: "AgriLogistics Pro",
    location: "Pune, Maharashtra",
    distance: "2.5 km",
    type: "Full-Service Logistics",
    rating: 4.8,
    phone: "+91 98765 43210",
    services: ["Crop Transportation", "Cold Storage Transport", "Market Delivery", "Door-to-Door Service"],
    vehicles: [
      { type: "Mini Truck", capacity: "1-2 Tons", rate: "₹15/km" },
      { type: "Medium Truck", capacity: "3-5 Tons", rate: "₹25/km" },
      { type: "Large Truck", capacity: "10-15 Tons", rate: "₹40/km" },
      { type: "Refrigerated Truck", capacity: "5-8 Tons", rate: "₹60/km" }
    ],
    coverage: ["Maharashtra", "Karnataka", "Gujarat", "Madhya Pradesh"],
    specialFeatures: ["Real-time Tracking", "Temperature Monitoring", "Loading/Unloading", "Insurance Coverage"],
    verified: true,
    insurance: true,
    gpsTracking: true,
    availability: "24/7"
  },
  {
    id: "2",
    name: "FarmLink Transport",
    location: "Nashik, Maharashtra",
    distance: "4.8 km",
    type: "Local Transport",
    rating: 4.5,
    phone: "+91 97654 32109",
    services: ["Local Delivery", "Market Transport", "Equipment Transport", "Bulk Cargo"],
    vehicles: [
      { type: "Pickup Truck", capacity: "500kg-1 Ton", rate: "₹12/km" },
      { type: "Tempo", capacity: "2-3 Tons", rate: "₹18/km" },
      { type: "Truck", capacity: "5-7 Tons", rate: "₹30/km" }
    ],
    coverage: ["Nashik District", "Pune District", "Ahmednagar District"],
    specialFeatures: ["Quick Booking", "Same Day Delivery", "Flexible Timing", "Competitive Rates"],
    verified: true,
    insurance: false,
    gpsTracking: true,
    availability: "6 AM - 10 PM"
  },
  {
    id: "3",
    name: "ColdChain Express",
    location: "Aurangabad, Maharashtra",
    distance: "9.2 km",
    type: "Cold Chain Specialist",
    rating: 4.9,
    phone: "+91 96543 21098",
    services: ["Refrigerated Transport", "Fruit & Vegetable Delivery", "Export Logistics", "Quality Preservation"],
    vehicles: [
      { type: "Small Reefer", capacity: "1-2 Tons", rate: "₹50/km" },
      { type: "Medium Reefer", capacity: "3-5 Tons", rate: "₹80/km" },
      { type: "Large Reefer", capacity: "8-12 Tons", rate: "₹120/km" }
    ],
    coverage: ["All India", "Export Ports", "Major Cities"],
    specialFeatures: ["Temperature Control", "Quality Certificates", "Export Documentation", "Port Connectivity"],
    verified: true,
    insurance: true,
    gpsTracking: true,
    availability: "24/7"
  },
  {
    id: "4",
    name: "Village Connect Logistics",
    location: "Kolhapur, Maharashtra",
    distance: "13.7 km",
    type: "Rural Transport",
    rating: 4.3,
    phone: "+91 95432 10987",
    services: ["Village Pickup", "Mandi Delivery", "Group Booking", "Small Loads"],
    vehicles: [
      { type: "Auto Rickshaw", capacity: "200-300 kg", rate: "₹8/km" },
      { type: "Mini Truck", capacity: "1 Ton", rate: "₹12/km" },
      { type: "Tractor Trailer", capacity: "2-4 Tons", rate: "₹15/km" }
    ],
    coverage: ["Kolhapur District", "Sangli District", "Satara District"],
    specialFeatures: ["Village Connectivity", "Group Discounts", "Flexible Payment", "Local Knowledge"],
    verified: false,
    insurance: false,
    gpsTracking: false,
    availability: "5 AM - 9 PM"
  },
  {
    id: "5",
    name: "Express Agri Movers",
    location: "Solapur, Maharashtra",
    distance: "18.4 km",
    type: "Express Service",
    rating: 4.6,
    phone: "+91 94321 09876",
    services: ["Emergency Transport", "Urgent Delivery", "Time-Critical Shipments", "Express Booking"],
    vehicles: [
      { type: "Fast Delivery Van", capacity: "500 kg", rate: "₹20/km" },
      { type: "Express Truck", capacity: "2 Tons", rate: "₹35/km" },
      { type: "High-Speed Truck", capacity: "5 Tons", rate: "₹55/km" }
    ],
    coverage: ["Maharashtra", "Karnataka", "Telangana", "Andhra Pradesh"],
    specialFeatures: ["Same Day Delivery", "Express Booking", "Priority Handling", "Time Guarantee"],
    verified: true,
    insurance: true,
    gpsTracking: true,
    availability: "24/7"
  },
  {
    id: "6",
    name: "Bulk Cargo Solutions",
    location: "Satara, Maharashtra",
    distance: "21.3 km",
    type: "Bulk Transport",
    rating: 4.4,
    phone: "+91 93210 98765",
    services: ["Bulk Grain Transport", "Large Quantity Shipping", "Warehouse to Warehouse", "Industrial Transport"],
    vehicles: [
      { type: "Large Truck", capacity: "10-15 Tons", rate: "₹35/km" },
      { type: "Trailer", capacity: "20-25 Tons", rate: "₹45/km" },
      { type: "Container Truck", capacity: "25-30 Tons", rate: "₹55/km" }
    ],
    coverage: ["Western India", "Central India", "Port Connectivity"],
    specialFeatures: ["Bulk Handling", "Container Service", "Port Connectivity", "Volume Discounts"],
    verified: true,
    insurance: true,
    gpsTracking: true,
    availability: "24/7"
  }
];

export default function TransportationServices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceType, setServiceType] = useState<string>("all");
  const [filteredServices, setFilteredServices] = useState(transportServices);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterServices(query, serviceType);
  };

  const handleTypeFilter = (type: string) => {
    setServiceType(type);
    filterServices(searchQuery, type);
  };

  const filterServices = (query: string, type: string) => {
    let filtered = transportServices;

    if (query.trim() !== "") {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(query.toLowerCase()) ||
        service.location.toLowerCase().includes(query.toLowerCase()) ||
        service.services.some(s => 
          s.toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    if (type !== "all") {
      filtered = filtered.filter(service =>
        service.type.toLowerCase().includes(type.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Transportation Services
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find reliable logistics providers for transporting your crops, equipment, and agricultural products
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
                  placeholder="Search transport services or locations..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 h-12"
                  data-testid="search-transport-services"
                />
              </div>
              <Select value={serviceType} onValueChange={handleTypeFilter}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="full-service">Full-Service Logistics</SelectItem>
                  <SelectItem value="local">Local Transport</SelectItem>
                  <SelectItem value="cold">Cold Chain Specialist</SelectItem>
                  <SelectItem value="express">Express Service</SelectItem>
                  <SelectItem value="bulk">Bulk Transport</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Found {filteredServices.length} transportation services near you
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                      <Badge variant="default">{service.type}</Badge>
                      {service.verified && (
                        <Badge variant="secondary">Verified</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{service.location} • {service.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{service.rating}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        {service.gpsTracking && (
                          <div className="flex items-center space-x-1">
                            <Navigation className="h-4 w-4 text-blue-600" />
                            <span>GPS Tracking</span>
                          </div>
                        )}
                        {service.insurance && (
                          <div className="flex items-center space-x-1">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span>Insured</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{service.availability}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Service Info */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Package className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Services</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {service.services.map((s, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium">Coverage</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {service.coverage.map((area, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium">Special Features</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {service.specialFeatures.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-accent text-accent">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Vehicles and Rates */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-2 mb-4">
                      <Truck className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Vehicle Options & Rates</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {service.vehicles.map((vehicle, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{vehicle.type}</h4>
                            <Badge variant="outline" className="text-green-600">
                              {vehicle.rate}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Capacity: {vehicle.capacity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6 pt-4 border-t">
                  <Button className="flex-1" data-testid={`book-${service.id}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Book Transport
                  </Button>
                  <Button variant="outline">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Get Quote
                  </Button>
                  {service.gpsTracking && (
                    <Button variant="outline">
                      <Navigation className="h-4 w-4 mr-2" />
                      Track Vehicle
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No transport services found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or check back later for new services in your area.
            </p>
          </div>
        )}

        {/* Transport Tips */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-primary" />
              <span>Transportation Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Insurance Coverage</h3>
                <p className="text-sm text-muted-foreground">
                  Choose insured transport services to protect your crops during transit
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Navigation className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Real-time Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Select services with GPS tracking for better visibility and security
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Advance Booking</h3>
                <p className="text-sm text-muted-foreground">
                  Book transport services in advance during peak harvest seasons
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}