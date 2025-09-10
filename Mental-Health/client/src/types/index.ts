export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  institution: string;
  course?: string;
  year?: number;
  language: string;
  isAdmin: boolean;
  coins?: number;
}

export interface ScreeningAssessment {
  id: string;
  userId: string;
  type: "PHQ9" | "GAD7";
  responses: number[];
  totalScore: number;
  riskLevel: "minimal" | "mild" | "moderate" | "moderately-severe" | "severe";
  isHighRisk: boolean;
  completedAt: Date;
}

export interface ScreeningQuestion {
  id: number;
  text: string;
}

export interface ScreeningResult {
  totalScore: number;
  riskLevel: string;
  isHighRisk: boolean;
  recommendations: string[];
  isCrisis: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  startedAt: Date;
  endedAt?: Date;
  isActive: boolean;
}

export interface Counselor {
  id: string;
  name: string;
  specialization: string;
  languages: string[];
  experience: number;
  rating: number;
  isAvailable: boolean;
  availableSlots: string[];
}

export interface Appointment {
  id: string;
  userId: string;
  counselorId: string;
  sessionType: "individual" | "group" | "crisis";
  scheduledFor: Date;
  duration: number;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  notes?: string;
  createdAt: Date;
}

export interface ForumPost {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  isAnonymous: boolean;
  likes: number;
  createdAt: Date;
  replies?: ForumReply[];
}

export interface ForumReply {
  id: string;
  postId: string;
  userId: string;
  content: string;
  isAnonymous: boolean;
  likes: number;
  createdAt: Date;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: "video" | "article" | "audio" | "guide";
  category: string;
  url?: string;
  content?: string;
  duration?: number;
  language: string;
  likes: number;
  isOfflineAvailable: boolean;
}

export interface MoodEntry {
  id: string;
  userId: string;
  moodLevel: number;
  moodType: string;
  notes?: string;
  date: Date;
}

export interface CrisisAlert {
  id: string;
  userId: string;
  triggerType: "screening" | "chat" | "manual";
  severity: "high" | "critical";
  isResolved: boolean;
  createdAt: Date;
}

export interface Analytics {
  activeUsers: number;
  screeningsCompleted: number;
  counselingSessions: number;
  highRiskAlerts: number;
  riskDistribution: Array<{
    riskLevel: string;
    count: number;
  }>;
}
