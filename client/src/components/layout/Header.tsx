import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, navigate] = useLocation();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Book a Court", href: "/book" },
    { name: "Memberships", href: "/memberships" },
    { name: "Coaching", href: "/coaching" },
    { name: "Classes", href: "/classes" },
    { name: "Events", href: "/events" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-colors duration-300 ${isScrolled ? 'bg-[#1a2430]/95' : 'bg-[#0f141a]/95'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold">
            <span className="text-[#22c55e]">Celtic</span>
            <span className="text-white">Padel</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <nav className="flex space-x-8 text-sm mr-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-semibold relative transition-colors nav-link ${
                  location === item.href
                    ? "text-[#22c55e]"
                    : "text-white hover:text-[#22c55e]"
                } after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#22c55e] after:transition-[width] after:duration-300 hover:after:w-full`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate("/admin")}
                    className="text-white hover:bg-[#22c55e]/20 hover:text-[#22c55e]"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-[#22c55e] text-white hover:bg-[#22c55e]/20"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => navigate("/login")}
                className="border-[#22c55e] text-white hover:bg-[#22c55e]/20"
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          {isAuthenticated && (
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin")}
              className="mr-2 p-2 text-white hover:bg-[#22c55e]/20 hover:text-[#22c55e]"
            >
              <User className="h-5 w-5" />
            </Button>
          )}
          <button
            className="text-white focus:outline-none"
            onClick={handleMobileMenuToggle}
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-64 bg-[#1a2430] p-6 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <span className="text-xl font-bold text-[#22c55e]">Menu</span>
          <button
            className="text-white focus:outline-none"
            onClick={closeMobileMenu}
            aria-label="Close mobile menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col space-y-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`font-semibold transition-colors ${
                location === item.href
                  ? "text-[#22c55e]"
                  : "text-white hover:text-[#22c55e]"
              }`}
              onClick={closeMobileMenu}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Auth Links */}
          <div className="pt-4 mt-4 border-t border-gray-700">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center font-semibold text-white hover:text-[#22c55e] mb-4"
                    onClick={closeMobileMenu}
                  >
                    <User className="h-4 w-4 mr-2 text-[#22c55e]" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="flex items-center font-semibold text-white hover:text-[#22c55e]"
                >
                  <LogOut className="h-4 w-4 mr-2 text-[#22c55e]" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center font-semibold text-white hover:text-[#22c55e]"
                onClick={closeMobileMenu}
              >
                <User className="h-4 w-4 mr-2 text-[#22c55e]" />
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
