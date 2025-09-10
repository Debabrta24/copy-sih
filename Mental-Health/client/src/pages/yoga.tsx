import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, Timer, Heart, Zap, Moon, Sun, Video, Users, Calendar, Clock } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { BackButton } from "@/components/ui/back-button";

interface YogaPose {
  id: string;
  name: string;
  duration: number;
  description: string;
  benefits: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructions: string[];
  image: string;
}

interface LiveSession {
  id: string;
  title: string;
  instructor: string;
  time: string;
  duration: number;
  participants: number;
  level: string;
  type: string;
  image: string;
}

interface YogaSession {
  id: string;
  name: string;
  description: string;
  duration: number;
  poses: YogaPose[];
  type: 'morning' | 'evening' | 'stress-relief' | 'energy-boost';
}

const yogaPoses: YogaPose[] = [
  {
    id: "mountain-pose",
    name: "Mountain Pose (Tadasana)",
    duration: 60,
    description: "A foundational standing pose that improves posture and balance",
    benefits: ["Improves posture", "Increases awareness", "Strengthens thighs", "Reduces anxiety"],
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1506629905607-d13b2b1b45e8?w=400&h=300&fit=crop&face=center",
    instructions: [
      "Stand with feet hip-width apart",
      "Ground down through all four corners of your feet",
      "Engage your leg muscles and lengthen your spine",
      "Relax your shoulders away from your ears",
      "Breathe deeply and hold"
    ]
  },
  {
    id: "child-pose",
    name: "Child's Pose (Balasana)",
    duration: 90,
    description: "A resting pose that calms the mind and relieves stress",
    benefits: ["Relieves stress", "Calms the mind", "Stretches hips", "Reduces anxiety"],
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop&face=center",
    instructions: [
      "Kneel on the floor with big toes touching",
      "Separate your knees about hip-width apart",
      "Fold forward, extending your arms in front",
      "Rest your forehead on the ground",
      "Breathe deeply and relax"
    ]
  },
  {
    id: "cat-cow",
    name: "Cat-Cow Pose",
    duration: 120,
    description: "A gentle flow that warms up the spine and relieves tension",
    benefits: ["Improves spine flexibility", "Relieves back tension", "Massages organs", "Improves coordination"],
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&face=center",
    instructions: [
      "Start on hands and knees in tabletop position",
      "Inhale, arch your back and look up (Cow)",
      "Exhale, round your spine and tuck chin (Cat)",
      "Continue flowing between these positions",
      "Move with your breath"
    ]
  },
  {
    id: "warrior-one",
    name: "Warrior I (Virabhadrasana I)",
    duration: 60,
    description: "A powerful standing pose that builds strength and confidence",
    benefits: ["Strengthens legs", "Improves balance", "Opens hips", "Builds confidence"],
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&face=center",
    instructions: [
      "Step your left foot back about 3-4 feet",
      "Turn your left foot out 45 degrees",
      "Bend your right knee over your ankle",
      "Raise your arms overhead",
      "Hold and repeat on other side"
    ]
  },
  {
    id: "tree-pose",
    name: "Tree Pose (Vrikshasana)",
    duration: 60,
    description: "A balancing pose that improves focus and stability",
    benefits: ["Improves balance", "Strengthens legs", "Enhances focus", "Calms the mind"],
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop&face=center",
    instructions: [
      "Stand in Mountain Pose",
      "Shift weight to your left foot",
      "Place right foot on inner left thigh or calf",
      "Avoid placing foot directly on the knee",
      "Bring palms together at heart center"
    ]
  },
  {
    id: "downward-dog",
    name: "Downward-Facing Dog (Adho Mukha Svanasana)",
    duration: 90,
    description: "An energizing pose that stretches the entire body",
    benefits: ["Strengthens arms", "Stretches hamstrings", "Energizes body", "Improves circulation"],
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&face=center",
    instructions: [
      "Start in tabletop position",
      "Tuck your toes under",
      "Lift your hips up and back",
      "Straighten your legs as much as possible",
      "Press hands firmly into the ground"
    ]
  }
];

