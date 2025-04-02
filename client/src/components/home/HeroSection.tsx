import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const HeroSection = () => {
  return (
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Video background - using image as placeholder */}
        <div className="bg-[url('https://images.unsplash.com/photo-1622279488909-78fe6c78953d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center h-full">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(15,20,26,0.7)] to-[rgba(15,20,26,0.8)]"></div>
        </div>
      </div>
      
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 pt-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white max-w-4xl">
          Dublin's Premier <span className="text-[#22c55e]">Padel Tennis</span> Experience
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-[#d1d5db] max-w-2xl">
          State-of-the-art courts, professional coaching, and a vibrant community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            asChild
            size="lg" 
            className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-bold rounded-full shadow-lg hover:shadow-[#22c55e]/30 animate-pulse"
          >
            <Link href="/book">Book a Court</Link>
          </Button>
          <Button 
            asChild
            variant="outline" 
            size="lg" 
            className="border-2 border-white hover:border-[#22c55e] text-white hover:text-[#22c55e] font-bold rounded-full"
          >
            <Link href="/memberships">View Memberships</Link>
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-white animate-bounce">
        <ChevronDown className="h-6 w-6" />
      </div>
    </section>
  );
};

export default HeroSection;
