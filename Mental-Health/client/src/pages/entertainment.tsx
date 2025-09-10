import { useState } from "react";
import { Play, Music, Film, Gamepad2, BookOpen, Mic, Calendar, Users, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { BackButton } from "@/components/ui/back-button";

const entertainmentContent = {
  music: [
    {
      id: 1,
      title: "Relaxation Playlist",
      artist: "Nature Sounds",
      duration: "45 mins",
      category: "Meditation",
      description: "Peaceful nature sounds and ambient music for stress relief",
      plays: "2.3k",
      rating: 4.8
    },
    {
      id: 2,
      title: "Study Focus Mix",
      artist: "Lo-Fi Collective",
      duration: "2 hours",
      category: "Focus",
      description: "Lo-fi beats to help you concentrate and study effectively",
      plays: "5.1k",
      rating: 4.9
    },
    {
      id: 3,
      title: "Morning Motivation",
      artist: "Upbeat Studios",
      duration: "30 mins",
      category: "Motivation",
      description: "Energizing music to start your day with positive vibes",
      plays: "1.8k",
      rating: 4.7
    }
  ],
  videos: [
    {
      id: 1,
      title: "10-Minute Morning Meditation",
      channel: "Mindful Living",
      duration: "10 mins",
      category: "Meditation",
      description: "Quick guided meditation to center yourself before the day",
      views: "45k",
      rating: 4.9
    },
    {
      id: 2,
      title: "Study Break Yoga",
      channel: "Wellness Corner",
      duration: "15 mins",
      category: "Wellness",
      description: "Simple yoga stretches perfect for study breaks",
      views: "23k",
      rating: 4.6
    },
    {
      id: 3,
      title: "Breathing Exercises for Anxiety",
      channel: "Calm Mind",
      duration: "8 mins",
      category: "Mental Health",
      description: "Proven breathing techniques to manage anxiety and stress",
      views: "67k",
      rating: 4.8
    }
  ],
  games: [
    {
      id: 1,
      title: "Mindful Matching",
      developer: "Brain Games Studio",
      category: "Puzzle",
      description: "Memory matching game designed to improve focus and concentration",
      players: "12k",
      rating: 4.5
    },
    {
      id: 2,
      title: "Stress Buster",
      developer: "Relax Games",
      category: "Casual",
      description: "Simple tap-and-pop game for quick stress relief",
      players: "8.5k",
      rating: 4.3
    },
    {
      id: 3,
      title: "Breathing Garden",
      developer: "Wellness Interactive",
      category: "Meditation",
      description: "Grow a virtual garden while practicing breathing exercises",
      players: "15k",
      rating: 4.7
    }
  ],
  books: [
    {
      id: 1,
      title: "The Student's Guide to Mental Wellness",
      author: "Dr. Sarah Mitchell",
      category: "Self-Help",
      description: "Practical strategies for managing stress during college years",
      readers: "3.2k",
      rating: 4.6
    },
    {
      id: 2,
      title: "Mindfulness for Beginners",
      author: "Jon Kabat-Zinn",
      category: "Mindfulness",
      description: "Simple meditation practices for everyday life",
      readers: "5.8k",
      rating: 4.8
    },
    {
      id: 3,
      title: "Academic Success & Mental Health",
      author: "Dr. Priya Sharma",
      category: "Education",
      description: "Balancing academic goals with emotional well-being",
      readers: "2.1k",
      rating: 4.4
    }
  ]
};

const liveEvents = [
  {
    id: 1,
    title: "Group Meditation Session",
    host: "Mindfulness Coach Maya",
    time: "7:00 PM Today",
    participants: 45,
    category: "Meditation",
    description: "Join our community for a guided meditation session"
  },
  {
    id: 2,
    title: "Study With Me - Live",
    host: "StudyBuddy Team",
    time: "9:00 AM Tomorrow",
    participants: 128,
    category: "Study",
    description: "Virtual study session with focus music and breaks"
  },
  {
    id: 3,
    title: "Mental Health Q&A",
    host: "Dr. Rajesh Kumar",
    time: "3:00 PM Tomorrow",
    participants: 67,
    category: "Education",
    description: "Live session with mental health expert"
  }
];

export default function Entertainment() {
  const [activeTab, setActiveTab] = useState("music");
  const [searchTerm, setSearchTerm] = useState("");

  const renderContentCard = (item: any, type: string) => {
    const getIcon = () => {
      switch (type) {
        case 'music': return <Music className="h-5 w-5" />;
        case 'videos': return <Film className="h-5 w-5" />;
        case 'games': return <Gamepad2 className="h-5 w-5" />;
        case 'books': return <BookOpen className="h-5 w-5" />;
        default: return <Play className="h-5 w-5" />;
      }
    };

    const getMetric = () => {
      switch (type) {
        case 'music': return `${item.plays} plays`;
        case 'videos': return `${item.views} views`;
        case 'games': return `${item.players} players`;
        case 'books': return `${item.readers} readers`;
        default: return '';
      }
    };

    return (
      <Card key={item.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                {getIcon()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm" data-testid={`text-${type}-title-${item.id}`}>
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {item.artist || item.channel || item.developer || item.author}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {item.category}
            </Badge>
          </div>
          
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {item.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {(item.duration || item.time) && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.duration || item.time}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                {item.rating}
              </span>
              <span>{getMetric()}</span>
            </div>
            <Button size="sm" variant="outline" data-testid={`button-play-${type}-${item.id}`}>
              <Play className="h-3 w-3 mr-1" />
              {type === 'books' ? 'Read' : 'Play'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <BackButton />
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Play className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Entertainment Hub</h1>
              <p className="text-muted-foreground">Discover content to relax, learn, and have fun</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search for music, videos, games, or books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
            data-testid="input-entertainment-search"
          />
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="music" className="text-xs" data-testid="tab-music">
              <Music className="h-4 w-4 mr-1" />
              Music
            </TabsTrigger>
            <TabsTrigger value="videos" className="text-xs" data-testid="tab-videos">
              <Film className="h-4 w-4 mr-1" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="games" className="text-xs" data-testid="tab-games">
              <Gamepad2 className="h-4 w-4 mr-1" />
              Games
            </TabsTrigger>
            <TabsTrigger value="books" className="text-xs" data-testid="tab-books">
              <BookOpen className="h-4 w-4 mr-1" />
              Books
            </TabsTrigger>
          </TabsList>

          {Object.entries(entertainmentContent).map(([key, items]) => (
            <TabsContent key={key} value={key} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items
                  .filter(item => 
                    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(item => renderContentCard(item, key))
                }
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Live Events Section */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Mic className="h-4 w-4 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold">Live Events</h2>
            <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline">{event.category}</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {event.participants}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-2" data-testid={`text-live-event-title-${event.id}`}>
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">{event.host}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {event.time}
                      </p>
                    </div>
                    <Button size="sm" data-testid={`button-join-live-${event.id}`}>
                      Join Live
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}