const liveSessions: LiveSession[] = [
  {
    id: "1",
    title: "Morning Mindfulness Flow",
    instructor: "Sarah Johnson",
    time: "8:00 AM",
    duration: 30,
    participants: 24,
    level: "Beginner",
    type: "Vinyasa Flow",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&face=center"
  },
  {
    id: "2", 
    title: "Stress Relief & Relaxation",
    instructor: "Michael Chen",
    time: "12:30 PM",
    duration: 45,
    participants: 18,
    level: "All Levels",
    type: "Restorative",
    image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop&face=center"
  },
  {
    id: "3",
    title: "Power Yoga for Students",
    instructor: "Emma Davis",
    time: "6:00 PM", 
    duration: 60,
    participants: 31,
    level: "Intermediate",
    type: "Power Yoga",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&face=center"
  },
  {
    id: "4",
    title: "Evening Gentle Stretch",
    instructor: "Alex Thompson",
    time: "8:30 PM",
    duration: 25,
    participants: 15,
    level: "Beginner",
    type: "Gentle Hatha",
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop&face=center"
  }
];

const yogaSessions: YogaSession[] = [
  {
    id: "morning-energy",
    name: "Morning Energy Flow",
    description: "A gentle sequence to energize your body and mind for the day ahead",
    duration: 15,
    type: "morning",
    poses: [
      yogaPoses.find(p => p.id === "mountain-pose")!,
      yogaPoses.find(p => p.id === "cat-cow")!,
      yogaPoses.find(p => p.id === "downward-dog")!,
      yogaPoses.find(p => p.id === "warrior-one")!,
      yogaPoses.find(p => p.id === "tree-pose")!
    ]
  },
  {
    id: "evening-relaxation",
    name: "Evening Relaxation",
    description: "A calming sequence to help you unwind and prepare for restful sleep",
    duration: 12,
    type: "evening",
    poses: [
      yogaPoses.find(p => p.id === "mountain-pose")!,
      yogaPoses.find(p => p.id === "cat-cow")!,
      yogaPoses.find(p => p.id === "child-pose")!
    ]
  },
  {
    id: "stress-relief",
    name: "Stress Relief",
    description: "A therapeutic sequence designed to release tension and calm anxiety",
    duration: 10,
    type: "stress-relief",
    poses: [
      yogaPoses.find(p => p.id === "child-pose")!,
      yogaPoses.find(p => p.id === "cat-cow")!,
      yogaPoses.find(p => p.id === "mountain-pose")!
    ]
  },
  {
    id: "quick-boost",
    name: "Quick Energy Boost",
    description: "A short energizing sequence for when you need a mental pick-me-up",
    duration: 8,
    type: "energy-boost",
    poses: [
      yogaPoses.find(p => p.id === "mountain-pose")!,
      yogaPoses.find(p => p.id === "warrior-one")!,
      yogaPoses.find(p => p.id === "tree-pose")!
    ]
  }
];

