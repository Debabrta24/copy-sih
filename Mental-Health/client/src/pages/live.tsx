import { useState, useEffect } from "react";
import { Radio, Users, Calendar, Clock, Mic, Video, MessageSquare, Heart, Share2, Volume2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { BackButton } from "@/components/ui/back-button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const liveStreams = [
  {
    id: 1,
    title: "Morning Mindfulness Session",
    host: "Dr. Priya Sharma",
    viewers: 234,
    status: "live",
    category: "Meditation",
    description: "Start your day with guided meditation and breathing exercises",
    startTime: "08:00 AM",
    thumbnail: "/api/placeholder/300/200",
    isAudio: false
  },
  {
    id: 2,
    title: "Study Together - Focus Hour",
    host: "StudyBuddy Community",
    viewers: 567,
    status: "live",
    category: "Study",
    description: "Virtual study room with ambient sounds and pomodoro breaks",
    startTime: "10:00 AM",
    thumbnail: "/api/placeholder/300/200",
    isAudio: true
  },
  {
    id: 3,
    title: "Mental Health Check-in",
    host: "Wellness Team",
    viewers: 89,
    status: "live",
    category: "Support",
    description: "Weekly community support session for mental wellness",
    startTime: "03:00 PM",
    thumbnail: "/api/placeholder/300/200",
    isAudio: false
  }
];

const sessionCategories = [
  "Meditation",
  "Study", 
  "Support",
  "Wellness",
  "Education"
];

const upcomingStreams = [
  {
    id: 4,
    title: "Evening Yoga Flow",
    host: "Yoga Instructor Maya",
    scheduledTime: "06:00 PM",
    category: "Wellness",
    description: "Gentle yoga session to unwind after a busy day"
  },
  {
    id: 5,
    title: "Career Guidance Session",
    host: "Dr. Rajesh Kumar",
    scheduledTime: "07:30 PM",
    category: "Education",
    description: "Tips for managing career stress and academic pressure"
  }
];

