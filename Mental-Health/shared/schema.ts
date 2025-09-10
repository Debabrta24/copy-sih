import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  integer, 
  boolean, 
  timestamp, 
  jsonb,
  serial,
  uuid
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  institution: text("institution").notNull(),
  course: text("course"),
  year: integer("year"),
  language: text("language").default("en"),
  isAdmin: boolean("is_admin").default(false),
  coins: integer("coins").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Screening assessments
export const screeningAssessments = pgTable("screening_assessments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'PHQ9' or 'GAD7'
  responses: jsonb("responses").notNull(), // Array of numeric responses
  totalScore: integer("total_score").notNull(),
  riskLevel: text("risk_level").notNull(), // 'minimal', 'mild', 'moderate', 'severe'
  isHighRisk: boolean("is_high_risk").default(false),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Chat sessions
export const chatSessions = pgTable("chat_sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  messages: jsonb("messages").default([]), // Array of message objects
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  isActive: boolean("is_active").default(true),
});

// Counselors
export const counselors = pgTable("counselors", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  specialization: text("specialization").notNull(),
  languages: jsonb("languages").notNull(), // Array of language codes
  experience: integer("experience_years").notNull(),
  rating: integer("rating").default(0), // 1-5 stars * 10 for precision
  isAvailable: boolean("is_available").default(true),
  availableSlots: jsonb("available_slots").default([]), // Array of time slots
});

// Counseling appointments
export const appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  counselorId: uuid("counselor_id").notNull().references(() => counselors.id),
  sessionType: text("session_type").notNull(), // 'individual', 'group', 'crisis'
  scheduledFor: timestamp("scheduled_for").notNull(),
  duration: integer("duration_minutes").default(60),
  status: text("status").default("scheduled"), // 'scheduled', 'completed', 'cancelled', 'no-show'
  notes: text("notes"),
  isConfidential: boolean("is_confidential").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Forum posts
