import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  Moon, 
  Book, 
  Clover, 
  Users, 
  Construction, 
  Play, 
  BookOpen, 
  Download, 
  ThumbsUp, 
  Bookmark,
  Search,
  Filter,
  Timer,
  Brain,
  Heart,
  Target,
  Lightbulb,
  CheckCircle,
  Clock,
  FileText,
  Headphones,
  Zap,
  Star,
  Calendar,
  MessageCircle,
  Mic,
  Award,
  TrendingUp
} from "lucide-react";
import type { Resource } from "@/types";
import { BackButton } from "@/components/ui/back-button";

// Import generated wellness images
import stressImage from "@assets/generated_images/Stress_management_breathing_exercise_cea20dc4.png";
import sleepImage from "@assets/generated_images/Sleep_hygiene_wellness_illustration_06246b3a.png";
import studyImage from "@assets/generated_images/Study_techniques_educational_illustration_89d65f81.png";
import mindfulnessImage from "@assets/generated_images/Mindfulness_meditation_wellness_illustration_1d2de5d2.png";
import socialImage from "@assets/generated_images/Social_confidence_building_illustration_08d34b18.png";
import careerImage from "@assets/generated_images/Career_guidance_professional_illustration_3fdaef7e.png";


const categories = [
  { id: "stress-management", icon: Leaf, label: "Stress Management", color: "bg-card border border-border text-card-foreground" },
  { id: "sleep-hygiene", icon: Moon, label: "Sleep Hygiene", color: "bg-card border border-border text-card-foreground" },
  { id: "study-techniques", icon: Book, label: "Study Techniques", color: "bg-card border border-border text-card-foreground" },
  { id: "mindfulness", icon: Clover, label: "Mindfulness", color: "bg-card border border-border text-card-foreground" },
  { id: "social-confidence", icon: Users, label: "Social Confidence", color: "bg-card border border-border text-card-foreground" },
  { id: "career-guidance", icon: Construction, label: "Career Guidance", color: "bg-primary text-primary-foreground" },
];

const resourceTypeIcons = {
  video: Play,
  article: BookOpen,
  audio: Play,
  guide: Book,
  tool: BookOpen,
  activity: BookOpen,
};

const resourceTypeColors = {
  video: "bg-secondary/20 text-secondary",
  article: "bg-accent/20 text-accent", 
  audio: "bg-chart-4/20 text-chart-4",
  guide: "bg-secondary/20 text-secondary",
  tool: "bg-primary/20 text-primary",
  activity: "bg-green-500/20 text-green-700",
};

// Category to image mapping
const categoryImages = {
  "stress-management": stressImage,
  "sleep-hygiene": sleepImage,
  "study-techniques": studyImage,
  "mindfulness": mindfulnessImage,
  "social-confidence": socialImage,
  "career-guidance": careerImage,
};