export default function YogaPage() {
  const { currentUser } = useAppContext();
  const [activeSession, setActiveSession] = useState<YogaSession | null>(null);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const startSession = (session: YogaSession) => {
    setActiveSession(session);
    setCurrentPoseIndex(0);
    setTimeRemaining(session.poses[0].duration);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetSession = () => {
    setActiveSession(null);
    setCurrentPoseIndex(0);
    setIsPlaying(false);
    setTimeRemaining(0);
  };

  const nextPose = () => {
    if (activeSession && currentPoseIndex < activeSession.poses.length - 1) {
      const newIndex = currentPoseIndex + 1;
      setCurrentPoseIndex(newIndex);
      setTimeRemaining(activeSession.poses[newIndex].duration);
      setIsPlaying(false);
    }
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'morning': return <Sun className="h-4 w-4" />;
      case 'evening': return <Moon className="h-4 w-4" />;
      case 'stress-relief': return <Heart className="h-4 w-4" />;
      case 'energy-boost': return <Zap className="h-4 w-4" />;
      default: return <Timer className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (activeSession) {
    const currentPose = activeSession.poses[currentPoseIndex];
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-primary">{activeSession.name}</h1>
            <Button variant="outline" onClick={resetSession} data-testid="button-reset-session">
              <RotateCcw className="h-4 w-4 mr-2" />
              End Session
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Pose {currentPoseIndex + 1} of {activeSession.poses.length}</span>
            <span>•</span>
            <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')} remaining</span>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{currentPose.name}</CardTitle>
                <CardDescription>{currentPose.description}</CardDescription>
              </div>
              <Badge className={getDifficultyColor(currentPose.difficulty)}>
                {currentPose.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Instructions</h3>
                <ol className="space-y-2">
                  {currentPose.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Benefits</h3>
                <ul className="space-y-2">
                  {currentPose.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t">
              <Button onClick={togglePlay} size="lg" data-testid="button-toggle-play">
                {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                {isPlaying ? 'Pause' : 'Start'}
              </Button>
              {currentPoseIndex < activeSession.poses.length - 1 && (
                <Button variant="outline" onClick={nextPose} data-testid="button-next-pose">
                  Next Pose
                </Button>
              )}
              {currentPoseIndex === activeSession.poses.length - 1 && (
                <Button variant="outline" onClick={resetSession} data-testid="button-complete-session">
                  Complete Session
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <BackButton />
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Yoga & Wellness</h1>
              <p className="text-muted-foreground">Practice mindfulness and improve your mental wellbeing</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="practice" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="practice" data-testid="tab-practice-sessions">
              <Timer className="h-4 w-4 mr-2" />
              Practice Sessions
            </TabsTrigger>
            <TabsTrigger value="live" data-testid="tab-live-sessions">
              <Video className="h-4 w-4 mr-2" />
              Live Classes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="practice" className="mt-6">

            <Tabs defaultValue="sessions" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sessions" data-testid="tab-sessions">Guided Sessions</TabsTrigger>
                <TabsTrigger value="poses" data-testid="tab-poses">Individual Poses</TabsTrigger>
              </TabsList>

              <TabsContent value="sessions" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {yogaSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSessionIcon(session.type)}
                      <CardTitle className="text-xl">{session.name}</CardTitle>
                    </div>
                    <Badge variant="secondary">
                      {session.duration} min
                    </Badge>
                  </div>
                  <CardDescription>{session.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Includes {session.poses.length} poses:</h4>
                      <div className="flex flex-wrap gap-1">
                        {session.poses.map((pose, index) => (
                          <Badge key={pose.id} variant="outline" className="text-xs">
                            {pose.name.split('(')[0].trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => startSession(session)}
                      data-testid={`button-start-${session.id}`}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="poses" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yogaPoses.map((pose) => (
              <Card key={pose.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pose.name}</CardTitle>
                    <Badge className={getDifficultyColor(pose.difficulty)}>
                      {pose.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{pose.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Benefits:</h4>
                      <ul className="space-y-1">
                        {pose.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Timer className="h-4 w-4 mr-1" />
                        {pose.duration}s hold
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="live" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {liveSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{session.title}</CardTitle>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        LIVE
                      </Badge>
                    </div>
                    <CardDescription>with {session.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-lg overflow-hidden mb-4">
                      <img 
                        src={session.image} 
                        alt={session.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{session.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Timer className="h-4 w-4 text-muted-foreground" />
                          <span>{session.duration} min</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{session.participants} joining</span>
                        </div>
                        <Badge variant="outline">{session.level}</Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Style:</span> {session.type}
                      </div>
                      
                      <Button className="w-full" data-testid={`button-join-live-${session.id}`}>
                        <Video className="h-4 w-4 mr-2" />
                        Join Live Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}