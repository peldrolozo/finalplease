import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, XCircle } from "lucide-react";

export default function BookingConfirmation() {
  const [location, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  
  // Define a proper type for booking details
  type BookingDetails = {
    id: number;
    courtId: number;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    totalAmount: number;
    paymentStatus: string;
    paymentIntentId: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
  };
  
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  useEffect(() => {
    // This handles payment flow for both direct confirmations and redirects
    const handlePaymentConfirmation = async () => {
      try {
        console.log("Starting payment confirmation process");
        
        // Check for redirect parameters first (for cards that require 3D Secure)
        const searchParams = new URLSearchParams(window.location.search);
        const paymentIntent = searchParams.get("payment_intent");
        const redirectStatus = searchParams.get("redirect_status");
        
        // Log the parameters for debugging
        console.log("URL Parameters:", { 
          paymentIntent, 
          redirectStatus 
        });
        
        if (redirectStatus === "succeeded" && paymentIntent) {
          // For redirected payments
          console.log("Confirming redirected payment with ID:", paymentIntent);
          await confirmPayment(paymentIntent);
        } else {
          // For direct payments or when parameters are missing
          console.log("Checking local storage for booking info");
          const bookingId = localStorage.getItem("currentBookingId");
          const storedPaymentIntentId = localStorage.getItem("currentPaymentIntentId");
          
          if (bookingId && storedPaymentIntentId) {
            console.log("Found stored payment info, confirming payment:", storedPaymentIntentId);
            await confirmPayment(storedPaymentIntentId);
          } else {
            console.error("No payment information found in URL or local storage");
            setStatus("error");
          }
        }
      } catch (error) {
        console.error("Error during payment confirmation:", error);
        setStatus("error");
      }
    };
    
    handlePaymentConfirmation();
  }, []);

  const confirmPayment = async (paymentIntentId: string) => {
    try {
      // Get the booking ID from local storage
      const bookingId = localStorage.getItem("currentBookingId");
      
      if (!bookingId) {
        setStatus("error");
        return;
      }

      // Send confirmation to backend
      const response = await apiRequest("POST", "/api/confirm-payment", {
        bookingId,
        paymentIntentId
      });

      const data = await response.json();
      
      if (data.success) {
        setBookingDetails(data.booking);
        setStatus("success");
        // Clear all booking and payment data from local storage
        localStorage.removeItem("currentBookingId");
        localStorage.removeItem("currentPaymentIntentId");
        console.log("Payment confirmed successfully and local storage cleaned");
      } else {
        console.error("Payment confirmation failed:", data);
        setStatus("error");
      }
    } catch (error) {
      console.error("Payment confirmation error:", error);
      setStatus("error");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container max-w-lg mx-auto py-16 px-4">
      <Card className="bg-[#1a2430] text-white border border-[#22c55e] shadow-xl mt-10">
        <CardHeader className="pt-8">
          <CardTitle className="text-2xl text-center font-bold">Booking Confirmation</CardTitle>
          <CardDescription className="text-center text-[#d1d5db]">
            {status === "loading" ? "Processing your booking..." : 
             status === "success" ? "Your court is booked successfully!" : 
             "There was an issue with your booking"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pb-6">
          {status === "loading" && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-6 border-4 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#d1d5db]">Please wait while we confirm your booking...</p>
            </div>
          )}
          
          {status === "success" && bookingDetails && (
            <div className="flex flex-col items-center space-y-6 w-full">
              <div className="rounded-full bg-[#22c55e]/20 p-4 shadow-lg">
                <CheckCircle className="h-14 w-14 text-[#22c55e]" />
              </div>
              
              <div className="w-full space-y-4 bg-[#0f141a]/50 rounded-lg p-4 border border-[#0f141a]">
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-b border-[#0f141a] pb-4">
                  {/* Always show customer section, even if null */}
                  <div className="text-[#d1d5db]">Booked for:</div>
                  <div className="text-right font-medium text-white">{bookingDetails.customerName || "Guest"}</div>
                  
                  <div className="text-[#d1d5db]">Email:</div>
                  <div className="text-right font-medium text-white">{bookingDetails.customerEmail || "N/A"}</div>
                  
                  <div className="text-[#d1d5db]">Phone:</div>
                  <div className="text-right font-medium text-white">{bookingDetails.customerPhone || "N/A"}</div>
                  
                  <div className="text-[#d1d5db]">Court:</div>
                  <div className="text-right font-medium text-white">Court #{bookingDetails.courtId}</div>
                  
                  <div className="text-[#d1d5db]">Date:</div>
                  <div className="text-right font-medium text-white">{formatDate(bookingDetails.date)}</div>
                  
                  <div className="text-[#d1d5db]">Time:</div>
                  <div className="text-right font-medium text-white">
                    {formatTime(bookingDetails.startTime)} - {formatTime(bookingDetails.endTime)}
                  </div>
                  
                  <div className="text-[#d1d5db]">Amount Paid:</div>
                  <div className="text-right font-medium text-[#22c55e]">€{bookingDetails.totalAmount?.toFixed(2)}</div>
                  
                  <div className="text-[#d1d5db]">Status:</div>
                  <div className="text-right font-medium text-[#22c55e] capitalize">{bookingDetails.status}</div>
                </div>
                <div className="text-center text-sm text-[#d1d5db] pt-2">
                  A confirmation email has been sent to {bookingDetails.customerEmail || "your registered email address"}.
                </div>
              </div>
            </div>
          )}
          
          {status === "error" && (
            <div className="flex flex-col items-center space-y-6">
              <div className="rounded-full bg-red-500/20 p-4 shadow-lg">
                <XCircle className="h-14 w-14 text-red-500" />
              </div>
              <div className="bg-[#0f141a]/50 rounded-lg p-4 border border-[#0f141a] text-center">
                <p className="mb-2 text-lg font-medium">Payment Verification Failed</p>
                <p className="text-[#d1d5db]">
                  We couldn't confirm your booking. Please contact our support team or try again later.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center pb-8">
          <Button 
            onClick={() => setLocation("/")}
            className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-semibold shadow-lg"
          >
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}