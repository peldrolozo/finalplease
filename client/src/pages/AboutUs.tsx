import { CalendarClock, Award, Users, Map } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="bg-[#1a2430] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-[#22c55e]">Celtic Padel</span>
          </h1>
          <p className="text-[#d1d5db] max-w-3xl mx-auto text-lg">
            Dublin's premier padel tennis club with state-of-the-art facilities, professional coaching, and a vibrant community.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1628891890467-b79f2c8ba7b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Celtic Padel Club" 
                className="rounded-xl shadow-lg w-full h-auto object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-white">Our Story</h2>
              <div className="space-y-4 text-[#d1d5db]">
                <p>
                  Founded in 2020, Celtic Padel Club was born from a passion to bring the exciting sport of padel to the heart of Dublin. Our founders, all avid padel players who fell in love with the sport during their travels across Europe, saw an opportunity to introduce this dynamic game to Ireland.
                </p>
                <p>
                  What started as a small facility with just two courts has now expanded into Dublin's premier padel destination with six professional-grade courts, a dedicated coaching team, and a thriving community of players ranging from beginners to competitive athletes.
                </p>
                <p>
                  Our mission is simple: to provide world-class padel facilities while fostering a welcoming community that celebrates the unique blend of tennis, squash, and social interaction that makes padel so special.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-[#1a2430]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#0f141a] p-6 rounded-xl text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#22c55e]/10 text-[#22c55e] mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Community</h3>
              <p className="text-[#d1d5db]">
                We believe in creating an inclusive environment where players of all levels can connect, learn, and enjoy the sport together.
              </p>
            </div>
            
            <div className="bg-[#0f141a] p-6 rounded-xl text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#22c55e]/10 text-[#22c55e] mb-4">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Excellence</h3>
              <p className="text-[#d1d5db]">
                From our courts to our coaching, we strive for excellence in every aspect of our club to ensure the best possible experience.
              </p>
            </div>
            
            <div className="bg-[#0f141a] p-6 rounded-xl text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#22c55e]/10 text-[#22c55e] mb-4">
                <CalendarClock size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Innovation</h3>
              <p className="text-[#d1d5db]">
                We continuously seek to improve our facilities, programs, and services to stay at the forefront of padel development in Ireland.
              </p>
            </div>
            
            <div className="bg-[#0f141a] p-6 rounded-xl text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#22c55e]/10 text-[#22c55e] mb-4">
                <Map size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Accessibility</h3>
              <p className="text-[#d1d5db]">
                We're committed to making padel accessible to everyone through tailored programs, flexible membership options, and a welcoming atmosphere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-[#1a2430] rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                alt="Michael O'Connor" 
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 text-white">Michael O'Connor</h3>
                <p className="text-[#22c55e] mb-4">Founder & Director</p>
                <p className="text-[#d1d5db]">
                  Former national tennis champion with a vision to make padel the fastest growing sport in Ireland.
                </p>
              </div>
            </div>
            
            <div className="bg-[#1a2430] rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80" 
                alt="Sarah Murphy" 
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 text-white">Sarah Murphy</h3>
                <p className="text-[#22c55e] mb-4">Head of Operations</p>
                <p className="text-[#d1d5db]">
                  Sports management expert who ensures the smooth running of all club facilities and services.
                </p>
              </div>
            </div>
            
            <div className="bg-[#1a2430] rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                alt="Carlos Rodriguez" 
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 text-white">Carlos Rodriguez</h3>
                <p className="text-[#22c55e] mb-4">Head Coach</p>
                <p className="text-[#d1d5db]">
                  Former professional padel player from Spain bringing world-class expertise to our coaching programs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#1a2430]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Ready to Join Our Community?
          </h2>
          <p className="text-[#d1d5db] max-w-2xl mx-auto mb-8 text-lg">
            Whether you're looking to try padel for the first time or take your game to the next level, 
            Celtic Padel offers the perfect environment for players of all abilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/book" 
              className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-bold py-3 px-6 rounded-md transition-colors"
            >
              Book a Court
            </a>
            <a 
              href="/memberships" 
              className="bg-transparent border border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/10 font-bold py-3 px-6 rounded-md transition-colors"
            >
              Explore Memberships
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;