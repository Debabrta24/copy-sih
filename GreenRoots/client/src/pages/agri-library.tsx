import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BookOpen, 
  Search, 
  Star, 
  Clock, 
  Download, 
  Eye,
  User,
  Calendar,
  Tag,
  Lightbulb,
  Leaf,
  Bug,
  CloudRain,
  TrendingUp,
  Heart
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  category: string;
  author: string;
  readTime: string;
  publishDate: string;
  rating: number;
  views: number;
  description: string;
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  featured: boolean;
}

const articles: Article[] = [
  {
    id: "1",
    title: "Complete Guide to Organic Farming Practices",
    category: "Organic Farming",
    author: "Dr. Rajesh Kumar",
    readTime: "12 min read",
    publishDate: "2024-01-15",
    rating: 4.9,
    views: 2340,
    description: "Learn comprehensive organic farming techniques including soil preparation, natural pest control, and sustainable crop rotation methods.",
    tags: ["Organic", "Sustainable", "Soil Health", "Pest Control"],
    difficulty: "Beginner",
    featured: true
  },
  {
    id: "2",
    title: "Smart Irrigation Systems: Water Management for Modern Farms",
    category: "Water Management",
    author: "Priya Sharma",
    readTime: "8 min read",
    publishDate: "2024-01-10",
    rating: 4.7,
    views: 1850,
    description: "Discover how to implement efficient drip irrigation, smart sensors, and water conservation techniques to optimize crop yield.",
    tags: ["Irrigation", "Water Conservation", "Technology", "Efficiency"],
    difficulty: "Intermediate",
    featured: true
  },
  {
    id: "3",
    title: "Integrated Pest Management: Chemical-Free Solutions",
    category: "Pest Control",
    author: "Suresh Patel",
    readTime: "15 min read",
    publishDate: "2024-01-08",
    rating: 4.8,
    views: 1920,
    description: "Master the art of natural pest control using beneficial insects, companion planting, and biological control methods.",
    tags: ["IPM", "Natural Solutions", "Beneficial Insects", "Companion Planting"],
    difficulty: "Intermediate",
    featured: false
  },
  {
    id: "4",
    title: "Weather Patterns and Climate-Smart Agriculture",
    category: "Climate & Weather",
    author: "Dr. Anjali Singh",
    readTime: "10 min read",
    publishDate: "2024-01-05",
    rating: 4.6,
    views: 1650,
    description: "Understanding seasonal patterns, climate change adaptation, and weather-based farming decisions for better crop planning.",
    tags: ["Climate Change", "Weather Forecasting", "Adaptation", "Planning"],
    difficulty: "Advanced",
    featured: false
  },
  {
    id: "5",
    title: "Soil Health Testing and Nutrient Management",
    category: "Soil Health",
    author: "Vikram Reddy",
    readTime: "9 min read",
    publishDate: "2024-01-03",
    rating: 4.5,
    views: 1420,
    description: "Complete guide to soil testing procedures, interpreting results, and creating balanced fertilizer programs for optimal crop growth.",
    tags: ["Soil Testing", "Nutrients", "Fertilizers", "Crop Growth"],
    difficulty: "Intermediate",
    featured: false
  },
  {
    id: "6",
    title: "Crop Rotation Strategies for Maximum Yield",
    category: "Crop Management",
    author: "Meera Joshi",
    readTime: "11 min read",
    publishDate: "2023-12-28",
    rating: 4.7,
    views: 1780,
    description: "Learn effective crop rotation patterns, cover cropping techniques, and how to maintain soil fertility across seasons.",
    tags: ["Crop Rotation", "Cover Crops", "Soil Fertility", "Seasonal Planning"],
    difficulty: "Beginner",
    featured: false
  },
  {
    id: "7",
    title: "Digital Agriculture: IoT and Precision Farming",
    category: "Technology",
    author: "Dr. Ravi Kumar",
    readTime: "13 min read",
    publishDate: "2023-12-25",
    rating: 4.8,
    views: 2100,
    description: "Explore modern farming technologies including IoT sensors, GPS guidance, variable rate technology, and data-driven decision making.",
    tags: ["IoT", "Precision Agriculture", "GPS", "Data Analytics"],
    difficulty: "Advanced",
    featured: true
  },
  {
    id: "8",
    title: "Post-Harvest Management and Storage Techniques",
    category: "Post-Harvest",
    author: "Sunita Devi",
    readTime: "7 min read",
    publishDate: "2023-12-20",
    rating: 4.4,
    views: 1320,
    description: "Best practices for crop harvesting, proper storage methods, and maintaining quality to reduce post-harvest losses.",
    tags: ["Harvesting", "Storage", "Quality Control", "Loss Reduction"],
    difficulty: "Beginner",
    featured: false
  }
];

