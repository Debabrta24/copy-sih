import { useState } from "react";
import { Play, Clock, Eye, Heart, Filter, Search, ChevronDown, MessageCircle, ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BackButton } from "@/components/ui/back-button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  views: number;
  category: 'Mindfulness' | 'Success' | 'Wellness' | 'Inspiration' | 'Comedy';
  thumbnailUrl: string;
  videoUrl: string;
  speaker: string;
  tags: string[];
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  avatar?: string;
}

// Function to generate video data from YouTube URLs
const generateVideoData = () => {
  const youtubeUrls = [
    "https://www.youtube.com/watch?v=27LIATkhqAU",
    "https://www.youtube.com/watch?v=EP8VVr4fIj4",
    "https://www.youtube.com/watch?v=9j0eUI4h1SE",
    "https://www.youtube.com/watch?v=1QRriWmCAsc",
    "https://www.youtube.com/watch?v=ZfPISsIIKQw",
    "https://www.youtube.com/watch?v=wu0n7kWYIY4",
    "https://www.youtube.com/watch?v=VJz_cM0Jg-Y",
    "https://www.youtube.com/watch?v=C7SmkXyeHVI",
    "https://www.youtube.com/watch?v=7RZne_dfg84",
    "https://www.youtube.com/watch?v=dvc81UK4iq8",
    "https://www.youtube.com/watch?v=CcY4GWjyl2U",
    "https://www.youtube.com/watch?v=aOfLe3xJvNc",
    "https://www.youtube.com/watch?v=5YoTP_fO4FI",
    "https://www.youtube.com/watch?v=placeholder14",
    "https://www.youtube.com/watch?v=placeholder15",
    "https://www.youtube.com/watch?v=placeholder16",
    "https://www.youtube.com/watch?v=placeholder17",
    "https://www.youtube.com/watch?v=placeholder18",
    "https://www.youtube.com/watch?v=placeholder19",
    "https://www.youtube.com/watch?v=placeholder20",
    "https://www.youtube.com/watch?v=placeholder21",
    "https://www.youtube.com/watch?v=placeholder22",
    "https://www.youtube.com/watch?v=placeholder23",
    "https://www.youtube.com/watch?v=placeholder24",
    "https://www.youtube.com/watch?v=placeholder25",
    "https://www.youtube.com/watch?v=placeholder26",
    "https://www.youtube.com/watch?v=placeholder27",
    "https://www.youtube.com/watch?v=placeholder28",
    "https://www.youtube.com/watch?v=placeholder29",
    "https://www.youtube.com/watch?v=placeholder30",
    "https://www.youtube.com/watch?v=placeholder31",
    "https://www.youtube.com/watch?v=placeholder32",
    "https://www.youtube.com/watch?v=placeholder33",
    "https://www.youtube.com/watch?v=placeholder34",
    "https://www.youtube.com/watch?v=placeholder35",
    "https://www.youtube.com/watch?v=placeholder36",
    "https://www.youtube.com/watch?v=placeholder37",
    "https://www.youtube.com/watch?v=placeholder38",
    "https://www.youtube.com/watch?v=placeholder39",
    "https://www.youtube.com/watch?v=placeholder40",
    "https://www.youtube.com/watch?v=placeholder41",
    "https://www.youtube.com/watch?v=placeholder42",
    "https://www.youtube.com/watch?v=placeholder43",
    "https://www.youtube.com/watch?v=placeholder44",
    "https://www.youtube.com/watch?v=placeholder45",
    "https://www.youtube.com/watch?v=placeholder46",
    "https://www.youtube.com/watch?v=placeholder47",
    "https://www.youtube.com/watch?v=placeholder48",
    "https://www.youtube.com/watch?v=placeholder49",
    "https://www.youtube.com/watch?v=placeholder50",
    "https://www.youtube.com/watch?v=placeholder51",
    "https://www.youtube.com/watch?v=placeholder52",
    "https://www.youtube.com/watch?v=placeholder53",
    "https://www.youtube.com/watch?v=placeholder54",
    "https://www.youtube.com/watch?v=placeholder55",
    "https://www.youtube.com/watch?v=placeholder56",
    "https://www.youtube.com/watch?v=placeholder57",
    "https://www.youtube.com/watch?v=placeholder58",
    "https://www.youtube.com/watch?v=placeholder59",
    "https://www.youtube.com/watch?v=placeholder60",
    "https://www.youtube.com/watch?v=placeholder61",
    "https://www.youtube.com/watch?v=placeholder62",
    "https://www.youtube.com/watch?v=placeholder63",
    "https://www.youtube.com/watch?v=placeholder64",
    "https://www.youtube.com/watch?v=placeholder65",
    "https://www.youtube.com/watch?v=placeholder66",
    "https://www.youtube.com/watch?v=placeholder67",
    "https://www.youtube.com/watch?v=placeholder68",
    "https://www.youtube.com/watch?v=placeholder69",
    "https://www.youtube.com/watch?v=placeholder70",
    "https://www.youtube.com/watch?v=placeholder71",
    "https://www.youtube.com/watch?v=placeholder72",
    "https://www.youtube.com/watch?v=placeholder73",
    "https://www.youtube.com/watch?v=placeholder74",
    "https://www.youtube.com/watch?v=placeholder75",
    "https://www.youtube.com/watch?v=placeholder76",
    "https://www.youtube.com/watch?v=placeholder77",
    "https://www.youtube.com/watch?v=placeholder78",
    "https://www.youtube.com/watch?v=placeholder79",
    "https://www.youtube.com/watch?v=placeholder80",
    "https://www.youtube.com/watch?v=placeholder81",
    "https://www.youtube.com/watch?v=placeholder82",
    "https://www.youtube.com/watch?v=placeholder83",
    "https://www.youtube.com/watch?v=placeholder84",
    "https://www.youtube.com/watch?v=placeholder85",
    "https://www.youtube.com/watch?v=placeholder86",
    "https://www.youtube.com/watch?v=placeholder87",
    "https://www.youtube.com/watch?v=placeholder88",
    "https://www.youtube.com/watch?v=placeholder89",
    "https://www.youtube.com/watch?v=placeholder90",
    "https://www.youtube.com/watch?v=placeholder91",
    "https://www.youtube.com/watch?v=placeholder92",
    "https://www.youtube.com/watch?v=placeholder93",
    "https://www.youtube.com/watch?v=placeholder94",
    "https://www.youtube.com/watch?v=placeholder95",
    "https://www.youtube.com/watch?v=placeholder96",
    "https://www.youtube.com/watch?v=placeholder97",
    "https://www.youtube.com/watch?v=placeholder98",
    "https://www.youtube.com/watch?v=placeholder99",
    "https://www.youtube.com/watch?v=placeholder100"
  ];

  const categories = ["Mindfulness", "Wellness", "Comedy", "Success", "Inspiration"];
  const speakers = [
    "Dr. Sarah Johnson", "Motivational Speaker", "Life Coach", "Success Coach", "Fear Coach",
    "Life Mentor", "Dream Coach", "Power Coach", "Life Purpose Coach", "Mindset Expert",
    "Resilience Coach", "Success Mentor", "Growth Expert", "Dr. Emma Wilson", "Master Chen",
    "Dr. Lisa Park", "Comedy Central", "Mike Johnson", "Animal Planet", "Dr. Humor Smith",
    "Wellness Guru", "Motivation Master", "Inspiration Guide", "Mental Health Expert", "Therapy Coach"
  ];

  const videoTitles = [
    "Mindful Breathing Techniques", "Success Through Mindfulness", "Daily Wellness Practices",
    "Success Mindset Development", "Overcoming Life Challenges", "Building Inner Resilience",
    "Wellness & Self-Care", "Inner Peace Meditation", "Life Balance Techniques", "Transform Your Wellness",
    "Inner Strength and Resilience", "Achieving Success Naturally", "Personal Growth Journey", "Breathing Techniques for Anxiety",
    "5-Minute Daily Meditation Guide", "Healthy Habits for Mental Wellness", "Laugh Your Way to Better Health",
    "Stand-up Comedy: Life's Funny Moments", "Funny Animal Videos Compilation", "Comedy Therapy: Humor as Medicine",
    "Building Confidence Daily", "Stress Management Techniques", "Finding Your Purpose", "Mindful Living Guide",
    "Positive Habits Formation", "Emotional Intelligence Mastery", "Self-Care Essentials", "Mental Clarity Methods",
    "Motivation Monday Special", "Wellness Wednesday Wisdom", "Fearless Friday Focus", "Sunday Self-Reflection",
    "Daily Affirmations Power", "Gratitude Practice Guide", "Mindfulness Meditation", "Energy Boost Techniques",
    "Productivity Hacks", "Goal Setting Mastery", "Time Management Tips", "Focus Enhancement",
    "Creativity Unleashed", "Problem Solving Skills", "Decision Making Guide", "Leadership Development",
    "Communication Skills", "Relationship Building", "Social Confidence", "Public Speaking Tips",
    "Study Motivation", "Academic Success", "Learning Techniques", "Memory Improvement",
    "Career Advancement", "Professional Growth", "Interview Preparation", "Networking Skills",
    "Financial Mindset", "Investment Basics", "Budgeting Tips", "Money Management",
    "Health & Fitness", "Exercise Motivation", "Nutrition Basics", "Sleep Optimization",
    "Travel Inspiration", "Adventure Mindset", "Cultural Awareness", "Language Learning",
    "Art & Creativity", "Music Therapy", "Dance Meditation", "Creative Writing",
    "Technology Wellness", "Digital Detox", "Online Safety", "Social Media Balance",
    "Environmental Awareness", "Sustainability Tips", "Green Living", "Nature Connection",
    "Family Relationships", "Parenting Tips", "Child Development", "Elder Care",
    "Pet Care & Love", "Animal Therapy", "Nature Therapy", "Garden Meditation",
    "Cooking for Wellness", "Nutrition Science", "Meal Planning", "Healthy Recipes",
    "Adventure Sports", "Extreme Motivation", "Risk Management", "Safety First",
    "Space & Astronomy", "Science Wonder", "Discovery Channel", "Learning Never Stops",
    "History Lessons", "Cultural Heritage", "Tradition Values", "Modern Evolution",
    "Philosophy of Life", "Spiritual Growth", "Religious Harmony", "Peace & Unity",
    "Technology Innovation", "Future Trends", "AI & Humanity", "Digital Revolution",
    "Climate Change", "Earth Day Special", "Conservation Efforts", "Renewable Energy",
    "Global Citizenship", "Community Service", "Volunteer Work", "Social Impact",
    "Entrepreneurship", "Startup Journey", "Business Growth", "Innovation Mindset",
    "Retirement Planning", "Life Transitions", "Age Gracefully", "Wisdom Sharing",
    "Youth Empowerment", "Student Life", "Campus Stories", "College Memories"
  ];

  const descriptions = [
    "Learn how to transform your mindset and overcome negative thoughts with practical techniques.",
    "Powerful motivational speech about perseverance and never giving up on your dreams.",
    "Inspiring speech about self-belief and achieving your goals against all odds.",
    "Powerful motivational content to develop a winning mindset and achieve your goals.",
    "Inspiring speech about facing your fears and stepping out of your comfort zone.",
    "Motivational video about resilience and rising above life's challenges.",
    "Inspirational content about setting big goals and pursuing your dreams.",
    "Powerful motivational speech about becoming unstoppable in life.",
    "Inspiring message about finding purpose and meaning in life's journey.",
    "Learn how to shift your thinking patterns for better mental health and success."
  ];

  return youtubeUrls.map((url, index) => {
    const videoId = url.split('v=')[1];
    const isPlaceholder = videoId.startsWith('placeholder');
    
    return {
      id: (index + 1).toString(),
      title: videoTitles[index] || `Motivational Video ${index + 1}`,
      description: descriptions[index % descriptions.length],
      duration: `${Math.floor(Math.random() * 15) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      views: Math.floor(Math.random() * 50000) + 10000,
      category: categories[index % categories.length] as 'Mindfulness' | 'Success' | 'Wellness' | 'Inspiration' | 'Comedy',
      thumbnailUrl: isPlaceholder 
        ? `https://via.placeholder.com/320x180/8b5cf6/ffffff?text=Video+${index + 1}`
        : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      videoUrl: `https://www.youtube.com/embed/${videoId}`,
      speaker: speakers[index % speakers.length],
      tags: [
        categories[index % categories.length].toLowerCase(),
        index % 3 === 0 ? "mental health" : index % 3 === 1 ? "success" : "inspiration",
        index % 2 === 0 ? "motivation" : "wellness"
      ]
    };
  });
};

