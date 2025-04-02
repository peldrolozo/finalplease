import { Link } from "wouter";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Book a Court", href: "/book" },
    { name: "Memberships", href: "/memberships" },
    { name: "Coaching", href: "/coaching" },
    { name: "Classes", href: "/classes" },
    { name: "Events", href: "/events" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const openingHours = [
    { day: "Monday - Friday", hours: "8:00 - 22:00" },
    { day: "Saturday", hours: "9:00 - 20:00" },
    { day: "Sunday", hours: "9:00 - 20:00" },
  ];

  return (
    <footer className="bg-[#1a2430] pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Club Info */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold">
                <span className="text-[#22c55e]">Celtic</span>
                <span className="text-white">Padel</span>
              </span>
            </Link>
            <p className="text-[#d1d5db] mb-4">
              Dublin's premier padel tennis club featuring state-of-the-art courts, 
              professional coaching, and a vibrant community.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-[#d1d5db] hover:text-[#22c55e] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-[#d1d5db] hover:text-[#22c55e] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-[#d1d5db] hover:text-[#22c55e] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-[#d1d5db] hover:text-[#22c55e] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-[#d1d5db] hover:text-[#22c55e] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Opening Hours */}
          <div>
            <h4 className="text-white font-bold mb-4">Opening Hours</h4>
            <ul className="space-y-2">
              {openingHours.map((item) => (
                <li key={item.day} className="flex justify-between">
                  <span className="text-[#d1d5db]">{item.day}</span>
                  <span className="text-white">{item.hours}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-4">Newsletter</h4>
            <p className="text-[#d1d5db] mb-4">
              Subscribe for updates on events, promotions, and padel tips.
            </p>
            <form className="flex">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-grow bg-[#0f141a] border-border rounded-r-none focus-visible:ring-[#22c55e]"
              />
              <Button 
                type="submit" 
                className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white rounded-l-none"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center text-[#d1d5db] text-sm">
          <p>
            &copy; {new Date().getFullYear()} Celtic Padel. All rights reserved.{" "}
            <a href="#" className="hover:text-[#22c55e]">Privacy Policy</a> |{" "}
            <a href="#" className="hover:text-[#22c55e]">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
