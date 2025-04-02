import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Event } from "@shared/schema";

type EventCardProps = {
  event: Event;
  onRegister: (id: number) => void;
};

const EventCard = ({ event, onRegister }: EventCardProps) => {
  // Format date for display
  const formatEventDate = () => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    // Same day event
    if (startDate.toDateString() === endDate.toDateString()) {
      return format(startDate, "MMM d").toUpperCase();
    } 
    
    // Multi-day event in the same month
    if (startDate.getMonth() === endDate.getMonth()) {
      return `${format(startDate, "MMM d").toUpperCase()}-${format(endDate, "d").toUpperCase()}`;
    }
    
    // Multi-day event spanning months
    return `${format(startDate, "MMM d").toUpperCase()}-${format(endDate, "MMM d").toUpperCase()}`;
  };

  return (
    <Card className="bg-[#1a2430] rounded-xl overflow-hidden shadow-lg">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={event.imagePath}
          alt={event.name}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute top-0 left-0 bg-[#22c55e] text-white px-4 py-2 font-bold">
          {formatEventDate()}
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2">{event.name}</h3>
        <p className="text-[#d1d5db] mb-4">{event.description}</p>
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-[#22c55e] font-bold">€{event.price.toFixed(2)}</span>
            <span className="text-[#d1d5db]">
              {event.price === 1 ? " per person" : " per team"}
            </span>
          </div>
          <Button
            onClick={() => onRegister(event.id)}
            className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white text-sm py-2 px-6 rounded-md"
          >
            Register
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
