import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { Redirect, Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

const Login = () => {
  const { user, loading, error, loginWithGoogle, loginAsGuest, loginWithGithub, loginWithTwitter } = useAuth();
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Redirect to home if user is already logged in
  if (user && !loading) {
    return <Redirect to="/" />;
  }
  
  const handleGoogleLogin = async () => {
    try {
      setLoginError(null);
      setAuthLoading(true);
      await loginWithGoogle();
    } catch (error: any) {
      console.error("Google login error:", error);
      setLoginError(error.message || "Failed to login with Google");
    } finally {
      setAuthLoading(false);
    }
  };
  
  const handleGuestLogin = async () => {
    try {
      setLoginError(null);
      setAuthLoading(true);
      await loginAsGuest();
    } catch (error: any) {
      console.error("Guest login error:", error);
      setLoginError(error.message || "Failed to login as guest");
    } finally {
      setAuthLoading(false);
    }
  };
  
  const handleGithubLogin = async () => {
    try {
      setLoginError(null);
      setAuthLoading(true);
      await loginWithGithub();
    } catch (error: any) {
      console.error("GitHub login error:", error);
      setLoginError(error.message || "Failed to login with GitHub");
    } finally {
      setAuthLoading(false);
    }
  };
  
  const handleTwitterLogin = async () => {
    try {
      setLoginError(null);
      setAuthLoading(true);
      await loginWithTwitter();
    } catch (error: any) {
      console.error("Twitter login error:", error);
      setLoginError(error.message || "Failed to login with Twitter");
    } finally {
      setAuthLoading(false);
    }
  };

  // Check if error contains unauthorized domain message
  const hasUnauthorizedDomainError = loginError && loginError.includes("unauthorized domain");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#121212]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-poppins tracking-wider text-white mb-2">
          <span className="text-neon-green neon-text">Stay</span>
          <span className="text-white">X</span>
        </h1>
        <p className="text-gray-medium">Connect with the crypto universe</p>
      </div>
      
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Choose your preferred sign in method
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {(loginError || error) && (
            <Alert variant="destructive" className="mb-3">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>
                {hasUnauthorizedDomainError ? (
                  <div>
                    <p>Your domain is not authorized for Firebase authentication.</p>
                    <p className="mt-1 text-xs">You need to add your Replit domain to the authorized domains list in Firebase console:</p>
                    <ol className="list-decimal pl-5 mt-1 text-xs">
                      <li>Go to Firebase Console</li>
                      <li>Select your project</li>
                      <li>Go to Authentication &gt; Settings &gt; Authorized domains</li>
                      <li>Add your Replit domain (e.g., yourapp.username.repl.co)</li>
                    </ol>
                  </div>
                ) : (
                  loginError || error
                )}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90"
              onClick={handleGoogleLogin}
              disabled={authLoading || loading}
            >
              <i className="ri-google-fill mr-2"></i>
              Google
            </Button>
            <Button 
              variant="outline" 
              className="text-white bg-[#24292F] hover:bg-[#24292F]/90"
              onClick={handleGithubLogin}
              disabled={authLoading || loading}
            >
              <i className="ri-github-fill mr-2"></i>
              GitHub
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="text-white bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
              onClick={handleTwitterLogin}
              disabled={authLoading || loading}
            >
              <i className="ri-twitter-fill mr-2"></i>
              Twitter
            </Button>
            <Button 
              variant="outline"
              className="text-white hover:text-neon-green"
              onClick={handleGuestLogin}
              disabled={authLoading || loading}
            >
              <i className="ri-user-line mr-2"></i>
              Guest
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-dark-card px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>
          
          <LoginForm />
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-neon-green hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
      
      <div className="crypto-grid fixed inset-0 -z-10 opacity-20"></div>
    </div>
  );
};

export default Login;
