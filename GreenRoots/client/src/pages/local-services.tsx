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
  Users,
  Briefcase,
  GraduationCap,
  FileText,
  Banknote,
  Wrench,
  Droplets,
  Zap
} from "lucide-react";

interface LocalService {
  id: string;
  name: string;
  location: string;
  distance: string;
  category: string;
  rating: number;
  phone: string;
  services: string[];
  specialization: string[];
  experience: string;
  priceRange: string;
  availability: string;
  verified: boolean;
  certified: boolean;
  description: string;
}

const localServices: LocalService[] = [
  {
    id: "1",
    name: "Krishi Consulting Services",
    location: "Pune, Maharashtra",
    distance: "1.9 km",
    category: "Agricultural Consultancy",
    rating: 4.8,
    phone: "+91 98765 43210",
    services: ["Crop Planning", "Soil Testing", "Disease Diagnosis", "Yield Optimization", "Organic Certification"],
    specialization: ["Sustainable Farming", "Precision Agriculture", "Crop Rotation", "Integrated Pest Management"],
    experience: "15+ years",
    priceRange: "₹500-2000 per consultation",
    availability: "Mon-Sat, 9 AM - 6 PM",
    verified: true,
    certified: true,
    description: "Expert agricultural consultants helping farmers adopt modern, sustainable farming practices for better yields and profitability."
  },
  {
    id: "2",
    name: "AgriFinance Solutions",
    location: "Nashik, Maharashtra",
    distance: "3.4 km",
    category: "Financial Services",
    rating: 4.6,
    phone: "+91 97654 32109",
    services: ["Crop Loans", "Equipment Financing", "Insurance Claims", "Subsidy Applications", "Investment Planning"],
    specialization: ["Agricultural Loans", "Government Schemes", "Crop Insurance", "Financial Planning"],
    experience: "10+ years",
    priceRange: "₹200-1000 per service",
    availability: "Mon-Fri, 10 AM - 5 PM",
    verified: true,
    certified: true,
    description: "Specialized financial advisors for agricultural financing, loans, insurance, and government subsidy applications."
  },
  {
    id: "3",
    name: "FarmTech Training Institute",
    location: "Aurangabad, Maharashtra", 
    distance: "7.8 km",
    category: "Training & Education",
    rating: 4.9,
    phone: "+91 96543 21098",
    services: ["Farmer Training", "Technology Workshops", "Certification Courses", "Skill Development", "Demo Programs"],
    specialization: ["Modern Farming Techniques", "Digital Agriculture", "Organic Farming", "Livestock Management"],
    experience: "8+ years",
    priceRange: "₹1000-5000 per course",
    availability: "Daily, 8 AM - 7 PM",
    verified: true,
    certified: true,
    description: "Comprehensive training programs for farmers to learn modern agricultural techniques and technologies."
  },
  {
    id: "4",
    name: "Agri-Legal Associates", 
    location: "Kolhapur, Maharashtra",
    distance: "11.2 km",
    category: "Legal Services",
    rating: 4.5,
    phone: "+91 95432 10987",
    services: ["Land Documentation", "Contract Farming", "Dispute Resolution", "Regulatory Compliance", "Property Registration"],
    specialization: ["Agricultural Law", "Land Rights", "Water Rights", "Environmental Compliance"],
    experience: "12+ years",
    priceRange: "₹1000-5000 per case",
    availability: "Mon-Fri, 10 AM - 6 PM",
    verified: true,
    certified: true,
    description: "Legal experts specializing in agricultural law, land disputes, contract farming, and regulatory compliance."
  },
  {
    id: "5",
    name: "Rural Tech Solutions",
    location: "Solapur, Maharashtra",
    distance: "14.6 km",
    category: "Technology Services", 
    rating: 4.7,
    phone: "+91 94321 09876",
    services: ["IoT Installation", "Software Training", "System Maintenance", "Data Analysis", "Tech Support"],
    specialization: ["Smart Farming", "IoT Sensors", "Farm Management Software", "Data Analytics"],
    experience: "6+ years",
    priceRange: "₹2000-10000 per project",
    availability: "Daily, 9 AM - 8 PM",
    verified: true,
    certified: false,
    description: "Technology specialists helping farmers implement IoT solutions, smart farming systems, and digital agriculture tools."
  },
  {
    id: "6",
    name: "Maintenance & Repair Hub",
    location: "Satara, Maharashtra",
    distance: "16.8 km", 
    category: "Equipment Services",
    rating: 4.4,
    phone: "+91 93210 98765",
    services: ["Equipment Repair", "Maintenance Services", "Spare Parts", "Installation", "Troubleshooting"],
    specialization: ["Tractor Repair", "Pump Maintenance", "Tool Servicing", "Irrigation Systems"],
    experience: "20+ years",
    priceRange: "₹500-3000 per service",
    availability: "Mon-Sat, 8 AM - 7 PM",
    verified: false,
    certified: false,
    description: "Experienced technicians providing repair and maintenance services for all types of agricultural equipment and machinery."
  },
  {
    id: "7",
    name: "Water Management Experts",
    location: "Sangli, Maharashtra",
    distance: "19.3 km",
    category: "Water Services",
    rating: 4.6,
    phone: "+91 92109 87654",
    services: ["Borewell Drilling", "Water Testing", "Irrigation Design", "Water Conservation", "Drip System Installation"],
    specialization: ["Groundwater Management", "Irrigation Efficiency", "Water Quality Testing", "Conservation Methods"],
    experience: "18+ years",
    priceRange: "₹5000-50000 per project",
    availability: "Daily, 7 AM - 6 PM",
    verified: true,
    certified: true,
    description: "Water management specialists offering borewell services, irrigation solutions, and water conservation systems for farms."
  },
  {
    id: "8",
    name: "Power Solutions for Farms",
    location: "Ahmednagar, Maharashtra", 
    distance: "22.1 km",
    category: "Electrical Services",
    rating: 4.3,
    phone: "+91 91098 76543",
    services: ["Solar Installation", "Electrical Repairs", "Power Solutions", "Generator Services", "Energy Audits"],
    specialization: ["Solar Power Systems", "Agricultural Pumps", "Rural Electrification", "Energy Efficiency"],
    experience: "14+ years",
    priceRange: "₹10000-100000 per project",
    availability: "Mon-Sat, 9 AM - 6 PM",
    verified: true,
    certified: true,
    description: "Electrical specialists providing solar power solutions, electrical repairs, and energy-efficient systems for agricultural operations."
  }
];

