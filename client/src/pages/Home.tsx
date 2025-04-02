import HeroSection from "@/components/home/HeroSection";
import ValueProposition from "@/components/home/ValueProposition";
import BookingForm from "@/components/booking/BookingForm";
import TestimonialsSection from "@/components/home/TestimonialsSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <ValueProposition />
      <BookingForm />
      <TestimonialsSection />
      
      {/* About Celtic Padel Section */}
      <section className="py-20 bg-[#0f141a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why <span className="text-[#22c55e]">Choose Us</span>
            </h2>
            <p className="text-[#d1d5db] max-w-2xl mx-auto">
              Dublin's premier padel experience awaits you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-[#1a2430] rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1540611025311-01df3cef54b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Padel Community" 
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Our Community</h3>
                <p className="text-[#d1d5db] mb-4">
                  Join a vibrant and welcoming community of padel enthusiasts of all skill levels.
                  We host regular social events, leagues, and tournaments to keep the spirit of competition alive.
                </p>
              </div>
            </div>
            
            <div className="bg-[#1a2430] rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1626224583764-f88b815249e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Padel Courts" 
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">State-of-the-Art Facilities</h3>
                <p className="text-[#d1d5db] mb-4">
                  Experience padel on our premium courts with professional lighting, high-quality surfaces,
                  and comfortable amenities. Our facility is designed to provide the best playing experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;