import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Users, 
  Video, 
  Calendar, 
  Star, 
  Phone, 
  MessageCircle, 
  Clock,
  Award,
  BookOpen,
  Microscope,
  TrendingUp
} from "lucide-react";

export default function ExpertSolutions() {
  const experts = [
    {
      id: 1,
      name: "Dr. Rajesh Singh",
      specialty: "Crop Disease Specialist",
      rating: 4.9,
      experience: "15+ years",
      price: "₹500/consultation",
      image: "/Agricultural_expert_male_d507b080.png",
      expertise: ["Disease Management", "Organic Farming", "Soil Health"],
      availability: "Available now",
      languages: ["English", "Hindi", "Punjabi"]
    },
    {
      id: 2,
      name: "Prof. Sunita Sharma",
      specialty: "Agricultural Engineer",
      rating: 4.8,
      experience: "12+ years",
      price: "₹650/consultation",
      image: "/Agricultural_expert_female_f7d6e053.png",
      expertise: ["Irrigation Systems", "Farm Mechanization", "Technology Integration"],
      availability: "Available in 2 hours",
      languages: ["English", "Hindi", "Marathi"]
    },
    {
      id: 3,
      name: "Dr. Mohammed Khan",
      specialty: "Livestock Expert",
      rating: 4.7,
      experience: "18+ years",
      price: "₹450/consultation",
      image: "/Agricultural_expert_male_d507b080.png",
      expertise: ["Animal Health", "Dairy Management", "Feed Optimization"],
      availability: "Available tomorrow",
      languages: ["English", "Hindi", "Urdu"]
    },
    {
      id: 4,
      name: "Dr. Priya Patel",
      specialty: "Soil Science Expert",
      rating: 4.9,
      experience: "14+ years",
      price: "₹550/consultation",
      image: "/Agricultural_expert_female_f7d6e053.png",
      expertise: ["Soil Testing", "Nutrient Management", "pH Correction"],
      availability: "Available now",
      languages: ["English", "Hindi", "Gujarati"]
    }
  ];

  const services = [
    {
      icon: Video,
      title: "Video Consultations",
      description: "One-on-one video calls with agricultural experts",
      features: ["HD Video Quality", "Screen Sharing", "Recording Available"]
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Quick phone consultations for urgent farming issues",
      features: ["24/7 Emergency Line", "Instant Connection", "Multilingual Support"]
    },
    {
      icon: Calendar,
      title: "Farm Visits",
      description: "Expert visits to your farm for detailed analysis",
      features: ["On-site Inspection", "Detailed Reports", "Follow-up Support"]
    },
    {
      icon: BookOpen,
      title: "Training Programs",
      description: "Comprehensive training on modern farming techniques",
      features: ["Group Sessions", "Certification", "Practical Workshops"]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <GraduationCap className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold text-card-foreground">Expert Solutions</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Get personalized advice from certified agricultural experts to solve your farming challenges
        </p>
      </div>

      {/* Services Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                <div className="space-y-1">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-xs text-muted-foreground">
                      <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Featured Experts */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">Featured Agricultural Experts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experts.map((expert) => (
            <Card key={expert.id} className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                  />
                  <h3 className="font-semibold text-lg">{expert.name}</h3>
                  <p className="text-sm text-muted-foreground">{expert.specialty}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{expert.rating}</span>
                    <span className="text-xs text-muted-foreground">({expert.experience})</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Expertise:</p>
                    <div className="flex flex-wrap gap-1">
                      {expert.expertise.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-green-600">{expert.availability}</span>
                  </div>
                  
                  <div className="text-center pt-2">
                    <p className="text-lg font-bold text-primary mb-3">{expert.price}</p>
                    <Button className="w-full" data-testid={`consult-expert-${expert.id}`}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Book Consultation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-primary/5 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">2,500+</div>
            <p className="text-muted-foreground">Farmers Helped</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">95%</div>
            <p className="text-muted-foreground">Problem Resolution Rate</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <p className="text-muted-foreground">Certified Experts</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">4.8⭐</div>
            <p className="text-muted-foreground">Average Rating</p>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-8">How Expert Solutions Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">1. Book Consultation</h3>
            <p className="text-muted-foreground">Choose an expert and schedule your consultation at a convenient time</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">2. Connect with Expert</h3>
            <p className="text-muted-foreground">Join the video call and discuss your farming challenges in detail</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">3. Implement Solutions</h3>
            <p className="text-muted-foreground">Get actionable advice and follow-up support to improve your farming</p>
          </div>
        </div>
      </div>
    </div>
  );
}