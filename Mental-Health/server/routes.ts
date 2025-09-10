import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import multer from "multer";
import mammoth from "mammoth";
import { storage } from "./storage";
import { aiService } from "./services/ai-service";
import { LocalAIService } from "./services/local-ai";
import { ScreeningService } from "./services/screening";
import { CrisisService } from "./services/crisis";
import { 
  insertUserSchema, 
  insertScreeningAssessmentSchema,
  insertAppointmentSchema,
  insertForumPostSchema,
  insertForumReplySchema,
  insertMoodEntrySchema,
  insertCustomPersonalitySchema,
  insertMedicineAlarmSchema,
  insertUserSkillSchema,
  insertSkillShowcaseSchema,
  insertSkillEndorsementSchema,
  users
} from "@shared/schema";
import { db } from "./db";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, TXT, and Word documents are allowed.'));
    }
  }
});

// File processing function
async function processUploadedFile(file: Express.Multer.File): Promise<string> {
  let extractedText = '';
  
  if (file.mimetype === 'text/plain') {
    extractedText = file.buffer.toString('utf-8');
  } else if (file.mimetype === 'application/pdf') {
    // Dynamic import to avoid pdf-parse test file issue
    const pdfParse = await import('pdf-parse');
    const pdfData = await pdfParse.default(file.buffer);
    extractedText = pdfData.text;
  } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    extractedText = result.value;
  } else if (file.mimetype === 'application/msword') {
    // For older .doc files, mammoth can still try to extract text
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    extractedText = result.value;
  }
  
  return extractedText.trim();
}

