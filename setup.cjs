// setup.cjs
require('dotenv').config();
const { Pool } = require('pg');

// Initialize database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Define the schema tables
const tables = {
  courts: {
    id: 'serial',
    name: 'text',
    type: 'text',
    description: 'text',
    pricePerHour: 'double precision',
    isActive: 'boolean',
  },
  membershipTiers: {
    id: 'serial',
    name: 'text',
    description: 'text',
    monthlyPrice: 'double precision',
    freeBookingsPerMonth: 'integer',
    discountPercentage: 'integer',
    otherBenefits: 'text',
    isPopular: 'boolean',
  },
  users: {
    id: 'serial',
    username: 'text',
    password: 'text',
    email: 'text',
    fullName: 'text',
    phone: 'text',
    isAdmin: 'boolean',
    createdAt: 'timestamp',
  },
  coaches: {
    id: 'serial',
    name: 'text',
    title: 'text',
    bio: 'text',
    imagePath: 'text',
    pricePerHour: 'double precision',
  },
  classes: {
    id: 'serial',
    name: 'text',
    description: 'text',
    coachId: 'integer',
    dayOfWeek: 'text',
    startTime: 'text',
    endTime: 'text',
    maxCapacity: 'integer',
    currentEnrollment: 'integer',
  },
  events: {
    id: 'serial',
    name: 'text',
    description: 'text',
    startDate: 'timestamp',
    endDate: 'timestamp',
    imagePath: 'text',
    price: 'double precision',
    maxParticipants: 'integer',
    currentParticipants: 'integer',
  },
  blogPosts: {
    id: 'serial',
    title: 'text',
    content: 'text',
    imagePath: 'text',
    publishDate: 'timestamp',
    authorId: 'integer',
    excerpt: 'text',
    slug: 'text',
  },
  testimonials: {
    id: 'serial',
    name: 'text',
    memberFor: 'text',
    imagePath: 'text',
    content: 'text',
    rating: 'integer',
    isActive: 'boolean',
  },
};

async function executeQuery(query, params = []) {
  return pool.query(query, params);
}

