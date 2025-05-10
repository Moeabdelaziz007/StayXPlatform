import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getCurrentUser, onAuthStateChanged, logout } from "@/firebase/auth";
import { 
  signInWithGoogle, 
  signInAsGuest, 
  signInWithGithub,
  signInWithTwitter 
} from "@/firebase/auth-providers";
import { User as FirebaseUser } from "firebase/auth";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";

interface AuthContextProps {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  getIdToken: () => Promise<string | null>;
  refreshUserData: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithTwitter: () => Promise<void>;
  logout: () => Promise<void>;
  isAnonymous: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(getCurrentUser());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  const getIdToken = async (): Promise<string | null> => {
    try {
      return firebaseUser ? await firebaseUser.getIdToken() : null;
    } catch (error) {
      console.error("Error getting ID token", error);
      return null;
    }
  };

  const fetchUserData = async (fbUser: FirebaseUser) => {
    try {
      setIsAnonymous(fbUser.isAnonymous || false);
      
      // If user is anonymous (guest), no need to fetch user data from backend
      if (fbUser.isAnonymous) {
        setUser(null);
        return;
      }
      
      const response = await fetch('/api/users/me', {
        headers: {
          'firebase-id': fbUser.uid
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // User might not exist in our backend yet
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user data", error);
      setError("Failed to fetch user data");
      setUser(null);
    }
  };

  const refreshUserData = async () => {
    if (firebaseUser) {
      await fetchUserData(firebaseUser);
    }
  };
  
  // Authentication methods
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      // The auth state change listener will handle setting the user
    } catch (error: any) {
      console.error("Google login error:", error);
      setError(error.message || "Failed to sign in with Google");
      setLoading(false);
    }
  };
  
  const loginAsGuest = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInAsGuest();
      // The auth state change listener will handle setting the user
    } catch (error: any) {
      console.error("Guest login error:", error);
      setError(error.message || "Failed to sign in as guest");
      setLoading(false);
    }
  };
  
  const loginWithGithub = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGithub();
      // The auth state change listener will handle setting the user
    } catch (error: any) {
      console.error("GitHub login error:", error);
      setError(error.message || "Failed to sign in with GitHub");
      setLoading(false);
    }
  };
  
  const loginWithTwitter = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithTwitter();
      // The auth state change listener will handle setting the user
    } catch (error: any) {
      console.error("Twitter login error:", error);
      setError(error.message || "Failed to sign in with Twitter");
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      queryClient.clear(); // Clear React Query cache
      // Auth state change listener will handle the reset
    } catch (error: any) {
      console.error("Logout error:", error);
      setError(error.message || "Failed to log out");
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (fbUser) => {
      setFirebaseUser(fbUser);
      setLoading(true);
      
      if (fbUser) {
        await fetchUserData(fbUser);
      } else {
        setUser(null);
        setIsAnonymous(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        user,
        loading,
        error,
        getIdToken,
        refreshUserData,
        loginWithGoogle,
        loginAsGuest,
        loginWithGithub,
        loginWithTwitter,
        logout: handleLogout,
        isAnonymous
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
