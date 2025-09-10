import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Search, 
  Star, 
  MessageCircle,
  Calendar,
  Sprout
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface Farmer {
  id: string;
  name: string;
  location: string;
  distance: string;
  crops: string[];
  experience: string;
  rating: number;
  phone: string;
  email: string;
  bio: string;
  avatar?: string;
  verified: boolean;
}

const nearbyFarmers: Farmer[] = [
  {
    id: "1",
    name: "Ramesh Kumar",
    location: "Pune, Maharashtra",
    distance: "2.3 km",
    crops: ["Rice", "Wheat", "Cotton"],
    experience: "15+ years",
    rating: 4.8,
    phone: "+91 98765 43210",
    email: "ramesh.kumar@email.com",
    bio: "Experienced organic farmer specializing in sustainable crop rotation and natural pest management.",
    verified: true
  },
  {
    id: "2",
    name: "Priya Sharma",
    location: "Nashik, Maharashtra",
    distance: "5.7 km",
    crops: ["Grapes", "Pomegranate", "Onion"],
    experience: "10+ years",
    rating: 4.6,
    phone: "+91 97654 32109",
    email: "priya.sharma@email.com",
    bio: "Fruit cultivation expert with expertise in drip irrigation and greenhouse farming techniques.",
    verified: true
  },
  {
    id: "3",
    name: "Suresh Patel",
    location: "Aurangabad, Maharashtra",
    distance: "8.2 km",
    crops: ["Soybean", "Cotton", "Sugarcane"],
    experience: "20+ years",
    rating: 4.7,
    phone: "+91 96543 21098",
    email: "suresh.patel@email.com",
    bio: "Traditional farmer transitioning to modern farming with focus on soil health and water conservation.",
    verified: false
  },
  {
    id: "4",
    name: "Anjali Singh",
    location: "Kolhapur, Maharashtra",
    distance: "12.1 km",
    crops: ["Turmeric", "Chili", "Ginger"],
    experience: "8+ years",
    rating: 4.9,
    phone: "+91 95432 10987",
    email: "anjali.singh@email.com",
    bio: "Spice farming specialist with organic certification and direct market connections.",
    verified: true
  },
  {
    id: "5",
    name: "Vikram Reddy",
    location: "Solapur, Maharashtra",
    distance: "15.4 km",
    crops: ["Jowar", "Bajra", "Tur Dal"],
    experience: "12+ years",
    rating: 4.5,
    phone: "+91 94321 09876",
    email: "vikram.reddy@email.com",
    bio: "Drought-resistant crop expert helping farmers adapt to climate change challenges.",
    verified: true
  },
  {
    id: "6",
    name: "Meera Joshi",
    location: "Satara, Maharashtra",
    distance: "18.9 km",
    crops: ["Strawberry", "Tomato", "Cucumber"],
    experience: "6+ years",
    rating: 4.4,
    phone: "+91 93210 98765",
    email: "meera.joshi@email.com",
    bio: "Young progressive farmer using technology and IoT for precision agriculture.",
    verified: true
  }
];

export default function NearbyFarmers() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFarmers, setFilteredFarmers] = useState(nearbyFarmers);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredFarmers(nearbyFarmers);
    } else {
      const filtered = nearbyFarmers.filter(farmer =>
        farmer.name.toLowerCase().includes(query.toLowerCase()) ||
        farmer.location.toLowerCase().includes(query.toLowerCase()) ||
        farmer.crops.some(crop => crop.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredFarmers(filtered);
    }
  };

  const handleConnect = (farmer: Farmer) => {
    // In a real app, this would open a chat or connection dialog
    alert(`Connecting with ${farmer.name}...`);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Nearby Farmers
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with experienced farmers in your area for collaboration, knowledge sharing, and mutual support
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, location, or crops..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-12"
                data-testid="search-farmers"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Found {filteredFarmers.length} farmers near you
          </p>
        </div>

        {/* Farmers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarmers.map((farmer) => (
            <Card key={farmer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={farmer.avatar} alt={farmer.name} />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{farmer.name}</CardTitle>
                        {farmer.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{farmer.distance}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{farmer.rating}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{farmer.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{farmer.experience}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Sprout className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Crops:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {farmer.crops.map((crop, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {farmer.bio}
                  </p>

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleConnect(farmer)}
                      data-testid={`connect-${farmer.id}`}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFarmers.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No farmers found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or check back later for new farmers in your area.
            </p>
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span>How to Connect</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Search & Filter</h3>
                <p className="text-sm text-muted-foreground">
                  Find farmers based on location, crops, or expertise
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Connect</h3>
                <p className="text-sm text-muted-foreground">
                  Send connection requests to collaborate and share knowledge
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Collaborate</h3>
                <p className="text-sm text-muted-foreground">
                  Share experiences, learn new techniques, and grow together
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}