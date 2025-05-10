import { useEffect, useState } from 'react';
import { useAuth as useAuthContext } from '@/context/AuthContext';
import { 
  signInWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logout,
  resetPassword
} from '@/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { trackUserLogin, trackUserSignUp } from '@/firebase/analytics';

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  username: string;
}

export const useAuth = () => {
  const auth = useAuthContext();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle sign in with Google
  const handleGoogleSignIn = async () => {
    setIsProcessing(true);
    try {
      await signInWithGoogle();
      trackUserLogin('google');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({
        title: 'Sign In Failed',
        description: error.message || 'Failed to sign in with Google',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle email/password login
  const handleEmailLogin = async (email: string, password: string) => {
    setIsProcessing(true);
    try {
      await loginWithEmail(email, password);
      trackUserLogin('email');
    } catch (error: any) {
      console.error('Email login error:', error);
      toast({
        title: 'Login Failed',
        description: error.message || 'Incorrect email or password',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle user registration
  const handleRegister = async (data: RegisterData) => {
    setIsProcessing(true);
    try {
      await registerWithEmail(data.email, data.password, data.displayName, data.username);
      trackUserSignUp('email');
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created',
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setIsProcessing(true);
    try {
      await logout();
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out',
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout Failed',
        description: error.message || 'Failed to log out',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (email: string) => {
    setIsProcessing(true);
    try {
      await resetPassword(email);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your email for password reset instructions',
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: 'Password Reset Failed',
        description: error.message || 'Failed to send password reset email',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    ...auth,
    isProcessing,
    signInWithGoogle: handleGoogleSignIn,
    loginWithEmail: handleEmailLogin,
    register: handleRegister,
    logout: handleLogout,
    resetPassword: handlePasswordReset,
  };
};
