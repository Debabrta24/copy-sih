export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  institution: string;
  course: string;
  year: number;
  language: string;
  isAdmin: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  riskLevel?: 'low' | 'moderate' | 'high';
}

export interface ScreeningResult {
  id: string;
  type: 'PHQ9' | 'GAD7';
  score: number;
  riskLevel: 'minimal' | 'mild' | 'moderate' | 'severe';
  completedAt: Date;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  category: string;
  likes: number;
  replies: number;
  isAnonymous: boolean;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'audio' | 'guide';
  category: string;
  url?: string;
  content: string;
  durationMinutes: number;
  language: string;
  likes: number;
  isOfflineAvailable: boolean;
}

export interface Counselor {
  id: string;
  name: string;
  specialization: string;
  languages: string[];
  experienceYears: number;
  rating: number;
  isAvailable: boolean;
  availableSlots: { day: string; times: string[] }[];
}

export interface Appointment {
  id: string;
  counselorId: string;
  userId: string;
  scheduledTime: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'video' | 'phone' | 'chat';
  notes?: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  moodLevel: number;
  moodType: string;
  notes?: string;
  date: Date;
}