import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { Class, Coach } from "@shared/schema";

type ClassCardProps = {
  classItem: Class;
  onBook: (id: number) => void;
};

const ClassCard = ({ classItem, onBook }: ClassCardProps) => {
  // Fetch coach info
  const { data: coach } = useQuery({
    queryKey: [`/api/coaches/${classItem.coachId}`],
    enabled: !!classItem.coachId,
  });

  const isFull = classItem.currentEnrollment >= classItem.maxCapacity;

  return (
    <div className={`border border-gray-700 rounded-lg p-4 hover:border-[#22c55e] transition-colors ${isFull ? '' : 'hover:border-[#22c55e]'}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h4 className="font-bold">{classItem.name}</h4>
          <p className="text-[#d1d5db] text-sm">
            {classItem.dayOfWeek} • {classItem.startTime} - {classItem.endTime} • 
            {coach ? ` Coach ${coach.name}` : ''}
          </p>
        </div>
        <div className="mt-3 md:mt-0 flex items-center space-x-4">
          <div className="text-sm">
            {isFull ? (
              <span className="text-red-500 font-bold">Full</span>
            ) : (
              <span className="text-[#22c55e] font-bold">{classItem.currentEnrollment}</span>
            )}
            <span className="text-[#d1d5db]">/{classItem.maxCapacity} spots</span>
          </div>
          <Button 
            onClick={() => onBook(classItem.id)}
            className={
              isFull 
                ? "bg-gray-700 text-[#d1d5db] cursor-not-allowed" 
                : "bg-[#22c55e] hover:bg-[#22c55e]/90 text-white"
            }
            disabled={isFull}
            size="sm"
          >
            Book
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
