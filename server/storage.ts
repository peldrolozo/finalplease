// Import all schema types and tables
import { 
  users, coaches, courts, bookings, membershipTiers, memberships, 
  coachingSessions, classes, classEnrollments, events, eventRegistrations,
  blogPosts, contactMessages, testimonials,
  type User, type InsertUser, type Court, type InsertCourt,
  type Booking, type InsertBooking, type MembershipTier, type InsertMembershipTier,
  type Membership, type InsertMembership, type Coach, type InsertCoach,
  type CoachingSession, type InsertCoachingSession, type Class, type InsertClass,
  type ClassEnrollment, type InsertClassEnrollment, type Event, type InsertEvent,
  type EventRegistration, type InsertEventRegistration, type BlogPost, type InsertBlogPost,
  type ContactMessage, type InsertContactMessage, type Testimonial, type InsertTestimonial
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Court methods
  getCourts(): Promise<Court[]>;
  getCourt(id: number): Promise<Court | undefined>;
  createCourt(court: InsertCourt): Promise<Court>;
  
  // Booking methods
  getBookings(): Promise<Booking[]>;
  getUserBookings(userId: number): Promise<Booking[]>;
  getCourtBookings(courtId: number, date: Date): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  updateBookingPaymentStatus(id: number, paymentStatus: string): Promise<Booking | undefined>;
  getBookingByPaymentIntentId(paymentIntentId: string): Promise<Booking | undefined>;
  
  // Membership Tier methods
  getMembershipTiers(): Promise<MembershipTier[]>;
  getMembershipTier(id: number): Promise<MembershipTier | undefined>;
  createMembershipTier(tier: InsertMembershipTier): Promise<MembershipTier>;
  
  // Membership methods
  getUserMembership(userId: number): Promise<Membership | undefined>;
  createMembership(membership: InsertMembership): Promise<Membership>;
  
  // Coach methods
  getCoaches(): Promise<Coach[]>;
  getCoach(id: number): Promise<Coach | undefined>;
  createCoach(coach: InsertCoach): Promise<Coach>;
  
  // Coaching Session methods
  getCoachingSessions(coachId: number, date: Date): Promise<CoachingSession[]>;
  createCoachingSession(session: InsertCoachingSession): Promise<CoachingSession>;
  
  // Class methods
  getClasses(): Promise<Class[]>;
  getClass(id: number): Promise<Class | undefined>;
  createClass(classItem: InsertClass): Promise<Class>;
  
  // Class Enrollment methods
  enrollInClass(enrollment: InsertClassEnrollment): Promise<ClassEnrollment>;
  getClassEnrollments(classId: number): Promise<ClassEnrollment[]>;
  
  // Event methods
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Event Registration methods
  registerForEvent(registration: InsertEventRegistration): Promise<EventRegistration>;
  getEventRegistrations(eventId: number): Promise<EventRegistration[]>;
  
  // Blog Post methods
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  // Contact Message methods
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  
  // Testimonial methods
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
}

