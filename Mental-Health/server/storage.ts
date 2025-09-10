import {
  users,
  screeningAssessments,
  appointments,
  forumPosts,
  forumReplies,
  resources,
  moodEntries,
  crisisAlerts,
  counselors,
  chatSessions,
  customPersonalities,
  coinTransactions,
  medicineAlarms,
  userSkills,
  skillShowcases,
  skillEndorsements,
  liveSessions,
  type User,
  type InsertUser,
  type ScreeningAssessment,
  type InsertScreeningAssessment,
  type Appointment,
  type InsertAppointment,
  type ForumPost,
  type InsertForumPost,
  type ForumReply,
  type InsertForumReply,
  type Resource,
  type InsertResource,
  type MoodEntry,
  type InsertMoodEntry,
  type CrisisAlert,
  type InsertCrisisAlert,
  type Counselor,
  type ChatSession,
  type CustomPersonality,
  type InsertCustomPersonality,
  type CoinTransaction,
  type InsertCoinTransaction,
  type MedicineAlarm,
  type InsertMedicineAlarm,
  type UserSkill,
  type InsertUserSkill,
  type SkillShowcase,
  type InsertSkillShowcase,
  type SkillEndorsement,
  type InsertSkillEndorsement,
  type LiveSession,
  type InsertLiveSession,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql, count } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;

  // Screening assessments
  createScreeningAssessment(assessment: InsertScreeningAssessment): Promise<ScreeningAssessment>;
  getUserScreeningHistory(userId: string, type?: string): Promise<ScreeningAssessment[]>;
  getLatestScreening(userId: string, type: string): Promise<ScreeningAssessment | undefined>;

  // Appointments
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getUserAppointments(userId: string): Promise<Appointment[]>;
  getCounselorAppointments(counselorId: string): Promise<Appointment[]>;
  updateAppointmentStatus(id: string, status: string): Promise<Appointment>;
  getCounselors(): Promise<Counselor[]>;

  // Forum
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  getForumPosts(category?: string): Promise<ForumPost[]>;
  getForumPostWithReplies(postId: string): Promise<ForumPost & { replies: ForumReply[] }>;
  createForumReply(reply: InsertForumReply): Promise<ForumReply>;
  likeForumPost(postId: string): Promise<void>;
  flagForumPost(postId: string): Promise<void>;

  // Resources
  getResources(category?: string, language?: string): Promise<Resource[]>;
  getResourceById(id: string): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  createResourcesBulk(resources: InsertResource[]): Promise<Resource[]>;
  likeResource(id: string): Promise<void>;

  // Mood tracking
  createMoodEntry(mood: InsertMoodEntry): Promise<MoodEntry>;
  getUserMoodHistory(userId: string, days?: number): Promise<MoodEntry[]>;

  // Crisis management
  createCrisisAlert(alert: InsertCrisisAlert): Promise<CrisisAlert>;
  getActiveCrisisAlerts(): Promise<CrisisAlert[]>;
  resolveCrisisAlert(id: string, resolvedBy: string, notes?: string): Promise<CrisisAlert>;

  // Chat sessions
  createChatSession(userId: string): Promise<ChatSession>;
  updateChatSession(id: string, messages: any[]): Promise<ChatSession>;
  getChatSession(id: string): Promise<ChatSession | undefined>;

  // Custom AI Personalities
  createCustomPersonality(personality: InsertCustomPersonality): Promise<CustomPersonality>;
  getUserCustomPersonalities(userId: string): Promise<CustomPersonality[]>;
  updateCustomPersonality(id: string, updates: Partial<CustomPersonality>): Promise<CustomPersonality>;
  deleteCustomPersonality(id: string, userId: string): Promise<void>;

  // Coin management
  addCoins(userId: string, amount: number, type: string, description: string, relatedEntityId?: string): Promise<CoinTransaction>;
  getUserCoinTransactions(userId: string, limit?: number): Promise<CoinTransaction[]>;
  getUserCoinBalance(userId: string): Promise<number>;

  // Medicine alarms
  createMedicineAlarm(alarm: InsertMedicineAlarm): Promise<MedicineAlarm>;
  getUserMedicineAlarms(userId: string): Promise<MedicineAlarm[]>;
  updateMedicineAlarm(id: string, updates: Partial<MedicineAlarm>): Promise<MedicineAlarm>;
  deleteMedicineAlarm(id: string): Promise<void>;

  // User skills
  createUserSkill(skill: InsertUserSkill): Promise<UserSkill>;
  getUserSkills(userId: string): Promise<UserSkill[]>;
  updateUserSkill(id: string, updates: Partial<UserSkill>): Promise<UserSkill>;
  deleteUserSkill(id: string): Promise<void>;

  // Skill showcases
  createSkillShowcase(showcase: InsertSkillShowcase): Promise<SkillShowcase>;
  getUserSkillShowcases(userId: string): Promise<SkillShowcase[]>;
  getAllSkillShowcases(): Promise<SkillShowcase[]>;
  updateSkillShowcase(id: string, updates: Partial<SkillShowcase>): Promise<SkillShowcase>;
  deleteSkillShowcase(id: string): Promise<void>;
  likeSkillShowcase(id: string): Promise<void>;

  // Skill endorsements
  createSkillEndorsement(endorsement: InsertSkillEndorsement): Promise<SkillEndorsement>;

  // Live sessions
  createLiveSession(session: InsertLiveSession): Promise<LiveSession>;
  getUserLiveSessions(userId: string): Promise<LiveSession[]>;
  getAllLiveSessions(): Promise<LiveSession[]>;
  getLiveSessionById(id: string): Promise<LiveSession | undefined>;
  updateLiveSession(id: string, updates: Partial<LiveSession>): Promise<LiveSession>;
  deleteLiveSession(id: string): Promise<void>;
  startLiveSession(id: string): Promise<LiveSession>;
  endLiveSession(id: string): Promise<LiveSession>;
  incrementSessionViewers(id: string): Promise<void>;

  // Analytics (anonymized)
  getAnalytics(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db().select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db().select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db().select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db().insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db()
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createScreeningAssessment(assessment: InsertScreeningAssessment): Promise<ScreeningAssessment> {
    const [result] = await db()
      .insert(screeningAssessments)
      .values(assessment)
      .returning();
    return result;
  }

  async getUserScreeningHistory(userId: string, type?: string): Promise<ScreeningAssessment[]> {
    let query = db()
      .select()
      .from(screeningAssessments)
      .where(eq(screeningAssessments.userId, userId))
      .orderBy(desc(screeningAssessments.completedAt));
    
    if (type) {
      query = db()
        .select()
        .from(screeningAssessments)
        .where(and(eq(screeningAssessments.userId, userId), eq(screeningAssessments.type, type)))
        .orderBy(desc(screeningAssessments.completedAt));
    }
    
    return await query;
  }

  async getLatestScreening(userId: string, type: string): Promise<ScreeningAssessment | undefined> {
    const [result] = await db()
      .select()
      .from(screeningAssessments)
      .where(and(eq(screeningAssessments.userId, userId), eq(screeningAssessments.type, type)))
      .orderBy(desc(screeningAssessments.completedAt))
      .limit(1);
    
    return result || undefined;
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [result] = await db().insert(appointments).values(appointment).returning();
    return result;
  }

  async getUserAppointments(userId: string): Promise<Appointment[]> {
    return await db()
      .select()
      .from(appointments)
      .where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.scheduledFor));
  }

  async getCounselorAppointments(counselorId: string): Promise<Appointment[]> {
    return await db()
      .select()
      .from(appointments)
      .where(eq(appointments.counselorId, counselorId))
      .orderBy(desc(appointments.scheduledFor));
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    const [appointment] = await db()
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    return appointment;
  }

  async getCounselors(): Promise<Counselor[]> {
    return await db().select().from(counselors).where(eq(counselors.isAvailable, true));
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [result] = await db().insert(forumPosts).values(post).returning();
    return result;
  }

  async getForumPosts(category?: string): Promise<ForumPost[]> {
    let query = db()
      .select()
      .from(forumPosts)
      .where(eq(forumPosts.isModerated, true))
      .orderBy(desc(forumPosts.createdAt));
    
    if (category) {
      query = db()
        .select()
        .from(forumPosts)
        .where(and(eq(forumPosts.category, category), eq(forumPosts.isModerated, true)))
        .orderBy(desc(forumPosts.createdAt));
    }
    
    return await query;
  }

  async getForumPostWithReplies(postId: string): Promise<ForumPost & { replies: ForumReply[] }> {
    const [post] = await db().select().from(forumPosts).where(eq(forumPosts.id, postId));
    const replies = await db()
      .select()
      .from(forumReplies)
      .where(eq(forumReplies.postId, postId))
      .orderBy(forumReplies.createdAt);
    
    return { ...post, replies };
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    const [result] = await db().insert(forumReplies).values(reply).returning();
    return result;
  }

  async likeForumPost(postId: string): Promise<void> {
    await db()
      .update(forumPosts)
      .set({ likes: sql`${forumPosts.likes} + 1` })
      .where(eq(forumPosts.id, postId));
  }

  async flagForumPost(postId: string): Promise<void> {
    await db()
      .update(forumPosts)
      .set({ isFlagged: true })
      .where(eq(forumPosts.id, postId));
  }

  async getResources(category?: string, language?: string): Promise<Resource[]> {
    const conditions = [];
    if (category) conditions.push(eq(resources.category, category));
    if (language) conditions.push(eq(resources.language, language));
    
    if (conditions.length > 0) {
      return await db()
        .select()
        .from(resources)
        .where(and(...conditions))
        .orderBy(desc(resources.likes));
    }
    
    return await db()
      .select()
      .from(resources)
      .orderBy(desc(resources.likes));
  }

  async getResourceById(id: string): Promise<Resource | undefined> {
    const [resource] = await db().select().from(resources).where(eq(resources.id, id));
    return resource || undefined;
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [result] = await db().insert(resources).values(resource).returning();
    return result;
  }

  async createResourcesBulk(resourcesData: InsertResource[]): Promise<Resource[]> {
    const results = await db().insert(resources).values(resourcesData).returning();
    return results;
  }

  async likeResource(id: string): Promise<void> {
    await db()
      .update(resources)
      .set({ likes: sql`${resources.likes} + 1` })
      .where(eq(resources.id, id));
  }

  async createMoodEntry(mood: InsertMoodEntry): Promise<MoodEntry> {
    const [result] = await db().insert(moodEntries).values(mood).returning();
    return result;
  }

  async getUserMoodHistory(userId: string, days: number = 7): Promise<MoodEntry[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    return await db()
      .select()
      .from(moodEntries)
      .where(and(eq(moodEntries.userId, userId), gte(moodEntries.date, since)))
      .orderBy(moodEntries.date);
  }

  async createCrisisAlert(alert: InsertCrisisAlert): Promise<CrisisAlert> {
    const [result] = await db().insert(crisisAlerts).values(alert).returning();
    return result;
  }

  async getActiveCrisisAlerts(): Promise<CrisisAlert[]> {
    return await db()
      .select()
      .from(crisisAlerts)
      .where(eq(crisisAlerts.isResolved, false))
      .orderBy(desc(crisisAlerts.createdAt));
  }

  async resolveCrisisAlert(id: string, resolvedBy: string, notes?: string): Promise<CrisisAlert> {
    const [alert] = await db()
      .update(crisisAlerts)
      .set({
        isResolved: true,
        resolvedBy,
        notes,
        resolvedAt: new Date(),
      })
      .where(eq(crisisAlerts.id, id))
      .returning();
    return alert;
  }

  async createChatSession(userId: string): Promise<ChatSession> {
    const [session] = await db()
      .insert(chatSessions)
      .values({ userId, messages: [] })
      .returning();
    return session;
  }

  async updateChatSession(id: string, messages: any[]): Promise<ChatSession> {
    const [session] = await db()
      .update(chatSessions)
      .set({ messages })
      .where(eq(chatSessions.id, id))
      .returning();
    return session;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    const [session] = await db().select().from(chatSessions).where(eq(chatSessions.id, id));
    return session || undefined;
  }

  async createCustomPersonality(personality: InsertCustomPersonality): Promise<CustomPersonality> {
    const [result] = await db().insert(customPersonalities).values(personality).returning();
    return result;
  }

  async getUserCustomPersonalities(userId: string): Promise<CustomPersonality[]> {
    return await db()
      .select()
      .from(customPersonalities)
      .where(and(eq(customPersonalities.userId, userId), eq(customPersonalities.isActive, true)))
      .orderBy(desc(customPersonalities.createdAt));
  }

  async updateCustomPersonality(id: string, updates: Partial<CustomPersonality>): Promise<CustomPersonality> {
    const [personality] = await db()
      .update(customPersonalities)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(customPersonalities.id, id))
      .returning();
    return personality;
  }

  async deleteCustomPersonality(id: string, userId: string): Promise<void> {
    await db()
      .update(customPersonalities)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(customPersonalities.id, id), eq(customPersonalities.userId, userId)));
  }

  async addCoins(userId: string, amount: number, type: string, description: string, relatedEntityId?: string): Promise<CoinTransaction> {
    // Create transaction record
    const [transaction] = await db()
      .insert(coinTransactions)
      .values({
        userId,
        amount,
        type,
        description,
        relatedEntityId: relatedEntityId || null,
      })
      .returning();

    // Update user's coin balance
    await db()
      .update(users)
      .set({ 
        coins: sql`${users.coins} + ${amount}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    return transaction;
  }

  async getUserCoinTransactions(userId: string, limit: number = 50): Promise<CoinTransaction[]> {
    return await db()
      .select()
      .from(coinTransactions)
      .where(eq(coinTransactions.userId, userId))
      .orderBy(desc(coinTransactions.createdAt))
      .limit(limit);
  }

  async getUserCoinBalance(userId: string): Promise<number> {
    const [user] = await db()
      .select({ coins: users.coins })
      .from(users)
      .where(eq(users.id, userId));
    
    return user?.coins || 0;
  }

  async getAnalytics(): Promise<any> {
    // Anonymized analytics for institutional insights
    const [activeUsersCount] = await db()
      .select({ count: count() })
      .from(users)
      .where(gte(users.updatedAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))); // Last 30 days

    const [screeningsThisMonth] = await db()
      .select({ count: count() })
      .from(screeningAssessments)
      .where(gte(screeningAssessments.completedAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)));

    const [appointmentsCount] = await db()
      .select({ count: count() })
      .from(appointments)
      .where(gte(appointments.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)));

    const [crisisAlertsCount] = await db()
      .select({ count: count() })
      .from(crisisAlerts)
      .where(eq(crisisAlerts.isResolved, false));

    // Risk level distribution
    const riskDistribution = await db()
      .select({
        riskLevel: screeningAssessments.riskLevel,
        count: count(),
      })
      .from(screeningAssessments)
      .where(gte(screeningAssessments.completedAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)))
      .groupBy(screeningAssessments.riskLevel);

    return {
      activeUsers: activeUsersCount.count,
      screeningsCompleted: screeningsThisMonth.count,
      counselingSessions: appointmentsCount.count,
      highRiskAlerts: crisisAlertsCount.count,
      riskDistribution,
    };
  }

  // Medicine alarm methods
  async createMedicineAlarm(alarm: InsertMedicineAlarm): Promise<MedicineAlarm> {
    const [result] = await db()
      .insert(medicineAlarms)
      .values(alarm)
      .returning();
    return result;
  }

  async getUserMedicineAlarms(userId: string): Promise<MedicineAlarm[]> {
    return await db()
      .select()
      .from(medicineAlarms)
      .where(eq(medicineAlarms.userId, userId))
      .orderBy(desc(medicineAlarms.createdAt));
  }

  async updateMedicineAlarm(id: string, updates: Partial<MedicineAlarm>): Promise<MedicineAlarm> {
    const [alarm] = await db()
      .update(medicineAlarms)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(medicineAlarms.id, id))
      .returning();
    return alarm;
  }

  async deleteMedicineAlarm(id: string): Promise<void> {
    await db()
      .delete(medicineAlarms)
      .where(eq(medicineAlarms.id, id));
  }

  // User skills methods
  async createUserSkill(skill: InsertUserSkill): Promise<UserSkill> {
    const [result] = await db()
      .insert(userSkills)
      .values(skill)
      .returning();
    return result;
  }

  async getUserSkills(userId: string): Promise<UserSkill[]> {
    return await db()
      .select()
      .from(userSkills)
      .where(eq(userSkills.userId, userId))
      .orderBy(desc(userSkills.createdAt));
  }

  async updateUserSkill(id: string, updates: Partial<UserSkill>): Promise<UserSkill> {
    const [skill] = await db()
      .update(userSkills)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userSkills.id, id))
      .returning();
    return skill;
  }

  async deleteUserSkill(id: string): Promise<void> {
    await db()
      .delete(userSkills)
      .where(eq(userSkills.id, id));
  }

  // Skill showcases methods
  async createSkillShowcase(showcase: InsertSkillShowcase): Promise<SkillShowcase> {
    const [result] = await db()
      .insert(skillShowcases)
      .values(showcase)
      .returning();
    return result;
  }

  async getUserSkillShowcases(userId: string): Promise<SkillShowcase[]> {
    return await db()
      .select()
      .from(skillShowcases)
      .where(eq(skillShowcases.userId, userId))
      .orderBy(desc(skillShowcases.createdAt));
  }

  async getAllSkillShowcases(): Promise<SkillShowcase[]> {
    return await db()
      .select()
      .from(skillShowcases)
      .orderBy(desc(skillShowcases.createdAt));
  }

  async updateSkillShowcase(id: string, updates: Partial<SkillShowcase>): Promise<SkillShowcase> {
    const [showcase] = await db()
      .update(skillShowcases)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(skillShowcases.id, id))
      .returning();
    return showcase;
  }

  async deleteSkillShowcase(id: string): Promise<void> {
    await db()
      .delete(skillShowcases)
      .where(eq(skillShowcases.id, id));
  }

  async likeSkillShowcase(id: string): Promise<void> {
    await db()
      .update(skillShowcases)
      .set({ 
        likes: sql`${skillShowcases.likes} + 1`,
        updatedAt: new Date()
      })
      .where(eq(skillShowcases.id, id));
  }

  // Skill endorsements methods
  async createSkillEndorsement(endorsement: InsertSkillEndorsement): Promise<SkillEndorsement> {
    // First create the endorsement
    const [result] = await db()
      .insert(skillEndorsements)
      .values(endorsement)
      .returning();

    // Then increment the endorsement count on the skill
    await db()
      .update(userSkills)
      .set({ 
        endorsements: sql`${userSkills.endorsements} + 1`,
        updatedAt: new Date()
      })
      .where(eq(userSkills.id, endorsement.skillId));

    return result;
  }

  // Live sessions methods
  async createLiveSession(session: InsertLiveSession): Promise<LiveSession> {
    const [result] = await db()
      .insert(liveSessions)
      .values(session)
      .returning();
    return result;
  }

  async getUserLiveSessions(userId: string): Promise<LiveSession[]> {
    return await db()
      .select()
      .from(liveSessions)
      .where(eq(liveSessions.userId, userId))
      .orderBy(desc(liveSessions.createdAt));
  }

  async getAllLiveSessions(): Promise<LiveSession[]> {
    return await db()
      .select()
      .from(liveSessions)
      .orderBy(desc(liveSessions.createdAt));
  }

  async getLiveSessionById(id: string): Promise<LiveSession | undefined> {
    const [session] = await db()
      .select()
      .from(liveSessions)
      .where(eq(liveSessions.id, id));
    return session || undefined;
  }

  async updateLiveSession(id: string, updates: Partial<LiveSession>): Promise<LiveSession> {
    const [session] = await db()
      .update(liveSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(liveSessions.id, id))
      .returning();
    return session;
  }

  async deleteLiveSession(id: string): Promise<void> {
    await db()
      .delete(liveSessions)
      .where(eq(liveSessions.id, id));
  }

  async startLiveSession(id: string): Promise<LiveSession> {
    const [session] = await db()
      .update(liveSessions)
      .set({ 
        status: 'live', 
        actualStart: new Date(),
        updatedAt: new Date()
      })
      .where(eq(liveSessions.id, id))
      .returning();
    return session;
  }

  async endLiveSession(id: string): Promise<LiveSession> {
    const [session] = await db()
      .update(liveSessions)
      .set({ 
        status: 'ended', 
        actualEnd: new Date(),
        updatedAt: new Date()
      })
      .where(eq(liveSessions.id, id))
      .returning();
    return session;
  }

  async incrementSessionViewers(id: string): Promise<void> {
    await db()
      .update(liveSessions)
      .set({ 
        currentViewers: sql`${liveSessions.currentViewers} + 1`,
        totalViews: sql`${liveSessions.totalViews} + 1`,
        updatedAt: new Date()
      })
      .where(eq(liveSessions.id, id));
  }
}

// Mock storage for development when database is not available
class MockStorage implements IStorage {
  private mockUsers = new Map<string, User>();
  private mockTransactions = new Map<string, CoinTransaction[]>();
  private mockLiveSessions = new Map<string, LiveSession[]>();

  constructor() {
    // Initialize with some sample users and coins for testing
    this.mockUsers.set('773f9dcc-d68d-45a2-ac3f-1969d5846d7c', {
      id: '773f9dcc-d68d-45a2-ac3f-1969d5846d7c',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      institution: 'Test University',
      language: 'en',
      isAdmin: false,
      coins: 50, // Start with 50 coins for testing
      password: 'hashed',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Add some sample transactions
    this.mockTransactions.set('773f9dcc-d68d-45a2-ac3f-1969d5846d7c', [
      {
        id: 'tx-1',
        userId: '773f9dcc-d68d-45a2-ac3f-1969d5846d7c',
        amount: 15,
        type: 'profile_completion',
        description: 'Completed your profile',
        relatedEntityId: null,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: 'tx-2',
        userId: '773f9dcc-d68d-45a2-ac3f-1969d5846d7c',
        amount: 10,
        type: 'screening_completed',
        description: 'Completed PHQ-9 screening assessment',
        relatedEntityId: null,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
      {
        id: 'tx-3',
        userId: '773f9dcc-d68d-45a2-ac3f-1969d5846d7c',
        amount: 5,
        type: 'chat_session',
        description: 'Chat session with AI assistant',
        relatedEntityId: null,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: 'tx-4',
        userId: '773f9dcc-d68d-45a2-ac3f-1969d5846d7c',
        amount: 3,
        type: 'mood_entry',
        description: 'Daily mood tracking entry',
        relatedEntityId: null,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
      {
        id: 'tx-5',
        userId: '773f9dcc-d68d-45a2-ac3f-1969d5846d7c',
        amount: 2,
        type: 'daily_login',
        description: 'Daily login bonus',
        relatedEntityId: null,
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      }
    ]);
  }

  async addCoins(userId: string, amount: number, type: string, description: string, relatedEntityId?: string): Promise<CoinTransaction> {
    const transaction: CoinTransaction = {
      id: `tx-${Date.now()}`,
      userId,
      amount,
      type,
      description,
      relatedEntityId: relatedEntityId || null,
      createdAt: new Date(),
    };

    if (!this.mockTransactions.has(userId)) {
      this.mockTransactions.set(userId, []);
    }
    this.mockTransactions.get(userId)!.push(transaction);

    // Update user's coin balance
    const user = this.mockUsers.get(userId);
    if (user) {
      user.coins = (user.coins || 0) + amount;
    }

    return transaction;
  }

  async getUserCoinTransactions(userId: string, limit: number = 50): Promise<CoinTransaction[]> {
    const transactions = this.mockTransactions.get(userId) || [];
    return transactions.slice(0, limit);
  }

  async getUserCoinBalance(userId: string): Promise<number> {
    const user = this.mockUsers.get(userId);
    return user?.coins || 0;
  }

  // Add mock implementations for all other methods to avoid errors
  async getUser(id: string): Promise<User | undefined> {
    return this.mockUsers.get(id);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.mockUsers.get(id);
    if (user) {
      Object.assign(user, updates);
      return user;
    }
    throw new Error('User not found');
  }

  // Stub implementations for other methods
  async getUserByUsername(username: string): Promise<User | undefined> { return undefined; }
  async getUserByEmail(email: string): Promise<User | undefined> { return undefined; }
  async createUser(user: InsertUser): Promise<User> { throw new Error('Not implemented in mock'); }
  async createScreeningAssessment(assessment: InsertScreeningAssessment): Promise<ScreeningAssessment> { throw new Error('Not implemented in mock'); }
  async getUserScreeningHistory(userId: string, type?: string): Promise<ScreeningAssessment[]> { return []; }
  async getLatestScreening(userId: string, type: string): Promise<ScreeningAssessment | undefined> { return undefined; }
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> { throw new Error('Not implemented in mock'); }
  async getUserAppointments(userId: string): Promise<Appointment[]> { return []; }
  async getCounselorAppointments(counselorId: string): Promise<Appointment[]> { return []; }
  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> { throw new Error('Not implemented in mock'); }
  async getCounselors(): Promise<Counselor[]> { return []; }
  async createForumPost(post: InsertForumPost): Promise<ForumPost> { throw new Error('Not implemented in mock'); }
  async getForumPosts(category?: string): Promise<ForumPost[]> { return []; }
  async getForumPostWithReplies(postId: string): Promise<ForumPost & { replies: ForumReply[] }> { throw new Error('Not implemented in mock'); }
  async createForumReply(reply: InsertForumReply): Promise<ForumReply> { throw new Error('Not implemented in mock'); }
  async likeForumPost(postId: string): Promise<void> { }
  async flagForumPost(postId: string): Promise<void> { }
  async getResources(category?: string, language?: string): Promise<Resource[]> { return []; }
  async getResourceById(id: string): Promise<Resource | undefined> { return undefined; }
  async createResource(resource: InsertResource): Promise<Resource> { throw new Error('Not implemented in mock'); }
  async createResourcesBulk(resources: InsertResource[]): Promise<Resource[]> { return []; }
  async likeResource(id: string): Promise<void> { }
  async createMoodEntry(mood: InsertMoodEntry): Promise<MoodEntry> { throw new Error('Not implemented in mock'); }
  async getUserMoodHistory(userId: string, days?: number): Promise<MoodEntry[]> { return []; }
  async createCrisisAlert(alert: InsertCrisisAlert): Promise<CrisisAlert> { throw new Error('Not implemented in mock'); }
  async getActiveCrisisAlerts(): Promise<CrisisAlert[]> { return []; }
  async resolveCrisisAlert(id: string, resolvedBy: string, notes?: string): Promise<CrisisAlert> { throw new Error('Not implemented in mock'); }
  async createChatSession(userId: string): Promise<ChatSession> { throw new Error('Not implemented in mock'); }
  async updateChatSession(id: string, messages: any[]): Promise<ChatSession> { throw new Error('Not implemented in mock'); }
  async getChatSession(id: string): Promise<ChatSession | undefined> { return undefined; }
  async createCustomPersonality(personality: InsertCustomPersonality): Promise<CustomPersonality> { throw new Error('Not implemented in mock'); }
  async getUserCustomPersonalities(userId: string): Promise<CustomPersonality[]> { return []; }
  async updateCustomPersonality(id: string, updates: Partial<CustomPersonality>): Promise<CustomPersonality> { throw new Error('Not implemented in mock'); }
  async deleteCustomPersonality(id: string, userId: string): Promise<void> { }
  async getAnalytics(): Promise<any> { return {}; }

  // Medicine alarm implementations
  private mockMedicineAlarms = new Map<string, MedicineAlarm[]>();

  async createMedicineAlarm(alarm: InsertMedicineAlarm): Promise<MedicineAlarm> {
    const mockAlarm: MedicineAlarm = {
      id: `alarm_${Date.now()}`,
      ...alarm,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!this.mockMedicineAlarms.has(alarm.userId)) {
      this.mockMedicineAlarms.set(alarm.userId, []);
    }
    
    this.mockMedicineAlarms.get(alarm.userId)!.push(mockAlarm);
    return mockAlarm;
  }

  async getUserMedicineAlarms(userId: string): Promise<MedicineAlarm[]> {
    return this.mockMedicineAlarms.get(userId) || [];
  }

  async updateMedicineAlarm(id: string, updates: Partial<MedicineAlarm>): Promise<MedicineAlarm> {
    for (const alarms of this.mockMedicineAlarms.values()) {
      const alarm = alarms.find(a => a.id === id);
      if (alarm) {
        Object.assign(alarm, updates, { updatedAt: new Date().toISOString() });
        return alarm;
      }
    }
    throw new Error('Medicine alarm not found');
  }

  async deleteMedicineAlarm(id: string): Promise<void> {
    for (const [userId, alarms] of this.mockMedicineAlarms.entries()) {
      const index = alarms.findIndex(a => a.id === id);
      if (index !== -1) {
        alarms.splice(index, 1);
        return;
      }
    }
    throw new Error('Medicine alarm not found');
  }

  // Skills mock implementations
  private mockUserSkills = new Map<string, UserSkill[]>();
  private mockSkillShowcases = new Map<string, SkillShowcase[]>();
  private mockSkillEndorsements = new Map<string, SkillEndorsement[]>();

  async createUserSkill(skill: InsertUserSkill): Promise<UserSkill> {
    const mockSkill: UserSkill = {
      id: `skill_${Date.now()}`,
      ...skill,
      endorsements: 0,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!this.mockUserSkills.has(skill.userId)) {
      this.mockUserSkills.set(skill.userId, []);
    }
    
    this.mockUserSkills.get(skill.userId)!.push(mockSkill);
    return mockSkill;
  }

  async getUserSkills(userId: string): Promise<UserSkill[]> {
    return this.mockUserSkills.get(userId) || [];
  }

  async updateUserSkill(id: string, updates: Partial<UserSkill>): Promise<UserSkill> {
    for (const skills of this.mockUserSkills.values()) {
      const skill = skills.find(s => s.id === id);
      if (skill) {
        Object.assign(skill, updates, { updatedAt: new Date().toISOString() });
        return skill;
      }
    }
    throw new Error('Skill not found');
  }

  async deleteUserSkill(id: string): Promise<void> {
    for (const [userId, skills] of this.mockUserSkills.entries()) {
      const index = skills.findIndex(s => s.id === id);
      if (index !== -1) {
        skills.splice(index, 1);
        return;
      }
    }
    throw new Error('Skill not found');
  }

  async createSkillShowcase(showcase: InsertSkillShowcase): Promise<SkillShowcase> {
    const mockShowcase: SkillShowcase = {
      id: `showcase_${Date.now()}`,
      ...showcase,
      likes: 0,
      views: 0,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!this.mockSkillShowcases.has(showcase.userId)) {
      this.mockSkillShowcases.set(showcase.userId, []);
    }
    
    this.mockSkillShowcases.get(showcase.userId)!.push(mockShowcase);
    return mockShowcase;
  }

  async getUserSkillShowcases(userId: string): Promise<SkillShowcase[]> {
    return this.mockSkillShowcases.get(userId) || [];
  }

  async getAllSkillShowcases(): Promise<SkillShowcase[]> {
    const allShowcases = [];
    for (const showcases of this.mockSkillShowcases.values()) {
      allShowcases.push(...showcases);
    }
    return allShowcases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateSkillShowcase(id: string, updates: Partial<SkillShowcase>): Promise<SkillShowcase> {
    for (const showcases of this.mockSkillShowcases.values()) {
      const showcase = showcases.find(s => s.id === id);
      if (showcase) {
        Object.assign(showcase, updates, { updatedAt: new Date().toISOString() });
        return showcase;
      }
    }
    throw new Error('Showcase not found');
  }

  async deleteSkillShowcase(id: string): Promise<void> {
    for (const [userId, showcases] of this.mockSkillShowcases.entries()) {
      const index = showcases.findIndex(s => s.id === id);
      if (index !== -1) {
        showcases.splice(index, 1);
        return;
      }
    }
    throw new Error('Showcase not found');
  }

  async likeSkillShowcase(id: string): Promise<void> {
    for (const showcases of this.mockSkillShowcases.values()) {
      const showcase = showcases.find(s => s.id === id);
      if (showcase) {
        showcase.likes = (showcase.likes || 0) + 1;
        showcase.updatedAt = new Date().toISOString();
        return;
      }
    }
    throw new Error('Showcase not found');
  }

  async createSkillEndorsement(endorsement: InsertSkillEndorsement): Promise<SkillEndorsement> {
    const mockEndorsement: SkillEndorsement = {
      id: `endorsement_${Date.now()}`,
      ...endorsement,
      createdAt: new Date().toISOString(),
    };

    if (!this.mockSkillEndorsements.has(endorsement.skillId)) {
      this.mockSkillEndorsements.set(endorsement.skillId, []);
    }
    
    this.mockSkillEndorsements.get(endorsement.skillId)!.push(mockEndorsement);

    // Update the skill's endorsement count
    for (const skills of this.mockUserSkills.values()) {
      const skill = skills.find(s => s.id === endorsement.skillId);
      if (skill) {
        skill.endorsements = (skill.endorsements || 0) + 1;
        skill.updatedAt = new Date().toISOString();
        break;
      }
    }

    return mockEndorsement;
  }

  // Live sessions methods
  async createLiveSession(session: InsertLiveSession): Promise<LiveSession> {
    const mockSession: LiveSession = {
      id: `session_${Date.now()}`,
      ...session,
      currentViewers: 0,
      totalViews: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!this.mockLiveSessions.has(session.userId)) {
      this.mockLiveSessions.set(session.userId, []);
    }
    
    this.mockLiveSessions.get(session.userId)!.push(mockSession);
    return mockSession;
  }

  async getUserLiveSessions(userId: string): Promise<LiveSession[]> {
    return this.mockLiveSessions.get(userId) || [];
  }

  async getAllLiveSessions(): Promise<LiveSession[]> {
    const allSessions = [];
    for (const sessions of this.mockLiveSessions.values()) {
      allSessions.push(...sessions);
    }
    return allSessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getLiveSessionById(id: string): Promise<LiveSession | undefined> {
    for (const sessions of this.mockLiveSessions.values()) {
      const session = sessions.find(s => s.id === id);
      if (session) return session;
    }
    return undefined;
  }

  async updateLiveSession(id: string, updates: Partial<LiveSession>): Promise<LiveSession> {
    for (const sessions of this.mockLiveSessions.values()) {
      const session = sessions.find(s => s.id === id);
      if (session) {
        Object.assign(session, updates, { updatedAt: new Date() });
        return session;
      }
    }
    throw new Error('Session not found');
  }

  async deleteLiveSession(id: string): Promise<void> {
    for (const [userId, sessions] of this.mockLiveSessions.entries()) {
      const index = sessions.findIndex(s => s.id === id);
      if (index !== -1) {
        sessions.splice(index, 1);
        return;
      }
    }
    throw new Error('Session not found');
  }

  async startLiveSession(id: string): Promise<LiveSession> {
    for (const sessions of this.mockLiveSessions.values()) {
      const session = sessions.find(s => s.id === id);
      if (session) {
        session.status = 'live';
        session.actualStart = new Date();
        session.updatedAt = new Date();
        return session;
      }
    }
    throw new Error('Session not found');
  }

  async endLiveSession(id: string): Promise<LiveSession> {
    for (const sessions of this.mockLiveSessions.values()) {
      const session = sessions.find(s => s.id === id);
      if (session) {
        session.status = 'ended';
        session.actualEnd = new Date();
        session.updatedAt = new Date();
        return session;
      }
    }
    throw new Error('Session not found');
  }

  async incrementSessionViewers(id: string): Promise<void> {
    for (const sessions of this.mockLiveSessions.values()) {
      const session = sessions.find(s => s.id === id);
      if (session) {
        session.currentViewers = (session.currentViewers || 0) + 1;
        session.totalViews = (session.totalViews || 0) + 1;
        session.updatedAt = new Date();
        return;
      }
    }
    throw new Error('Session not found');
  }
}

// Try to use DatabaseStorage, fall back to MockStorage if database is not available
let storage: IStorage;

async function initializeStorage(): Promise<IStorage> {
  if (process.env.DATABASE_URL) {
    try {
      const dbStorage = new DatabaseStorage();
      // Test database connection by calling a simple method
      await dbStorage.getAnalytics();
      console.log('Connected to database successfully');
      return dbStorage;
    } catch (error) {
      console.log('Database connection failed, using mock storage for development:', error);
      return new MockStorage();
    }
  } else {
    console.log('DATABASE_URL not found, using mock storage for development');
    return new MockStorage();
  }
}

// Initialize storage synchronously for immediate use, but also attempt async initialization
storage = new MockStorage();
initializeStorage().then((initializedStorage) => {
  storage = initializedStorage;
}).catch(() => {
  console.log('Failed to initialize storage, continuing with mock storage');
});

export { storage };