export const forumPosts = pgTable("forum_posts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  isAnonymous: boolean("is_anonymous").default(true),
  likes: integer("likes").default(0),
  isModerated: boolean("is_moderated").default(false),
  isFlagged: boolean("is_flagged").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Forum replies
export const forumReplies = pgTable("forum_replies", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: uuid("post_id").notNull().references(() => forumPosts.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  isAnonymous: boolean("is_anonymous").default(true),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Resources
export const resources = pgTable("resources", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'video', 'article', 'audio', 'guide'
  category: text("category").notNull(),
  url: text("url"),
  content: text("content"),
  duration: integer("duration_minutes"),
  language: text("language").default("en"),
  likes: integer("likes").default(0),
  isOfflineAvailable: boolean("is_offline_available").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mood entries
export const moodEntries = pgTable("mood_entries", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  moodLevel: integer("mood_level").notNull(), // 1-5 scale
  moodType: text("mood_type").notNull(), // 'happy', 'sad', 'anxious', 'stressed', 'calm'
  notes: text("notes"),
  date: timestamp("date").defaultNow(),
});

// Crisis alerts
export const crisisAlerts = pgTable("crisis_alerts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  triggerType: text("trigger_type").notNull(), // 'screening', 'chat', 'manual'
  severity: text("severity").notNull(), // 'high', 'critical'
  isResolved: boolean("is_resolved").default(false),
  resolvedBy: uuid("resolved_by").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// Custom AI personalities
export const customPersonalities = pgTable("custom_personalities", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  customPrompt: text("custom_prompt").notNull(),
  sourceType: text("source_type").notNull().default("text"), // 'text', 'file'
  originalFileName: text("original_file_name"),
  trainingData: text("training_data"), // Processed text content
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Coin transactions
export const coinTransactions = pgTable("coin_transactions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // Can be positive (earned) or negative (spent)
  type: text("type").notNull(), // 'screening_completed', 'chat_session', 'daily_login', 'forum_post', 'mood_entry', 'profile_completion', 'spent'
  description: text("description").notNull(),
  relatedEntityId: uuid("related_entity_id"), // Reference to the related activity (e.g., screening ID)
  createdAt: timestamp("created_at").defaultNow(),
});

// Medicine alarms
export const medicineAlarms = pgTable("medicine_alarms", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  medicineName: text("medicine_name").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(), // 'daily', 'twice-daily', 'thrice-daily', 'weekly', 'custom'
  times: jsonb("times").notNull(), // Array of time strings like ["08:00", "20:00"]
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User skills
export const userSkills = pgTable("user_skills", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  skillName: text("skill_name").notNull(),
  category: text("category").notNull(), // 'technical', 'creative', 'academic', 'sports', 'other'
  proficiencyLevel: text("proficiency_level").notNull(), // 'beginner', 'intermediate', 'advanced', 'expert'
  description: text("description"),
  yearsOfExperience: integer("years_of_experience").default(0),
  isVerified: boolean("is_verified").default(false),
  endorsements: integer("endorsements").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Skill showcases
export const skillShowcases = pgTable("skill_showcases", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  skillId: uuid("skill_id").notNull().references(() => userSkills.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'project', 'achievement', 'certificate', 'portfolio'
  mediaUrl: text("media_url"), // Link to images, videos, documents
  externalUrl: text("external_url"), // Link to project, repository, etc.
  tags: jsonb("tags").default([]), // Array of tags
  likes: integer("likes").default(0),
  views: integer("views").default(0),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Skill endorsements
export const skillEndorsements = pgTable("skill_endorsements", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  skillId: uuid("skill_id").notNull().references(() => userSkills.id, { onDelete: "cascade" }),
  endorserId: uuid("endorser_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Live sessions
export const liveSessions = pgTable("live_sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'Meditation', 'Study', 'Support', 'Wellness', 'Education'
  status: text("status").default("scheduled"), // 'scheduled', 'live', 'ended'
  scheduledStart: timestamp("scheduled_start"),
  actualStart: timestamp("actual_start"),
  actualEnd: timestamp("actual_end"),
  isAudio: boolean("is_audio").default(false), // true for audio-only, false for video
  maxParticipants: integer("max_participants").default(100),
  currentViewers: integer("current_viewers").default(0),
  totalViews: integer("total_views").default(0),
  streamUrl: text("stream_url"), // URL for the actual stream
  thumbnailUrl: text("thumbnail_url"),
  tags: jsonb("tags").default([]), // Array of tags
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  screeningAssessments: many(screeningAssessments),
  chatSessions: many(chatSessions),
  appointments: many(appointments),
  forumPosts: many(forumPosts),
  forumReplies: many(forumReplies),
  moodEntries: many(moodEntries),
  crisisAlerts: many(crisisAlerts),
  customPersonalities: many(customPersonalities),
  coinTransactions: many(coinTransactions),
  medicineAlarms: many(medicineAlarms),
  userSkills: many(userSkills),
  skillShowcases: many(skillShowcases),
  skillEndorsements: many(skillEndorsements),
  liveSessions: many(liveSessions),
}));

export const customPersonalitiesRelations = relations(customPersonalities, ({ one }) => ({
  user: one(users, {
    fields: [customPersonalities.userId],
    references: [users.id],
  }),
}));

export const screeningAssessmentsRelations = relations(screeningAssessments, ({ one }) => ({
  user: one(users, {
    fields: [screeningAssessments.userId],
    references: [users.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
  counselor: one(counselors, {
    fields: [appointments.counselorId],
    references: [counselors.id],
  }),
}));

export const forumPostsRelations = relations(forumPosts, ({ one, many }) => ({
  user: one(users, {
    fields: [forumPosts.userId],
    references: [users.id],
  }),
  replies: many(forumReplies),
}));

export const forumRepliesRelations = relations(forumReplies, ({ one }) => ({
  post: one(forumPosts, {
    fields: [forumReplies.postId],
    references: [forumPosts.id],
  }),
  user: one(users, {
    fields: [forumReplies.userId],
    references: [users.id],
  }),
}));

export const coinTransactionsRelations = relations(coinTransactions, ({ one }) => ({
  user: one(users, {
    fields: [coinTransactions.userId],
    references: [users.id],
  }),
}));

export const medicineAlarmsRelations = relations(medicineAlarms, ({ one }) => ({
  user: one(users, {
    fields: [medicineAlarms.userId],
    references: [users.id],
  }),
}));

export const userSkillsRelations = relations(userSkills, ({ one, many }) => ({
  user: one(users, {
    fields: [userSkills.userId],
    references: [users.id],
  }),
  showcases: many(skillShowcases),
  endorsements: many(skillEndorsements),
}));

export const skillShowcasesRelations = relations(skillShowcases, ({ one }) => ({
  user: one(users, {
    fields: [skillShowcases.userId],
    references: [users.id],
  }),
  skill: one(userSkills, {
    fields: [skillShowcases.skillId],
    references: [userSkills.id],
  }),
}));

export const skillEndorsementsRelations = relations(skillEndorsements, ({ one }) => ({
  skill: one(userSkills, {
    fields: [skillEndorsements.skillId],
    references: [userSkills.id],
  }),
  endorser: one(users, {
    fields: [skillEndorsements.endorserId],
    references: [users.id],
  }),
}));

export const liveSessionsRelations = relations(liveSessions, ({ one }) => ({
  user: one(users, {
    fields: [liveSessions.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertScreeningAssessmentSchema = createInsertSchema(screeningAssessments).omit({
  id: true,
  completedAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likes: true,
  isModerated: true,
  isFlagged: true,
});

export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  createdAt: true,
  likes: true,
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  date: true,
});

export const insertCrisisAlertSchema = createInsertSchema(crisisAlerts).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export const insertCustomPersonalitySchema = createInsertSchema(customPersonalities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
  likes: true,
});

export const insertCoinTransactionSchema = createInsertSchema(coinTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertMedicineAlarmSchema = createInsertSchema(medicineAlarms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSkillSchema = createInsertSchema(userSkills).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  endorsements: true,
  isVerified: true,
});

export const insertSkillShowcaseSchema = createInsertSchema(skillShowcases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likes: true,
  views: true,
  isFeatured: true,
});

export const insertSkillEndorsementSchema = createInsertSchema(skillEndorsements).omit({
  id: true,
  createdAt: true,
});

export const insertLiveSessionSchema = createInsertSchema(liveSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  currentViewers: true,
  totalViews: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ScreeningAssessment = typeof screeningAssessments.$inferSelect;
export type InsertScreeningAssessment = z.infer<typeof insertScreeningAssessmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertForumReply = z.infer<typeof insertForumReplySchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type CrisisAlert = typeof crisisAlerts.$inferSelect;
export type InsertCrisisAlert = z.infer<typeof insertCrisisAlertSchema>;
export type Counselor = typeof counselors.$inferSelect;
export type ChatSession = typeof chatSessions.$inferSelect;
export type CustomPersonality = typeof customPersonalities.$inferSelect;
export type InsertCustomPersonality = z.infer<typeof insertCustomPersonalitySchema>;
export type CoinTransaction = typeof coinTransactions.$inferSelect;
export type InsertCoinTransaction = z.infer<typeof insertCoinTransactionSchema>;
export type MedicineAlarm = typeof medicineAlarms.$inferSelect;
export type InsertMedicineAlarm = z.infer<typeof insertMedicineAlarmSchema>;
export type UserSkill = typeof userSkills.$inferSelect;
export type InsertUserSkill = z.infer<typeof insertUserSkillSchema>;
export type SkillShowcase = typeof skillShowcases.$inferSelect;
export type InsertSkillShowcase = z.infer<typeof insertSkillShowcaseSchema>;
export type SkillEndorsement = typeof skillEndorsements.$inferSelect;
export type InsertSkillEndorsement = z.infer<typeof insertSkillEndorsementSchema>;
export type LiveSession = typeof liveSessions.$inferSelect;
export type InsertLiveSession = z.infer<typeof insertLiveSessionSchema>;