// Create DatabaseStorage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results.length > 0 ? results[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const results = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return results[0];
  }
  
  // Courts
  async getCourts(): Promise<Court[]> {
    return db.select().from(courts);
  }

  async getCourt(id: number): Promise<Court | undefined> {
    const results = await db.select().from(courts).where(eq(courts.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async createCourt(court: InsertCourt): Promise<Court> {
    const results = await db.insert(courts).values(court).returning();
    return results[0];
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    return db.select().from(bookings);
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return db.select().from(bookings).where(eq(bookings.userId, userId));
  }

  async getCourtBookings(courtId: number, date: Date): Promise<Booking[]> {
    return db.select()
      .from(bookings)
      .where(and(
        eq(bookings.courtId, courtId),
        eq(bookings.date, date)
      ));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const results = await db.insert(bookings).values(booking).returning();
    return results[0];
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const results = await db.update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return results.length > 0 ? results[0] : undefined;
  }
  
  async updateBookingPaymentStatus(id: number, paymentStatus: string): Promise<Booking | undefined> {
    const results = await db.update(bookings)
      .set({ 
        paymentStatus,
        status: paymentStatus === 'paid' ? 'confirmed' : 'pending'
      })
      .where(eq(bookings.id, id))
      .returning();
    return results.length > 0 ? results[0] : undefined;
  }
  
  async getBookingByPaymentIntentId(paymentIntentId: string): Promise<Booking | undefined> {
    const results = await db.select()
      .from(bookings)
      .where(eq(bookings.paymentIntentId, paymentIntentId));
    return results.length > 0 ? results[0] : undefined;
  }

  // Membership Tiers
  async getMembershipTiers(): Promise<MembershipTier[]> {
    return db.select().from(membershipTiers);
  }

  async getMembershipTier(id: number): Promise<MembershipTier | undefined> {
    const results = await db.select().from(membershipTiers).where(eq(membershipTiers.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async createMembershipTier(tier: InsertMembershipTier): Promise<MembershipTier> {
    const results = await db.insert(membershipTiers).values(tier).returning();
    return results[0];
  }

  // Memberships
  async getUserMembership(userId: number): Promise<Membership | undefined> {
    const results = await db.select()
      .from(memberships)
      .where(and(
        eq(memberships.userId, userId),
        eq(memberships.isActive, true)
      ));
    return results.length > 0 ? results[0] : undefined;
  }

  async createMembership(membership: InsertMembership): Promise<Membership> {
    const results = await db.insert(memberships).values(membership).returning();
    return results[0];
  }

  // Coaches
  async getCoaches(): Promise<Coach[]> {
    return db.select().from(coaches);
  }

  async getCoach(id: number): Promise<Coach | undefined> {
    const results = await db.select().from(coaches).where(eq(coaches.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async createCoach(coach: InsertCoach): Promise<Coach> {
    const results = await db.insert(coaches).values(coach).returning();
    return results[0];
  }

  // Coaching Sessions
  async getCoachingSessions(coachId: number, date: Date): Promise<CoachingSession[]> {
    return db.select()
      .from(coachingSessions)
      .where(and(
        eq(coachingSessions.coachId, coachId),
        eq(coachingSessions.date, date)
      ));
  }

  async createCoachingSession(session: InsertCoachingSession): Promise<CoachingSession> {
    const results = await db.insert(coachingSessions).values(session).returning();
    return results[0];
  }

  // Classes
  async getClasses(): Promise<Class[]> {
    return db.select().from(classes);
  }

  async getClass(id: number): Promise<Class | undefined> {
    const results = await db.select().from(classes).where(eq(classes.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async createClass(classItem: InsertClass): Promise<Class> {
    const results = await db.insert(classes).values(classItem).returning();
    return results[0];
  }

  // Class Enrollments
  async enrollInClass(enrollment: InsertClassEnrollment): Promise<ClassEnrollment> {
    const results = await db.insert(classEnrollments).values(enrollment).returning();
    
    // Update class enrollment count
    const classItem = await this.getClass(enrollment.classId);
    if (classItem) {
      await db.update(classes)
        .set({ currentEnrollment: classItem.currentEnrollment + 1 })
        .where(eq(classes.id, enrollment.classId));
    }
    
    return results[0];
  }

  async getClassEnrollments(classId: number): Promise<ClassEnrollment[]> {
    return db.select()
      .from(classEnrollments)
      .where(eq(classEnrollments.classId, classId));
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return db.select().from(events);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const results = await db.select().from(events).where(eq(events.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const results = await db.insert(events).values(event).returning();
    return results[0];
  }

  // Event Registrations
  async registerForEvent(registration: InsertEventRegistration): Promise<EventRegistration> {
    const results = await db.insert(eventRegistrations).values(registration).returning();
    
    // Update event participants count
    const event = await this.getEvent(registration.eventId);
    if (event) {
      await db.update(events)
        .set({ currentParticipants: event.currentParticipants + 1 })
        .where(eq(events.id, registration.eventId));
    }
    
    return results[0];
  }

  async getEventRegistrations(eventId: number): Promise<EventRegistration[]> {
    return db.select()
      .from(eventRegistrations)
      .where(eq(eventRegistrations.eventId, eventId));
  }

  // Blog Posts
  async getBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts);
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const results = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const results = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return results.length > 0 ? results[0] : undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const results = await db.insert(blogPosts).values(post).returning();
    return results[0];
  }

  // Contact Messages
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const results = await db.insert(contactMessages).values(message).returning();
    return results[0];
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages);
  }

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    return db.select().from(testimonials).where(eq(testimonials.isActive, true));
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const results = await db.insert(testimonials).values(testimonial).returning();
    return results[0];
  }
}

// Export the storage implementation
export const storage = new DatabaseStorage();