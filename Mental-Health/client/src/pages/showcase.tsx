import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Heart, 
  Eye,
  MessageSquare, 
  Palette,
  Code,
  Music,
  Camera,
  PenTool,
  Award,
  Star,
  Trophy,
  Image,
  FileText,
  Mic,
  Video,
  Theater,
  Brush,
  Guitar,
  Zap,
  Gamepad2,
  Scissors,
  Cake,
  Shirt,
  Car,
  Wrench,
  Dumbbell,
  TreePine,
  Coffee,
  Utensils,
  Flower,
  Languages,
  Globe,
  BookOpen,
  Filter,
  TrendingUp,
  Clock,
  Users,
  Share2,
  Search,
  Grid,
  List,
  Upload,
  Sparkles,
  ExternalLink,
  Calendar,
  MessageCircle
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/ui/back-button";

// Import local assets
import showcaseImage1 from '@/assets/showcase/images/image_1757128213806.png';
import showcaseImage2 from '@/assets/showcase/images/image_1757134410950.png';
import showcaseImage3 from '@/assets/showcase/images/image_1757136142731.png';
import audioSample1 from '@/assets/showcase/audio/WhatsApp Audio 2025-09-06 at 09.26.39_7516e2fa_1757131765090.mp3';
import audioSample2 from '@/assets/showcase/audio/WhatsApp Audio 2025-09-06 at 09.26.40_42b10528_1757131765090.mp3';

