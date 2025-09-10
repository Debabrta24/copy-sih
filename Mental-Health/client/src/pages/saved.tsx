import { useState } from "react";
import { BookOpen, Heart, Video, Music, Stethoscope, Flower, Clock, Star, Bookmark, Share2, Download, X, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BackButton } from "@/components/ui/back-button";
import { useToast } from "@/hooks/use-toast";

interface SavedItem {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'video' | 'audio' | 'tip' | 'quote';
  category: string;
  tags: string[];
  savedDate: string;
  source?: string;
  duration?: string;
  thumbnail?: string;
  isFavorite: boolean;
}

const savedContent: SavedItem[] = [
  {
    id: "1",
    title: "5 Breathing Techniques for Instant Calm",
    content: "Learn powerful breathing exercises that can help reduce anxiety and stress within minutes. These techniques are scientifically proven to activate your body's relaxation response.",
    type: "article",
    category: "Stress Management",
    tags: ["breathing", "anxiety", "relaxation", "mindfulness"],
    savedDate: "2024-01-15",
    source: "Mental Wellness Hub",
    isFavorite: true
  },
  {
    id: "2",
    title: "Morning Meditation for Students",
    content: "A guided 10-minute meditation designed specifically for college students to start their day with clarity and focus.",
    type: "audio",
    category: "Meditation",
    tags: ["meditation", "morning routine", "focus", "students"],
    savedDate: "2024-01-14",
    duration: "10 min",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    isFavorite: false
  },
  {
    id: "3",
    title: "Study Smart, Not Hard: Proven Techniques",
    content: "Discover evidence-based study methods that can improve your learning efficiency by up to 40%. Perfect for exam preparation and long-term retention.",
    type: "video",
    category: "Academic Success",
    tags: ["study tips", "memory", "productivity", "exams"],
    savedDate: "2024-01-13",
    duration: "15 min",
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop",
    isFavorite: true
  },
  {
    id: "4",
    title: "Progressive Muscle Relaxation Guide",
    content: "Step-by-step instructions for progressive muscle relaxation - a powerful technique to reduce physical tension and mental stress.",
    type: "article",
    category: "Relaxation",
    tags: ["muscle relaxation", "stress relief", "sleep", "wellness"],
    savedDate: "2024-01-12",
    source: "Wellness Today",
    isFavorite: false
  },
  {
    id: "5",
    title: "Healthy Sleep Habits for Better Mental Health",
    content: "Understanding the connection between sleep and mental wellbeing. Learn how to optimize your sleep schedule for better mood and cognitive performance.",
    type: "article",
    category: "Sleep Wellness",
    tags: ["sleep", "mental health", "routine", "wellness"],
    savedDate: "2024-01-11",
    source: "Sleep Science Journal",
    isFavorite: true
  },
  {
    id: "6",
    title: "Dealing with Academic Pressure",
    content: "Practical strategies for managing academic stress, setting realistic goals, and maintaining a healthy work-life balance during college years.",
    type: "tip",
    category: "Student Life",
    tags: ["academic stress", "goal setting", "balance", "college"],
    savedDate: "2024-01-10",
    isFavorite: false
  },
  {
    id: "7",
    title: "Quick Yoga Sequence for Stress Relief",
    content: "A 5-minute yoga flow that you can do anywhere to release tension and center yourself during busy days.",
    type: "video",
    category: "Physical Wellness",
    tags: ["yoga", "stress relief", "quick workout", "flexibility"],
    savedDate: "2024-01-09",
    duration: "5 min",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop",
    isFavorite: true
  },
  {
    id: "8",
    title: "Building Healthy Relationships in College",
    content: "Tips for forming meaningful connections, maintaining friendships, and navigating social situations with confidence and authenticity.",
    type: "article",
    category: "Social Wellness",
    tags: ["relationships", "social skills", "friendship", "communication"],
    savedDate: "2024-01-08",
    source: "Social Psychology Today",
    isFavorite: false
  }
];

const typeIcons = {
  article: BookOpen,
  video: Video,
  audio: Music,
  tip: Stethoscope,
  quote: Heart
};

const categoryColors = {
  "Stress Management": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  "Meditation": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Academic Success": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Relaxation": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Sleep Wellness": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  "Student Life": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "Physical Wellness": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  "Social Wellness": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
};

export default function SavedContent() {
  const [items, setItems] = useState<SavedItem[]>(savedContent);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { toast } = useToast();

  const filteredContent = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesType = selectedType === "all" || item.type === selectedType;
    const matchesFavorites = !showFavoritesOnly || item.isFavorite;
    
    return matchesSearch && matchesCategory && matchesType && matchesFavorites;
  });

  const categories = Array.from(new Set(items.map(item => item.category)));
  const types = Array.from(new Set(items.map(item => item.type)));

  const handleShare = (item: SavedItem) => {
    toast({
      title: "Content Shared",
      description: `"${item.title}" has been shared successfully.`,
    });
  };

  const handleDownload = (item: SavedItem) => {
    toast({
      title: "Download Started",
      description: `Downloading "${item.title}" for offline access.`,
    });
  };

  const handleRemove = (item: SavedItem) => {
    setItems(prevItems => prevItems.filter(i => i.id !== item.id));
    toast({
      title: "Content Removed",
      description: `"${item.title}" has been removed from your saved content.`,
    });
  };

  const toggleFavorite = (item: SavedItem) => {
    setItems(prevItems => 
      prevItems.map(i => 
        i.id === item.id ? { ...i, isFavorite: !i.isFavorite } : i
      )
    );
    toast({
      title: !item.isFavorite ? "Added to Favorites" : "Removed from Favorites",
      description: `"${item.title}" has been ${!item.isFavorite ? 'added to' : 'removed from'} your favorites.`,
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <BackButton />
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Saved Content</h1>
        <p className="text-muted-foreground">
          Your personal collection of wellness resources, tips, and helpful content
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search saved content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-saved-content"
              />
            </div>
          </div>
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="w-full sm:w-auto"
            data-testid="button-show-favorites"
          >
            <Heart className={`h-4 w-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            Favorites Only
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md"
              data-testid="select-category"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md"
              data-testid="select-type"
            >
              <option value="all">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {filteredContent.length} item{filteredContent.length !== 1 ? 's' : ''} found
          </h2>
        </div>

        {filteredContent.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No saved content found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or explore the app to save some content!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredContent.map((item) => {
              const TypeIcon = typeIcons[item.type];
              const categoryColor = categoryColors[item.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
              
              return (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Thumbnail for video/audio content */}
                  {item.thumbnail && (
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {item.duration && (
                        <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.duration}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        <Badge className={categoryColor}>
                          {item.category}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(item)}
                        data-testid={`button-favorite-${item.id}`}
                      >
                        <Heart className={`h-4 w-4 ${item.isFavorite ? 'fill-current text-red-500' : ''}`} />
                      </Button>
                    </div>

                    <h3 className="text-lg font-semibold mb-2 line-clamp-2" data-testid={`text-title-${item.id}`}>
                      {item.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {item.content}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tags.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>Saved {new Date(item.savedDate).toLocaleDateString()}</span>
                      {item.source && <span>From {item.source}</span>}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleShare(item)}
                        data-testid={`button-share-${item.id}`}
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDownload(item)}
                        data-testid={`button-download-${item.id}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRemove(item)}
                        data-testid={`button-remove-${item.id}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}