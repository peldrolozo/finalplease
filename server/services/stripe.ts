import Stripe from 'stripe';

// Check that the key exists and is well-formed
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY must be set in the environment variables');
}

if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
  throw new Error('STRIPE_SECRET_KEY appears to be invalid. It should start with sk_test_ or sk_live_');
}

console.log('Initializing Stripe with key:', process.env.STRIPE_SECRET_KEY.substring(0, 8) + '...');

// Initialize Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export interface PaymentIntentData {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
}

export async function createPaymentIntent(data: PaymentIntentData) {
  try {
    // Convert amount to cents (Stripe uses smallest currency unit)
    const amountInCents = Math.round(data.amount * 100);
    
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: data.currency,
      description: data.description,
      metadata: data.metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    throw error;
  }
}

export async function cancelPaymentIntent(paymentIntentId: string) {
  try {
    return await stripe.paymentIntents.cancel(paymentIntentId);
  } catch (error) {
    console.error('Error canceling payment intent:', error);
    throw error;
  }
}

export default {
  createPaymentIntent,
  retrievePaymentIntent,
  cancelPaymentIntent,
};