import { useState } from "react";
import { Stethoscope, Calendar, Clock, MapPin, Star, Phone, Video, UserPlus, Mail, Building, Award, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { BackButton } from "@/components/ui/back-button";
import { useToast } from "@/hooks/use-toast";

const doctors = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialization: "Psychiatrist",
    experience: "8 years",
    rating: 4.8,
    languages: ["English", "Hindi", "Bengali"],
    location: "Mumbai, Maharashtra",
    fees: "₹1,200",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&face=center",
    availableSlots: ["10:00 AM", "2:00 PM", "4:30 PM"],
    about: "Specializes in anxiety, depression, and stress management for college students.",
    education: "MBBS, MD Psychiatry - AIIMS Delhi",
    certifications: ["Certified CBT Therapist", "Mindfulness-Based Therapy"],
    achievements: "Published 15+ research papers on student mental health"
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialization: "Clinical Psychologist",
    experience: "12 years",
    rating: 4.9,
    languages: ["English", "Hindi", "Tamil"],
    location: "Chennai, Tamil Nadu",
    fees: "₹1,000",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&face=center",
    availableSlots: ["9:00 AM", "11:30 AM", "3:00 PM"],
    about: "Expert in cognitive behavioral therapy and trauma counseling.",
    education: "PhD in Clinical Psychology - University of Madras",
    certifications: ["Trauma-Informed Care Specialist", "EMDR Certified"],
    achievements: "Former Head of Psychology - Apollo Hospitals Chennai"
  },
  {
    id: 3,
    name: "Dr. Anita Desai",
    specialization: "Psychiatrist",
    experience: "15 years",
    rating: 4.7,
    languages: ["English", "Hindi", "Gujarati"],
    location: "Ahmedabad, Gujarat",
    fees: "₹1,500",
    image: "https://images.unsplash.com/photo-1594824919297-b166c1de2e63?w=300&h=300&fit=crop&face=center",
    availableSlots: ["1:00 PM", "3:30 PM", "5:00 PM"],
    about: "Focuses on mood disorders and academic stress management.",
    education: "MBBS, MD Psychiatry - Medical College Gujarat",
    certifications: ["Adolescent Psychiatry Specialist", "Family Therapy Certified"],
    achievements: "Winner of Gujarat State Medical Excellence Award 2023"
  },
  {
    id: 4,
    name: "Dr. Meera Patel",
    specialization: "Counseling Psychologist",
    experience: "6 years",
    rating: 4.6,
    languages: ["English", "Hindi", "Marathi"],
    location: "Pune, Maharashtra",
    fees: "₹800",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&face=center",
    availableSlots: ["11:00 AM", "2:30 PM", "6:00 PM"],
    about: "Specializes in academic stress, relationship counseling, and career guidance for young adults.",
    education: "MA in Counseling Psychology - Fergusson College",
    certifications: ["Solution-Focused Brief Therapy", "Career Counseling Specialist"],
    achievements: "Trained over 500+ students in stress management techniques"
  },
  {
    id: 5,
    name: "Dr. Vikram Singh",
    specialization: "Psychiatrist",
    experience: "20 years",
    rating: 4.9,
    languages: ["English", "Hindi", "Punjabi"],
    location: "New Delhi, Delhi",
    fees: "₹2,000",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&face=center",
    availableSlots: ["9:30 AM", "1:00 PM", "4:00 PM"],
    about: "Senior psychiatrist with expertise in severe mental health conditions and crisis intervention.",
    education: "MBBS, MD Psychiatry - AIIMS Delhi, Fellowship in Addiction Medicine",
    certifications: ["Crisis Intervention Specialist", "Addiction Medicine Certified"],
    achievements: "Former Director of Mental Health - Max Healthcare"
  },
  {
    id: 6,
    name: "Dr. Sneha Reddy",
    specialization: "Clinical Psychologist",
    experience: "9 years",
    rating: 4.8,
    languages: ["English", "Hindi", "Telugu"],
    location: "Hyderabad, Telangana",
    fees: "₹1,100",
    image: "https://images.unsplash.com/photo-1594824919297-b166c1de2e63?w=300&h=300&fit=crop&face=center",
    availableSlots: ["10:30 AM", "3:00 PM", "5:30 PM"],
    about: "Focuses on anxiety disorders, social phobia, and confidence building for college students.",
    education: "PhD in Clinical Psychology - University of Hyderabad",
    certifications: ["Anxiety Disorders Specialist", "Group Therapy Certified"],
    achievements: "Research published in International Journal of Mental Health"
  },
  {
    id: 7,
    name: "Dr. Arjun Nair",
    specialization: "Psychiatrist",
    experience: "11 years",
    rating: 4.7,
    languages: ["English", "Hindi", "Malayalam"],
    location: "Kochi, Kerala",
    fees: "₹1,300",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&face=center",
    availableSlots: ["8:00 AM", "12:00 PM", "6:00 PM"],
    about: "Specializes in sleep disorders, depression, and holistic mental wellness approaches.",
    education: "MBBS, MD Psychiatry - Medical College Kerala",
    certifications: ["Sleep Medicine Specialist", "Integrative Medicine Certified"],
    achievements: "Founder of Kerala Youth Mental Health Initiative"
  },
  {
    id: 8,
    name: "Dr. Kavya Iyer",
    specialization: "Counseling Psychologist",
    experience: "7 years",
    rating: 4.5,
    languages: ["English", "Hindi", "Kannada"],
    location: "Bangalore, Karnataka",
    fees: "₹900",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&face=center",
    availableSlots: ["9:00 AM", "1:30 PM", "7:00 PM"],
    about: "Expert in tech industry stress, work-life balance, and digital wellness for young professionals.",
    education: "MA in Applied Psychology - Christ University",
    certifications: ["Digital Wellness Coach", "Workplace Mental Health Specialist"],
    achievements: "Mental health consultant for 20+ tech companies in Bangalore"
  }
];

