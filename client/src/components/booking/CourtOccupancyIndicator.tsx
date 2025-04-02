import { useCourtOccupancy } from "@/hooks/use-court-occupancy";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

type CourtOccupancyIndicatorProps = {
  courtId: number;
  className?: string;
  showToast?: boolean;
};

export const CourtOccupancyIndicator = ({ 
  courtId, 
  className = "", 
  showToast = false 
}: CourtOccupancyIndicatorProps) => {
  const { isConnected, isCourtOccupied, occupancy } = useCourtOccupancy();
  const { toast } = useToast();
  
  const occupied = isCourtOccupied(courtId);

  // Show a toast when court occupancy changes
  useEffect(() => {
    if (showToast && isConnected) {
      if (occupied) {
        toast({
          title: "Court status changed",
          description: `Court #${courtId} is now occupied`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Court status changed",
          description: `Court #${courtId} is now available`,
        });
      }
    }
  }, [occupied, courtId, showToast, isConnected, toast]);

  if (!isConnected) {
    return (
      <Badge className={`bg-gray-500 hover:bg-gray-500 ${className}`}>
        Connecting...
      </Badge>
    );
  }

  return (
    <Badge 
      className={`${occupied 
        ? 'bg-red-500 hover:bg-red-600' 
        : 'bg-[#22c55e] hover:bg-[#22c55e]/90'} ${className}`}
    >
      {occupied ? 'Occupied' : 'Available'}
    </Badge>
  );
};

type CourtOccupancyGridProps = {
  courts: {
    id: number;
    name: string;
  }[];
};

export const CourtOccupancyGrid = ({ courts }: CourtOccupancyGridProps) => {
  const { isConnected, occupancy } = useCourtOccupancy();

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin w-5 h-5 border-2 border-[#22c55e] border-t-transparent rounded-full mr-2" />
        <p>Connecting to real-time court status...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {courts.map(court => (
        <div 
          key={court.id} 
          className={`p-4 rounded-lg shadow-md ${
            occupancy[court.id] 
              ? 'bg-red-500/10 border border-red-500/50' 
              : 'bg-[#22c55e]/10 border border-[#22c55e]/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{court.name}</h3>
            <CourtOccupancyIndicator courtId={court.id} />
          </div>
          <p className="text-sm text-[#d1d5db]">
            {occupancy[court.id] 
              ? 'Currently in use. Check back later or book for a future time.' 
              : 'Available for immediate booking.'}
          </p>
        </div>
      ))}
    </div>
  );
};