import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser 
} from "firebase/auth";
import { auth } from "./firebase";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if the user exists in our backend
    try {
      await apiRequest("GET", "/api/users/me");
    } catch (error) {
      // If user doesn't exist, create a new one
      if (user.email && user.displayName) {
        await apiRequest("POST", "/api/users", {
          firebaseId: user.uid,
          email: user.email,
          username: user.email.split('@')[0], // Default username from email
          displayName: user.displayName,
          photoURL: user.photoURL || "",
          bio: "",
          level: 1,
          achievementPoints: 0,
          interests: []
        });
      }
    }
    
    // Invalidate user data queries
    queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
    
    return user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Sign up with email and password
export const registerWithEmail = async (
  email: string, 
  password: string, 
  displayName: string,
  username: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, { displayName });
    
    // Create user in our backend
    await apiRequest("POST", "/api/users", {
      firebaseId: user.uid,
      email,
      username,
      displayName,
      photoURL: user.photoURL || "",
      bio: "",
      level: 1,
      achievementPoints: 0,
      interests: []
    });
    
    return user;
  } catch (error) {
    console.error("Error registering with email", error);
    throw error;
  }
};

// Sign in with email and password
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in with email", error);
    throw error;
  }
};

// Sign out
export const logout = async () => {
  try {
    await signOut(auth);
    // Clear user-related queries from cache
    queryClient.clear();
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email", error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

// Add Firebase auth state listener
export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void) => {
  return auth.onAuthStateChanged(callback);
};
