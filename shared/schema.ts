import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const courts = pgTable("courts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // indoor or outdoor
  description: text("description"),
  pricePerHour: doublePrecision("price_per_hour").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  courtId: integer("court_id").references(() => courts.id).notNull(),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  date: timestamp("date").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: text("status").notNull().default("pending"), // confirmed, cancelled, pending, paid
  totalAmount: doublePrecision("total_amount"),
  paymentStatus: text("payment_status").default("unpaid"), // unpaid, paid, refunded
  paymentIntentId: text("payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const membershipTiers = pgTable("membership_tiers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  monthlyPrice: doublePrecision("monthly_price").notNull(),
  freeBookingsPerMonth: integer("free_bookings_per_month").notNull(),
  discountPercentage: integer("discount_percentage").notNull(),
  otherBenefits: text("other_benefits"),
  isPopular: boolean("is_popular").default(false),
});

export const memberships = pgTable("memberships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  tierId: integer("tier_id").references(() => membershipTiers.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const coaches = pgTable("coaches", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  imagePath: text("image_path"),
  pricePerHour: doublePrecision("price_per_hour").notNull(),
});

export const coachingSessions = pgTable("coaching_sessions", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").references(() => coaches.id).notNull(),
  userId: integer("user_id").references(() => users.id),
  date: timestamp("date").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: text("status").notNull().default("confirmed"), // confirmed, cancelled, pending
});

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  coachId: integer("coach_id").references(() => coaches.id).notNull(),
  dayOfWeek: text("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  maxCapacity: integer("max_capacity").notNull(),
  currentEnrollment: integer("current_enrollment").default(0).notNull(),
});

export const classEnrollments = pgTable("class_enrollments", {
  id: serial("id").primaryKey(),
  classId: integer("class_id").references(() => classes.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  enrollmentDate: timestamp("enrollment_date").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  imagePath: text("image_path"),
  price: doublePrecision("price").notNull(),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0).notNull(),
});

export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  registrationDate: timestamp("registration_date").defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imagePath: text("image_path"),
  publishDate: timestamp("publish_date").defaultNow().notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  excerpt: text("excerpt"),
  slug: text("slug").notNull().unique(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isRead: boolean("is_read").default(false).notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  memberFor: text("member_for").notNull(),
  imagePath: text("image_path"),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  phone: true,
});

export const insertCourtSchema = createInsertSchema(courts).pick({
  name: true,
  type: true,
  description: true,
  pricePerHour: true,
  isActive: true,
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  userId: true,
  courtId: true,
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  date: true,
  startTime: true,
  endTime: true,
  status: true,
  totalAmount: true,
  paymentStatus: true,
  paymentIntentId: true,
});

export const insertMembershipTierSchema = createInsertSchema(membershipTiers).pick({
  name: true,
  description: true,
  monthlyPrice: true,
  freeBookingsPerMonth: true,
  discountPercentage: true,
  otherBenefits: true,
  isPopular: true,
});

export const insertMembershipSchema = createInsertSchema(memberships).pick({
  userId: true,
  tierId: true,
  startDate: true,
  endDate: true,
  isActive: true,
});

export const insertCoachSchema = createInsertSchema(coaches).pick({
  name: true,
  title: true,
  bio: true,
  imagePath: true,
  pricePerHour: true,
});

export const insertCoachingSessionSchema = createInsertSchema(coachingSessions).pick({
  coachId: true,
  userId: true,
  date: true,
  startTime: true,
  endTime: true,
  status: true,
});

export const insertClassSchema = createInsertSchema(classes).pick({
  name: true,
  description: true,
  coachId: true,
  dayOfWeek: true,
  startTime: true,
  endTime: true,
  maxCapacity: true,
});

export const insertClassEnrollmentSchema = createInsertSchema(classEnrollments).pick({
  classId: true,
  userId: true,
});

export const insertEventSchema = createInsertSchema(events).pick({
  name: true,
  description: true,
  startDate: true,
  endDate: true,
  imagePath: true,
  price: true,
  maxParticipants: true,
});

export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations).pick({
  eventId: true,
  userId: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  content: true,
  imagePath: true,
  authorId: true,
  excerpt: true,
  slug: true,
  publishDate: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  memberFor: true,
  imagePath: true,
  content: true,
  rating: true,
  isActive: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCourt = z.infer<typeof insertCourtSchema>;
export type Court = typeof courts.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertMembershipTier = z.infer<typeof insertMembershipTierSchema>;
export type MembershipTier = typeof membershipTiers.$inferSelect;

export type InsertMembership = z.infer<typeof insertMembershipSchema>;
export type Membership = typeof memberships.$inferSelect;

export type InsertCoach = z.infer<typeof insertCoachSchema>;
export type Coach = typeof coaches.$inferSelect;

export type InsertCoachingSession = z.infer<typeof insertCoachingSessionSchema>;
export type CoachingSession = typeof coachingSessions.$inferSelect;

export type InsertClass = z.infer<typeof insertClassSchema>;
export type Class = typeof classes.$inferSelect;

export type InsertClassEnrollment = z.infer<typeof insertClassEnrollmentSchema>;
export type ClassEnrollment = typeof classEnrollments.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;
export type EventRegistration = typeof eventRegistrations.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