const motivationalVideos: Video[] = generateVideoData();

const categories = ["All", "Mindfulness", "Success", "Wellness", "Inspiration", "Comedy"];

export default function Videos() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [likedVideos, setLikedVideos] = useState<string[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState("");
  const [commentLikes, setCommentLikes] = useState<Record<string, {likes: Set<string>, dislikes: Set<string>}>>({});

  const filteredVideos = motivationalVideos.filter(video => {
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleLike = (videoId: string) => {
    setLikedVideos(prev => 
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const addComment = () => {
    if (!selectedVideo || !newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: "Anonymous User",
      content: newComment,
      timestamp: new Date().toLocaleString(),
      likes: 0,
      dislikes: 0
    };
    
    setComments(prev => ({
      ...prev,
      [selectedVideo.id]: [...(prev[selectedVideo.id] || []), comment]
    }));
    
    setNewComment("");
  };

  const toggleCommentLike = (commentId: string, type: 'like' | 'dislike') => {
    const userId = "current-user"; // In a real app, this would be the actual user ID
    
    setCommentLikes(prev => {
      const current = prev[commentId] || { likes: new Set(), dislikes: new Set() };
      const newState = { ...current };
      
      if (type === 'like') {
        if (newState.likes.has(userId)) {
          newState.likes.delete(userId);
        } else {
          newState.likes.add(userId);
          newState.dislikes.delete(userId);
        }
      } else {
        if (newState.dislikes.has(userId)) {
          newState.dislikes.delete(userId);
        } else {
          newState.dislikes.add(userId);
          newState.likes.delete(userId);
        }
      }
      
      return {
        ...prev,
        [commentId]: newState
      };
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Mind Fresh Videos</h1>
        <p className="text-muted-foreground">Inspiring and entertaining content to boost your mental wellness and mood</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search videos..."
            className="pl-10"
            data-testid="input-search-videos"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48" data-testid="select-video-filter">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category} data-testid={`filter-option-${category.toLowerCase()}`}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No videos found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria or category filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-[1.02] border-0 bg-card/50 backdrop-blur-sm">
              <div 
                className="relative overflow-hidden rounded-t-lg"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="w-full h-48 relative overflow-hidden">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to a gradient background if thumbnail fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center absolute inset-0" style={{display: 'none'}}>
                    <div className="text-center text-white">
                      <Play className="h-12 w-12 mx-auto mb-2 opacity-80" />
                      <p className="text-sm font-medium">{video.category}</p>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {video.speaker}
                  </div>
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="h-6 w-6 text-black ml-1" />
                  </div>
                </div>
                <Badge 
                  className="absolute top-2 right-2 bg-black/70 text-white"
                  variant="secondary"
                >
                  {video.duration}
                </Badge>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {video.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(video.id)}
                    className="shrink-0"
                    data-testid={`like-video-${video.id}`}
                  >
                    <Heart className={`h-4 w-4 ${likedVideos.includes(video.id) ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                </div>
                <CardDescription className="text-sm">
                  by {video.speaker}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {video.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatViews(video.views)} views
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {(comments[video.id] || []).length}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {video.category}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {video.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          {selectedVideo && (
            <div className="flex flex-col h-full">
              <div className="relative aspect-video bg-black">
                <iframe
                  src={`${selectedVideo.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedVideo.title}
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/70 px-3 py-1 rounded-full">
                  <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span className="text-white text-xs font-medium">YouTube</span>
                </div>
              </div>
              
              <div className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">
                        by {selectedVideo.speaker}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatViews(selectedVideo.views)} views
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {selectedVideo.duration}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {selectedVideo.category}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleLike(selectedVideo.id)}
                      data-testid={`modal-like-video-${selectedVideo.id}`}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${likedVideos.includes(selectedVideo.id) ? 'fill-current text-red-500' : ''}`} />
                      {likedVideos.includes(selectedVideo.id) ? 'Liked' : 'Like'}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">About this video</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedVideo.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVideo.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Comments Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    <h4 className="font-medium">Comments ({(comments[selectedVideo.id] || []).length})</h4>
                  </div>

                  {/* Add Comment */}
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>AU</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="min-h-[80px] resize-none"
                          data-testid="comment-input"
                        />
                        <div className="flex justify-end">
                          <Button 
                            onClick={addComment}
                            size="sm"
                            disabled={!newComment.trim()}
                            data-testid="submit-comment"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comments List */}
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {(comments[selectedVideo.id] || []).map((comment) => {
                        const commentLike = commentLikes[comment.id] || { likes: new Set(), dislikes: new Set() };
                        const userId = "current-user";
                        const hasLiked = commentLike.likes.has(userId);
                        const hasDisliked = commentLike.dislikes.has(userId);
                        
                        return (
                          <div key={comment.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{comment.author}</span>
                                <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                              </div>
                              <p className="text-sm leading-relaxed">{comment.content}</p>
                              <div className="flex items-center gap-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleCommentLike(comment.id, 'like')}
                                  className={`h-8 px-2 ${hasLiked ? 'text-blue-600' : 'text-muted-foreground'}`}
                                  data-testid={`like-comment-${comment.id}`}
                                >
                                  <ThumbsUp className="h-3 w-3 mr-1" />
                                  {commentLike.likes.size}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleCommentLike(comment.id, 'dislike')}
                                  className={`h-8 px-2 ${hasDisliked ? 'text-red-600' : 'text-muted-foreground'}`}
                                  data-testid={`dislike-comment-${comment.id}`}
                                >
                                  <ThumbsDown className="h-3 w-3 mr-1" />
                                  {commentLike.dislikes.size}
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {(comments[selectedVideo.id] || []).length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>No comments yet. Be the first to share your thoughts!</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}