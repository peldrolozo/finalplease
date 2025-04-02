import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';

const Login: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return <LoginForm />;
};

export default Login;