export default function LocalServices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceCategory, setServiceCategory] = useState<string>("all");
  const [filteredServices, setFilteredServices] = useState(localServices);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterServices(query, serviceCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setServiceCategory(category);
    filterServices(searchQuery, category);
  };

  const filterServices = (query: string, category: string) => {
    let filtered = localServices;

    if (query.trim() !== "") {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(query.toLowerCase()) ||
        service.location.toLowerCase().includes(query.toLowerCase()) ||
        service.services.some(s => 
          s.toLowerCase().includes(query.toLowerCase())
        ) ||
        service.specialization.some(s => 
          s.toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    if (category !== "all") {
      filtered = filtered.filter(service =>
        service.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "agricultural consultancy": return <Briefcase className="h-5 w-5" />;
      case "financial services": return <Banknote className="h-5 w-5" />;
      case "training & education": return <GraduationCap className="h-5 w-5" />;
      case "legal services": return <FileText className="h-5 w-5" />;
      case "technology services": return <Zap className="h-5 w-5" />;
      case "equipment services": return <Wrench className="h-5 w-5" />;
      case "water services": return <Droplets className="h-5 w-5" />;
      case "electrical services": return <Zap className="h-5 w-5" />;
      default: return <Users className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Local Agricultural Services
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover specialized services including consultancy, financing, training, legal support, and technical assistance
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
                  placeholder="Search services, specialists, or expertise..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 h-12"
                  data-testid="search-local-services"
                />
              </div>
              <Select value={serviceCategory} onValueChange={handleCategoryFilter}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Service Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="consultancy">Agricultural Consultancy</SelectItem>
                  <SelectItem value="financial">Financial Services</SelectItem>
                  <SelectItem value="training">Training & Education</SelectItem>
                  <SelectItem value="legal">Legal Services</SelectItem>
                  <SelectItem value="technology">Technology Services</SelectItem>
                  <SelectItem value="equipment">Equipment Services</SelectItem>
                  <SelectItem value="water">Water Services</SelectItem>
                  <SelectItem value="electrical">Electrical Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Found {filteredServices.length} local services near you
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
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        {getCategoryIcon(service.category)}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                        <Badge variant="default">{service.category}</Badge>
                      </div>
                      {service.verified && (
                        <Badge variant="secondary">Verified</Badge>
                      )}
                      {service.certified && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Certified
                        </Badge>
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
                      <div className="flex items-center space-x-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{service.experience}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-2">
                      {service.priceRange}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{service.availability}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Service Description */}
                  <div className="lg:col-span-2 space-y-4">
                    <p className="text-muted-foreground">{service.description}</p>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Services Offered</span>
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
                        <Star className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium">Specialization</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {service.specialization.map((spec, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h3 className="font-semibold mb-3">Contact Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{service.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{service.availability}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{service.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6 pt-4 border-t">
                  <Button className="flex-1" data-testid={`contact-${service.id}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Service
                  </Button>
                  <Button variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Get Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No services found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or check back later for new services in your area.
            </p>
          </div>
        )}

        {/* Service Categories Guide */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Service Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Consultancy</h3>
                <p className="text-xs text-muted-foreground">
                  Expert advice on crop planning, soil health, and farming practices
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Banknote className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Financial</h3>
                <p className="text-xs text-muted-foreground">
                  Loans, insurance, subsidies, and financial planning services
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Training</h3>
                <p className="text-xs text-muted-foreground">
                  Skill development and modern farming technique training
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Wrench className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Technical</h3>
                <p className="text-xs text-muted-foreground">
                  Equipment maintenance, technology support, and repairs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}