const wellnessResourcesData = {
  "stress-management": {
    title: "Stress Management",
    description: "Tools and techniques to help you manage stress effectively",
    resources: [
      {
        id: "stress-1",
        title: "4-7-8 Breathing Exercise",
        description: "A simple yet powerful breathing technique to reduce stress instantly. Inhale for 4, hold for 7, exhale for 8.",
        type: "activity",
        duration: 5,
        likes: 245,
        icon: Heart,
        category: "Breathing Exercise"
      },
      {
        id: "stress-2", 
        title: "Progressive Muscle Relaxation",
        description: "Step-by-step guide to systematically tense and relax different muscle groups for deep relaxation.",
        type: "guide",
        duration: 15,
        likes: 189,
        icon: Target,
        category: "Relaxation Technique"
      },
      {
        id: "stress-3",
        title: "Stress Journal Template",
        description: "Track your stress triggers, responses, and coping strategies with this structured journaling template.",
        type: "tool",
        duration: 10,
        likes: 167,
        icon: FileText,
        category: "Journaling Tool"
      },
      {
        id: "stress-4",
        title: "5-Minute Desk Stress Relief",
        description: "Quick exercises and stretches you can do at your desk to release tension and boost energy.",
        type: "activity",
        duration: 5,
        likes: 203,
        icon: Zap,
        category: "Quick Exercise"
      },
      {
        id: "stress-5",
        title: "Motivational Quotes Generator",
        description: "Daily dose of inspiration with curated motivational quotes to help shift your mindset.",
        type: "tool",
        duration: 2,
        likes: 134,
        icon: Star,
        category: "Motivation"
      },
      {
        id: "stress-6",
        title: "Stress Relief Mini Games",
        description: "Fun, interactive games designed to distract your mind and reduce stress levels quickly.",
        type: "activity",
        duration: 10,
        likes: 276,
        icon: Play,
        category: "Interactive Game"
      }
    ]
  },
  "sleep-hygiene": {
    title: "Sleep Hygiene",
    description: "Improve your sleep quality with evidence-based tips and tools",
    resources: [
      {
        id: "sleep-1",
        title: "Personalized Sleep Routine Planner",
        description: "Create a custom bedtime routine tailored to your schedule and preferences for better sleep quality.",
        type: "tool",
        duration: 15,
        likes: 312,
        icon: Calendar,
        category: "Planning Tool"
      },
      {
        id: "sleep-2",
        title: "Sleep Hygiene Do's & Don'ts",
        description: "Comprehensive guide covering what helps and what hurts your sleep, with actionable tips.",
        type: "guide",
        duration: 8,
        likes: 198,
        icon: CheckCircle,
        category: "Educational Guide"
      },
      {
        id: "sleep-3",
        title: "Relaxing Bedtime Sounds",
        description: "Curated collection of nature sounds, white noise, and calming music for better sleep.",
        type: "audio",
        duration: 30,
        likes: 445,
        icon: Headphones,
        category: "Sleep Audio"
      },
      {
        id: "sleep-4",
        title: "Sleep Quality Tracker",
        description: "Monitor your sleep patterns, quality, and factors affecting your rest with detailed analytics.",
        type: "tool",
        duration: 5,
        likes: 267,
        icon: TrendingUp,
        category: "Tracking Tool"
      },
      {
        id: "sleep-5",
        title: "Power Nap Optimization Guide",
        description: "Learn the science of napping and how to take perfect 20-minute power naps for energy boost.",
        type: "guide",
        duration: 6,
        likes: 156,
        icon: Clock,
        category: "Nap Strategy"
      },
      {
        id: "sleep-6",
        title: "Bedtime Wind-Down Routine",
        description: "Gentle activities and exercises to help your mind and body prepare for restful sleep.",
        type: "activity",
        duration: 20,
        likes: 234,
        icon: Moon,
        category: "Bedtime Routine"
      }
    ]
  },
  "study-techniques": {
    title: "Study Techniques",
    description: "Proven methods to enhance learning efficiency and academic performance",
    resources: [
      {
        id: "study-1",
        title: "Pomodoro Study Timer",
        description: "Interactive timer using the Pomodoro Technique: 25 minutes focused study + 5 minute breaks.",
        type: "tool",
        duration: 30,
        likes: 389,
        icon: Timer,
        category: "Time Management"
      },
      {
        id: "study-2",
        title: "Active Recall & Spaced Repetition",
        description: "Master these powerful learning techniques that boost memory retention by up to 200%.",
        type: "guide",
        duration: 12,
        likes: 278,
        icon: Brain,
        category: "Learning Method"
      },
      {
        id: "study-3",
        title: "Note-Taking Strategy Guide",
        description: "Explore Cornell, Mind Mapping, and Outline methods to find your perfect note-taking style.",
        type: "guide",
        duration: 10,
        likes: 195,
        icon: FileText,
        category: "Note-Taking"
      },
      {
        id: "study-4",
        title: "Memory Palace Builder",
        description: "Learn and practice the ancient memory palace technique to remember complex information.",
        type: "activity",
        duration: 20,
        likes: 167,
        icon: Lightbulb,
        category: "Memory Technique"
      },
      {
        id: "study-5",
        title: "Digital Flashcard Creator",
        description: "Create, organize, and review flashcards with spaced repetition algorithms for optimal learning.",
        type: "tool",
        duration: 15,
        likes: 224,
        icon: BookOpen,
        category: "Study Tool"
      },
      {
        id: "study-6",
        title: "Practice Test Generator",
        description: "Generate custom practice tests and quizzes to assess your knowledge and identify weak areas.",
        type: "tool",
        duration: 25,
        likes: 201,
        icon: Award,
        category: "Assessment Tool"
      }
    ]
  },
  "mindfulness": {
    title: "Mindfulness",
    description: "Develop present-moment awareness and inner peace through guided practices",
    resources: [
      {
        id: "mindful-1",
        title: "5-Minute Daily Meditation",
        description: "Quick guided meditation sessions perfect for busy students to start their mindfulness journey.",
        type: "audio",
        duration: 5,
        likes: 356,
        icon: Heart,
        category: "Meditation"
      },
      {
        id: "mindful-2",
        title: "Gratitude Journal Prompts",
        description: "Daily prompts to cultivate appreciation and positive thinking through structured gratitude practice.",
        type: "tool",
        duration: 10,
        likes: 298,
        icon: Star,
        category: "Gratitude Practice"
      },
      {
        id: "mindful-3",
        title: "Mindful Breathing Exercises",
        description: "Various breathing techniques to center yourself and reduce anxiety in any situation.",
        type: "activity",
        duration: 8,
        likes: 267,
        icon: Heart,
        category: "Breathing Practice"
      },
      {
        id: "mindful-4",
        title: "Grounding Techniques for Anxiety",
        description: "Practical exercises to help you stay present and calm during anxious moments using your senses.",
        type: "guide",
        duration: 7,
        likes: 312,
        icon: Target,
        category: "Anxiety Relief"
      },
      {
        id: "mindful-5",
        title: "Calming Visualizations",
        description: "Guided imagery and visualization exercises to create inner peace and mental relaxation.",
        type: "audio",
        duration: 12,
        likes: 234,
        icon: Moon,
        category: "Visualization"
      },
      {
        id: "mindful-6",
        title: "Mindful Movement Practice",
        description: "Gentle yoga and stretching exercises that combine movement with mindfulness awareness.",
        type: "activity",
        duration: 15,
        likes: 189,
        icon: Clover,
        category: "Mindful Movement"
      }
    ]
  },
  "social-confidence": {
    title: "Social Confidence",
    description: "Build meaningful connections and overcome social anxiety with practical tools",
    resources: [
      {
        id: "social-1",
        title: "Conversation Starter Toolkit",
        description: "Ready-to-use conversation prompts and questions for various social situations and settings.",
        type: "tool",
        duration: 8,
        likes: 276,
        icon: MessageCircle,
        category: "Communication Tool"
      },
      {
        id: "social-2",
        title: "Public Speaking Confidence Guide",
        description: "Step-by-step techniques to overcome speaking anxiety and deliver confident presentations.",
        type: "guide",
        duration: 15,
        likes: 203,
        icon: Mic,
        category: "Public Speaking"
      },
      {
        id: "social-3",
        title: "Shyness Reduction Activities",
        description: "Gradual exposure exercises and confidence-building activities to overcome social shyness.",
        type: "activity",
        duration: 20,
        likes: 198,
        icon: Users,
        category: "Confidence Building"
      },
      {
        id: "social-4",
        title: "Social Situation Simulator",
        description: "Practice common social scenarios through interactive role-play simulations and feedback.",
        type: "tool",
        duration: 12,
        likes: 167,
        icon: Play,
        category: "Practice Tool"
      },
      {
        id: "social-5",
        title: "Empathy & Active Listening",
        description: "Develop deeper connections by learning to truly understand and connect with others.",
        type: "guide",
        duration: 10,
        likes: 245,
        icon: Heart,
        category: "Relationship Skills"
      },
      {
        id: "social-6",
        title: "Social Confidence Challenges",
        description: "Weekly challenges to gradually expand your comfort zone and build lasting social confidence.",
        type: "activity",
        duration: 30,
        likes: 189,
        icon: Target,
        category: "Challenge Series"
      }
    ]
  },
  "career-guidance": {
    title: "Career Guidance",
    description: "Navigate your career path with tools, templates, and strategic guidance",
    resources: [
      {
        id: "career-1",
        title: "Resume & Cover Letter Templates",
        description: "Professional, ATS-friendly templates with industry-specific examples and writing guides.",
        type: "tool",
        duration: 30,
        likes: 445,
        icon: FileText,
        category: "Application Tools"
      },
      {
        id: "career-2",
        title: "Career Personality Assessment",
        description: "Discover your strengths, interests, and ideal career paths through comprehensive personality testing.",
        type: "tool",
        duration: 20,
        likes: 367,
        icon: Brain,
        category: "Self-Assessment"
      },
      {
        id: "career-3",
        title: "Interview Preparation Kit",
        description: "Common questions, STAR method training, and mock interview practice for job success.",
        type: "guide",
        duration: 25,
        likes: 312,
        icon: MessageCircle,
        category: "Interview Prep"
      },
      {
        id: "career-4",
        title: "Higher Studies Planning Guide",
        description: "Navigate graduate school applications, funding options, and program selection strategies.",
        type: "guide",
        duration: 18,
        likes: 234,
        icon: Book,
        category: "Education Planning"
      },
      {
        id: "career-5",
        title: "Internship Strategy Toolkit",
        description: "Find, apply, and excel in internships with networking tips and application strategies.",
        type: "tool",
        duration: 15,
        likes: 289,
        icon: TrendingUp,
        category: "Internship Guide"
      },
      {
        id: "career-6",
        title: "5-Year Career Roadmap",
        description: "Create a strategic plan for your career with goal-setting templates and milestone tracking.",
        type: "tool",
        duration: 45,
        likes: 198,
        icon: Calendar,
        category: "Career Planning"
      }
    ]
  }
};

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState("career-guidance");
  const [searchQuery, setSearchQuery] = useState("");

  // Get current category data
  const currentCategoryData = wellnessResourcesData[selectedCategory as keyof typeof wellnessResourcesData];
  
  // Filter resources based on search query
  const resources = currentCategoryData?.resources.filter(resource => 
    searchQuery === "" || 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const isLoading = false; // No loading since we use local data

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      // Reset other categories to default styling
      categories.forEach(cat => {
        if (cat.id !== categoryId) {
          cat.color = "bg-card border border-border text-card-foreground hover:bg-muted/50 transition-colors";
        }
      });
      // Set active category styling
      category.color = "bg-primary text-primary-foreground";
    }
  };

  const handleResourceAction = (action: string, resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;

    if (action === 'view') {
      // Open resource content based on type
      if (resource.type === 'video' || resource.type === 'audio') {
        // For video/audio - show a modal or redirect to media player
        alert(`Playing: ${resource.title}\n\n${resource.description}\n\nDuration: ${resource.duration} minutes`);
      } else if (resource.type === 'tool') {
        // For tools - show interactive tool interface
        alert(`Using Tool: ${resource.title}\n\n${resource.description}\n\nThis would open the interactive ${resource.category.toLowerCase()} tool.`);
      } else if (resource.type === 'guide' || resource.type === 'article') {
        // For guides/articles - show reading interface
        alert(`Reading: ${resource.title}\n\n${resource.description}\n\nEstimated reading time: ${resource.duration} minutes\n\nThis would open the full content for reading.`);
      } else {
        // For activities - show step-by-step instructions
        alert(`Starting Activity: ${resource.title}\n\n${resource.description}\n\nDuration: ${resource.duration} minutes\n\nThis would guide you through the ${resource.category.toLowerCase()} activity.`);
      }
    } else if (action === 'bookmark') {
      // Add to saved resources
      alert(`Bookmarked: ${resource.title}\n\nThis resource has been saved to your bookmarks for easy access later.`);
    } else if (action === 'download') {
      // Download for offline access
      alert(`Downloading: ${resource.title}\n\nThis resource is being prepared for offline access.`);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Wellness Resources</h1>
        <p className="text-muted-foreground">
          Explore curated content to support your mental health journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-card-foreground mb-4">Browse Resources</h3>
              <div className="grid grid-cols-1 gap-3">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div
                      key={category.id}
                      className={`cursor-pointer rounded-lg p-4 transition-all duration-300 hover:shadow-lg border-2 ${
                        selectedCategory === category.id 
                          ? "border-primary shadow-md bg-primary text-primary-foreground" 
                          : "border-border hover:border-primary/50 bg-card text-card-foreground"
                      }`}
                      onClick={() => handleCategoryChange(category.id)}
                      data-testid={`button-category-${category.id}`}
                    >
                      <div className="flex items-center">
                        <IconComponent className="h-5 w-5 mr-3" />
                        <span className="font-medium">{category.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div>
              <h4 className="font-medium text-card-foreground mb-2">Search Resources</h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-resources"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resource Content */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-3"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !resources || resources.length === 0 ? (
            <div className="text-center py-12">
              <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">No Resources Found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search terms." : "Resources are being curated for this category."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Category Header */}
              <div className="text-center py-6 border-b border-border">
                <h2 className="text-2xl font-bold text-foreground mb-2">{currentCategoryData?.title}</h2>
                <p className="text-muted-foreground">{currentCategoryData?.description}</p>
              </div>

              {/* Resources Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => {
                  const ResourceIcon = resource.icon;
                  const typeColor = resourceTypeColors[resource.type as keyof typeof resourceTypeColors];
                  
                  return (
                    <Card key={resource.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-primary">
                      {/* Beautiful Category Image */}
                      <div className="h-32 relative overflow-hidden">
                        <img 
                          src={categoryImages[selectedCategory as keyof typeof categoryImages]} 
                          alt={currentCategoryData?.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        <div className="absolute top-3 right-3">
                          <Badge className={`text-xs font-medium ${typeColor} backdrop-blur-sm`}>
                            {resource.type}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <ResourceIcon className="h-8 w-8 text-white drop-shadow-lg" />
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {resource.category}
                          </Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{resource.duration} min</span>
                          </div>
                        </div>
                        
                        <h4 className="font-semibold text-card-foreground mb-2 line-clamp-2 text-lg">
                          {resource.title}
                        </h4>
                        
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                          {resource.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <ThumbsUp className="h-3 w-3 mr-1 text-green-500" />
                            <span className="font-medium">{resource.likes} helpful</span>
                          </div>
                          
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              className="h-8 px-3"
                              onClick={() => handleResourceAction('view', resource.id)}
                              data-testid={`button-view-resource-${resource.id}`}
                            >
                              {resource.type === 'video' || resource.type === 'audio' ? (
                                <>
                                  <Play className="h-3 w-3 mr-1" />
                                  Play
                                </>
                              ) : resource.type === 'tool' ? (
                                <>
                                  <Zap className="h-3 w-3 mr-1" />
                                  Use
                                </>
                              ) : (
                                <>
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  Start
                                </>
                              )}
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleResourceAction('bookmark', resource.id)}
                              data-testid={`button-bookmark-resource-${resource.id}`}
                            >
                              <Bookmark className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
