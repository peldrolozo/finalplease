import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Coach } from "@shared/schema";

type CoachCardProps = {
  coach: Coach;
  onClick: (id: number) => void;
};

const CoachCard = ({ coach, onClick }: CoachCardProps) => {
  return (
    <Card className="bg-[#1a2430] rounded-xl overflow-hidden shadow-lg">
      <div className="h-64 overflow-hidden">
        <img 
          src={coach.imagePath} 
          alt={`Coach ${coach.name}`} 
          className="w-full h-full object-cover object-center"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-1">{coach.name}</h3>
        <div className="text-[#22c55e] text-sm mb-3">{coach.title}</div>
        <p className="text-[#d1d5db] text-sm mb-4">{coach.bio}</p>
        <div className="flex justify-between items-center">
          <span className="text-white font-bold">
            €{coach.pricePerHour}<span className="text-[#d1d5db] font-normal">/hour</span>
          </span>
          <Button 
            onClick={() => onClick(coach.id)}
            className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-bold"
          >
            Book Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachCard;
