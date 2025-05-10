import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getCurrentUser, onAuthStateChanged } from "@/firebase/auth";
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
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(getCurrentUser());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (fbUser) => {
      setFirebaseUser(fbUser);
      setLoading(true);
      
      if (fbUser) {
        await fetchUserData(fbUser);
      } else {
        setUser(null);
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
        refreshUserData
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
