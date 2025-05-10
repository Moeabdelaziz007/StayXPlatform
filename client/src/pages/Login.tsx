import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";

const Login = () => {
  const { user, loading } = useAuth();

  // Redirect to home if user is already logged in
  if (user && !loading) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#121212]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-poppins tracking-wider text-white mb-2">
          <span className="text-neon-green neon-text">Stay</span>X
        </h1>
        <p className="text-gray-medium">Connect with the crypto universe</p>
      </div>
      
      <LoginForm />
      
      <div className="crypto-grid fixed inset-0 -z-10 opacity-20"></div>
    </div>
  );
};

export default Login;
