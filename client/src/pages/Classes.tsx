import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ClassCard from "@/components/classes/ClassCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { Class } from "@shared/schema";

const Classes = () => {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  // Calculate week range for display
  const getWeekRange = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + (weekOffset * 7));
    
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return {
      start: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  };

  const weekRange = getWeekRange();

  // Fetch classes
  const { data: classes, isLoading } = useQuery({
    queryKey: ['/api/classes'],
  });

  // Class enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: async (classId: number) => {
      return apiRequest('POST', `/api/classes/${classId}/enroll`, { userId: 1 }); // Using a mock userId for demonstration
    },
    onSuccess: () => {
      toast({
        title: "Enrollment successful!",
        description: "You've been enrolled in the class.",
      });
      setEnrollDialogOpen(false);
      setSelectedClass(null);
      queryClient.invalidateQueries({ queryKey: ['/api/classes'] });
    },
    onError: (error) => {
      toast({
        title: "Enrollment failed",
        description: error.message || "There was an error enrolling in the class. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBookClick = (classItem: Class) => {
    setSelectedClass(classItem);
    setEnrollDialogOpen(true);
  };

  const handleEnroll = () => {
    if (!selectedClass) return;
    enrollMutation.mutate(selectedClass.id);
  };

  const handlePreviousWeek = () => {
    setWeekOffset(prev => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(prev => prev + 1);
  };

  return (
    <section className="py-20 pt-28 bg-[#1a2430] min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Group <span className="text-[#22c55e]">Classes</span>
          </h1>
          <p className="text-[#d1d5db] max-w-2xl mx-auto">
            Join our structured group sessions for all levels
          </p>
        </div>
        
        <Card className="bg-[#0f141a] rounded-xl overflow-hidden shadow-xl max-w-4xl mx-auto">
          <div className="border-b border-gray-700 p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Weekly Schedule</h3>
              <div className="flex space-x-2 items-center">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={handlePreviousWeek}
                  className="bg-[#1a2430] hover:bg-[#1a2430]/80 text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-white">{weekRange.start} - {weekRange.end}</span>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={handleNextWeek}
                  className="bg-[#1a2430] hover:bg-[#1a2430]/80 text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <Skeleton className="h-5 w-40 mb-2" />
                        <Skeleton className="h-4 w-60" />
                      </div>
                      <div className="mt-3 md:mt-0 flex items-center space-x-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                classes?.map((classItem: Class) => (
                  <ClassCard 
                    key={classItem.id} 
                    classItem={classItem} 
                    onBook={() => handleBookClick(classItem)} 
                  />
                ))
              )}
            </div>
          </div>
        </Card>

        {/* Enrollment Dialog */}
        <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
          <DialogContent className="bg-[#1a2430] border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Enroll in {selectedClass?.name}
              </DialogTitle>
              <DialogDescription className="text-[#d1d5db] mt-2">
                <p>
                  {selectedClass?.description}
                </p>
                <p className="mt-2">
                  Schedule: {selectedClass?.dayOfWeek} • {selectedClass?.startTime} - {selectedClass?.endTime}
                </p>
                <p className="mt-1">
                  Available spots: {selectedClass && (selectedClass.maxCapacity - selectedClass.currentEnrollment)} / {selectedClass?.maxCapacity}
                </p>
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setEnrollDialogOpen(false)}
                className="border-gray-600 text-white hover:bg-[#0f141a]"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEnroll}
                className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white"
                disabled={enrollMutation.isPending}
              >
                {enrollMutation.isPending ? "Processing..." : "Confirm Enrollment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Classes;
