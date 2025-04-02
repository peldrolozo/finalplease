import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarDays, Clock, CreditCard, AlertCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useCourtOccupancy } from "@/hooks/use-court-occupancy";
import { CourtOccupancyIndicator } from "./CourtOccupancyIndicator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StripePaymentForm from "@/components/payments/StripePaymentForm";
import type { Court } from "@shared/schema";

const BookingForm = () => {
  const { toast } = useToast();
  const { isConnected, isCourtOccupied, isTimeSlotBooked } = useCourtOccupancy();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  
  // Fetch courts
  const { data: courts, isLoading: isLoadingCourts } = useQuery<Court[]>({
    queryKey: ['/api/courts'],
  });
  
  // Create booking form schema
  const formSchema = z.object({
    courtId: z.string().min(1, "Please select a court"),
    duration: z.string().min(1, "Please select a duration"),
    customerName: z.string().min(2, "Please enter your name"),
    customerEmail: z.string().email("Please enter a valid email"),
    customerPhone: z.string().optional(),
  });
  
  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courtId: "",
      duration: "60",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
    },
  });
  
  // Create payment intent mutation
  const paymentIntentMutation = useMutation({
    mutationFn: async (data: { 
      courtId: number;
      date: string;
      startTime: string;
      endTime: string;
      userId?: number;
      customerName: string;
      customerEmail: string;
      customerPhone?: string;
    }) => {
      return apiRequest('POST', '/api/create-payment-intent', data);
    },
    onSuccess: async (response) => {
      const data = await response.json();
      console.log("Payment intent created:", data);
      setPaymentClientSecret(data.clientSecret);
      
      // Store both booking ID and payment intent ID for confirmation
      if (data.bookingId) {
        localStorage.setItem('currentBookingId', data.bookingId.toString());
      }
      
      if (data.paymentIntentId) {
        localStorage.setItem('currentPaymentIntentId', data.paymentIntentId);
      }
      
      setIsPaymentModalOpen(true);
      setBookingInProgress(false);
    },
    onError: (error) => {
      toast({
        title: "Payment setup failed",
        description: error.message || "There was an error setting up your payment. Please try again.",
        variant: "destructive",
      });
      setBookingInProgress(false);
    },
  });
  
  // Create booking mutation (legacy, kept for reference)
  const bookingMutation = useMutation({
    mutationFn: async (data: { courtId: number, userId: number | null, date: Date, startTime: Date, endTime: Date, status: string }) => {
      return apiRequest('POST', '/api/bookings', data);
    },
    onSuccess: () => {
      toast({
        title: "Booking confirmed!",
        description: "Your court has been booked successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      form.reset();
      setSelectedTimeSlot(null);
    },
    onError: (error) => {
      toast({
        title: "Booking failed",
        description: error.message || "There was an error booking your court. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      days.push({
        date: date.toISOString().split('T')[0],
        dayOfMonth: date.getDate(),
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
      });
    }
    
    return days;
  };
  
  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    const openingHour = 8; // 8 AM
    const closingHour = 22; // 10 PM
    
    for (let hour = openingHour; hour < closingHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    
    return slots;
  };
  
  const calendarDays = generateCalendarDays();
  const timeSlots = generateTimeSlots();
  
  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };
  
  // Handle time slot selection
  const handleTimeSlotSelect = (time: string) => {
    setSelectedTimeSlot(time);
  };
  
  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!selectedTimeSlot) {
      toast({
        title: "Time slot required",
        description: "Please select a time slot for your booking.",
        variant: "destructive",
      });
      return;
    }
    
    const startDateTime = new Date(`${selectedDate}T${selectedTimeSlot}`);
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + parseInt(values.duration));
    
    // Check for overlapping bookings
    const courtId = parseInt(values.courtId);
    const startHour = startDateTime.getHours();
    const durationHours = parseInt(values.duration) / 60;
    let hasOverlap = false;
    
    // Check each hour of the booking for availability
    for (let i = 0; i < durationHours; i++) {
      const hour = startHour + i;
      if (isTimeSlotBooked(courtId, selectedDate, hour)) {
        hasOverlap = true;
        break;
      }
    }
    
    if (hasOverlap) {
      toast({
        title: "Time slot conflict",
        description: "This booking overlaps with an existing reservation. Please select a different time or duration.",
        variant: "destructive",
      });
      return;
    }
    
    // Set booking in progress
    setBookingInProgress(true);
    
    // Create payment intent for the booking
    paymentIntentMutation.mutate({
      courtId: courtId,
      date: selectedDate,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      userId: 1, // Use a default user ID for demo purposes
      customerName: values.customerName,
      customerEmail: values.customerEmail,
      customerPhone: values.customerPhone,
    });
  };
  
  // Handle payment success
  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    setPaymentClientSecret(null);
    
    // Reset form and selections
    form.reset();
    setSelectedTimeSlot(null);
    
    // Show success message
    toast({
      title: "Payment successful!",
      description: "Your court has been booked successfully.",
    });
    
    // Invalidate queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
    
    // Redirect to the booking confirmation page
    // The confirmation page will read the necessary data from localStorage
    window.location.href = '/booking-confirmation';
  };
  
  // Handle payment cancellation
  const handlePaymentCancel = () => {
    setIsPaymentModalOpen(false);
    setPaymentClientSecret(null);
    
    toast({
      title: "Booking cancelled",
      description: "Your booking request has been cancelled. No payment was processed.",
    });
  };
  
  // Calculate price based on court and duration
  const calculatePrice = () => {
    const courtId = form.watch("courtId");
    const duration = form.watch("duration");
    
    if (!courtId || !duration || !courts) return null;
    
    const court = courts.find((c: Court) => c.id === parseInt(courtId));
    if (!court) return null;
    
    const hours = parseInt(duration) / 60;
    return court.pricePerHour * hours;
  };

  return (
    <section id="book" className="py-20 bg-[#0f141a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Book a <span className="text-[#22c55e]">Court</span>
          </h2>
          <p className="text-[#d1d5db] max-w-2xl mx-auto">
            Reserve your court in just a few clicks
          </p>
        </div>
        
        <Card className="bg-[#1a2430] rounded-xl overflow-hidden shadow-xl max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Date Selection */}
            <CardContent className="p-6 md:border-r border-[#0f141a]/30">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-[#22c55e]" />
                Select Date
              </h3>
              <div className="booking-calendar grid grid-cols-7 gap-1 text-center">
                {/* Calendar header */}
                <div className="text-xs text-[#d1d5db] py-2">Mon</div>
                <div className="text-xs text-[#d1d5db] py-2">Tue</div>
                <div className="text-xs text-[#d1d5db] py-2">Wed</div>
                <div className="text-xs text-[#d1d5db] py-2">Thu</div>
                <div className="text-xs text-[#d1d5db] py-2">Fri</div>
                <div className="text-xs text-[#d1d5db] py-2">Sat</div>
                <div className="text-xs text-[#d1d5db] py-2">Sun</div>
                
                {/* Calendar days */}
                {calendarDays.map((day) => (
                  <div
                    key={day.date}
                    className={`py-2 px-1 rounded-md text-sm cursor-pointer ${
                      selectedDate === day.date
                        ? "bg-[#22c55e] text-white"
                        : "hover:bg-[#22c55e]/20"
                    }`}
                    onClick={() => handleDateSelect(day.date)}
                  >
                    {day.dayOfMonth}
                  </div>
                ))}
              </div>
            </CardContent>
            
            {/* Time Selection */}
            <CardContent className="p-6 md:border-r border-[#0f141a]/30">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-[#22c55e]" />
                Select Time
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((time) => {
                  const hour = parseInt(time.split(':')[0]);
                  const courtId = form.watch("courtId");
                  const isBooked = courtId && isTimeSlotBooked(parseInt(courtId), selectedDate, hour);
                  
                  return (
                    <div
                      key={time}
                      className={`border rounded-md p-2 text-center text-sm transition-all ${
                        isBooked 
                          ? 'border-red-500 bg-red-500/10 cursor-not-allowed opacity-70 hover:bg-red-500/20'
                          : selectedTimeSlot === time
                            ? "border-[#22c55e] bg-[#22c55e]/20 cursor-pointer"
                            : "border-gray-600 hover:bg-[#22c55e]/20 hover:border-[#22c55e] cursor-pointer"
                      }`}
                      onClick={() => {
                        if (!isBooked && courtId) {
                          handleTimeSlotSelect(time);
                        } else if (isBooked) {
                          toast({
                            title: "Time slot unavailable",
                            description: "This time slot is already booked. Please select another time.",
                            variant: "destructive",
                          });
                        } else if (!courtId) {
                          toast({
                            title: "Court selection required",
                            description: "Please select a court first to check availability.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <div className="flex items-center justify-center">
                        {time}
                        {isBooked && <span className="ml-2 text-red-500 text-xs">(Booked)</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            
            {/* Court Details */}
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Court Details</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="courtId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-[#d1d5db]">Court Type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isLoadingCourts}
                          >
                            <SelectTrigger className="w-full bg-[#0f141a] border-gray-600">
                              <SelectValue placeholder="Select a court" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0f141a] border-gray-600">
                              {isLoadingCourts ? (
                                <Skeleton className="h-6 w-full" />
                              ) : courts && courts.length > 0 ? (
                                courts.map((court: Court) => (
                                  <SelectItem 
                                    key={court.id} 
                                    value={court.id.toString()}
                                    className="relative pr-16"
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span>{court.name}</span>
                                      <div className="absolute right-2">
                                        <CourtOccupancyIndicator courtId={court.id} />
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="" disabled>No courts available</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-[#d1d5db]">Duration</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full bg-[#0f141a] border-gray-600">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0f141a] border-gray-600">
                              <SelectItem value="60">60 minutes</SelectItem>
                              <SelectItem value="90">90 minutes</SelectItem>
                              <SelectItem value="120">120 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {calculatePrice() !== null && (
                    <div className="text-[#d1d5db] text-sm mt-2">
                      Price: <span className="text-[#22c55e] font-bold">€{calculatePrice()?.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-[#0f141a]/30 mt-4">
                    <h4 className="text-lg font-semibold mb-3">Your Information</h4>
                    
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem className="mb-3">
                          <FormLabel className="text-sm text-[#d1d5db]">Full Name</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              className="flex h-9 w-full rounded-md border border-gray-600 bg-[#0f141a] px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                              placeholder="John Smith"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }) => (
                        <FormItem className="mb-3">
                          <FormLabel className="text-sm text-[#d1d5db]">Email</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              type="email"
                              className="flex h-9 w-full rounded-md border border-gray-600 bg-[#0f141a] px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                              placeholder="john@example.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-[#d1d5db]">Phone (optional)</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              type="tel"
                              className="flex h-9 w-full rounded-md border border-gray-600 bg-[#0f141a] px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                              placeholder="+353 123 456 7890"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-bold shadow-lg hover:shadow-[#22c55e]/30 mt-6"
                    disabled={bookingInProgress || paymentIntentMutation.isPending}
                  >
                    {bookingInProgress || paymentIntentMutation.isPending ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Book & Pay Now
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </div>
        </Card>
      </div>
      
      {/* Payment Dialog */}
      <Dialog 
        open={isPaymentModalOpen} 
        onOpenChange={(open) => {
          if (!open) handlePaymentCancel();
          setIsPaymentModalOpen(open);
        }}
      >
        <DialogContent className="bg-[#1a2430] text-white border-[#0f141a]/30 max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold">
              Complete Payment
            </DialogTitle>
            <DialogDescription className="text-[#d1d5db]">
              Your court booking is reserved for 15 minutes. Please complete payment to confirm.
            </DialogDescription>
          </DialogHeader>
          
          {paymentClientSecret && (
            <StripePaymentForm
              clientSecret={paymentClientSecret}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default BookingForm;
