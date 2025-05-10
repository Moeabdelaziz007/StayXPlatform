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

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    trackUserLogin("google");
    return result;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

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