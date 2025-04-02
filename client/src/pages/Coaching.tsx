import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";
import CoachCard from "@/components/coaching/CoachCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import type { Coach } from "@shared/schema";

const Coaching = () => {
  const { toast } = useToast();
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Fetch coaches
  const { data: coaches, isLoading } = useQuery({
    queryKey: ['/api/coaches'],
  });

  // Create coaching session mutation
  const bookSessionMutation = useMutation({
    mutationFn: async (data: { coachId: number, date: string, startTime: string, endTime: string }) => {
      return apiRequest('POST', '/api/coaching-sessions', data);
    },
    onSuccess: () => {
      toast({
        title: "Session booked!",
        description: "Your coaching session has been scheduled successfully.",
      });
      setBookingDialogOpen(false);
      setSelectedCoach(null);
      setSelectedTime("");
      queryClient.invalidateQueries({ queryKey: ['/api/coaching-sessions'] });
    },
    onError: (error) => {
      toast({
        title: "Booking failed",
        description: error.message || "There was an error booking your session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBookClick = (coach: Coach) => {
    setSelectedCoach(coach);
    setBookingDialogOpen(true);
  };

  const handleBookSession = () => {
    if (!selectedCoach || !selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select a date and time for your session.",
        variant: "destructive",
      });
      return;
    }

    const startDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1); // 1 hour session

    bookSessionMutation.mutate({
      coachId: selectedCoach.id,
      date: selectedDate,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
    });
  };

  // Generate available time slots
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 9; // Start at 9 AM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  return (
    <section className="py-20 pt-28 bg-[#0f141a] min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Private <span className="text-[#22c55e]">Coaching</span>
          </h1>
          <p className="text-[#d1d5db] max-w-2xl mx-auto">
            Learn from our certified professional coaches
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="bg-[#1a2430]">
                <div className="h-64 bg-gray-800 animate-pulse" />
                <div className="p-6">
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-48 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-10 w-28" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            coaches?.map((coach: Coach) => (
              <CoachCard 
                key={coach.id} 
                coach={coach} 
                onClick={() => handleBookClick(coach)} 
              />
            ))
          )}
        </div>

        {/* Booking Dialog */}
        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
          <DialogContent className="bg-[#1a2430] border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Book a Session with {selectedCoach?.name}
              </DialogTitle>
              <DialogDescription className="text-[#d1d5db]">
                Choose a date and time for your private coaching session.
                <div className="mt-2 text-white">
                  Price: <span className="text-[#22c55e] font-bold">€{selectedCoach?.pricePerHour}</span> per hour
                </div>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm text-[#d1d5db] flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-[#22c55e]" />
                  Date
                </label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={format(new Date(), "yyyy-MM-dd")}
                  className="w-full bg-[#0f141a] border border-gray-700 rounded-md p-2 text-white focus:border-[#22c55e] focus:outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-[#d1d5db]">Time</label>
                <Select onValueChange={setSelectedTime}>
                  <SelectTrigger className="w-full bg-[#0f141a] border-gray-700">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f141a] border-gray-700">
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setBookingDialogOpen(false)}
                className="border-gray-600 text-white hover:bg-[#0f141a]"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleBookSession}
                className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white"
                disabled={bookSessionMutation.isPending}
              >
                {bookSessionMutation.isPending ? "Processing..." : "Book Session"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Coaching;
