import { User } from '@shared/schema';
import bcrypt from 'bcrypt';

// For our simple implementation, we'll have a hardcoded admin user
// In a real application, this would be retrieved from a database
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin'; // In production, this would be hashed

export async function validateUser(username: string, password: string): Promise<User | null> {
  // For demo purposes, we only have one admin user
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return {
      id: 1,
      username: 'admin',
      password: '', // We don't send the password back
      email: 'admin@celticpadel.com',
      fullName: 'Admin User',
      phone: null,
      isAdmin: true,
      createdAt: new Date()
    };
  }
  
  return null;
}
