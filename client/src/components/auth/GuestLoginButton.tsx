import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { signInAsGuest } from '@/firebase/auth-providers';
import { useToast } from '@/hooks/use-toast';

const GuestLoginButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      await signInAsGuest();
    } catch (error) {
      console.error('Guest login error:', error);
      toast({
        variant: 'destructive',
        title: 'Guest Login Failed',
        description: 'Error logging in as a guest. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full border-[#2A2A2A] hover:bg-dark-lighter"
      onClick={handleGuestLogin}
      disabled={loading}
    >
      {loading ? 'Logging in...' : 'Login as Guest'}
    </Button>
  );
};

export default GuestLoginButton;