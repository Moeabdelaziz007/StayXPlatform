// client/src/firebase/auth-providers.ts
import { signInAnonymously } from "firebase/auth";
import { auth } from "./firebase";

export const signInAsGuest = async () => {
  try {
    const result = await signInAnonymously(auth);
    trackUserLogin("guest");
    return result;
  } catch (error) {
    console.error("Error signing in as guest:", error); // Log error details for easier debugging
    throw error;
  }
};// client/src/components/auth/GuestLoginButton.tsx
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
      // Handle successful login (e.g., redirect or update state)
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
      {loading ? 'Logging in...' : 'Continue as Guest'}
    </Button>
  );
};
export default GuestLoginButton;

import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously,
  GithubAuthProvider,
  TwitterAuthProvider
} from "firebase/auth";
import { auth } from "./firebase";
import { trackUserLogin, trackUserSignUp } from "./analytics";

// Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});

// GitHub Provider 
const githubProvider = new GithubAuthProvider();

// Twitter Provider
const twitterProvider = new TwitterAuthProvider();

export const signInWithGoogle = async () => {<Component variant="example" /><Component variant="example"
    const result = await signInWithPopup(auth, googleProvider);
    trackUserLogin("google");
    return result;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};



export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    trackUserLogin("github");
    return result;
  } catch (error) {
    console.error("Error signing in with GitHub:", error);
    throw error;
  }
};

export const signInWithTwitter = async () => {
  try {
    const result = await signInWithPopup(auth, twitterProvider);
    trackUserLogin("twitter");
    return result;
  } catch (error) {
    console.error("Error signing in with Twitter:", error);
    throw error;
  }
};