const skillCategories = [
  { value: "art", label: "Art & Drawing", icon: Palette, color: "bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border-rose-200 dark:from-rose-900 dark:to-pink-900 dark:text-rose-200 dark:border-rose-700" },
  { value: "digital-art", label: "Digital Art", icon: Brush, color: "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200 dark:from-purple-900 dark:to-violet-900 dark:text-purple-200 dark:border-purple-700" },
  { value: "music", label: "Music", icon: Music, color: "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 dark:from-blue-900 dark:to-indigo-900 dark:text-blue-200 dark:border-blue-700" },
  { value: "instrumental", label: "Instrumental", icon: Guitar, color: "bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 border-indigo-200 dark:from-indigo-900 dark:to-blue-900 dark:text-indigo-200 dark:border-indigo-700" },
  { value: "singing", label: "Singing", icon: Mic, color: "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 border-pink-200 dark:from-pink-900 dark:to-rose-900 dark:text-pink-200 dark:border-pink-700" },
  { value: "writing", label: "Creative Writing", icon: PenTool, color: "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200 dark:from-emerald-900 dark:to-teal-900 dark:text-emerald-200 dark:border-emerald-700" },
  { value: "poetry", label: "Poetry", icon: FileText, color: "bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 border-teal-200 dark:from-teal-900 dark:to-cyan-900 dark:text-teal-200 dark:border-teal-700" },
  { value: "photography", label: "Photography", icon: Camera, color: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 dark:from-amber-900 dark:to-yellow-900 dark:text-amber-200 dark:border-amber-700" },
  { value: "videography", label: "Video Creation", icon: Video, color: "bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200 dark:from-orange-900 dark:to-red-900 dark:text-orange-200 dark:border-orange-700" },
  { value: "coding", label: "Programming", icon: Code, color: "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200 dark:from-slate-900 dark:to-gray-900 dark:text-slate-200 dark:border-slate-700" },
  { value: "dance", label: "Dance", icon: Zap, color: "bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-800 border-cyan-200 dark:from-cyan-900 dark:to-teal-900 dark:text-cyan-200 dark:border-cyan-700" },
  { value: "theater", label: "Theater & Acting", icon: Theater, color: "bg-gradient-to-r from-violet-100 to-purple-100 text-violet-800 border-violet-200 dark:from-violet-900 dark:to-purple-900 dark:text-violet-200 dark:border-violet-700" },
  { value: "gaming", label: "Game Development", icon: Gamepad2, color: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 dark:from-green-900 dark:to-emerald-900 dark:text-green-200 dark:border-green-700" },
  { value: "crafts", label: "Arts & Crafts", icon: Scissors, color: "bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border-rose-200 dark:from-rose-900 dark:to-pink-900 dark:text-rose-200 dark:border-rose-700" },
  { value: "cooking", label: "Cooking", icon: Utensils, color: "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 dark:from-amber-900 dark:to-orange-900 dark:text-amber-200 dark:border-amber-700" },
  { value: "baking", label: "Baking", icon: Cake, color: "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200 dark:from-yellow-900 dark:to-amber-900 dark:text-yellow-200 dark:border-yellow-700" },
  { value: "fashion", label: "Fashion Design", icon: Shirt, color: "bg-gradient-to-r from-fuchsia-100 to-pink-100 text-fuchsia-800 border-fuchsia-200 dark:from-fuchsia-900 dark:to-pink-900 dark:text-fuchsia-200 dark:border-fuchsia-700" },
  { value: "automotive", label: "Automotive", icon: Car, color: "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200 dark:from-gray-900 dark:to-slate-900 dark:text-gray-200 dark:border-gray-700" },
  { value: "diy", label: "DIY Projects", icon: Wrench, color: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200 dark:from-blue-900 dark:to-cyan-900 dark:text-blue-200 dark:border-blue-700" },
  { value: "fitness", label: "Fitness", icon: Dumbbell, color: "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200 dark:from-red-900 dark:to-rose-900 dark:text-red-200 dark:border-red-700" },
  { value: "gardening", label: "Gardening", icon: TreePine, color: "bg-gradient-to-r from-green-100 to-lime-100 text-green-800 border-green-200 dark:from-green-900 dark:to-lime-900 dark:text-green-200 dark:border-green-700" },
  { value: "coffee-art", label: "Coffee Art", icon: Coffee, color: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 dark:from-amber-900 dark:to-yellow-900 dark:text-amber-200 dark:border-amber-700" },
  { value: "nature", label: "Nature Art", icon: Flower, color: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200 dark:from-emerald-900 dark:to-green-900 dark:text-emerald-200 dark:border-emerald-700" },
  { value: "languages", label: "Languages", icon: Languages, color: "bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-800 border-indigo-200 dark:from-indigo-900 dark:to-violet-900 dark:text-indigo-200 dark:border-indigo-700" },
  { value: "cultural", label: "Cultural Arts", icon: Globe, color: "bg-gradient-to-r from-purple-100 to-fuchsia-100 text-purple-800 border-purple-200 dark:from-purple-900 dark:to-fuchsia-900 dark:text-purple-200 dark:border-purple-700" },
  { value: "academic", label: "Academic Work", icon: BookOpen, color: "bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800 border-teal-200 dark:from-teal-900 dark:to-emerald-900 dark:text-teal-200 dark:border-teal-700" },
  { value: "other", label: "Other", icon: Star, color: "bg-gradient-to-r from-gray-100 to-zinc-100 text-gray-800 border-gray-200 dark:from-gray-900 dark:to-zinc-900 dark:text-gray-200 dark:border-gray-700" }
];

const themes = [
  { value: "inspiration", label: "Inspiration & Hope", color: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700" },
  { value: "healing", label: "Healing Journey", color: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700" },
  { value: "mindfulness", label: "Mindfulness & Peace", color: "bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 dark:from-purple-900/20 dark:to-violet-900/20 dark:border-purple-700" },
  { value: "community", label: "Community Support", color: "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 dark:from-orange-900/20 dark:to-amber-900/20 dark:border-orange-700" },
  { value: "cultural", label: "Cultural Heritage", color: "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 dark:from-yellow-900/20 dark:to-amber-900/20 dark:border-yellow-700" },
  { value: "nature", label: "Nature & Environment", color: "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 dark:from-emerald-900/20 dark:to-teal-900/20 dark:border-emerald-700" },
  { value: "education", label: "Learning & Growth", color: "bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 dark:from-indigo-900/20 dark:to-blue-900/20 dark:border-indigo-700" },
  { value: "innovation", label: "Innovation & Tech", color: "bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-200 dark:from-cyan-900/20 dark:to-teal-900/20 dark:border-cyan-700" },
  { value: "celebration", label: "Joy & Celebration", color: "bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200 dark:from-pink-900/20 dark:to-rose-900/20 dark:border-pink-700" },
  { value: "challenge", label: "Overcoming Challenges", color: "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 dark:from-red-900/20 dark:to-rose-900/20 dark:border-red-700" }
];

const sortOptions = [
  { value: "recent", label: "Most Recent", icon: Clock },
  { value: "popular", label: "Most Popular", icon: TrendingUp },
  { value: "views", label: "Most Viewed", icon: Eye },
  { value: "liked", label: "Most Liked", icon: Heart }
];

interface ShowcasePost {
  id: string;
  title: string;
  description: string;
  category: string;
  theme?: string;
  tags?: string[];
  imageUrl?: string;
  fileUrl?: string;
  likes: number;
  views: number;
  comments: number;
  author: {
    name: string;
    institution: string;
  };
  createdAt: string;
  isLiked: boolean;
}

export default function Showcase() {
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");
  const [showTrending, setShowTrending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    category: "",
    theme: "",
    tags: "",
    file: null as File | null
  });

  // Fetch showcase posts
  const { data: showcasePosts, isLoading } = useQuery({
    queryKey: ["/api/showcase/posts", selectedCategory],
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: FormData) => {
      return await apiRequest("POST", "/api/showcase/posts", postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/showcase/posts"] });
      setIsCreatePostOpen(false);
      setNewPost({ title: "", description: "", category: "", theme: "", tags: "", file: null });
      toast({
        title: "Showcase created!",
        description: "Your creative work has been shared with the community.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create showcase post. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      return await apiRequest("POST", `/api/showcase/posts/${postId}/like`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/showcase/posts"] });
    },
  });

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.description || !newPost.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("description", newPost.description);
    formData.append("category", newPost.category);
    formData.append("theme", newPost.theme);
    formData.append("tags", newPost.tags);
    formData.append("userId", currentUser?.id || "");
    
    if (newPost.file) {
      formData.append("file", newPost.file);
    }

    createPostMutation.mutate(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      setNewPost({ ...newPost, file });
    }
  };

  // Enhanced mock data with local assets
  const mockPosts: ShowcasePost[] = [
    {
      id: "1",
      title: "Sunset Painting",
      description: "A watercolor painting of sunset over mountains. This piece represents my journey through healing and finding peace.",
      category: "art",
      theme: "healing",
      tags: ["watercolor", "nature", "peace"],
      imageUrl: showcaseImage1,
      likes: 24,
      views: 156,
      comments: 8,
      author: {
        name: "Anonymous Artist",
        institution: "Delhi University"
      },
      createdAt: "2024-01-15T10:30:00Z",
      isLiked: false
    },
    {
      id: "2",
      title: "Mental Health Awareness Song",
      description: "Original composition about breaking mental health stigma in Indian society.",
      category: "music",
      theme: "community",
      tags: ["original", "awareness", "mental-health"],
      fileUrl: audioSample1,
      likes: 18,
      views: 89,
      comments: 12,
      author: {
        name: "Music Lover",
        institution: "Mumbai College"
      },
      createdAt: "2024-01-14T15:20:00Z",
      isLiked: true
    },
    {
      id: "3",
      title: "Hope - A Short Poem",
      description: "A poem about finding hope during difficult times. Written during my recovery journey.",
      category: "poetry",
      theme: "inspiration",
      tags: ["hope", "recovery", "inspiration"],
      likes: 31,
      views: 203,
      comments: 15,
      author: {
        name: "Word Weaver",
        institution: "Bangalore Institute"
      },
      createdAt: "2024-01-13T09:45:00Z",
      isLiked: false
    },
    {
      id: "4",
      title: "Digital Portrait Series",
      description: "A collection of digital portraits exploring emotions and mental states through vibrant colors.",
      category: "digital-art",
      theme: "mindfulness",
      tags: ["digital", "portraits", "emotions"],
      imageUrl: showcaseImage2,
      likes: 45,
      views: 234,
      comments: 19,
      author: {
        name: "Digital Creator",
        institution: "IIT Chennai"
      },
      createdAt: "2024-01-12T14:20:00Z",
      isLiked: false
    },
    {
      id: "5",
      title: "Healthy Meal Prep Ideas",
      description: "Creative and nutritious meal prep recipes for busy college students on a budget.",
      category: "cooking",
      theme: "education",
      tags: ["healthy", "budget", "student-life"],
      imageUrl: showcaseImage3,
      likes: 67,
      views: 401,
      comments: 23,
      author: {
        name: "Chef Student",
        institution: "Culinary Institute Delhi"
      },
      createdAt: "2024-01-11T09:15:00Z",
      isLiked: true
    },
    {
      id: "6",
      title: "Meditation App UI Design",
      description: "User interface design for a mindfulness app focused on Indian meditation practices.",
      category: "coding",
      theme: "innovation",
      tags: ["ui-design", "meditation", "tech"],
      imageUrl: showcaseImage1,
      likes: 52,
      views: 312,
      comments: 16,
      author: {
        name: "UX Designer",
        institution: "NIT Warangal"
      },
      createdAt: "2024-01-10T16:45:00Z",
      isLiked: false
    },
    {
      id: "7",
      title: "Inspiring Audio Journal",
      description: "Personal reflections and motivational thoughts shared to inspire other students.",
      category: "singing",
      theme: "inspiration",
      tags: ["motivation", "personal", "voice"],
      fileUrl: audioSample2,
      likes: 89,
      views: 567,
      comments: 34,
      author: {
        name: "Voice of Hope",
        institution: "University of Delhi"
      },
      createdAt: "2024-01-09T11:30:00Z",
      isLiked: true
    },
    {
      id: "8",
      title: "Creative Photography Series",
      description: "Capturing the beauty and complexity of Indian college life through artistic photography.",
      category: "photography",
      theme: "cultural",
      tags: ["photography", "college-life", "artistic"],
      imageUrl: showcaseImage2,
      likes: 38,
      views: 189,
      comments: 12,
      author: {
        name: "Lens Artist",
        institution: "NIFT Mumbai"
      },
      createdAt: "2024-01-08T13:20:00Z",
      isLiked: false
    }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      
      <div className="mb-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
            Creative Showcase
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Share your creative talents, discover amazing work from the community, and celebrate the diverse skills of students across India
          </p>
        </div>
      </div>

      {/* Featured Creators Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Featured Creators
          </h2>
          <Button variant="outline" size="sm" className="text-xs">
            View All <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Anonymous Artist", works: 12, likes: 450, specialty: "Digital Art", avatar: "🎨" },
            { name: "Music Lover", works: 8, likes: 380, specialty: "Music Production", avatar: "🎵" },
            { name: "Word Weaver", works: 15, likes: 520, specialty: "Poetry & Writing", avatar: "✍️" },
            { name: "Lens Artist", works: 20, likes: 670, specialty: "Photography", avatar: "📸" }
          ].map((creator, index) => (
            <Card key={`creator-${index}`} className="p-4 text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="text-3xl mb-2">{creator.avatar}</div>
              <h3 className="font-semibold text-sm mb-1">{creator.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">{creator.specialty}</p>
              <div className="flex justify-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <Award className="h-3 w-3" /> {creator.works}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" /> {creator.likes}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Trending Now Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-500" />
            Trending This Week
          </h2>
          <Button 
            variant={showTrending ? "default" : "outline"} 
            size="sm" 
            onClick={() => setShowTrending(!showTrending)}
            className="text-xs"
          >
            {showTrending ? "Show All" : "Show Trending"}
          </Button>
        </div>
        {showTrending && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mockPosts.slice(0, 3).map((post) => {
              const categoryInfo = skillCategories.find(cat => cat.value === post.category);
              const CategoryIcon = categoryInfo?.icon || Star;
              return (
                <Card key={`trending-${post.id}`} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-green-200 dark:border-green-800">
                  <div className="relative">
                    {post.imageUrl && (
                      <div className="aspect-video overflow-hidden">
                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                      <TrendingUp className="h-3 w-3 mr-1" /> Trending
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CategoryIcon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{categoryInfo?.label}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" /> {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" /> {post.views}
                        </span>
                      </div>
                      <Button size="sm" variant="outline" className="h-6 text-xs">
                        <Share2 className="h-3 w-3 mr-1" /> Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search creative works..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 text-base border-2 border-border/50 focus:border-primary/50 rounded-xl bg-background/80 backdrop-blur-sm"
            data-testid="input-search"
          />
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="space-y-6 mb-8">
        {/* Top Actions Bar */}
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                <span className="text-base font-semibold text-foreground">Sort & View:</span>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44 bg-background/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
              <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 border border-border/30">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-9 w-9 p-0 transition-all duration-200"
                >
                  <Users className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-9 w-9 p-0 transition-all duration-200"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" 
                  data-testid="button-create-showcase"
                  size="lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Share Your Work
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-background to-background/80 border-border/50">
              <DialogHeader className="text-center pb-4">
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Share Your Creative Work
                </DialogTitle>
                <p className="text-muted-foreground mt-2">Showcase your talents and inspire the community</p>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-foreground">Title *</Label>
                  <Input
                    id="title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Give your work a catchy title..."
                    className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                    data-testid="input-showcase-title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-semibold text-foreground">Category *</Label>
                  <Select
                    value={newPost.category}
                    onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                  >
                    <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary" data-testid="select-showcase-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-sm font-semibold text-foreground">Theme (Optional)</Label>
                  <Select
                    value={newPost.theme}
                    onValueChange={(value) => setNewPost({ ...newPost, theme: value })}
                  >
                    <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary" data-testid="select-showcase-theme">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          {theme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm font-semibold text-foreground">Tags (Optional)</Label>
                  <Input
                    id="tags"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    placeholder="creativity, mental-health, inspiration..."
                    className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                    data-testid="input-showcase-tags"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate tags with commas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-foreground">Description *</Label>
                  <Textarea
                    id="description"
                    value={newPost.description}
                    onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                    placeholder="Tell us about your work, inspiration, or journey..."
                    rows={4}
                    className="bg-background/50 border-border/50 focus:border-primary transition-colors resize-none"
                    data-testid="textarea-showcase-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file" className="text-sm font-semibold text-foreground">Upload File (Optional)</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
                    className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                    data-testid="input-showcase-file"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported: Images, Audio, Video, PDF, Documents (Max 10MB)
                  </p>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreatePostOpen(false)}
                    className="transition-all duration-200 hover:scale-105"
                    data-testid="button-cancel-showcase"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    disabled={createPostMutation.isPending}
                    className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    data-testid="button-submit-showcase"
                  >
                    {createPostMutation.isPending ? "Sharing..." : "Share Work"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
          </div>
        </div>
        
        {/* Category Filters */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <span className="text-base font-semibold text-foreground">Categories:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="transition-all duration-200 hover:scale-105 text-xs sm:text-sm"
            >
              All Categories
            </Button>
            {skillCategories.slice(0, 6).map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className={`transition-all duration-200 hover:scale-105 text-xs sm:text-sm ${selectedCategory === category.value ? category.color : ''}`}
              >
                <category.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">{category.label}</span>
                <span className="sm:hidden">{category.label.split(' ')[0]}</span>
              </Button>
            ))}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-28 sm:w-36 text-xs sm:text-sm">
                <SelectValue placeholder="More..." />
              </SelectTrigger>
              <SelectContent>
                {skillCategories.slice(6).map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        </div>
        
        
        {/* Theme Filters */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="text-base font-semibold text-foreground">Themes:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTheme === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTheme("all")}
              className="transition-all duration-200 hover:scale-105 text-xs sm:text-sm"
            >
              All Themes
            </Button>
            {themes.slice(0, 5).map((theme) => (
              <Button
                key={theme.value}
                variant={selectedTheme === theme.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTheme(theme.value)}
                className={`transition-all duration-200 hover:scale-105 text-xs sm:text-sm ${selectedTheme === theme.value ? theme.color : ''}`}
              >
                <span className="hidden sm:inline">{theme.label}</span>
                <span className="sm:hidden">{theme.label.split(' ')[0]}</span>
              </Button>
            ))}
            {themes.length > 5 && (
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger className="w-28 sm:w-36 text-xs sm:text-sm">
                  <SelectValue placeholder="More themes..." />
                </SelectTrigger>
                <SelectContent>
                  {themes.slice(5).map((theme) => (
                    <SelectItem key={theme.value} value={theme.value}>
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      {/* Showcase Grid */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8" : "space-y-4 sm:space-y-6"}>
        {mockPosts.map((post) => {
          const categoryInfo = skillCategories.find(cat => cat.value === post.category);
          const themeInfo = themes.find(t => t.value === post.theme);
          const CategoryIcon = categoryInfo?.icon || Star;
          
          return (
            <Card key={post.id} className="group overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1 border-border/50 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={`flex items-center gap-1 px-3 py-1 text-xs font-medium border ${categoryInfo?.color || "bg-secondary"}`}>
                      <CategoryIcon className="h-3 w-3" />
                      {categoryInfo?.label || post.category}
                    </Badge>
                    {post.theme && themeInfo && (
                      <Badge variant="outline" className={`text-xs px-2 py-1 ${themeInfo.color}`}>
                        {themeInfo.label}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                    <Eye className="h-3 w-3" />
                    <span className="font-medium">{post.views}</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors duration-200">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-5">
                {(post.imageUrl || post.fileUrl) && (
                  <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted rounded-xl overflow-hidden border border-border/30 group-hover:border-primary/30 transition-colors duration-300">
                    {post.imageUrl ? (
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : post.fileUrl && (post.category === 'music' || post.category === 'singing') ? (
                      <div className="flex flex-col items-center justify-center h-full p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                        <Music className="h-12 w-12 text-primary mb-3" />
                        <div className="text-center mb-3">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">🎵 Audio Content</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Click play to listen</p>
                        </div>
                        <audio controls className="w-full max-w-xs rounded-lg shadow-sm">
                          <source src={post.fileUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    ) : null}
                    <div className="hidden flex items-center justify-center h-full">
                      <Image className="h-16 w-16 text-muted-foreground/60 group-hover:text-primary/60 transition-colors duration-300" />
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground/90 line-clamp-3 leading-relaxed">
                  {post.description}
                </p>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Badge 
                        key={`${post.id}-tag-${index}`}
                        variant="outline" 
                        className="text-xs px-2 py-0.5 bg-gradient-to-r from-primary/10 to-primary/20 border-primary/20 text-primary/80 hover:bg-primary/20 hover:from-primary/20 hover:to-primary/30 transition-all duration-200 cursor-pointer"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground/80">{post.author.name}</p>
                    <p className="text-muted-foreground/70">{post.author.institution}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => likePostMutation.mutate(post.id)}
                      className={`transition-all duration-200 hover:scale-110 ${post.isLiked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"}`}
                      data-testid={`button-like-${post.id}`}
                    >
                      <Heart className={`h-4 w-4 mr-1 transition-all duration-200 ${post.isLiked ? "fill-current scale-110" : ""}`} />
                      <span className="font-medium">{post.likes}</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="transition-all duration-200 hover:scale-110 hover:text-blue-500"
                      data-testid={`button-comment-${post.id}`}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span className="font-medium">{post.comments}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="transition-all duration-200 hover:scale-110 hover:text-green-500"
                      onClick={() => {
                        navigator.share ? 
                          navigator.share({
                            title: post.title,
                            text: post.description,
                            url: window.location.href
                          }) : 
                          navigator.clipboard.writeText(window.location.href)
                      }}
                      data-testid={`button-share-${post.id}`}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Community Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Total Creations", value: "2,847", icon: Award, color: "text-blue-500" },
          { label: "Active Creators", value: "1,203", icon: Users, color: "text-green-500" },
          { label: "This Week", value: "89", icon: Calendar, color: "text-purple-500" },
          { label: "Total Likes", value: "15.2K", icon: Heart, color: "text-red-500" }
        ].map((stat, index) => (
          <Card key={`stat-${index}`} className="p-4 text-center hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-primary/5 to-secondary/5">
            <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-lg">
        <Sparkles className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4 sm:mb-6 animate-pulse" />
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Share Your Creative Journey
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
          Join our vibrant community of creative minds. Upload your artwork, music, writing, or any creative expression
          to inspire others and showcase your unique talents. Every creation tells a story of healing and hope.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => setIsCreatePostOpen(true)}
            size="lg"
            className="px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            data-testid="button-upload-creation"
          >
            <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Upload Your Creation
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold border-2 hover:bg-primary/10 transition-all duration-300"
            data-testid="button-join-community"
          >
            <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Join Community
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {mockPosts.length === 0 && (
        <Card className="text-center py-16 bg-gradient-to-br from-background to-muted/20 border-dashed border-2 border-border/50">
          <CardContent>
            <div className="max-w-md mx-auto">
              <Trophy className="h-16 w-16 text-muted-foreground/60 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-3 text-foreground">No showcases yet</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Be the first to share your creative work with the community and inspire others!
              </p>
              <Button 
                onClick={() => setIsCreatePostOpen(true)}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Share Your Work
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}