// WebSocket connection management
const wsConnections = new Map<string, WebSocket>();
const peerConnections = new Map<string, {ws: WebSocket, userId: string, callId?: string}>();

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws' 
  });

  wss.on('connection', (ws: WebSocket, req) => {
    const userId = req.url?.split('userId=')[1];
    if (userId) {
      wsConnections.set(userId, ws);
      console.log(`WebSocket connected for user: ${userId}`);
    }

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'chat_message' && userId) {
          let response;
          
          // Check if we should use local AI for custom personality
          if (data.personality && (data.personality.trainingData || data.personality.customPrompt)) {
            try {
              // Use local AI service for custom personalities
              const localAI = new LocalAIService();
              if (data.personality.trainingData) {
                localAI.learnFromChat(data.personality.trainingData);
              }
              
              response = localAI.generateResponse([
                ...data.chatHistory || [],
                { role: 'user', content: data.message, timestamp: new Date() }
              ]);
            } catch (error) {
              console.error('Local AI error, falling back to regular AI:', error);
              // Fall back to regular AI with custom prompt
              response = await aiService.generateResponse([
                ...data.chatHistory || [],
                { role: 'user', content: data.message, timestamp: new Date() }
              ], data.personality);
            }
          } else {
            // Use regular AI service for default responses
            response = await aiService.generateResponse([
              ...data.chatHistory || [],
              { role: 'user', content: data.message, timestamp: new Date() }
            ], data.personality);
          }

          // Check for crisis indicators
          await CrisisService.evaluateChatMessage(userId, data.message);

          // Send AI response back
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'chat_response',
              message: response.message,
              supportiveActions: response.supportiveActions,
              riskLevel: response.riskLevel,
              escalationRequired: response.escalationRequired
            }));
          }
        }
        
        // Handle WebRTC signaling for peer calls
        else if (data.type === 'webrtc_signal' && userId) {
          const { targetUserId, signal, callId } = data;
          const targetConnection = wsConnections.get(targetUserId);
          
          if (targetConnection && targetConnection.readyState === WebSocket.OPEN) {
            targetConnection.send(JSON.stringify({
              type: 'webrtc_signal',
              fromUserId: userId,
              signal,
              callId
            }));
          }
        }
        
        // Handle call initiation
        else if (data.type === 'initiate_call' && userId) {
          const { targetUserId, callType, callId } = data;
          const targetConnection = wsConnections.get(targetUserId);
          
          if (targetConnection && targetConnection.readyState === WebSocket.OPEN) {
            targetConnection.send(JSON.stringify({
              type: 'incoming_call',
              fromUserId: userId,
              callType,
              callId
            }));
          }
        }
        
        // Handle call response
        else if (data.type === 'call_response' && userId) {
          const { targetUserId, accepted, callId } = data;
          const targetConnection = wsConnections.get(targetUserId);
          
          if (targetConnection && targetConnection.readyState === WebSocket.OPEN) {
            targetConnection.send(JSON.stringify({
              type: 'call_response',
              fromUserId: userId,
              accepted,
              callId
            }));
          }
        }
        
        // Handle call end
        else if (data.type === 'end_call' && userId) {
          const { targetUserId, callId } = data;
          const targetConnection = wsConnections.get(targetUserId);
          
          if (targetConnection && targetConnection.readyState === WebSocket.OPEN) {
            targetConnection.send(JSON.stringify({
              type: 'call_ended',
              fromUserId: userId,
              callId
            }));
          }
        }
        
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (userId) {
        wsConnections.delete(userId);
        console.log(`WebSocket disconnected for user: ${userId}`);
      }
    });
  });

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Screening routes
  app.get("/api/screening/questions/:type", async (req, res) => {
    try {
      const { type } = req.params;
      if (type !== "PHQ9" && type !== "GAD7") {
        return res.status(400).json({ message: "Invalid screening type" });
      }
      
      const questions = ScreeningService.getScreeningQuestions(type);
      const options = ScreeningService.getResponseOptions();
      
      res.json({ questions, options });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/screening/submit", async (req, res) => {
    try {
      const assessmentData = insertScreeningAssessmentSchema.parse(req.body);
      
      // Calculate score based on type
      let result;
      if (assessmentData.type === "PHQ9") {
        result = ScreeningService.calculatePHQ9Score(assessmentData.responses as number[]);
      } else if (assessmentData.type === "GAD7") {
        result = ScreeningService.calculateGAD7Score(assessmentData.responses as number[]);
      } else {
        return res.status(400).json({ message: "Invalid screening type" });
      }

      // Save assessment
      const assessment = await storage.createScreeningAssessment({
        ...assessmentData,
        totalScore: result.totalScore,
        riskLevel: result.riskLevel,
        isHighRisk: result.isHighRisk,
      });

      // Check for crisis intervention
      await CrisisService.evaluateScreeningResult(
        assessmentData.userId,
        assessmentData.type,
        result.totalScore,
        result.isHighRisk,
        result.isCrisis
      );

      res.json({ assessment, result });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/screening/history/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { type } = req.query;
      
      const history = await storage.getUserScreeningHistory(userId, type as string);
      res.json(history);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Chat routes
  app.post("/api/chat/session", async (req, res) => {
    try {
      const { userId } = req.body;
      const session = await storage.createChatSession(userId);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/chat/session/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.getChatSession(id);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/chat/guided-exercise", async (req, res) => {
    try {
      const { type } = req.body;
      const steps = await aiService.generateGuidedExercise(type);
      res.json({ steps });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Custom AI Personality Routes
  app.post("/api/chat/custom-personality", upload.single('file'), async (req, res) => {
    try {
      const { userId, name, description, chatData } = req.body;
      const file = req.file;
      
      let trainingData = '';
      let sourceType = 'text';
      let originalFileName = '';
      
      // Process file if uploaded
      if (file) {
        trainingData = await processUploadedFile(file);
        sourceType = 'file';
        originalFileName = file.originalname;
      } else if (chatData) {
        trainingData = chatData;
        sourceType = 'text';
      } else {
        return res.status(400).json({ message: "Either file or chat data is required" });
      }
      
      // Create and train local AI service
      const localAI = new LocalAIService();
      localAI.learnFromChat(trainingData);
      
      const personalityInfo = localAI.getPersonalityInfo();
      let customPrompt = '';
      
      if (personalityInfo) {
        customPrompt = `Trained Local AI with personality traits:
Name: ${personalityInfo.name}
Common Phrases: ${personalityInfo.commonPhrases.join(', ')}
Communication Style: Uses ${personalityInfo.communicationStyle.emojis.join(' ')} emojis
Response Patterns: ${personalityInfo.responsePatterns.length} learned patterns
Topics: ${Array.from(personalityInfo.topics.keys()).join(', ')}

This AI has learned from real conversation patterns and will respond authentically based on the training data.`;
      } else {
        customPrompt = `Local AI trained on conversation data but no patterns were detected. Will use default supportive responses.`;
      }

      // Check if user exists, if not create a basic user record
      let user = await storage.getUser(userId);
      if (!user) {
        // Create a basic user record with the specified userId
        try {
          // Use raw database insert to specify the ID
          const [basicUser] = await db().insert(users).values({
            id: userId,
            username: `user-${userId.substring(0, 8)}`,
            email: `user-${userId}@temp.com`,
            password: 'temp-password',
            firstName: 'User',
            lastName: '',
            institution: 'Unknown',
            course: 'Unknown',
            year: 1
          }).returning();
          console.log('Created basic user record for custom personality');
          user = basicUser;
        } catch (err) {
          console.error('Failed to create user:', err);
          return res.status(500).json({ message: "Failed to create user account" });
        }
      }

      // Validate input
      const personalityData = insertCustomPersonalitySchema.parse({
        userId,
        name: name || (personalityInfo?.name || "Custom AI"),
        description: description || "AI trained locally on uploaded conversations - no external APIs needed!",
        customPrompt,
        sourceType,
        originalFileName,
        trainingData
      });

      // Save to database
      const personality = await storage.createCustomPersonality(personalityData);
      
      res.json({ success: true, personality });
    } catch (error: any) {
      console.error("Error creating custom personality:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/chat/custom-personalities/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Get custom personalities for user from database
      const personalities = await storage.getUserCustomPersonalities(userId);
      
      res.json(personalities);
    } catch (error: any) {
      console.error("Error fetching custom personalities:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/chat/custom-personality/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      await storage.deleteCustomPersonality(id, userId);
      
      res.json({ success: true, message: "Custom personality deleted" });
    } catch (error: any) {
      console.error("Error deleting custom personality:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // Counselor and appointment routes
  app.get("/api/counselors", async (req, res) => {
    try {
      const counselors = await storage.getCounselors();
      res.json(counselors);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      res.json(appointment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/appointments/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const appointments = await storage.getUserAppointments(userId);
      res.json(appointments);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Forum routes
  app.get("/api/forum/posts", async (req, res) => {
    try {
      const { category } = req.query;
      const posts = await storage.getForumPosts(category as string);
      res.json(posts);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/forum/posts", async (req, res) => {
    try {
      const postData = insertForumPostSchema.parse(req.body);
      const post = await storage.createForumPost(postData);
      res.json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/forum/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const post = await storage.getForumPostWithReplies(id);
      res.json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/forum/posts/:id/replies", async (req, res) => {
    try {
      const { id } = req.params;
      const replyData = insertForumReplySchema.parse({
        ...req.body,
        postId: id
      });
      const reply = await storage.createForumReply(replyData);
      res.json(reply);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/forum/posts/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.likeForumPost(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Resources routes
  app.get("/api/resources", async (req, res) => {
    try {
      const { category, language } = req.query;
      const resources = await storage.getResources(category as string, language as string);
      res.json(resources);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/resources/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const resource = await storage.getResourceById(id);
      
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      res.json(resource);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/resources/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.likeResource(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Mood tracking routes
  app.post("/api/mood", async (req, res) => {
    try {
      const moodData = insertMoodEntrySchema.parse(req.body);
      const mood = await storage.createMoodEntry(moodData);
      res.json(mood);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/mood/history/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { days } = req.query;
      const history = await storage.getUserMoodHistory(userId, days ? parseInt(days as string) : 7);
      res.json(history);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Crisis management routes
  app.get("/api/crisis/resources", async (req, res) => {
    try {
      const resources = await CrisisService.getCrisisResources();
      res.json(resources);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/crisis/alerts", async (req, res) => {
    try {
      const alerts = await storage.getActiveCrisisAlerts();
      res.json(alerts);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/crisis/alerts/:id/resolve", async (req, res) => {
    try {
      const { id } = req.params;
      const { resolvedBy, notes } = req.body;
      
      await CrisisService.resolveCrisisAlert(id, resolvedBy, notes);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Peer Calling Routes
  app.get("/api/peer-calling/available-peers/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Mock available peers with anxiety compatibility
      const mockPeers = [
        {
          id: "peer-1",
          firstName: "Anonymous",
          lastName: "Student",
          institution: "Delhi University",
          year: 2,
          anxietyLevel: "moderate",
          isOnline: true,
          matchScore: 92,
          languages: ["English", "Hindi"],
          interests: ["Study stress", "Social anxiety"],
          lastOnline: new Date().toISOString(),
        },
        {
          id: "peer-2", 
          firstName: "Anonymous",
          lastName: "Peer",
          institution: "IIT Mumbai",
          year: 3,
          anxietyLevel: "high",
          isOnline: true,
          matchScore: 87,
          languages: ["English", "Marathi"],
          interests: ["Exam stress", "Career anxiety"],
          lastOnline: new Date().toISOString(),
        },
        {
          id: "peer-3",
          firstName: "Anonymous",
          lastName: "Helper",
          institution: "Chennai College",
          year: 1,
          anxietyLevel: "mild",
          isOnline: true,
          matchScore: 78,
          languages: ["English", "Tamil"],
          interests: ["Social anxiety", "Family pressure"],
          lastOnline: new Date().toISOString(),
        }
      ];
      
      res.json(mockPeers);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/peer-calling/find-peer", async (req, res) => {
    try {
      const { userId, type, anxietyLevel } = req.body;
      
      // Simulate finding a peer
      setTimeout(() => {
        const mockSession = {
          sessionId: `session-${Date.now()}`,
          partnerId: `peer-${Math.floor(Math.random() * 1000)}`,
          partnerName: "Anonymous Student",
          type: type,
        };
        
        res.json(mockSession);
      }, 1000); // Simulate search time
      
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/peer-calling/end-call/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      // Mock ending call
      res.json({ 
        success: true, 
        message: "Call ended successfully",
        duration: Math.floor(Math.random() * 30) + 5 // 5-35 minutes
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/peer-calling/history/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Mock call history
      const mockHistory = [
        {
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
          duration: 15,
          type: "audio",
          partnerId: "anonymous",
        },
        {
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          duration: 22,
          type: "video", 
          partnerId: "anonymous",
        },
        {
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
          duration: 8,
          type: "audio",
          partnerId: "anonymous",
        }
      ];
      
      res.json(mockHistory);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Analytics routes (admin only)
  app.get("/api/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Local music file management
  app.get("/api/local-music/scan", async (req, res) => {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const musicDir = path.resolve(process.cwd(), 'attached_assets/local_music');
      
      try {
        const files = await fs.readdir(musicDir);
        const musicFiles = files
          .filter(file => /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(file))
          .map(file => ({
            name: file,
            duration: "0:00" // In real implementation, would extract from file metadata
          }));
        
        res.json(musicFiles);
      } catch (dirError) {
        // Directory doesn't exist or is empty
        res.json([]);
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error scanning music files" });
    }
  });

  // Configure multer for music file uploads
  const musicUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'attached_assets/local_music/');
      },
      filename: (req, file, cb) => {
        // Keep original filename but ensure it's safe
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, safeName);
      }
    }),
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit for music files
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/aac', 'audio/ogg', 'audio/flac'];
      if (allowedTypes.includes(file.mimetype) || /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(file.originalname)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only audio files are allowed.'));
      }
    }
  });

  app.post("/api/local-music/upload", musicUpload.single('musicFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No music file provided' });
      }

      const file_url = `/attached_assets/local_music/${req.file.filename}`;
      
      res.json({
        message: 'Music file uploaded successfully',
        file_url,
        file_name: req.file.filename,
        original_name: req.file.originalname
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Medicine alarm routes
  app.get("/api/medicine-alarms", async (req, res) => {
    try {
      const userId = req.query.userId as string || "d3025d97-c8b5-4b96-a170-a98c88a0b98b"; // Mock user ID for now
      const alarms = await storage.getUserMedicineAlarms(userId);
      res.json(alarms);
    } catch (error: any) {
      console.error("Error fetching medicine alarms:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/medicine-alarms", async (req, res) => {
    try {
      const validatedData = insertMedicineAlarmSchema.parse(req.body);
      const alarm = await storage.createMedicineAlarm({
        ...validatedData,
        userId: validatedData.userId || "d3025d97-c8b5-4b96-a170-a98c88a0b98b"
      });
      res.json(alarm);
    } catch (error: any) {
      console.error("Error creating medicine alarm:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/medicine-alarms/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const alarm = await storage.updateMedicineAlarm(id, req.body);
      res.json(alarm);
    } catch (error: any) {
      console.error("Error updating medicine alarm:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/medicine-alarms/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteMedicineAlarm(id);
      res.json({ message: "Medicine alarm deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting medicine alarm:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // Skills routes
  app.get("/api/skills", async (req, res) => {
    try {
      const userId = req.query.userId as string || "d3025d97-c8b5-4b96-a170-a98c88a0b98b"; // Mock user ID for now
      const skills = await storage.getUserSkills(userId);
      res.json(skills);
    } catch (error: any) {
      console.error("Error fetching skills:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/skills", async (req, res) => {
    try {
      const validatedData = insertUserSkillSchema.parse(req.body);
      const skill = await storage.createUserSkill({
        ...validatedData,
        userId: validatedData.userId || "d3025d97-c8b5-4b96-a170-a98c88a0b98b"
      });
      res.json(skill);
    } catch (error: any) {
      console.error("Error creating skill:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/skills/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const skill = await storage.updateUserSkill(id, req.body);
      res.json(skill);
    } catch (error: any) {
      console.error("Error updating skill:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/skills/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteUserSkill(id);
      res.json({ message: "Skill deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting skill:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // Skill showcase routes
  app.get("/api/skill-showcases", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (userId) {
        const showcases = await storage.getUserSkillShowcases(userId);
        res.json(showcases);
      } else {
        const showcases = await storage.getAllSkillShowcases();
        res.json(showcases);
      }
    } catch (error: any) {
      console.error("Error fetching skill showcases:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/skill-showcases", async (req, res) => {
    try {
      const validatedData = insertSkillShowcaseSchema.parse(req.body);
      const showcase = await storage.createSkillShowcase({
        ...validatedData,
        userId: validatedData.userId || "d3025d97-c8b5-4b96-a170-a98c88a0b98b"
      });
      res.json(showcase);
    } catch (error: any) {
      console.error("Error creating skill showcase:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/skill-showcases/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const showcase = await storage.updateSkillShowcase(id, req.body);
      res.json(showcase);
    } catch (error: any) {
      console.error("Error updating skill showcase:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/skill-showcases/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSkillShowcase(id);
      res.json({ message: "Skill showcase deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting skill showcase:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/skills/:skillId/endorse", async (req, res) => {
    try {
      const { skillId } = req.params;
      const validatedData = insertSkillEndorsementSchema.parse({
        ...req.body,
        skillId,
      });
      const endorsement = await storage.createSkillEndorsement({
        ...validatedData,
        endorserId: validatedData.endorserId || "d3025d97-c8b5-4b96-a170-a98c88a0b98b"
      });
      res.json(endorsement);
    } catch (error: any) {
      console.error("Error endorsing skill:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/skill-showcases/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.likeSkillShowcase(id);
      res.json({ message: "Showcase liked successfully" });
    } catch (error: any) {
      console.error("Error liking showcase:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // Coin management routes
  app.get("/api/coins/transactions/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const transactions = await storage.getUserCoinTransactions(userId, limit);
      res.json(transactions);
    } catch (error: any) {
      console.error("Error fetching coin transactions:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/coins/balance/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const balance = await storage.getUserCoinBalance(userId);
      res.json({ balance });
    } catch (error: any) {
      console.error("Error fetching coin balance:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/coins/add", async (req, res) => {
    try {
      const { userId, amount, type, description, relatedEntityId } = req.body;
      
      if (!userId || !amount || !type || !description) {
        return res.status(400).json({ message: "UserId, amount, type, and description are required" });
      }

      const transaction = await storage.addCoins(userId, amount, type, description, relatedEntityId);
      res.json(transaction);
    } catch (error: any) {
      console.error("Error adding coins:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // Live sessions routes
  app.get("/api/live-sessions", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (userId) {
        const sessions = await storage.getUserLiveSessions(userId);
        res.json(sessions);
      } else {
        const sessions = await storage.getAllLiveSessions();
        res.json(sessions);
      }
    } catch (error: any) {
      console.error("Error fetching live sessions:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/live-sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.getLiveSessionById(id);
      if (!session) {
        return res.status(404).json({ message: "Live session not found" });
      }
      res.json(session);
    } catch (error: any) {
      console.error("Error fetching live session:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/live-sessions", async (req, res) => {
    try {
      const sessionData = {
        ...req.body,
        userId: req.body.userId || "d3025d97-c8b5-4b96-a170-a98c88a0b98b"
      };
      const session = await storage.createLiveSession(sessionData);
      res.json(session);
    } catch (error: any) {
      console.error("Error creating live session:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/live-sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.updateLiveSession(id, req.body);
      res.json(session);
    } catch (error: any) {
      console.error("Error updating live session:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/live-sessions/:id/start", async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.startLiveSession(id);
      res.json(session);
    } catch (error: any) {
      console.error("Error starting live session:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/live-sessions/:id/end", async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.endLiveSession(id);
      res.json(session);
    } catch (error: any) {
      console.error("Error ending live session:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/live-sessions/:id/join", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.incrementSessionViewers(id);
      res.json({ message: "Joined session successfully" });
    } catch (error: any) {
      console.error("Error joining live session:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/live-sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteLiveSession(id);
      res.json({ message: "Live session deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting live session:", error);
      res.status(400).json({ message: error.message });
    }
  });

  return httpServer;
}
