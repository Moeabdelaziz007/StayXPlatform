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

// Anonymous sign in (guest)
export const signInAsGuest = async () => {
  try {
    const result = await signInAnonymously(auth);
    trackUserLogin("guest");
    return result;
  } catch (error) {
    console.error("Error signing in as guest:", error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    trackUserLogin("google");
    return result;
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    
    // Handle the specific unauthorized domain error
    if (error.code === 'auth/unauthorized-domain') {
      const message = "Your domain is not authorized for Firebase authentication. Please add your Replit domain to the Firebase console's authorized domains list.";
      console.error(message);
      throw new Error(message);
    }
    
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