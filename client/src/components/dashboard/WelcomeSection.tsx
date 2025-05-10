import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { trackFeatureUsage } from "@/firebase/analytics";

const WelcomeSection = () => {
  const { user } = useAuth();

  const handleConnect = () => {
    trackFeatureUsage('welcome_connect_button');
  };

  const handleDiscover = () => {
    trackFeatureUsage('welcome_discover_button');
  };

  return (
    <section className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-poppins mb-2">
            {user ? (
              <>Welcome back, <span className="text-neon-green">{user.displayName.split(' ')[0]}</span></>
            ) : (
              <>Welcome to <span className="text-neon-green">StayX</span></>
            )}
          </h1>
          <p className="text-gray-medium mb-4">Your financial universe is expanding</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          {user ? (
            <>
              <Button 
                onClick={handleConnect}
                className="bg-neon-green hover:bg-opacity-80 text-dark font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center"
                asChild
              >
                <Link href="/connections">
                  <i className="ri-user-add-line mr-2"></i>
                  Connect
                </Link>
              </Button>
              <Button 
                onClick={handleDiscover}
                variant="outline"
                className="border border-neon-green text-neon-green hover:bg-neon-green hover:bg-opacity-10 font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center"
                asChild
              >
                <Link href="/discover">
                  <i className="ri-search-line mr-2"></i>
                  Discover
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button 
                className="bg-neon-green hover:bg-opacity-80 text-dark font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center"
                asChild
              >
                <Link href="/login">
                  <i className="ri-login-box-line mr-2"></i>
                  Login
                </Link>
              </Button>
              <Button 
                variant="outline"
                className="border border-neon-green text-neon-green hover:bg-neon-green hover:bg-opacity-10 font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center"
                asChild
              >
                <Link href="/register">
                  <i className="ri-user-add-line mr-2"></i>
                  Register
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
