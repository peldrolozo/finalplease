import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import EventCard from "@/components/events/EventCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { Event } from "@shared/schema";

const Events = () => {
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);

  // Fetch events
  const { data: events, isLoading } = useQuery({
    queryKey: ['/api/events'],
  });

  // Event registration mutation
  const registerMutation = useMutation({
    mutationFn: async (eventId: number) => {
      return apiRequest('POST', `/api/events/${eventId}/register`, { userId: 1 }); // Using a mock userId for demonstration
    },
    onSuccess: () => {
      toast({
        title: "Registration successful!",
        description: "You've been registered for the event.",
      });
      setRegisterDialogOpen(false);
      setSelectedEvent(null);
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message || "There was an error registering for the event. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event);
    setRegisterDialogOpen(true);
  };

  const handleRegister = () => {
    if (!selectedEvent) return;
    registerMutation.mutate(selectedEvent.id);
  };

  const formatEventDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.toDateString() === end.toDateString()) {
      return format(start, "EEEE, MMMM d, yyyy");
    }
    
    return `${format(start, "MMMM d")} - ${format(end, "MMMM d, yyyy")}`;
  };

  return (
    <section className="py-20 pt-28 bg-[#0f141a] min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Upcoming <span className="text-[#22c55e]">Events</span>
          </h1>
          <p className="text-[#d1d5db] max-w-2xl mx-auto">
            Join our tournaments and social events
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="bg-[#1a2430]">
                <div className="h-48 bg-gray-800 animate-pulse relative">
                  <div className="absolute top-0 left-0 bg-gray-700 w-20 h-10"></div>
                </div>
                <div className="p-6">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            events?.map((event: Event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onRegister={() => handleRegisterClick(event)} 
              />
            ))
          )}
        </div>

        {/* Registration Dialog */}
        <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
          <DialogContent className="bg-[#1a2430] border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Register for {selectedEvent?.name}
              </DialogTitle>
              <DialogDescription className="text-[#d1d5db] mt-2">
                <p>
                  {selectedEvent?.description}
                </p>
                <p className="mt-2 text-white">
                  Date: {selectedEvent && formatEventDate(selectedEvent.startDate, selectedEvent.endDate)}
                </p>
                <p className="mt-1 text-white">
                  Price: <span className="text-[#22c55e] font-bold">€{selectedEvent?.price.toFixed(2)}</span>
                </p>
                {selectedEvent?.maxParticipants && (
                  <p className="mt-1 text-white">
                    Available spots: {selectedEvent.maxParticipants - selectedEvent.currentParticipants} / {selectedEvent.maxParticipants}
                  </p>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setRegisterDialogOpen(false)}
                className="border-gray-600 text-white hover:bg-[#0f141a]"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleRegister}
                className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Processing..." : "Register Now"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Events;