const consultationTypes = [
  {
    type: "video",
    title: "Video Consultation",
    duration: "30 mins",
    icon: Video,
    description: "Face-to-face consultation from comfort of your home"
  },
  {
    type: "phone",
    title: "Phone Consultation", 
    duration: "20 mins",
    icon: Phone,
    description: "Quick consultation over phone call"
  },
  {
    type: "inperson",
    title: "In-Person Visit",
    duration: "45 mins", 
    icon: MapPin,
    description: "Visit doctor's clinic for detailed consultation"
  }
];

export default function Doctor() {
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConsultationType, setSelectedConsultationType] = useState("video");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  // Doctor registration form state
  const [registrationForm, setRegistrationForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    qualifications: "",
    licenseNumber: "",
    clinicName: "",
    clinicAddress: "",
    consultationFees: "",
    languages: [],
    about: "",
    availableSlots: []
  });

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSpecialization = selectedSpecialization === "all" || 
      doctor.specialization.toLowerCase().includes(selectedSpecialization.toLowerCase());
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSpecialization && matchesSearch;
  });

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Registration Submitted",
      description: "Your doctor registration has been submitted for review. You will be contacted within 2-3 business days.",
    });
    // Reset form
    setRegistrationForm({
      fullName: "",
      email: "",
      phone: "",
      specialization: "",
      experience: "",
      qualifications: "",
      licenseNumber: "",
      clinicName: "",
      clinicAddress: "",
      consultationFees: "",
      languages: [],
      about: "",
      availableSlots: []
    });
  };

  const updateRegistrationForm = (field: string, value: any) => {
    setRegistrationForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <BackButton />
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Medical Services</h1>
              <p className="text-muted-foreground">Find doctors or register as a healthcare professional</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="find-doctors" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="find-doctors" data-testid="tab-find-doctors">
              <Stethoscope className="h-4 w-4 mr-2" />
              Find Doctors
            </TabsTrigger>
            <TabsTrigger value="register" data-testid="tab-register-doctor">
              <UserPlus className="h-4 w-4 mr-2" />
              Doctor Registration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="find-doctors" className="mt-6">
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search doctors by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                data-testid="input-doctor-search"
              />
            </div>
            <div className="w-full sm:w-auto">
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
                data-testid="select-specialization"
              >
                <option value="all">All Specializations</option>
                <option value="psychiatrist">Psychiatrist</option>
                <option value="clinical psychologist">Clinical Psychologist</option>
                <option value="counseling psychologist">Counseling Psychologist</option>
                <option value="counselor">Counselor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Consultation Types */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Choose Consultation Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {consultationTypes.map((consultation) => {
              const IconComponent = consultation.icon;
              return (
                <Card 
                  key={consultation.type}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedConsultationType === consultation.type 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : ''
                  }`}
                  onClick={() => setSelectedConsultationType(consultation.type)}
                  data-testid={`card-consultation-${consultation.type}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">{consultation.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{consultation.description}</p>
                    <Badge variant="secondary" className="text-xs">{consultation.duration}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Doctors List */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Available Doctors ({filteredDoctors.length})</h3>
          
          {filteredDoctors.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No doctors found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Doctor Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden">
                            <img 
                              src={doctor.image} 
                              alt={doctor.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-1" data-testid={`text-doctor-name-${doctor.id}`}>
                              {doctor.name}
                            </h3>
                            <p className="text-primary font-medium mb-2">{doctor.specialization}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                {doctor.rating}
                              </div>
                              <span>{doctor.experience} experience</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {doctor.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4">{doctor.about}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {doctor.languages.map((language) => (
                            <Badge key={language} variant="outline" className="text-xs">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Booking Section */}
                      <div className="lg:w-80">
                        <Card className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="text-center mb-4">
                              <p className="text-2xl font-bold text-primary">{doctor.fees}</p>
                              <p className="text-sm text-muted-foreground">Consultation Fee</p>
                            </div>

                            <div className="mb-4">
                              <p className="text-sm font-medium mb-2">Available Today:</p>
                              <div className="flex flex-wrap gap-2">
                                {doctor.availableSlots.map((slot) => (
                                  <Badge key={slot} variant="secondary" className="text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {slot}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Button 
                                className="w-full" 
                                data-testid={`button-book-appointment-${doctor.id}`}
                              >
                                <Calendar className="h-4 w-4 mr-2" />
                                Book Appointment
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    className="w-full"
                                    data-testid={`button-view-profile-${doctor.id}`}
                                  >
                                    View Profile
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="text-xl font-bold">{doctor.name} - Profile</DialogTitle>
                                  </DialogHeader>
                                  
                                  <div className="space-y-6">
                                    {/* Doctor Header */}
                                    <div className="flex items-start gap-4">
                                      <div className="w-20 h-20 rounded-full overflow-hidden">
                                        <img 
                                          src={doctor.image} 
                                          alt={doctor.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <h2 className="text-xl font-semibold mb-1">{doctor.name}</h2>
                                        <p className="text-primary font-medium mb-2">{doctor.specialization}</p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                          <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                            {doctor.rating} Rating
                                          </div>
                                          <span>{doctor.experience} experience</span>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-2xl font-bold text-primary">{doctor.fees}</p>
                                        <p className="text-sm text-muted-foreground">Consultation Fee</p>
                                      </div>
                                    </div>
                                    
                                    {/* About Section */}
                                    <div>
                                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <Stethoscope className="h-5 w-5" />
                                        About
                                      </h3>
                                      <p className="text-muted-foreground leading-relaxed">{doctor.about}</p>
                                    </div>
                                    
                                    {/* Education */}
                                    <div>
                                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5" />
                                        Education
                                      </h3>
                                      <p className="text-muted-foreground">{doctor.education}</p>
                                    </div>
                                    
                                    {/* Certifications */}
                                    <div>
                                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <Award className="h-5 w-5" />
                                        Certifications
                                      </h3>
                                      <div className="flex flex-wrap gap-2">
                                        {doctor.certifications.map((cert) => (
                                          <Badge key={cert} variant="secondary">
                                            {cert}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    {/* Achievements */}
                                    <div>
                                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <Star className="h-5 w-5" />
                                        Achievements
                                      </h3>
                                      <p className="text-muted-foreground">{doctor.achievements}</p>
                                    </div>
                                    
                                    {/* Languages */}
                                    <div>
                                      <h3 className="text-lg font-semibold mb-3">Languages</h3>
                                      <div className="flex flex-wrap gap-2">
                                        {doctor.languages.map((language) => (
                                          <Badge key={language} variant="outline">
                                            {language}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    {/* Location */}
                                    <div>
                                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Location
                                      </h3>
                                      <p className="text-muted-foreground">{doctor.location}</p>
                                    </div>
                                    
                                    {/* Available Slots */}
                                    <div>
                                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        Available Today
                                      </h3>
                                      <div className="flex flex-wrap gap-2">
                                        {doctor.availableSlots.map((slot) => (
                                          <Badge key={slot} variant="secondary">
                                            {slot}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4 border-t">
                                      <Button className="flex-1">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Book Appointment
                                      </Button>
                                      <Button variant="outline" className="flex-1">
                                        <Phone className="h-4 w-4 mr-2" />
                                        Contact
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
            </div>
          </TabsContent>

          <TabsContent value="register" className="mt-6">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Doctor Registration
                </CardTitle>
                <p className="text-muted-foreground">
                  Join our platform to provide mental health support to students
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={registrationForm.fullName}
                        onChange={(e) => updateRegistrationForm("fullName", e.target.value)}
                        required
                        data-testid="input-registration-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={registrationForm.email}
                        onChange={(e) => updateRegistrationForm("email", e.target.value)}
                        required
                        data-testid="input-registration-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={registrationForm.phone}
                        onChange={(e) => updateRegistrationForm("phone", e.target.value)}
                        required
                        data-testid="input-registration-phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization *</Label>
                      <Select 
                        value={registrationForm.specialization} 
                        onValueChange={(value) => updateRegistrationForm("specialization", value)}
                      >
                        <SelectTrigger data-testid="select-registration-specialization">
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="psychiatrist">Psychiatrist</SelectItem>
                          <SelectItem value="psychologist">Clinical Psychologist</SelectItem>
                          <SelectItem value="counselor">Counselor</SelectItem>
                          <SelectItem value="therapist">Therapist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience *</Label>
                      <Input
                        id="experience"
                        value={registrationForm.experience}
                        onChange={(e) => updateRegistrationForm("experience", e.target.value)}
                        required
                        data-testid="input-registration-experience"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Medical License Number *</Label>
                      <Input
                        id="licenseNumber"
                        value={registrationForm.licenseNumber}
                        onChange={(e) => updateRegistrationForm("licenseNumber", e.target.value)}
                        required
                        data-testid="input-registration-license"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qualifications">Qualifications *</Label>
                    <Textarea
                      id="qualifications"
                      placeholder="List your degrees, certifications, and qualifications..."
                      value={registrationForm.qualifications}
                      onChange={(e) => updateRegistrationForm("qualifications", e.target.value)}
                      required
                      data-testid="textarea-registration-qualifications"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="clinicName">Clinic/Hospital Name</Label>
                      <Input
                        id="clinicName"
                        value={registrationForm.clinicName}
                        onChange={(e) => updateRegistrationForm("clinicName", e.target.value)}
                        data-testid="input-registration-clinic"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consultationFees">Consultation Fees (₹)</Label>
                      <Input
                        id="consultationFees"
                        type="number"
                        value={registrationForm.consultationFees}
                        onChange={(e) => updateRegistrationForm("consultationFees", e.target.value)}
                        data-testid="input-registration-fees"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clinicAddress">Clinic Address</Label>
                    <Textarea
                      id="clinicAddress"
                      placeholder="Full address of your clinic or practice..."
                      value={registrationForm.clinicAddress}
                      onChange={(e) => updateRegistrationForm("clinicAddress", e.target.value)}
                      data-testid="textarea-registration-address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about">About Yourself</Label>
                    <Textarea
                      id="about"
                      placeholder="Describe your approach, areas of expertise, and experience working with students..."
                      value={registrationForm.about}
                      onChange={(e) => updateRegistrationForm("about", e.target.value)}
                      data-testid="textarea-registration-about"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" size="lg" data-testid="button-submit-registration">
                      <Mail className="h-4 w-4 mr-2" />
                      Submit Registration
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}