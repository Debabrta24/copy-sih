import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Search, Loader2, Upload, Plus, ChevronDown, Filter, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ambientMusic } from "@/lib/ambient-music";
import { musicAPI, Track } from "@/lib/music-api";
import { localMusicManager, LocalTrack } from "@/lib/local-music";
import { useQuery } from "@tanstack/react-query";
import { BackButton } from "@/components/ui/back-button";

// Import the uploaded audio files
import audio1 from "@assets/WhatsApp Audio 2025-09-06 at 09.26.39_7516e2fa_1757131765090.mp3";
import audio2 from "@assets/WhatsApp Audio 2025-09-06 at 09.26.40_42b10528_1757131765090.mp3";
import audio3 from "@assets/WhatsApp Audio 2025-09-06 at 09.26.40_816527c1_1757131765090.mp3";
import audio4 from "@assets/WhatsApp Audio 2025-09-06 at 09.26.40_f0a72bd0_1757131765090.mp3";

const musicTracks = [
  {
    id: 1,
    title: "Mind Fresh Track 1",
    artist: "Mind Fresh Audio",
    duration: "3:45",
    category: "Uploaded",
    type: "uploaded",
    description: "Relaxing audio for mental wellness",
    audioUrl: audio1,
    isUploaded: true
  },
  {
    id: 2,
    title: "Mind Fresh Track 2",
    artist: "Mind Fresh Audio", 
    duration: "4:12",
    category: "Uploaded",
    type: "uploaded",
    description: "Calming sounds for stress relief",
    audioUrl: audio2,
    isUploaded: true
  },
  {
    id: 3,
    title: "Mind Fresh Track 3",
    artist: "Mind Fresh Audio",
    duration: "2:58",
    category: "Uploaded", 
    type: "uploaded",
    description: "Peaceful audio for relaxation",
    audioUrl: audio3,
    isUploaded: true
  },
  {
    id: 4,
    title: "Mind Fresh Track 4",
    artist: "Mind Fresh Audio",
    duration: "3:21",
    category: "Uploaded",
    type: "uploaded", 
    description: "Soothing sounds for meditation",
    audioUrl: audio4,
    isUploaded: true
  },
  {
    id: 5,
    title: "Peaceful Meditation",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Meditation",
    type: "meditation",
    description: "Gentle meditation tones to start your day peacefully"
  },
  {
    id: 6,
    title: "Ocean Waves",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Relaxation",
    type: "ocean",
    description: "Soothing ocean waves for deep relaxation"
  },
  {
    id: 7,
    title: "Forest Ambience",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Nature",
    type: "forest",
    description: "Peaceful forest sounds to reduce stress"
  },
  {
    id: 8,
    title: "Gentle Rain",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Sleep",
    type: "rain",
    description: "Soft rainfall sounds for better sleep"
  },
  {
    id: 9,
    title: "Focus Sounds",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Focus",
    type: "focus",
    description: "Clear focus sounds for better concentration"
  },
  {
    id: 10,
    title: "Mountain Stream",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Nature",
    type: "stream",
    description: "Gentle flowing water sounds from mountain streams"
  },
  {
    id: 11,
    title: "Deep Focus",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Focus",
    type: "deep-focus",
    description: "Binaural beats for enhanced concentration"
  },
  {
    id: 8,
    title: "Evening Wind",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Sleep",
    type: "wind",
    description: "Soft evening wind sounds for peaceful sleep"
  },
  {
    id: 9,
    title: "Zen Garden",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Meditation",
    type: "zen",
    description: "Tranquil sounds from a peaceful zen garden"
  },
  {
    id: 10,
    title: "Healing Frequencies",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Relaxation",
    type: "healing",
    description: "Therapeutic frequencies for mind and body healing"
  },
  {
    id: 11,
    title: "Bird Songs",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Nature",
    type: "birds",
    description: "Peaceful morning bird songs and chirping"
  },
  {
    id: 12,
    title: "Study Alpha",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Focus",
    type: "alpha",
    description: "Alpha wave frequencies for enhanced learning"
  },
  {
    id: 13,
    title: "Campfire Crackle",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Relaxation",
    type: "fire",
    description: "Cozy campfire sounds for warm relaxation"
  },
  {
    id: 14,
    title: "Thunder Storm",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Sleep",
    type: "storm",
    description: "Distant thunder and rain for deep sleep"
  },
  {
    id: 15,
    title: "Mindful Breathing",
    artist: "Mind Fresh Audio",
    duration: "∞",
    category: "Meditation",
    type: "breathing",
    description: "Guided breathing rhythms for mindfulness"
  }
];

