import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { MembershipTier } from "@shared/schema";
import { useLocation } from "wouter";

const MembershipCard = ({ tier }: { tier: MembershipTier }) => {
  const [_, navigate] = useLocation();
  
  // Split benefits into an array
  const benefitsList = [
    `${tier.freeBookingsPerMonth} free bookings per month`,
    `${tier.discountPercentage}% discount on additional bookings`,
    ...(tier.otherBenefits ? tier.otherBenefits.split(', ') : [])
  ];
  
  // Handle redirecting to contact form with plan info
  const handleSelectPlan = () => {
    navigate(`/contact?plan=${encodeURIComponent(tier.name)}`);
  };

  return (
    <Card className={`bg-[#0f141a] rounded-xl overflow-hidden transition-transform hover:scale-105 ${tier.isPopular ? 'relative' : ''}`}>
      {tier.isPopular && (
        <div className="absolute top-0 right-0 bg-[#22c55e] text-white px-4 py-1 text-sm font-bold">
          Popular
        </div>
      )}
      <CardHeader className="p-6 border-b border-gray-700">
        <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
        <div className="text-3xl font-bold text-[#22c55e]">
          €{tier.monthlyPrice}<span className="text-sm text-[#d1d5db] font-normal">/month</span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ul className="space-y-3">
          {benefitsList.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <Check className="text-[#22c55e] h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-[#d1d5db]">{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button 
          onClick={handleSelectPlan}
          className={tier.isPopular 
            ? "w-full bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-bold shadow-lg hover:shadow-[#22c55e]/30" 
            : "w-full border-2 border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-white font-bold"
          }
        >
          Select Plan
        </Button>
      </CardFooter>
    </Card>
  );
};

const MembershipsSkeletonCard = () => (
  <Card className="bg-[#0f141a]">
    <CardHeader className="p-6 border-b border-gray-700">
      <Skeleton className="h-6 w-24 mb-2" />
      <Skeleton className="h-8 w-32" />
    </CardHeader>
    <CardContent className="p-6">
      <div className="space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>
    </CardContent>
    <CardFooter className="p-6 pt-0">
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);

const Memberships = () => {
  const { data: membershipTiers, isLoading } = useQuery({
    queryKey: ['/api/membership-tiers'],
  });

  return (
    <section id="memberships" className="py-20 pt-28 bg-[#1a2430] min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Membership <span className="text-[#22c55e]">Plans</span>
          </h1>
          <p className="text-[#d1d5db] max-w-2xl mx-auto">
            Find the perfect membership option for your padel journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {isLoading ? (
            <>
              <MembershipsSkeletonCard />
              <MembershipsSkeletonCard />
              <MembershipsSkeletonCard />
            </>
          ) : (
            membershipTiers?.map((tier: MembershipTier) => (
              <MembershipCard key={tier.id} tier={tier} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Memberships;
