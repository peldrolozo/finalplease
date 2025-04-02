import { useQuery } from "@tanstack/react-query";
import { Star, StarHalf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Testimonial } from "@shared/schema";

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  // Generate stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="text-[#22c55e] fill-[#22c55e] h-4 w-4" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="text-[#22c55e] fill-[#22c55e] h-4 w-4" />);
    }
    
    return stars;
  };

  return (
    <Card className="bg-[#0f141a] testimonial-card transition-transform hover:translate-y-[-5px]">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <img 
            src={testimonial.imagePath}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h4 className="font-bold">{testimonial.name}</h4>
            <div className="text-[#22c55e] text-sm">Member for {testimonial.memberFor}</div>
          </div>
        </div>
        <p className="text-[#d1d5db] italic">{testimonial.content}</p>
        <div className="mt-4 flex">
          {renderStars(testimonial.rating)}
        </div>
      </CardContent>
    </Card>
  );
};

const TestimonialsSkeletonCard = () => (
  <Card className="bg-[#0f141a]">
    <CardContent className="p-6">
      <div className="flex items-center mb-4">
        <Skeleton className="w-12 h-12 rounded-full mr-4" />
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
      <div className="mt-4 flex">
        <Skeleton className="h-4 w-20" />
      </div>
    </CardContent>
  </Card>
);

const TestimonialsSection = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['/api/testimonials'],
  });

  return (
    <section className="py-20 bg-[#1a2430]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our <span className="text-[#22c55e]">Members Say</span>
          </h2>
          <p className="text-[#d1d5db] max-w-2xl mx-auto">
            Testimonials from our padel community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {isLoading ? (
            <>
              <TestimonialsSkeletonCard />
              <TestimonialsSkeletonCard />
              <TestimonialsSkeletonCard />
            </>
          ) : (
            testimonials?.map((testimonial: Testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
