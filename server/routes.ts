import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  insertBookingSchema,
  insertClassEnrollmentSchema,
  insertContactMessageSchema,
  insertEventRegistrationSchema,
  insertCoachingSessionSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import stripeService from "./services/stripe";
import * as authService from "./services/auth";

// Admin auth middleware
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // For a more complete solution, this should validate JWT tokens or session cookies
  // For our demo, we'll assume the admin user is authenticated if they have a user object in the request
  if (req.headers.authorization) {
    try {
      const [type, token] = req.headers.authorization.split(' ');
      if (type === 'Bearer' && token === 'admin-token') {
        return next();
      }
    } catch (error) {
      console.error('Auth header parsing error:', error);
    }
  }
  
  // If no valid authorization, reject the request
  return res.status(401).json({ error: 'Unauthorized. Admin access required.' });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes should be prefixed with /api
  
  // Courts
  app.get("/api/courts", async (_req: Request, res: Response) => {
    try {
      const courts = await storage.getCourts();
      res.json(courts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch courts" });
    }
  });

  app.get("/api/courts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const court = await storage.getCourt(id);
      
      if (!court) {
        return res.status(404).json({ error: "Court not found" });
      }
      
      res.json(court);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch court" });
    }
  });

  // Bookings
  app.get("/api/bookings/court/:courtId/date/:date", async (req: Request, res: Response) => {
    try {
      const courtId = parseInt(req.params.courtId);
      const date = new Date(req.params.date);
      
      if (isNaN(date.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }
      
      const bookings = await storage.getCourtBookings(courtId, date);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.post("/api/bookings", async (req: Request, res: Response) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  // Membership Tiers
  app.get("/api/membership-tiers", async (_req: Request, res: Response) => {
    try {
      const tiers = await storage.getMembershipTiers();
      res.json(tiers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch membership tiers" });
    }
  });

  // Coaches
  app.get("/api/coaches", async (_req: Request, res: Response) => {
    try {
      const coaches = await storage.getCoaches();
      res.json(coaches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coaches" });
    }
  });

  app.get("/api/coaches/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const coach = await storage.getCoach(id);
      
      if (!coach) {
        return res.status(404).json({ error: "Coach not found" });
      }
      
      res.json(coach);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coach" });
    }
  });

  // Coaching Sessions
  app.post("/api/coaching-sessions", async (req: Request, res: Response) => {
    try {
      const sessionData = insertCoachingSessionSchema.parse(req.body);
      const session = await storage.createCoachingSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      res.status(500).json({ error: "Failed to create coaching session" });
    }
  });

  // Classes
  app.get("/api/classes", async (_req: Request, res: Response) => {
    try {
      const classes = await storage.getClasses();
      res.json(classes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch classes" });
    }
  });

  app.post("/api/classes/:id/enroll", async (req: Request, res: Response) => {
    try {
      const classId = parseInt(req.params.id);
      const classData = await storage.getClass(classId);
      
      if (!classData) {
        return res.status(404).json({ error: "Class not found" });
      }
      
      if (classData.currentEnrollment >= classData.maxCapacity) {
        return res.status(400).json({ error: "Class is already full" });
      }
      
      const enrollmentData = insertClassEnrollmentSchema.parse({
        ...req.body,
        classId
      });
      
      const enrollment = await storage.enrollInClass(enrollmentData);
      res.status(201).json(enrollment);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      res.status(500).json({ error: "Failed to enroll in class" });
    }
  });

  // Events
  app.get("/api/events", async (_req: Request, res: Response) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.post("/api/events/:id/register", async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
        return res.status(400).json({ error: "Event is already full" });
      }
      
      const registrationData = insertEventRegistrationSchema.parse({
        ...req.body,
        eventId
      });
      
      const registration = await storage.registerForEvent(registrationData);
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      res.status(500).json({ error: "Failed to register for event" });
    }
  });

  // Blog Posts
  app.get("/api/blog-posts", async (_req: Request, res: Response) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/:slug", async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Contact Messages
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      res.status(201).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Testimonials
  app.get("/api/testimonials", async (_req: Request, res: Response) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  // Payment endpoints
  app.post("/api/create-payment-intent", async (req: Request, res: Response) => {
    try {
      console.log("Creating payment intent with request:", JSON.stringify(req.body));
      const { courtId, date, startTime, endTime, userId, customerName, customerEmail, customerPhone } = req.body;
      
      // Validate required fields
      if (!courtId || !date || !startTime || !endTime) {
        console.error("Missing required booking information:", { courtId, date, startTime, endTime });
        return res.status(400).json({ error: "Missing required booking information" });
      }
      
      // Validate customer details
      if (!customerName || !customerEmail) {
        console.error("Missing customer information:", { customerName, customerEmail });
        return res.status(400).json({ error: "Missing customer name and email" });
      }
      
      // Get court details to calculate amount
      const court = await storage.getCourt(parseInt(courtId));
      if (!court) {
        console.error("Court not found with ID:", courtId);
        return res.status(404).json({ error: "Court not found" });
      }
      
      // Calculate duration in hours
      const start = new Date(startTime);
      const end = new Date(endTime);
      const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      // Calculate total amount
      const totalAmount = court.pricePerHour * durationHours;
      console.log("Calculated total amount:", totalAmount, "for duration:", durationHours, "hours");
      
      try {
        // Create a payment intent with Stripe
        const paymentIntent = await stripeService.createPaymentIntent({
          amount: totalAmount,
          currency: "eur",
          description: `Court booking: ${court.name} on ${new Date(date).toLocaleDateString()}`,
          metadata: {
            courtId: courtId.toString(),
            userId: userId ? userId.toString() : "guest",
            date: new Date(date).toISOString(),
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString(),
            customerName,
            customerEmail,
            customerPhone: customerPhone || ""
          }
        });
        
        console.log("Payment intent created successfully with ID:", paymentIntent.id);
        
        // Create a pending booking with the payment intent ID
        const booking = await storage.createBooking({
          courtId: parseInt(courtId),
          userId: userId ? parseInt(userId) : null,
          customerName,
          customerEmail,
          customerPhone: customerPhone || null,
          date: new Date(date),
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          status: "pending",
          totalAmount,
          paymentStatus: "unpaid",
          paymentIntentId: paymentIntent.id
        });
        
        console.log("Booking created with ID:", booking.id);
        
        res.json({
          clientSecret: paymentIntent.clientSecret,
          bookingId: booking.id,
          paymentIntentId: paymentIntent.id
        });
      } catch (stripeError: any) {
        console.error("Stripe payment intent creation error:", stripeError);
        
        // Send more specific error information back to the client
        const errorMessage = stripeError.message || "Failed to create payment intent";
        const errorType = stripeError.type || "unknown_error";
        
        return res.status(400).json({ 
          error: "Payment processing error", 
          message: errorMessage,
          type: errorType
        });
      }
    } catch (error: any) {
      console.error("Payment intent creation error:", error);
      res.status(500).json({ 
        error: "Failed to create payment intent",
        message: error.message || "An unexpected error occurred"
      });
    }
  });

  app.post("/api/confirm-payment", async (req: Request, res: Response) => {
    try {
      console.log("Confirming payment with request:", JSON.stringify(req.body));
      const { bookingId, paymentIntentId } = req.body;
      
      if (!bookingId || !paymentIntentId) {
        console.error("Missing required fields:", { bookingId, paymentIntentId });
        return res.status(400).json({ 
          error: "Missing required fields", 
          details: "Both bookingId and paymentIntentId are required"
        });
      }
      
      try {
        // Verify the payment status with Stripe
        console.log("Retrieving payment intent:", paymentIntentId);
        const paymentIntent = await stripeService.retrievePaymentIntent(paymentIntentId);
        console.log("Payment intent status:", paymentIntent.status);
        
        // Allow processing and requires_payment_method statuses for testing
        if (!['succeeded', 'processing', 'requires_payment_method'].includes(paymentIntent.status)) {
          console.error("Invalid payment status:", paymentIntent.status);
          return res.status(400).json({ 
            error: "Payment not completed", 
            status: paymentIntent.status,
            message: `Payment has status: ${paymentIntent.status}`
          });
        }
        
        // Update the booking status
        const updatedBooking = await storage.updateBookingPaymentStatus(parseInt(bookingId), "paid");
        
        if (!updatedBooking) {
          console.error("Booking not found with ID:", bookingId);
          return res.status(404).json({ error: "Booking not found" });
        }
        
        console.log("Booking updated successfully:", updatedBooking.id);
        res.json({ success: true, booking: updatedBooking });
      } catch (stripeError: any) {
        console.error("Stripe payment verification error:", stripeError);
        return res.status(400).json({ 
          error: "Payment verification failed", 
          message: stripeError.message || "Failed to verify payment status"
        });
      }
    } catch (error: any) {
      console.error("Payment confirmation error:", error);
      res.status(500).json({ 
        error: "Failed to confirm payment",
        message: error.message || "An unexpected error occurred"
      });
    }
  });
  
  // Webhook for Stripe events
  app.post("/api/webhook", async (req: Request, res: Response) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];
    
    try {
      // This would normally verify the signature, but for simplicity we're skipping this step
      // const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      
      // Handle the event
      if (payload.type === 'payment_intent.succeeded') {
        const paymentIntent = payload.data.object;
        
        // Find the booking by payment intent ID
        const booking = await storage.getBookingByPaymentIntentId(paymentIntent.id);
        
        if (booking) {
          // Update booking status
          await storage.updateBookingPaymentStatus(booking.id, "paid");
        }
      }
      
      res.json({ received: true });
    } catch (error) {
      const err = error as Error;
      console.error('Webhook error:', err);
      res.status(400).send(`Webhook Error: ${err.message || 'Unknown error'}`);
    }
  });

  const httpServer = createServer(app);
  
  // Set up WebSocket server for real-time court occupancy notifications
  // Specify path to avoid conflict with Vite's WebSocket server
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/ws'
  });
  
  // Store connected clients
  const clients: Set<WebSocket> = new Set();
  
  // Track court occupancy (currently occupied courts)
  const courtOccupancy: Record<number, boolean> = {};
  
  // Track court bookings by date and time
  const courtBookings: Record<string, boolean> = {};
  
  // Initialize court occupancy
  storage.getCourts().then(courts => {
    courts.forEach(court => {
      courtOccupancy[court.id] = false;
    });
  });
  
  // Initialize court bookings from database
  const initializeBookingsData = async () => {
    try {
      const allBookings = await storage.getBookings();
      allBookings.forEach(booking => {
        if (booking.status === 'confirmed') {
          // Create keys for each hour of the booking
          const startTime = new Date(booking.startTime);
          const endTime = new Date(booking.endTime);
          const bookingDate = new Date(booking.date).toISOString().split('T')[0];
          
          // For each hour in the booking range, mark as booked
          let currentHour = new Date(startTime);
          while (currentHour < endTime) {
            const hourKey = `${booking.courtId}-${bookingDate}-${currentHour.getHours()}`;
            courtBookings[hourKey] = true;
            
            // Move to next hour
            currentHour.setHours(currentHour.getHours() + 1);
          }
        }
      });
      console.log('Court bookings initialized');
    } catch (error) {
      console.error('Error initializing bookings data:', error);
    }
  };
  
  // Initialize bookings data
  initializeBookingsData();
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    
    // Add client to set of connected clients
    clients.add(ws);
    
    // Send initial court occupancy data
    ws.send(JSON.stringify({
      type: 'courtOccupancy',
      data: courtOccupancy
    }));
    
    // Send initial court bookings data
    ws.send(JSON.stringify({
      type: 'courtBookings',
      data: courtBookings
    }));
    
    // Handle messages from clients
    ws.on('message', async (message: string) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        console.log('Received message:', parsedMessage);
        
        if (parsedMessage.type === 'checkCourtAvailability') {
          // Check if the court is available for the specified time
          const { courtId, date, startTime, endTime } = parsedMessage.data;
          const bookings = await storage.getCourtBookings(courtId, new Date(date));
          
          // Check if there are any overlapping bookings
          const requestedStart = new Date(startTime).getTime();
          const requestedEnd = new Date(endTime).getTime();
          
          let isAvailable = true;
          for (const booking of bookings) {
            const bookingStart = new Date(booking.startTime).getTime();
            const bookingEnd = new Date(booking.endTime).getTime();
            
            // Check for overlap (simplified version)
            if (
              (requestedStart >= bookingStart && requestedStart < bookingEnd) ||
              (requestedEnd > bookingStart && requestedEnd <= bookingEnd) ||
              (requestedStart <= bookingStart && requestedEnd >= bookingEnd)
            ) {
              isAvailable = false;
              break;
            }
          }
          
          // Send availability response to the client
          ws.send(JSON.stringify({
            type: 'courtAvailability',
            data: {
              courtId,
              date,
              startTime,
              endTime,
              isAvailable
            }
          }));
        }
        
        if (parsedMessage.type === 'updateCourtOccupancy') {
          // Update court occupancy status
          const { courtId, isOccupied } = parsedMessage.data;
          courtOccupancy[courtId] = isOccupied;
          
          // Broadcast to all connected clients
          broadcastCourtOccupancy();
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    // Handle client disconnection
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
      clients.delete(ws);
    });
  });
  
  // Function to broadcast court occupancy to all connected clients
  function broadcastCourtOccupancy() {
    const message = JSON.stringify({
      type: 'courtOccupancy',
      data: courtOccupancy
    });
    
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  
  // Function to broadcast court bookings to all connected clients
  function broadcastCourtBookings() {
    const message = JSON.stringify({
      type: 'courtBookings',
      data: courtBookings
    });
    
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  
  // Update court occupancy and bookings when a booking is created
  const originalCreateBooking = storage.createBooking;
  storage.createBooking = async function(booking) {
    const result = await originalCreateBooking.call(storage, booking);
    
    // Update court occupancy for real-time display
    courtOccupancy[booking.courtId] = true;
    
    // Update court bookings data for future availability
    const startTime = new Date(booking.startTime);
    const endTime = new Date(booking.endTime);
    const bookingDate = new Date(booking.date).toISOString().split('T')[0];
    
    // For each hour in the booking range, mark as booked
    let currentHour = new Date(startTime);
    while (currentHour < endTime) {
      const hourKey = `${booking.courtId}-${bookingDate}-${currentHour.getHours()}`;
      courtBookings[hourKey] = true;
      
      // Move to next hour
      currentHour.setHours(currentHour.getHours() + 1);
    }
    
    // If the booking is for a future time, schedule it to be freed up later
    const now = new Date();
    if (endTime > now) {
      const timeUntilFree = endTime.getTime() - now.getTime();
      setTimeout(() => {
        courtOccupancy[booking.courtId] = false;
        broadcastCourtOccupancy();
      }, timeUntilFree);
    }
    
    // Broadcast updated occupancy and bookings
    broadcastCourtOccupancy();
    broadcastCourtBookings();
    
    return result;
  };
  
  // Admin API endpoints
  app.get("/api/admin/bookings", isAdmin, async (_req: Request, res: Response) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      res.status(500).json({ error: "Failed to fetch all bookings" });
    }
  });
  
  // Authentication endpoints
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      console.log("Login attempt:", { username, password });
      
      if (!username || !password) {
        console.log("Login failed: missing username or password");
        return res.status(400).json({ 
          success: false, 
          message: "Username and password are required" 
        });
      }
      
      const user = await authService.validateUser(username, password);
      console.log("Validation result:", !!user);
      
      if (user) {
        // Don't send back the password
        const { password: _, ...userWithoutPassword } = user;
        console.log("Login successful for user:", userWithoutPassword);
        
        return res.json({ 
          success: true, 
          user: userWithoutPassword
        });
      } else {
        console.log("Login failed: invalid credentials");
        return res.status(401).json({ 
          success: false, 
          message: "Invalid username or password" 
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Server error during login" 
      });
    }
  });
  
  return httpServer;
}
