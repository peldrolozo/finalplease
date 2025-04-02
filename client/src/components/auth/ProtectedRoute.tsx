import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (requireAdmin && !isAdmin) {
        navigate('/'); // Redirect to home if not admin
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate, requireAdmin]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f141a]">
        <Loader2 className="h-12 w-12 text-[#22c55e] animate-spin" />
      </div>
    );
  }

  // If authenticated (and admin if required), render children
  if (isAuthenticated && (!requireAdmin || isAdmin)) {
    return <>{children}</>;
  }

  // This should not render as the useEffect above will redirect
  return null;
};

export default ProtectedRoute;