// setup-db.js
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
// Import schema with proper resolution for TypeScript files in ESM
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Load schema from compiled JS file
const schema = await import('./node_modules/.vite/deps/shared_schema.js');
import { eq } from 'drizzle-orm';

// Initialize database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function populateDatabase() {
  console.log('Starting database population...');

  try {
    // Create default courts
    console.log('Creating courts...');
    await db.insert(schema.courts).values([
      {
        name: "Indoor Court 1",
        type: "indoor",
        description: "Professional-grade indoor court with excellent lighting",
        pricePerHour: 30,
        isActive: true
      },
      {
        name: "Indoor Court 2",
        type: "indoor",
        description: "Professional-grade indoor court with excellent lighting",
        pricePerHour: 30,
        isActive: true
      },
      {
        name: "Outdoor Court 1",
        type: "outdoor",
        description: "Excellent outdoor court with weather protection",
        pricePerHour: 25,
        isActive: true
      },
      {
        name: "Outdoor Court 2",
        type: "outdoor",
        description: "Excellent outdoor court with weather protection",
        pricePerHour: 25,
        isActive: true
      }
    ]).onConflictDoNothing();

    // Create default membership tiers
    console.log('Creating membership tiers...');
    await db.insert(schema.membershipTiers).values([
      {
        name: "Basic",
        description: "Entry-level membership with essential benefits",
        monthlyPrice: 40,
        freeBookingsPerMonth: 2,
        discountPercentage: 10,
        otherBenefits: "Access to member-only events",
        isPopular: false
      },
      {
        name: "Premium",
        description: "Enhanced membership with additional benefits",
        monthlyPrice: 75,
        freeBookingsPerMonth: 5,
        discountPercentage: 20,
        otherBenefits: "1 free group class per month, Priority booking (48hr advance)",
        isPopular: true
      },
      {
        name: "Elite",
        description: "All-inclusive membership for dedicated players",
        monthlyPrice: 120,
        freeBookingsPerMonth: 10,
        discountPercentage: 30,
        otherBenefits: "2 free group classes per month, 1 free private coaching session, Priority booking (72hr advance)",
        isPopular: false
      }
    ]).onConflictDoNothing();

    // Create default coaches
    console.log('Creating coaches...');
    await db.insert(schema.coaches).values([
      {
        name: "Miguel Gonzalez",
        title: "Head Coach · Former WPT Player",
        bio: "10+ years coaching experience with professional tournament background. Specializes in advanced technique and strategy.",
        imagePath: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        pricePerHour: 60
      },
      {
        name: "Sarah Murphy",
        title: "Performance Coach · Irish Champion",
        bio: "Irish Padel Champion with expertise in competitive play. Perfect for intermediate players looking to advance their game.",
        imagePath: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        pricePerHour: 55
      },
      {
        name: "Mark Johnson",
        title: "Junior Development Coach",
        bio: "Specializes in beginner and junior coaching. Patient approach perfect for those new to the sport of all ages.",
        imagePath: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        pricePerHour: 45
      }
    ]).onConflictDoNothing();

    // Create default classes
    console.log('Creating classes...');
    await db.insert(schema.classes).values([
      {
        name: "Beginner Fundamentals",
        description: "Learn the basics of padel tennis in a fun, supportive environment",
        coachId: 3, // Mark Johnson
        dayOfWeek: "Monday",
        startTime: "18:00",
        endTime: "19:30",
        maxCapacity: 8,
        currentEnrollment: 5
      },
      {
        name: "Intermediate Tactics",
        description: "Improve your game with strategic plays and tactical knowledge",
        coachId: 2, // Sarah Murphy
        dayOfWeek: "Tuesday",
        startTime: "19:00",
        endTime: "20:30",
        maxCapacity: 8,
        currentEnrollment: 3
      },
      {
        name: "Advanced Strategies",
        description: "Master advanced techniques with our head coach",
        coachId: 1, // Miguel Gonzalez
        dayOfWeek: "Wednesday",
        startTime: "20:00",
        endTime: "21:30",
        maxCapacity: 6,
        currentEnrollment: 6
      },
      {
        name: "Ladies Only Session",
        description: "Focused training for women in a supportive environment",
        coachId: 2, // Sarah Murphy
        dayOfWeek: "Thursday",
        startTime: "18:00",
        endTime: "19:30",
        maxCapacity: 8,
        currentEnrollment: 2
      },
      {
        name: "Weekend Warriors",
        description: "Weekend session for all levels with focus on fun and improvement",
        coachId: 3, // Mark Johnson
        dayOfWeek: "Saturday",
        startTime: "11:00",
        endTime: "12:30",
        maxCapacity: 8,
        currentEnrollment: 4
      }
    ]).onConflictDoNothing();

    // Create default events
    console.log('Creating events...');
    await db.insert(schema.events).values([
      {
        name: "Dublin Open Tournament",
        description: "A weekend tournament for intermediate and advanced players with prizes and refreshments.",
        startDate: new Date('2025-05-20'),
        endDate: new Date('2025-05-21'),
        imagePath: "https://images.unsplash.com/photo-1602211844066-d3bb556e983b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        price: 40,
        maxParticipants: 32,
        currentParticipants: 12
      },
      {
        name: "Beginners Social Night",
        description: "A fun evening for newcomers to meet other players, learn the basics, and enjoy light refreshments.",
        startDate: new Date('2025-06-03'),
        endDate: new Date('2025-06-03'),
        imagePath: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        price: 15,
        maxParticipants: 24,
        currentParticipants: 5
      },
      {
        name: "Kids Summer Camp",
        description: "A week-long summer camp for children ages 8-14. All equipment provided.",
        startDate: new Date('2025-07-10'),
        endDate: new Date('2025-07-14'),
        imagePath: "https://images.unsplash.com/photo-1526307616774-60d0098f7642?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        price: 180,
        maxParticipants: 20,
        currentParticipants: 8
      },
      {
        name: "Pro Exhibition Match",
        description: "Watch professional players showcase their skills with a meet and greet afterward.",
        startDate: new Date('2025-07-22'),
        endDate: new Date('2025-07-22'),
        imagePath: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        price: 25,
        maxParticipants: 100,
        currentParticipants: 27
      }
    ]).onConflictDoNothing();

    // Create a default user for blog posts
    console.log('Creating admin user...');
    try {
      await db.insert(schema.users).values({
        username: "admin",
        password: "password123", // In a real app, this would be hashed
        email: "admin@celticpadel.ie",
        fullName: "Admin User",
        phone: "+353 123 4567",
        isAdmin: true
      }).onConflictDoNothing();
    } catch (error) {
      console.log("Admin user may already exist, skipping creation");
    }

    // Create default blog posts
    console.log('Creating blog posts...');
    await db.insert(schema.blogPosts).values([
      {
        title: "Beginner's Guide to Padel Equipment",
        content: "Everything you need to know about choosing your first padel racket, proper footwear, and essential accessories...",
        imagePath: "https://images.unsplash.com/photo-1612908605393-8e28e6a357ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        authorId: 1,
        excerpt: "Everything you need to know about choosing your first padel racket, proper footwear, and essential accessories.",
        slug: "beginners-guide-to-padel-equipment",
        publishDate: new Date('2023-05-10')
      },
      {
        title: "5 Strategies to Improve Your Padel Game",
        content: "Advanced techniques and tactical approaches to help you dominate the court and outsmart your opponents...",
        imagePath: "https://images.unsplash.com/photo-1591491580609-e8b83671fa6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        authorId: 1,
        excerpt: "Advanced techniques and tactical approaches to help you dominate the court and outsmart your opponents.",
        slug: "5-strategies-to-improve-your-padel-game",
        publishDate: new Date('2023-05-03')
      },
      {
        title: "Spring Tournament Recap: Highlights and Winners",
        content: "A look back at our successful spring tournament, featuring exciting matches, standout performances, and community fun...",
        imagePath: "https://images.unsplash.com/photo-1509539662397-c7315ff49a31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        authorId: 1,
        excerpt: "A look back at our successful spring tournament, featuring exciting matches, standout performances, and community fun.",
        slug: "spring-tournament-recap",
        publishDate: new Date('2023-04-25')
      }
    ]).onConflictDoNothing();

    // Create default testimonials
    console.log('Creating testimonials...');
    await db.insert(schema.testimonials).values([
      {
        name: "John D.",
        memberFor: "2 years",
        imagePath: "https://xsgames.co/randomusers/assets/avatars/male/32.jpg",
        content: "Celtic Padel has transformed my weekends. The facilities are top-notch and the community is so welcoming. Coach Miguel has helped me improve my game tremendously.",
        rating: 5,
        isActive: true
      },
      {
        name: "Emma T.",
        memberFor: "1 year",
        imagePath: "https://xsgames.co/randomusers/assets/avatars/female/44.jpg",
        content: "I started as a complete beginner and now play in local tournaments. The ladies-only sessions were perfect for building my confidence. Facilities are modern and always clean.",
        rating: 5,
        isActive: true
      },
      {
        name: "David M.",
        memberFor: "6 months",
        imagePath: "https://xsgames.co/randomusers/assets/avatars/male/67.jpg",
        content: "The booking system is so convenient, and the Elite membership is great value for how often I play. The tournaments are well-organized and a great way to meet other players.",
        rating: 4,
        isActive: true
      }
    ]).onConflictDoNothing();

    console.log('Database population completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

populateDatabase();