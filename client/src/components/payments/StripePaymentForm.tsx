import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
// Check for the public key
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.error('Missing Stripe public key. VITE_STRIPE_PUBLIC_KEY environment variable is required.');
}

// Load Stripe with the public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

function CheckoutForm({ onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // Use redirect: 'if_required' to handle both payment methods that require 
    // additional actions and those that complete immediately
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Use a clean URL without query parameters for redirect
        return_url: `${window.location.origin}/booking-confirmation`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || "An unknown error occurred");
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: error.message || "An unknown error occurred",
      });
    } else {
      toast({
        title: "Payment successful",
        description: "Your court booking has been confirmed!",
      });
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Payment Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <PaymentElement className="mb-6" />
      
      <div className="flex justify-between mt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!stripe || isLoading}>
          {isLoading ? <Spinner className="mr-2" /> : null}
          Pay Now
        </Button>
      </div>
    </form>
  );
}

interface StripePaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function StripePaymentForm({ 
  clientSecret, 
  onSuccess,
  onCancel 
}: StripePaymentFormProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (clientSecret) {
      setIsReady(true);
    }
  }, [clientSecret]);

  if (!isReady) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#22c55e',
        colorBackground: '#1a2430',
        colorText: '#ffffff',
      },
    },
  };

  return (
    <div className="stripe-payment-container">
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm onSuccess={onSuccess} onCancel={onCancel} />
      </Elements>
    </div>
  );
}