const categories = ["All Categories", "Organic Farming", "Water Management", "Pest Control", "Climate & Weather", "Soil Health", "Crop Management", "Technology", "Post-Harvest"];

export default function AgriLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [filteredArticles, setFilteredArticles] = useState(articles);

  const handleSearch = () => {
    let filtered = articles;

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (selectedDifficulty !== "All Levels") {
      filtered = filtered.filter(article => article.difficulty === selectedDifficulty);
    }

    setFilteredArticles(filtered);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Auto-trigger search when filter changes
    setTimeout(handleSearch, 0);
  };

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setTimeout(handleSearch, 0);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Organic Farming": return <Leaf className="h-4 w-4" />;
      case "Pest Control": return <Bug className="h-4 w-4" />;
      case "Climate & Weather": return <CloudRain className="h-4 w-4" />;
      case "Technology": return <TrendingUp className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Intermediate": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const featuredArticles = articles.filter(article => article.featured);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Agricultural Knowledge Library
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore comprehensive guides, expert articles, and practical knowledge to enhance your farming skills
          </p>
        </div>

        {/* Featured Articles */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Star className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">Featured Articles</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    {getCategoryIcon(article.category)}
                    <Badge variant="outline">{article.category}</Badge>
                    <Badge className={getDifficultyColor(article.difficulty)}>
                      {article.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{article.rating}</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full" data-testid={`read-${article.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Read Article
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="sm:col-span-2 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles, topics, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 sm:h-12"
                  data-testid="search-articles"
                />
              </div>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-10 sm:h-12">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Select value={selectedDifficulty} onValueChange={handleDifficultyChange}>
                  <SelectTrigger className="h-10 sm:h-12">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Levels">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSearch} className="h-10 sm:h-12 px-4 sm:px-6">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Found {filteredArticles.length} articles
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-6">
                  <div className="lg:col-span-3">
                    <div className="flex items-center space-x-2 mb-3">
                      {getCategoryIcon(article.category)}
                      <Badge variant="outline">{article.category}</Badge>
                      <Badge className={getDifficultyColor(article.difficulty)}>
                        {article.difficulty}
                      </Badge>
                      {article.featured && (
                        <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3 text-foreground">
                      {article.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4">
                      {article.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{article.views.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{article.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col justify-between gap-2 sm:gap-4 lg:gap-0">
                    <div className="flex flex-col sm:flex-row lg:flex-col space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-0 lg:space-y-2 mb-4">
                      <Button className="w-full sm:flex-1 lg:w-full" data-testid={`read-full-${article.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Read Full Article
                      </Button>
                      <Button variant="outline" className="w-full sm:flex-1 lg:w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline" size="sm" className="w-full sm:flex-1 lg:w-full">
                        <Heart className="h-4 w-4 mr-2" />
                        Save for Later
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No articles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find relevant articles.
            </p>
          </div>
        )}

        {/* Knowledge Categories */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <span>Knowledge Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Sustainable Practices</h3>
                <p className="text-xs text-muted-foreground">
                  Organic farming, soil health, and environmental conservation
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Modern Technology</h3>
                <p className="text-xs text-muted-foreground">
                  IoT sensors, precision agriculture, and digital farming
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Bug className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Pest & Disease</h3>
                <p className="text-xs text-muted-foreground">
                  Identification, prevention, and treatment strategies
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CloudRain className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Climate Adaptation</h3>
                <p className="text-xs text-muted-foreground">
                  Weather patterns, climate change, and adaptation methods
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}