export default function Live() {
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedStream, setSelectedStream] = useState(liveStreams[0]);
  const [chatMessage, setChatMessage] = useState("");
  const [volume, setVolume] = useState([75]);
  const [isConnected, setIsConnected] = useState(false);
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "Alex M.", message: "This is really helpful, thanks!", time: "2 mins ago" },
    { id: 2, user: "Priya S.", message: "Can you share the breathing technique again?", time: "3 mins ago" },
    { id: 3, user: "Raj K.", message: "Joining from Mumbai 👋", time: "5 mins ago" },
  ]);
  
  const [newSession, setNewSession] = useState({
    title: "",
    description: "",
    category: "",
    isAudio: false,
    scheduledStart: "",
    maxParticipants: 100,
    tags: [] as string[],
  });

  // Fetch live sessions from API
  const { data: liveSessions, isLoading: isLoadingSessions, error: sessionsError } = useQuery({
    queryKey: ["/api/live-sessions"],
  });
  
  // Debug log to check data
  console.log("Live sessions data:", liveSessions, "Loading:", isLoadingSessions, "Error:", sessionsError);

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      return await apiRequest("POST", "/api/live-sessions", {
        ...sessionData,
        userId: currentUser?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/live-sessions"] });
      setIsCreateSessionOpen(false);
      setNewSession({
        title: "",
        description: "",
        category: "",
        isAudio: false,
        scheduledStart: "",
        maxParticipants: 100,
        tags: [],
      });
      toast({
        title: "Live session created",
        description: "Your live session has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create live session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const startSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      return await apiRequest("POST", `/api/live-sessions/${sessionId}/start`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/live-sessions"] });
      toast({
        title: "Session started",
        description: "Your live session is now live!",
      });
    },
  });

  useEffect(() => {
    // Simulate connection status
    const timer = setTimeout(() => setIsConnected(true), 1000);
    return () => clearTimeout(timer);
  }, [selectedStream]);

  const handleSendMessage = () => {
    if (chatMessage.trim() && currentUser) {
      const newMessage = {
        id: chatMessages.length + 1,
        user: `${currentUser.firstName} ${currentUser.lastName}`,
        message: chatMessage,
        time: "now"
      };
      setChatMessages([newMessage, ...chatMessages]);
      setChatMessage("");
    }
  };

  const handleJoinStream = (stream: any) => {
    setSelectedStream(stream);
    setIsConnected(false);
  };

  const handleCreateSession = () => {
    if (!newSession.title.trim() || !newSession.description.trim() || !newSession.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const sessionData = {
      ...newSession,
      status: "scheduled",
      scheduledStart: newSession.scheduledStart ? new Date(newSession.scheduledStart) : null,
    };
    
    createSessionMutation.mutate(sessionData);
  };

  const handleStartSession = (sessionId: string) => {
    startSessionMutation.mutate(sessionId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <BackButton />
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Radio className="h-6 w-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">Live Sessions</h1>
              <p className="text-muted-foreground">Join live mental health and wellness sessions</p>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={isCreateSessionOpen} onOpenChange={setIsCreateSessionOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700 text-white font-medium" data-testid="button-start-live-session">
                    <Plus className="h-4 w-4 mr-2" />
                    Start Live Session
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">Start Live Session</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Session Title *
                      </label>
                      <Input
                        placeholder="e.g., Morning Mindfulness Session"
                        value={newSession.title}
                        onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                        data-testid="input-session-title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category *
                      </label>
                      <Select 
                        value={newSession.category} 
                        onValueChange={(value) => setNewSession({ ...newSession, category: value })}
                      >
                        <SelectTrigger data-testid="select-session-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {sessionCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <Textarea
                        placeholder="Describe what your session will cover..."
                        rows={3}
                        value={newSession.description}
                        onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                        data-testid="textarea-session-description"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Session Type
                        </label>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={!newSession.isAudio}
                              onChange={() => setNewSession({ ...newSession, isAudio: false })}
                              className="mr-2"
                              data-testid="radio-video-session"
                            />
                            Video Session
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={newSession.isAudio}
                              onChange={() => setNewSession({ ...newSession, isAudio: true })}
                              className="mr-2"
                              data-testid="radio-audio-session"
                            />
                            Audio Only
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Max Participants
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max="500"
                          value={newSession.maxParticipants}
                          onChange={(e) => setNewSession({ ...newSession, maxParticipants: parseInt(e.target.value) || 100 })}
                          data-testid="input-max-participants"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Scheduled Start (Optional)
                      </label>
                      <Input
                        type="datetime-local"
                        value={newSession.scheduledStart}
                        onChange={(e) => setNewSession({ ...newSession, scheduledStart: e.target.value })}
                        data-testid="input-scheduled-start"
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave empty to start immediately</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tags (Optional)
                      </label>
                      <Input
                        placeholder="mindfulness, wellness, study (comma separated)"
                        onChange={(e) => {
                          const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                          setNewSession({ ...newSession, tags });
                        }}
                        data-testid="input-session-tags"
                      />
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <Radio className="inline h-4 w-4 mr-2" />
                        Your session will be visible to all users. Make sure to follow community guidelines.
                      </p>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsCreateSessionOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCreateSession}
                        disabled={createSessionMutation.isPending}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium"
                        data-testid="button-create-session"
                      >
                        {createSessionMutation.isPending ? "Creating..." : "Create Session"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Badge variant="destructive" className="animate-pulse">
                <Radio className="h-3 w-3 mr-1" />
                LIVE
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Video/Audio Player */}
          <div className="xl:col-span-3">
            <Card className="mb-6">
              <CardContent className="p-0">
                {/* Video/Audio Player */}
                <div className="relative bg-black rounded-t-lg">
                  {selectedStream.isAudio ? (
                    <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Volume2 className="h-12 w-12 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Audio Stream</h3>
                        <p className="text-muted-foreground">Listen to the live session</p>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-900 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>Video Stream</p>
                        {!isConnected && (
                          <div className="mt-4">
                            <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
                            <p className="mt-2 text-sm">Connecting...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Live indicator */}
                  <div className="absolute top-4 left-4">
                    <Badge variant="destructive" className="animate-pulse">
                      <Radio className="h-3 w-3 mr-1" />
                      LIVE
                    </Badge>
                  </div>
                  
                  {/* Viewer count */}
                  <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                    <Users className="h-4 w-4 inline mr-1" />
                    {selectedStream.viewers} watching
                  </div>
                </div>

                {/* Player Controls */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold" data-testid="text-stream-title">
                        {selectedStream.title}
                      </h2>
                      <p className="text-muted-foreground">Hosted by {selectedStream.host}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" data-testid="button-share-stream">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm" data-testid="button-like-stream">
                        <Heart className="h-4 w-4 mr-1" />
                        Like
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{selectedStream.description}</p>
                  
                  {/* Volume Control */}
                  <div className="flex items-center gap-4">
                    <Volume2 className="h-4 w-4" />
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="flex-1 max-w-32"
                    />
                    <span className="text-sm text-muted-foreground w-10">{volume[0]}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Other Live Streams */}
            <Card>
              <CardHeader>
                <CardTitle>Other Live Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {liveStreams
                    .filter(stream => stream.id !== selectedStream.id)
                    .map((stream) => (
                    <Card 
                      key={stream.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-red-500"
                      onClick={() => handleJoinStream(stream)}
                      data-testid={`card-stream-${stream.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline">{stream.category}</Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {stream.viewers}
                          </div>
                        </div>
                        <h3 className="font-semibold mb-1">{stream.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{stream.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{stream.host}</span>
                          <Badge variant="destructive" className="text-xs">LIVE</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Sidebar */}
          <div className="xl:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Chat Messages */}
                <ScrollArea className="flex-1 px-4">
                  <div className="space-y-3 pb-4">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-xs">{msg.user}</span>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <p className="text-foreground">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                {/* Chat Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      data-testid="input-chat-message"
                    />
                    <Button onClick={handleSendMessage} size="sm" data-testid="button-send-message">
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Live Sessions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Radio className="h-4 w-4 text-red-500" />
                  Live Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingSessions ? (
                  <div className="space-y-3">
                    <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(Array.isArray(liveSessions) && liveSessions.length > 0) ? (
                      liveSessions.filter((session: any) => session.status === 'live').map((session: any) => (
                        <div key={session.id} className="p-3 border rounded-lg bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="destructive" className="animate-pulse">
                              <Radio className="h-3 w-3 mr-1" />
                              LIVE
                            </Badge>
                            <Badge variant="outline">{session.category}</Badge>
                          </div>
                          <h4 className="font-medium text-sm mb-1">{session.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{session.description}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium">{session.hostName || currentUser?.firstName + ' ' + currentUser?.lastName}</p>
                            <Button 
                              size="sm" 
                              onClick={() => handleJoinStream(session)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                              data-testid={`button-join-session-${session.id}`}
                            >
                              Join Live
                            </Button>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            <Users className="h-3 w-3 inline mr-1" />
                            {session.currentViewers || 0} watching
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <Radio className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No live sessions right now</p>
                        <p className="text-sm">Start your own session to connect with the community!</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Streams */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingStreams.map((stream) => (
                    <div key={stream.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{stream.category}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {stream.scheduledTime}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{stream.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{stream.description}</p>
                      <p className="text-xs font-medium">{stream.host}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}