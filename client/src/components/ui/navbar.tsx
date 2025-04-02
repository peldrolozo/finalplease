import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  CalendarDays, 
  Home, 
  Users, 
  Award,
  Clock,
  Calendar,
  Info,
  Mail,
  LogIn,
  LogOut,
  LayoutDashboard
} from 'lucide-react';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const navLinks = [
    { name: 'Home', link: '/', icon: <Home className="w-5 h-5 mr-2" /> },
    { name: 'Book Court', link: '/book-court', icon: <CalendarDays className="w-5 h-5 mr-2" /> },
    { name: 'Memberships', link: '/memberships', icon: <Award className="w-5 h-5 mr-2" /> },
    { name: 'Coaching', link: '/coaching', icon: <Users className="w-5 h-5 mr-2" /> },
    { name: 'Classes', link: '/classes', icon: <Clock className="w-5 h-5 mr-2" /> },
    { name: 'Events', link: '/events', icon: <Calendar className="w-5 h-5 mr-2" /> },
    { name: 'About Us', link: '/about-us', icon: <Info className="w-5 h-5 mr-2" /> },
    { name: 'Contact', link: '/contact', icon: <Mail className="w-5 h-5 mr-2" /> },
  ];

  return (
    <nav className="bg-[#1a2430] border-b border-[#0f141a]/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center" onClick={closeMenu}>
              <img
                className="h-14 w-auto"
                src="/images/celtic-padel-logo.png"
                alt="Celtic Padel Logo"
              />
              <span className="ml-2 text-xl font-bold text-white">Celtic Padel</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                  location === item.link
                    ? 'text-[#22c55e] bg-[#0f141a]/40'
                    : 'text-gray-300 hover:bg-[#0f141a]/30 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated && isAdmin && (
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                  location === '/admin'
                    ? 'text-[#22c55e] bg-[#0f141a]/40'
                    : 'text-gray-300 hover:bg-[#0f141a]/30 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Admin
              </Link>
            )}

            {isAuthenticated ? (
              <Button 
                onClick={handleLogout}
                variant="ghost" 
                className="text-gray-300 hover:bg-[#0f141a]/30 hover:text-white flex items-center"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  className="text-gray-300 hover:bg-[#0f141a]/30 hover:text-white flex items-center"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1a2430]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className={`${
                  location === item.link
                    ? 'text-[#22c55e] bg-[#0f141a]/40'
                    : 'text-gray-300 hover:bg-[#0f141a]/30 hover:text-white'
                } block px-3 py-2 rounded-md text-base font-medium flex items-center`}
                onClick={closeMenu}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated && isAdmin && (
              <Link
                href="/admin"
                className={`${
                  location === '/admin'
                    ? 'text-[#22c55e] bg-[#0f141a]/40'
                    : 'text-gray-300 hover:bg-[#0f141a]/30 hover:text-white'
                } block px-3 py-2 rounded-md text-base font-medium flex items-center`}
                onClick={closeMenu}
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Admin
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:bg-[#0f141a]/30 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="text-gray-300 hover:bg-[#0f141a]/30 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
                onClick={closeMenu}
              >
                <LogIn className="w-5 h-5 mr-2" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;