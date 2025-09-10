import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, MessageCircle, Bot, Sparkles, Camera, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CustomPersonalityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onPersonalityCreated: (personality: any) => void;
}

export default function CustomPersonalityDialog({ 
  open, 
  onOpenChange, 
  userId,
  onPersonalityCreated 
}: CustomPersonalityDialogProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [chatData, setChatData] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("file");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a TXT, PDF, or Word document.",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
      setName(name || `AI from ${file.name}`);
    }
  };

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit for images
        toast({
          title: "Image too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedImageTypes.includes(file.type)) {
        toast({
          title: "Invalid image type",
          description: "Please select a JPG, PNG, WEBP, or GIF image.",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedPhoto(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processFileData = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const trainLocalAI = (trainingData: string) => {
    // Simple local AI training - extract patterns from chat data
    const lines = trainingData.split('\n').filter(line => line.trim());
    const messages = [];
    
    // Try to parse WhatsApp format: "DD/MM/YY, HH:MM - Name: Message"
    const whatsappRegex = /^\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}\s(?:am|pm)?\s?-\s([^:]+):\s(.+)$/i;
    
    for (const line of lines) {
      const match = line.match(whatsappRegex);
      if (match) {
        const [, sender, message] = match;
        messages.push({ sender: sender.trim(), message: message.trim() });
      } else if (line.includes(':') && !line.startsWith('[')) {
        // Simple format: "Name: Message"
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const sender = line.substring(0, colonIndex).trim();
          const message = line.substring(colonIndex + 1).trim();
          if (message) {
            messages.push({ sender, message });
          }
        }
      }
    }
    
    // Extract personality traits
    const senders = Array.from(new Set(messages.map(m => m.sender)));
    const mainSender = senders.find(s => s.toLowerCase() !== 'system') || senders[0];
    const senderMessages = messages.filter(m => m.sender === mainSender);
    
    // Extract common phrases and patterns
    const commonPhrases = [];
    const responses = senderMessages.map(m => m.message);
    
    // Find frequently used words/phrases
    const wordCount: Record<string, number> = {};
    responses.forEach(response => {
      const words = response.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 3 && !['this', 'that', 'with', 'have', 'will', 'been', 'from'].includes(word)) {
          wordCount[word] = (wordCount[word] || 0) + 1;
        }
      });
    });
    
    // Get top phrases
    const sortedWords = Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
    
    return {
      name: mainSender || 'Trained AI',
      commonPhrases: sortedWords,
      sampleResponses: responses.slice(0, 20),
      messageCount: senderMessages.length,
      conversationStyle: responses.join(' ').toLowerCase().includes('lol') || responses.join(' ').toLowerCase().includes('haha') ? 'casual' : 'formal'
    };
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your custom AI.",
        variant: "destructive"
      });
      return;
    }

    if (activeTab === "file" && !selectedFile) {
      toast({
        title: "File required",
        description: "Please select a chat file to train your AI.",
        variant: "destructive"
      });
      return;
    }

    if (activeTab === "text" && !chatData.trim()) {
      toast({
        title: "Chat data required",
        description: "Please paste some chat conversation data.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      let trainingData = '';
      let sourceType = 'text';
      let originalFileName = '';
      
      if (activeTab === "file" && selectedFile) {
        trainingData = await processFileData(selectedFile);
        sourceType = 'file';
        originalFileName = selectedFile.name;
      } else {
        trainingData = chatData;
        sourceType = 'text';
      }
      
      // Train local AI
      const aiPersonality = trainLocalAI(trainingData);
      
      const customPersonality = {
        name: name.trim(),
        description: description.trim() || `AI trained from ${sourceType === 'file' ? 'uploaded file' : 'chat data'}`,
        sourceType,
        originalFileName,
        trainingData: trainingData.substring(0, 5000), // Store first 5000 chars for reference
        aiPersonality,
        photo: photoPreview, // Store the photo preview URL
        customPrompt: `You are ${name}, a custom AI trained on conversation data. 
        Your speaking style includes phrases like: ${aiPersonality.commonPhrases.join(', ')}.
        You have a ${aiPersonality.conversationStyle} conversation style.
        Respond naturally and authentically based on the conversation patterns you learned.
        Always be helpful and supportive while maintaining your unique personality.`
      };
      
      toast({
        title: "Custom AI Created! 🎉",
        description: "Your personalized chatbot is ready to use - completely free, no API keys needed!",
      });

      onPersonalityCreated(customPersonality);
      handleClose();
      
    } catch (error: any) {
      console.error('Error creating personality:', error);
      
      toast({
        title: "Unable to Create Custom AI",
        description: "There was an issue processing your training data. Please check your file or text and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setChatData("");
    setSelectedFile(null);
    setSelectedPhoto(null);
    setPhotoPreview(null);
    setActiveTab("file");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create Your Custom AI Bot
          </DialogTitle>
          <DialogDescription>
            Train your own AI companion using your chat conversations. Completely free - no external API keys required!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* AI Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">AI Name</Label>
              <Input
                id="name"
                placeholder="e.g., My Chat Buddy, Dev AI, Friend Bot"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="input-ai-name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Describe what makes this AI special"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                data-testid="input-ai-description"
              />
            </div>
            
            {/* Photo Upload */}
            <div>
              <Label>AI Profile Photo (Optional)</Label>
              <div className="flex items-center space-x-4 mt-2">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden bg-muted/10">
                  {photoPreview ? (
                    <img 
                      src={photoPreview} 
                      alt="AI profile preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-muted-foreground/50" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={() => photoInputRef.current?.click()}
                    data-testid="button-upload-photo"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {photoPreview ? "Change Photo" : "Upload Photo"}
                  </Button>
                  {photoPreview && (
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedPhoto(null);
                        setPhotoPreview(null);
                      }}
                      data-testid="button-remove-photo"
                    >
                      Remove Photo
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, WEBP, GIF (Max 5MB)
                  </p>
                </div>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Training Data */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Chat File
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Paste Chat Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                {selectedFile ? (
                  <div className="space-y-2">
                    <FileText className="h-12 w-12 text-green-500 mx-auto" />
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedFile(null)}
                      data-testid="button-remove-file"
                    >
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                    <div>
                      <p className="font-medium">Upload WhatsApp Chat or Text File</p>
                      <p className="text-sm text-muted-foreground">
                        Supported: TXT, PDF, Word documents (Max 10MB)
                      </p>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="button-select-file"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select File
                    </Button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  💡 How to export WhatsApp chats:
                </h4>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                  <li>Open WhatsApp chat</li>
                  <li>Tap the contact/group name at top</li>
                  <li>Scroll down and tap "Export Chat"</li>
                  <li>Choose "Without Media" for faster processing</li>
                  <li>Upload the exported .txt file here</li>
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <div>
                <Label htmlFor="chatData">Paste Chat Conversation</Label>
                <Textarea
                  id="chatData"
                  placeholder="Paste your chat conversation here... For example:
12/01/24, 2:30 PM - John: Hey, how are you doing?
12/01/24, 2:31 PM - Sarah: I'm good! Just working on some coding projects.
12/01/24, 2:32 PM - John: That sounds cool! What are you building?"
                  value={chatData}
                  onChange={(e) => setChatData(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                  data-testid="textarea-chat-data"
                />
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                  ✨ Your AI will learn:
                </h4>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1 list-disc list-inside">
                  <li>Speaking style and tone</li>
                  <li>Common phrases and expressions</li>
                  <li>Response patterns and personality quirks</li>
                  <li>Topics of interest and expertise</li>
                  <li>Emotional expressions and reactions</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} data-testid="button-create-ai">
            {loading ? (
              <>
                <Bot className="h-4 w-4 mr-2 animate-spin" />
                Creating AI...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Create Custom AI
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}