const categories = [
  { value: "All", label: "All Categories" },
  { value: "Uploaded", label: "Uploaded Audio" },
  { value: "Meditation", label: "Meditation" },
  { value: "Relaxation", label: "Relaxation" },
  { value: "Nature", label: "Nature Sounds" },
  { value: "Sleep", label: "Sleep" },
  { value: "Focus", label: "Focus & Study" },
  { value: "Music", label: "Music Tracks" },
  { value: "Local Music", label: "My Music" }
];

export default function Music() {
  const [currentTrack, setCurrentTrack] = useState(musicTracks[0]);
  const [currentApiTrack, setCurrentApiTrack] = useState<Track | null>(null);
  const [currentLocalTrack, setCurrentLocalTrack] = useState<LocalTrack | null>(null);
  const [currentTrackType, setCurrentTrackType] = useState<'ambient' | 'api' | 'local'>('ambient');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([80]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedTracks, setLikedTracks] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ambientTimer, setAmbientTimer] = useState<NodeJS.Timeout | null>(null);
  const [isShuffleMode, setIsShuffleMode] = useState(false);
  const [playedTracks, setPlayedTracks] = useState<number[]>([]);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch popular tracks for Music category
  const { data: popularTracks = [], isLoading: loadingPopular } = useQuery({
    queryKey: ['/music/popular'],
    queryFn: () => musicAPI.getTracksByMood('relaxing'),
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    enabled: selectedCategory === "Music"
  });

  // Search tracks based on query
  const { data: searchResults = [], isLoading: loadingSearch } = useQuery({
    queryKey: ['/music/search', searchQuery],
    queryFn: () => musicAPI.searchTracks(searchQuery),
    enabled: searchQuery.length > 2 && selectedCategory === "Music",
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
  });

  // Scan local music files
  const { data: localTracks = [], isLoading: loadingLocal } = useQuery({
    queryKey: ['/music/local'],
    queryFn: () => localMusicManager.scanMusicFiles(),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    enabled: selectedCategory === "Local Music"
  });

  const ambientTracks = selectedCategory === "All" 
    ? musicTracks 
    : musicTracks.filter(track => track.category === selectedCategory);

  const apiTracks = selectedCategory === "Music" 
    ? (searchQuery ? searchResults : popularTracks)
    : [];

  const localMusicTracks = selectedCategory === "Local Music" ? localTracks : [];

  const allTracks = selectedCategory === "Music" 
    ? apiTracks 
    : selectedCategory === "Local Music" 
    ? localMusicTracks 
    : ambientTracks;

  // Shuffle function
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Get next track for random playback
  const getNextRandomTrack = () => {
    const availableTracks = allTracks.filter((_, index) => !playedTracks.includes(index));
    if (availableTracks.length === 0) {
      // Reset played tracks if all have been played
      setPlayedTracks([]);
      return allTracks[Math.floor(Math.random() * allTracks.length)];
    }
    const randomTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];
    const trackIndex = allTracks.findIndex(t => t.id === randomTrack.id);
    setPlayedTracks(prev => [...prev, trackIndex]);
    return randomTrack;
  };

  const playAmbientTrack = async (track: any) => {
    // Handle uploaded audio files
    if (track.isUploaded && track.audioUrl) {
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        await audioRef.current.play();
        setIsPlaying(true);
        setCurrentTrackType('ambient');
        setCurrentTrack(track);
      }
      return;
    }

    const trackType = track.type as string;
    switch (trackType) {
      case 'uploaded':
        // Handle uploaded files
        if (audioRef.current && track.audioUrl) {
          audioRef.current.src = track.audioUrl;
          await audioRef.current.play();
        }
        break;
      case 'meditation':
        await ambientMusic.playMeditation();
        break;
      case 'ocean':
        await ambientMusic.playOceanWaves();
        break;
      case 'forest':
        await ambientMusic.playForest();
        break;
      case 'rain':
        await ambientMusic.playRainfall();
        break;
      case 'focus':
      case 'deep-focus':
      case 'alpha':
        await ambientMusic.playFocus();
        break;
      case 'stream':
      case 'birds':
        await ambientMusic.playForest();
        break;
      case 'wind':
      case 'storm':
        await ambientMusic.playRainfall();
        break;
      case 'zen':
      case 'breathing':
        await ambientMusic.playMeditation();
        break;
      case 'healing':
      case 'fire':
        await ambientMusic.playOceanWaves();
        break;
      default:
        await ambientMusic.playMeditation();
    }
  };

  const playApiTrack = (track: Track) => {
    if (audioRef.current && track.preview_url) {
      audioRef.current.src = track.preview_url;
      audioRef.current.play();
    }
  };

  const playLocalTrack = (track: LocalTrack) => {
    if (audioRef.current) {
      audioRef.current.src = track.file_url;
      audioRef.current.play();
    }
  };

  const selectTrack = (track: any, type: 'ambient' | 'api' | 'local') => {
    if (isPlaying) {
      ambientMusic.stop();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (ambientTimer) {
        clearInterval(ambientTimer);
        setAmbientTimer(null);
      }
      setIsPlaying(false);
    }
    
    // Reset current time when selecting a new track
    setCurrentTime(0);
    
    if (type === 'ambient') {
      setCurrentTrack(track);
      setCurrentTrackType('ambient');
    } else if (type === 'api') {
      setCurrentApiTrack(track);
      setCurrentTrackType('api');
    } else if (type === 'local') {
      setCurrentLocalTrack(track);
      setCurrentTrackType('local');
    }
  };

  const togglePlay = async () => {
    if (isPlaying) {
      ambientMusic.stop();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (ambientTimer) {
        clearInterval(ambientTimer);
        setAmbientTimer(null);
      }
      setIsPlaying(false);
    } else {
      if (currentTrackType === 'ambient') {
        await playAmbientTrack(currentTrack);
        // Start timer for ambient tracks
        const timer = setInterval(() => {
          setCurrentTime(prev => prev + 1);
        }, 1000);
        setAmbientTimer(timer);
      } else if (currentTrackType === 'api' && currentApiTrack) {
        playApiTrack(currentApiTrack);
      } else if (currentTrackType === 'local' && currentLocalTrack) {
        playLocalTrack(currentLocalTrack);
      }
      setIsPlaying(true);
    }
  };

  const skipToNext = async () => {
    if (currentTrackType === 'ambient') {
      let nextTrack;
      
      if (isShuffleMode) {
        nextTrack = getNextRandomTrack();
      } else {
        const currentIndex = ambientTracks.findIndex((track: any) => track.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % ambientTracks.length;
        nextTrack = ambientTracks[nextIndex];
      }
      
      if (isPlaying) {
        ambientMusic.stop();
        await playAmbientTrack(nextTrack);
      }
      setCurrentTrack(nextTrack);
    } else if (currentApiTrack && apiTracks.length > 0) {
      let nextTrack;
      
      if (isShuffleMode) {
        const randomIndex = Math.floor(Math.random() * apiTracks.length);
        nextTrack = apiTracks[randomIndex];
      } else {
        const currentIndex = apiTracks.findIndex((track: Track) => track.id === currentApiTrack.id);
        const nextIndex = (currentIndex + 1) % apiTracks.length;
        nextTrack = apiTracks[nextIndex];
      }
      
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentApiTrack(nextTrack);
      if (isPlaying) {
        playApiTrack(nextTrack);
      }
    }
  };

  const skipToPrevious = async () => {
    if (currentTrackType === 'ambient') {
      const currentIndex = ambientTracks.findIndex((track: any) => track.id === currentTrack.id);
      const prevIndex = currentIndex === 0 ? ambientTracks.length - 1 : currentIndex - 1;
      const prevTrack = ambientTracks[prevIndex];
      
      if (isPlaying) {
        ambientMusic.stop();
        await playAmbientTrack(prevTrack);
      }
      setCurrentTrack(prevTrack);
    } else if (currentApiTrack && apiTracks.length > 0) {
      const currentIndex = apiTracks.findIndex((track: Track) => track.id === currentApiTrack.id);
      const prevIndex = currentIndex === 0 ? apiTracks.length - 1 : currentIndex - 1;
      const prevTrack = apiTracks[prevIndex];
      
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentApiTrack(prevTrack);
      if (isPlaying) {
        playApiTrack(prevTrack);
      }
    }
  };

  const toggleLike = (trackId: number) => {
    setLikedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  // Audio event handlers
  const handleApiTrackPlay = () => setIsPlaying(true);
  const handleApiTrackPause = () => setIsPlaying(false);
  const handleApiTrackEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };
  const handleApiTrackTimeUpdate = (e: any) => setCurrentTime(e.target.currentTime);
  const handleApiTrackLoadedMetadata = (e: any) => {
    setDuration(e.target.duration);
    setCurrentTime(0);
  };

  // Add audio ref event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('play', handleApiTrackPlay);
    audio.addEventListener('pause', handleApiTrackPause);
    audio.addEventListener('ended', handleApiTrackEnded);
    audio.addEventListener('timeupdate', handleApiTrackTimeUpdate);
    audio.addEventListener('loadedmetadata', handleApiTrackLoadedMetadata);

    return () => {
      audio.removeEventListener('play', handleApiTrackPlay);
      audio.removeEventListener('pause', handleApiTrackPause);
      audio.removeEventListener('ended', handleApiTrackEnded);
      audio.removeEventListener('timeupdate', handleApiTrackTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleApiTrackLoadedMetadata);
    };
  }, []);

  // Update volume for API tracks
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  // Cleanup ambient timer on component unmount
  useEffect(() => {
    return () => {
      if (ambientTimer) {
        clearInterval(ambientTimer);
      }
    };
  }, [ambientTimer]);

  // Handle local music file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/aac', 'audio/ogg', 'audio/flac'];
      if (!validTypes.includes(file.type)) {
        alert(`"${file.name}" is not a valid audio file. Please select MP3, WAV, M4A, AAC, OGG, or FLAC files.`);
        continue;
      }

      try {
        // Create object URL for local playback
        const audioUrl = URL.createObjectURL(file);
        
        // Create a local track entry
        const localTrack: LocalTrack = {
          id: `local-${Date.now()}-${i}`,
          title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
          artist: 'Local Music',
          file_url: audioUrl,
          duration: '0', // Will be set when loaded
          file_name: file.name,
          type: 'local'
        };

        // Test if audio can be loaded
        const audio = new Audio(audioUrl);
        await new Promise((resolve, reject) => {
          audio.onloadedmetadata = () => {
            localTrack.duration = audio.duration.toString();
            resolve(undefined);
          };
          audio.onerror = reject;
        });

        // Store in localStorage for persistence
        const existingTracks = JSON.parse(localStorage.getItem('localMusicTracks') || '[]');
        existingTracks.push(localTrack);
        localStorage.setItem('localMusicTracks', JSON.stringify(existingTracks));

        // Set as current track if it's the first one uploaded
        if (i === 0) {
          setCurrentLocalTrack(localTrack);
          setCurrentTrackType('local');
          setSelectedCategory('Local Music');
        }
        
      } catch (error) {
        console.error('Error loading audio file:', error);
        alert(`Error loading "${file.name}". Please try another file.`);
      }
    }

    alert(`Successfully added ${files.length} song${files.length !== 1 ? 's' : ''} to your music library!`);

    // Reset the input
    event.target.value = '';
  };

  // Load local tracks from localStorage
  const getLocalTracks = () => {
    try {
      return JSON.parse(localStorage.getItem('localMusicTracks') || '[]');
    } catch {
      return [];
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Mind Fresh Music</h1>
        <p className="text-muted-foreground">Relaxing music and nature sounds for mental wellness</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Player */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Now Playing</CardTitle>
              <CardDescription>
                {currentTrackType === 'api' ? currentApiTrack?.title : 
                 currentTrackType === 'local' ? currentLocalTrack?.title : currentTrack.title} - 
                {currentTrackType === 'api' ? currentApiTrack?.artist : 
                 currentTrackType === 'local' ? currentLocalTrack?.artist : currentTrack.artist}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-8">
                <div className="text-center space-y-2">
                  <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden">
                    {currentTrackType === 'api' && currentApiTrack?.cover_art ? (
                      <img 
                        src={currentApiTrack.cover_art} 
                        alt="Album Cover" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                        {currentTrackType === 'local' ? '🎵' : '♪'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {currentTrackType === 'api' ? currentApiTrack?.title : 
                       currentTrackType === 'local' ? currentLocalTrack?.title : currentTrack.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {currentTrackType === 'api' ? currentApiTrack?.artist : 
                       currentTrackType === 'local' ? currentLocalTrack?.artist : currentTrack.artist}
                    </p>
                    {currentTrackType === 'ambient' && (
                      <p className="text-sm text-muted-foreground">{currentTrack.description}</p>
                    )}
                    {currentTrackType === 'api' && currentApiTrack?.album && (
                      <p className="text-sm text-muted-foreground">{currentApiTrack.album}</p>
                    )}
                    {currentTrackType === 'local' && currentLocalTrack && (
                      <p className="text-sm text-muted-foreground">Local Music File</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={(currentTime / duration) * 100} className="w-full" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>
                    {(currentTrackType === 'api' || currentTrackType === 'local') ? formatTime(duration) : formatTime(currentTime)}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsShuffleMode(!isShuffleMode)}
                  className={isShuffleMode ? 'bg-primary text-primary-foreground' : ''}
                  data-testid="button-shuffle"
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={skipToPrevious}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button onClick={togglePlay} size="lg" data-testid="button-play-pause">
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                <Button variant="outline" size="sm" onClick={skipToNext}>
                  <SkipForward className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const trackId = currentTrackType === 'api' ? parseInt(currentApiTrack?.id || '0') : currentTrack.id;
                    toggleLike(trackId);
                  }}
                >
                  <Heart className={`h-4 w-4 ${
                    currentTrackType === 'api' 
                      ? (currentApiTrack && likedTracks.includes(parseInt(currentApiTrack.id))) 
                      : likedTracks.includes(currentTrack.id)
                  } ? 'fill-current text-red-500' : ''`} />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="flex-1"
                  data-testid="slider-volume"
                />
                <span className="text-sm text-muted-foreground w-8">{volume[0]}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Playlist Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Music Library</CardTitle>
              <CardDescription>Choose your relaxation soundtrack</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Category Filter Dropdown */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Filter by Category</span>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full" data-testid="select-category-filter">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem 
                        key={category.value} 
                        value={category.value}
                        data-testid={`filter-${category.value.toLowerCase()}`}
                      >
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Input for Music */}
              {selectedCategory === "Music" && (
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search for music tracks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                      data-testid="input-music-search"
                    />
                  </div>
                  {loadingSearch && (
                    <div className="flex items-center justify-center mt-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
                    </div>
                  )}
                </div>
              )}

              {/* Local Music Upload */}
              {selectedCategory === "Local Music" && (
                <div className="mb-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Add music files to your local collection
                    </p>
                    <Input
                      type="file"
                      accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="music-file-upload"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('music-file-upload')?.click()}
                      data-testid="button-upload-music"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Music File
                    </Button>
                  </div>
                  {loadingLocal && (
                    <div className="flex items-center justify-center mt-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2 text-sm text-muted-foreground">Scanning local files...</span>
                    </div>
                  )}
                </div>
              )}

              {/* Track List */}
              <div className="space-y-2">
                {selectedCategory === "Music" && loadingPopular && !searchQuery && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2 text-sm text-muted-foreground">Loading popular tracks...</span>
                  </div>
                )}
                
                {allTracks.map((track: any) => {
                  const isApiTrack = selectedCategory === "Music";
                  const isLocalTrack = selectedCategory === "Local Music";
                  const trackId = (isApiTrack || isLocalTrack) ? parseInt(track.id) : track.id;
                  
                  const isCurrentTrack = isApiTrack 
                    ? currentApiTrack?.id === track.id
                    : isLocalTrack
                    ? currentLocalTrack?.id === track.id
                    : currentTrack.id === track.id;
                  
                  return (
                    <div
                      key={track.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        isCurrentTrack
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => selectTrack(track, isApiTrack ? 'api' : isLocalTrack ? 'local' : 'ambient')}
                      data-testid={`track-${track.id}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded overflow-hidden">
                          {isApiTrack && track.cover_art ? (
                            <img 
                              src={track.cover_art} 
                              alt="Album Cover" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg">
                              {isLocalTrack ? '🎵' : '♪'}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{track.title}</h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {track.artist} • {track.duration}
                            {isApiTrack && track.album && ` • ${track.album}`}
                          </p>
                          {!isApiTrack && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {track.category}
                              </span>
                            </div>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(trackId);
                          }}
                          data-testid={`button-like-${track.id}`}
                        >
                          <Heart className={`h-4 w-4 ${likedTracks.includes(trackId) ? 'fill-current text-red-500' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                
                {selectedCategory === "Music" && allTracks.length === 0 && !loadingSearch && !loadingPopular && (
                  <div className="text-center p-4 text-muted-foreground">
                    {searchQuery ? 'No tracks found. Try a different search.' : 'No popular tracks available.'}
                  </div>
                )}
                
                {selectedCategory === "Local Music" && allTracks.length === 0 && !loadingLocal && (
                  <div className="text-center p-4 text-muted-foreground">
                    <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No local music files found.</p>
                    <p className="text-xs mt-1">Upload some music files to get started!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Hidden audio player for API tracks */}
      <audio 
        ref={audioRef}
        onPlay={handleApiTrackPlay}
        onPause={handleApiTrackPause}
        onEnded={handleApiTrackEnded}
        onTimeUpdate={handleApiTrackTimeUpdate}
        onLoadedMetadata={handleApiTrackLoadedMetadata}
        style={{ display: 'none' }}
      />
    </div>
  );
}