async function populateDatabase() {
  console.log('Starting database population...');

  try {
    // Create default courts
    console.log('Creating courts...');
    await executeQuery(`
      INSERT INTO courts (name, type, description, price_per_hour, is_active)
      VALUES
        ('Indoor Court 1', 'indoor', 'Professional-grade indoor court with excellent lighting', 30, true),
        ('Indoor Court 2', 'indoor', 'Professional-grade indoor court with excellent lighting', 30, true),
        ('Outdoor Court 1', 'outdoor', 'Excellent outdoor court with weather protection', 25, true),
        ('Outdoor Court 2', 'outdoor', 'Excellent outdoor court with weather protection', 25, true)
      ON CONFLICT DO NOTHING;
    `);

    // Create default membership tiers
    console.log('Creating membership tiers...');
    await executeQuery(`
      INSERT INTO membership_tiers (name, description, monthly_price, free_bookings_per_month, discount_percentage, other_benefits, is_popular)
      VALUES
        ('Basic', 'Entry-level membership with essential benefits', 40, 2, 10, 'Access to member-only events', false),
        ('Premium', 'Enhanced membership with additional benefits', 75, 5, 20, '1 free group class per month, Priority booking (48hr advance)', true),
        ('Elite', 'All-inclusive membership for dedicated players', 120, 10, 30, '2 free group classes per month, 1 free private coaching session, Priority booking (72hr advance)', false)
      ON CONFLICT DO NOTHING;
    `);

    // Create default coaches
    console.log('Creating coaches...');
    await executeQuery(`
      INSERT INTO coaches (name, title, bio, image_path, price_per_hour)
      VALUES
        ('Miguel Gonzalez', 'Head Coach · Former WPT Player', '10+ years coaching experience with professional tournament background. Specializes in advanced technique and strategy.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', 60),
        ('Sarah Murphy', 'Performance Coach · Irish Champion', 'Irish Padel Champion with expertise in competitive play. Perfect for intermediate players looking to advance their game.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', 55),
        ('Mark Johnson', 'Junior Development Coach', 'Specializes in beginner and junior coaching. Patient approach perfect for those new to the sport of all ages.', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', 45)
      ON CONFLICT DO NOTHING;
    `);

    // Create default classes
    console.log('Creating classes...');
    await executeQuery(`
      INSERT INTO classes (name, description, coach_id, day_of_week, start_time, end_time, max_capacity, current_enrollment)
      VALUES
        ('Beginner Fundamentals', 'Learn the basics of padel tennis in a fun, supportive environment', 3, 'Monday', '18:00', '19:30', 8, 5),
        ('Intermediate Tactics', 'Improve your game with strategic plays and tactical knowledge', 2, 'Tuesday', '19:00', '20:30', 8, 3),
        ('Advanced Strategies', 'Master advanced techniques with our head coach', 1, 'Wednesday', '20:00', '21:30', 6, 6),
        ('Ladies Only Session', 'Focused training for women in a supportive environment', 2, 'Thursday', '18:00', '19:30', 8, 2),
        ('Weekend Warriors', 'Weekend session for all levels with focus on fun and improvement', 3, 'Saturday', '11:00', '12:30', 8, 4)
      ON CONFLICT DO NOTHING;
    `);

    // Create default events
    console.log('Creating events...');
    await executeQuery(`
      INSERT INTO events (name, description, start_date, end_date, image_path, price, max_participants, current_participants)
      VALUES
        ('Dublin Open Tournament', 'A weekend tournament for intermediate and advanced players with prizes and refreshments.', '2025-05-20', '2025-05-21', 'https://images.unsplash.com/photo-1602211844066-d3bb556e983b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80', 40, 32, 12),
        ('Beginners Social Night', 'A fun evening for newcomers to meet other players, learn the basics, and enjoy light refreshments.', '2025-06-03', '2025-06-03', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80', 15, 24, 5),
        ('Kids Summer Camp', 'A week-long summer camp for children ages 8-14. All equipment provided.', '2025-07-10', '2025-07-14', 'https://images.unsplash.com/photo-1526307616774-60d0098f7642?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80', 180, 20, 8),
        ('Pro Exhibition Match', 'Watch professional players showcase their skills with a meet and greet afterward.', '2025-07-22', '2025-07-22', 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80', 25, 100, 27)
      ON CONFLICT DO NOTHING;
    `);

    // Create a default user for blog posts
    console.log('Creating admin user...');
    try {
      await executeQuery(`
        INSERT INTO users (username, password, email, full_name, phone, is_admin, created_at)
        VALUES ('admin', 'password123', 'admin@celticpadel.ie', 'Admin User', '+353 123 4567', true, CURRENT_TIMESTAMP)
        ON CONFLICT DO NOTHING;
      `);
    } catch (error) {
      console.log("Admin user may already exist, skipping creation");
    }

    // Create default blog posts
    console.log('Creating blog posts...');
    await executeQuery(`
      INSERT INTO blog_posts (title, content, image_path, author_id, excerpt, slug, publish_date)
      VALUES
        ('Beginner''s Guide to Padel Equipment', 'Everything you need to know about choosing your first padel racket, proper footwear, and essential accessories...', 'https://images.unsplash.com/photo-1612908605393-8e28e6a357ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 1, 'Everything you need to know about choosing your first padel racket, proper footwear, and essential accessories.', 'beginners-guide-to-padel-equipment', '2023-05-10'),
        ('5 Strategies to Improve Your Padel Game', 'Advanced techniques and tactical approaches to help you dominate the court and outsmart your opponents...', 'https://images.unsplash.com/photo-1591491580609-e8b83671fa6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 1, 'Advanced techniques and tactical approaches to help you dominate the court and outsmart your opponents.', '5-strategies-to-improve-your-padel-game', '2023-05-03'),
        ('Spring Tournament Recap: Highlights and Winners', 'A look back at our successful spring tournament, featuring exciting matches, standout performances, and community fun...', 'https://images.unsplash.com/photo-1509539662397-c7315ff49a31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 1, 'A look back at our successful spring tournament, featuring exciting matches, standout performances, and community fun.', 'spring-tournament-recap', '2023-04-25')
      ON CONFLICT DO NOTHING;
    `);

    // Create default testimonials
    console.log('Creating testimonials...');
    await executeQuery(`
      INSERT INTO testimonials (name, member_for, image_path, content, rating, is_active)
      VALUES
        ('John D.', '2 years', 'https://xsgames.co/randomusers/assets/avatars/male/32.jpg', 'Celtic Padel has transformed my weekends. The facilities are top-notch and the community is so welcoming. Coach Miguel has helped me improve my game tremendously.', 5, true),
        ('Emma T.', '1 year', 'https://xsgames.co/randomusers/assets/avatars/female/44.jpg', 'I started as a complete beginner and now play in local tournaments. The ladies-only sessions were perfect for building my confidence. Facilities are modern and always clean.', 5, true),
        ('David M.', '6 months', 'https://xsgames.co/randomusers/assets/avatars/male/67.jpg', 'The booking system is so convenient, and the Elite membership is great value for how often I play. The tournaments are well-organized and a great way to meet other players.', 4, true)
      ON CONFLICT DO NOTHING;
    `);

    console.log('Database population completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    // Close the connection
    await pool.end();
  }
}

populateDatabase();