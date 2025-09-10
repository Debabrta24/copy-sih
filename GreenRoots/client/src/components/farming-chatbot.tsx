import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Bot, 
  Send, 
  User, 
  MessageSquare, 
  X, 
  AlertTriangle, 
  Flashlight, 
  FlashlightOff,
  Bell,
  BellOff,
  Camera,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Image,
  Upload
} from 'lucide-react';
import { useLanguage } from './language-provider';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  image?: string;
  isVoice?: boolean;
}

interface FarmingChatbotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FarmingChatbot({ open, onOpenChange }: FarmingChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI farming assistant. I can help you with crop advice, pest identification, weather planning, and emergency farming situations. How can I help you today?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  // Quick farming questions - multilingual support
  const quickQuestions = {
    en: [
      "What's the best time to plant wheat?",
      "How to identify pest attacks?",
      "Weather forecast for farming",
      "Crop rotation suggestions",
      "Organic fertilizer recipes",
      "Emergency crop protection"
    ],
    hi: [
      "गेहूं बोने का सबसे अच्छा समय क्या है?",
      "कीट के हमले की पहचान कैसे करें?",
      "खेती के लिए मौसम की भविष्यवाणी",
      "फसल चक्र के सुझाव",
      "जैविक उर्वरक के नुस्खे",
      "आपातकालीन फसल सुरक्षा"
    ],
    bn: [
      "গম রোপণের সেরা সময় কখন?",
      "কীটপতঙ্গের আক্রমণ কীভাবে চিহ্নিত করবেন?",
      "কৃষিকাজের জন্য আবহাওয়ার পূর্বাভাস",
      "ফসল আবর্তনের পরামর্শ",
      "জৈব সারের রেসিপি",
      "জরুরী ফসল সুরক্ষা"
    ],
    ta: [
      "கோதுமை விதைக்க சிறந்த நேரம் எது?",
      "பூச்சி தாக்குதலை எப்படி கண்டறிவது?",
      "விவசாயத்திற்கான வானிலை முன்னறிவிப்பு",
      "பயிர் சுழற்சி பரிந்துரைகள்",
      "இயற்கை உரம் செய்முறைகள்",
      "அவசர பயிர் பாதுகாப்பு"
    ]
  };

  // Emergency farming situations - multilingual support
  const emergencyTopics = {
    en: [
      "Sudden weather changes",
      "Pest outbreak control",
      "Crop disease emergency",
      "Flood damage recovery",
      "Drought management",
      "Equipment breakdown solutions"
    ],
    hi: [
      "अचानक मौसम परिवर्तन",
      "कीट प्रकोप नियंत्रण",
      "फसल रोग आपातकाल",
      "बाढ़ की क्षति से उबरना",
      "सूखा प्रबंधन",
      "उपकरण खराबी के समाधान"
    ],
    bn: [
      "হঠাৎ আবহাওয়া পরিবর্তন",
      "কীটপতঙ্গ প্রাদুর্ভাব নিয়ন্ত্রণ",
      "ফসলের রোগ জরুরী অবস্থা",
      "বন্যার ক্ষতি পুনরুদ্ধার",
      "খরা ব্যবস্থাপনা",
      "যন্ত্রপাতি ভাঙ্গার সমাধান"
    ],
    ta: [
      "திடீர் வானிலை மாற்றங்கள்",
      "பூச்சி வெடிப்பு கட்டுப்பாடு",
      "பயிர் நோய் அவசரநிலை",
      "வெள்ள சேத மீட்பு",
      "வறட்சி மேலாண்மை",
      "கருவி பழுது தீர்வுகள்"
    ]
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Cleanup media streams on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
    };
  }, [cameraStream, mediaRecorder]);

  // Start camera for photo capture
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCameraModal(true);
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
        sendImageMessage(imageData);
      }
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        sendImageMessage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Send image message
  const sendImageMessage = async (imageData: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: "I've uploaded an image for analysis. Can you help me identify any issues?",
      role: 'user',
      timestamp: new Date(),
      image: imageData
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulate AI image analysis (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = `📸 Image Analysis Complete\n\n🔍 I can see your crop image. Based on the visual analysis:\n\n🌱 Plant Health: Appears to be in good condition\n🐛 Pest Detection: No obvious pest damage visible\n🍃 Leaf Condition: Healthy green foliage\n💧 Moisture Level: Adequate hydration\n\n📋 Recommendations:\n• Continue current care routine\n• Monitor for any changes\n• Consider soil testing for nutrients\n\nFor more specific analysis, please describe any concerns you have about this plant.`;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        
        // Simulate speech-to-text (replace with actual API)
        await new Promise(resolve => setTimeout(resolve, 1000));
        const transcribedText = "Sample transcribed text from voice input";
        
        setInput(transcribedText);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak now. Tap the mic again to stop."
      });
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
      
      toast({
        title: "Recording Stopped",
        description: "Processing your voice input..."
      });
    }
  };

  // Text-to-speech function
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on current language setting
      switch (language) {
        case 'hi':
          utterance.lang = 'hi-IN';
          break;
        case 'bn':
          utterance.lang = 'bn-IN';
          break;
        case 'ta':
          utterance.lang = 'ta-IN';
          break;
        default:
          utterance.lang = 'en-US';
      }
      
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Text-to-Speech Not Available",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive"
      });
    }
  };

  // Stop text-to-speech
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Flashlight control for mobile devices
  const toggleFlashlight = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          title: "Flashlight Not Available",
          description: "Your device doesn't support flashlight control.",
          variant: "destructive"
        });
        return;
      }

      if (flashlightOn) {
        // Turn off flashlight
        if (window.currentStream) {
          window.currentStream.getTracks().forEach(track => track.stop());
          window.currentStream = null;
        }
        setFlashlightOn(false);
        toast({
          title: "Flashlight Off",
          description: "Flashlight has been turned off."
        });
      } else {
        // Turn on flashlight
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            advanced: [{ torch: true } as any]
          }
        });
        window.currentStream = stream;
        setFlashlightOn(true);
        toast({
          title: "Flashlight On",
          description: "Flashlight has been turned on for emergency use."
        });
      }
    } catch (error) {
      toast({
        title: "Flashlight Error",
        description: "Unable to control flashlight. Try using your device's flashlight directly.",
        variant: "destructive"
      });
    }
  };

  const toggleEmergencyNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    if (!notificationsEnabled) {
      toast({
        title: "Emergency Notifications Enabled",
        description: "You'll receive alerts for weather warnings and farming emergencies."
      });
      // Send test notification
      if (Notification.permission === 'granted') {
        new Notification('AgreeGrow Emergency Alert', {
          body: 'Emergency notifications are now enabled for your farming activities.',
          icon: '/icon-192x192.png'
        });
      }
    } else {
      toast({
        title: "Emergency Notifications Disabled",
        description: "Emergency notifications have been turned off."
      });
    }
  };

  const sendEmergencyAlert = (message: string) => {
    if (notificationsEnabled && Notification.permission === 'granted') {
      new Notification('🚨 Farming Emergency Alert', {
        body: message,
        icon: '/icon-192x192.png',
        requireInteraction: true
      } as NotificationOptions);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Check for emergency keywords
    const emergencyKeywords = ['emergency', 'urgent', 'help', 'crisis', 'disaster', 'flood', 'drought', 'pest attack'];
    const isEmergency = emergencyKeywords.some(keyword => 
      input.toLowerCase().includes(keyword)
    );

    if (isEmergency) {
      setEmergencyMode(true);
      sendEmergencyAlert(`Emergency farming question detected: ${input}`);
    }

    try {
      // Simulate AI response (replace with actual AI API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let response = '';
      
      if (isEmergency) {
        response = `🚨 EMERGENCY RESPONSE: I understand this is urgent. Based on your question "${input}", here are immediate steps:\n\n1. Stay calm and assess the situation\n2. Contact local agricultural emergency services if needed\n3. Document the issue with photos if possible\n4. Apply immediate protective measures\n\nFor specific emergency guidance, please provide more details about the situation. I'm here to help you through this farming emergency.`;
      } else if (input.toLowerCase().includes('pest')) {
        response = `For pest management: \n\n🐛 Identification: Take clear photos of affected plants\n🌿 Organic solutions: Neem oil, beneficial insects\n⚠️ Prevention: Regular monitoring, crop rotation\n📅 Timing: Early morning inspections are best\n\nWould you like specific treatment recommendations for a particular pest?`;
      } else if (input.toLowerCase().includes('weather')) {
        response = `Weather planning for farming:\n\n🌤️ Monitor 7-day forecasts daily\n🌧️ Rain preparation: Ensure drainage systems\n☀️ Heat protection: Shade nets, adequate irrigation\n❄️ Cold protection: Row covers, mulching\n\nCheck your local weather alerts regularly for best results.`;
      } else if (input.toLowerCase().includes('crop') || input.toLowerCase().includes('plant')) {
        response = `Crop guidance:\n\n🌱 Soil testing is crucial before planting\n💧 Irrigation: Deep, less frequent watering\n🍃 Nutrition: Balanced NPK fertilizers\n🔄 Rotation: Change crop families each season\n📏 Spacing: Follow seed packet recommendations\n\nWhat specific crop are you working with?`;
      } else {
        response = `Thank you for your farming question! Here's my advice:\n\n• Always consider your local climate and soil conditions\n• Consult with local agricultural extension services\n• Keep detailed records of your farming activities\n• Consider sustainable and organic practices\n\nFor more specific help, please share details about your location, crop type, or specific farming challenge.`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  if (!open) return null;

  return (
    <>
      {/* Main Chatbot */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
        <Card className="w-full max-w-2xl h-[85vh] sm:h-[80vh] flex flex-col max-h-screen">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2 sm:pb-4 px-3 sm:px-6 py-3 sm:py-6">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-primary" />
            <CardTitle className="text-lg">Farm AI Assistant</CardTitle>
            {emergencyMode && (
              <Badge variant="destructive" className="animate-pulse">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Emergency Mode
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* Emergency Notifications Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleEmergencyNotifications}
              title={notificationsEnabled ? "Disable Emergency Notifications" : "Enable Emergency Notifications"}
              className="h-8 w-8"
            >
              {notificationsEnabled ? (
                <Bell className="w-4 h-4 text-orange-500" />
              ) : (
                <BellOff className="w-4 h-4" />
              )}
            </Button>
            
            {/* Flashlight Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFlashlight}
              title={flashlightOn ? "Turn Off Flashlight" : "Turn On Flashlight"}
              className="h-8 w-8"
            >
              {flashlightOn ? (
                <Flashlight className="w-4 h-4 text-yellow-500" />
              ) : (
                <FlashlightOff className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-3 sm:space-y-4 p-3 sm:p-4 overflow-hidden">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {(emergencyMode ? emergencyTopics[language as keyof typeof emergencyTopics] || emergencyTopics.en : quickQuestions[language as keyof typeof quickQuestions] || quickQuestions.en).slice(0, 3).map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickQuestion(question)}
                className="text-xs"
              >
                {question}
              </Button>
            ))}
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    {message.image && (
                      <img 
                        src={message.image} 
                        alt="Uploaded crop image" 
                        className="w-full max-w-[200px] h-auto rounded-lg mb-2"
                      />
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => isSpeaking ? stopSpeaking() : speakText(message.content)}
                          className="h-6 w-6 p-0"
                        >
                          {isSpeaking ? (
                            <VolumeX className="w-3 h-3" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </Button>
                        {message.isVoice && (
                          <Badge variant="outline" className="text-xs">
                            Voice Message
                          </Badge>
                        )}
                      </div>
                    )}
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-accent" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                      <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="flex space-x-2">
            <div className="flex flex-1 space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={emergencyMode ? "Describe your emergency situation..." : "Ask me anything about farming..."}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                className="flex-1 no-zoom"
                disabled={isLoading}
              />
              
              {/* Voice Recording Button */}
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                className={`min-w-[44px] ${isRecording ? 'animate-pulse' : ''}`}
                title={isRecording ? "Stop Recording" : "Start Voice Input"}
              >
                {isRecording ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
              
              {/* Camera Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={startCamera}
                disabled={isLoading}
                className="min-w-[44px]"
                title="Take Photo"
              >
                <Camera className="w-4 h-4" />
              </Button>
              
              {/* File Upload Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="min-w-[44px]"
                title="Upload Image"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
            
            <Button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()}
              size="icon"
              className="min-w-[44px]"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          {emergencyMode && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-red-700 dark:text-red-300">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Emergency Mode Active</span>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Priority support for urgent farming situations. If this is a life-threatening emergency, call local emergency services.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEmergencyMode(false)}
                className="mt-2 text-xs"
              >
                Exit Emergency Mode
              </Button>
            </div>
          )}
        </CardContent>
        </Card>
      </div>
      
      {/* Camera Modal */}
      <Dialog open={showCameraModal} onOpenChange={stopCamera}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Capture Plant Photo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
              />
            </div>
            <div className="flex justify-center gap-4">
              <Button
                onClick={capturePhoto}
                className="min-w-[120px]"
              >
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </Button>
              <Button
                variant="outline"
                onClick={stopCamera}
                className="min-w-[120px]"
              >
                Cancel
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Position your crop or plant in the camera view and click capture
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    currentStream: MediaStream | null;
  }
}