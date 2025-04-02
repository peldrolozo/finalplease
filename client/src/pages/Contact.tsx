import { MapPin, Clock, Phone, Mail } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";
import { useLocation } from "wouter";

const Contact = () => {
  // Parse URL query params for pre-filled form
  const [location] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const planName = urlParams.get('plan');
  
  // Set default values if coming from membership selection
  const defaultSubject = planName ? "Membership Information" : "";
  const defaultMessage = planName 
    ? `I'm interested in the ${planName} membership plan. Please provide more information about sign-up, benefits, and payment options.`
    : "";

  return (
    <section className="py-20 pt-28 bg-[#1a2430] min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Contact <span className="text-[#22c55e]">Us</span>
          </h1>
          <p className="text-[#d1d5db] max-w-2xl mx-auto">
            Have questions? We're here to help!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <div className="bg-[#0f141a] p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold mb-4">Location & Hours</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="text-[#22c55e] mt-1 mr-3 w-5 h-5" />
                  <div>
                    <p className="text-white">123 Sports Avenue</p>
                    <p className="text-[#d1d5db]">Dublin, D02 AB12</p>
                    <p className="text-[#d1d5db]">Ireland</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="text-[#22c55e] mt-1 mr-3 w-5 h-5" />
                  <div>
                    <p className="text-white">Monday - Friday: 8:00 - 22:00</p>
                    <p className="text-white">Saturday - Sunday: 9:00 - 20:00</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="text-[#22c55e] mt-1 mr-3 w-5 h-5" />
                  <div>
                    <p className="text-white">+353 (01) 123 4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="text-[#22c55e] mt-1 mr-3 w-5 h-5" />
                  <div>
                    <p className="text-white">info@celticpadel.ie</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#0f141a] p-1 rounded-xl h-80">
              {/* Google Maps embed */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d152515.0588207474!2d-6.422051336429273!3d53.324238066090466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48670e80ea27ac2f%3A0xa00c7a9973171a0!2sDublin%2C%20Ireland!5e0!3m2!1sen!2sus!4v1687868043811!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '0.75rem' }}
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Celtic Padel Location"
              ></iframe>
            </div>
          </div>
          
          <ContactForm 
            defaultSubject={defaultSubject}
            defaultMessage={defaultMessage}
          />
        </div>
      </div>
    </section>
  );
};

export default Contact;
