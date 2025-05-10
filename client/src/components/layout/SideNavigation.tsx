import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/context/UIContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import CryptoPriceTicker from "@/components/dashboard/CryptoPriceTicker";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
}

const NavItem = ({ icon, label, href, active }: NavItemProps) => {
  return (
    <Link href={href}>
      <div className={cn(
        "flex items-center px-4 py-3 text-gray-light rounded-lg transition-colors duration-200 group cursor-pointer",
        active ? "bg-dark-lighter" : "hover:bg-dark-lighter"
      )}>
        <i className={cn(
          icon,
          "mr-3",
          active ? "text-neon-green" : "text-gray-medium group-hover:text-neon-green transition-colors duration-200"
        )}></i>
        <span>{label}</span>
      </div>
    </Link>
  );
};

const SideNavigation = () => {
  const { user } = useAuth();
  const { sidebarOpen, isMobile } = useUI();
  const [location] = useLocation();

  if (!sidebarOpen) {
    return null;
  }

  return (
    <aside className={cn(
      "flex flex-col bg-[#1E1E1E] border-r border-[#2A2A2A] transition-all duration-300 z-40",
      isMobile 
        ? "fixed inset-0 w-full h-full md:w-64" 
        : "hidden md:flex w-64"
    )}>
      {/* Logo */}
      <div className="flex items-center justify-center h-20 border-b border-[#2A2A2A]">
        <h1 className="text-3xl font-bold font-poppins tracking-wider text-white">
          <span className="text-neon-green neon-text">Stay</span>
          <span className="text-white">X</span>
        </h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          <NavItem 
            icon="ri-home-5-line" 
            label="Dashboard" 
            href="/" 
            active={location === "/"}
          />
          
          <NavItem 
            icon="ri-user-3-line" 
            label="Profile" 
            href="/profile" 
            active={location === "/profile"}
          />
          
          <NavItem 
            icon="ri-group-line" 
            label="Connections" 
            href="/connections" 
            active={location === "/connections"}
          />
          
          <NavItem 
            icon="ri-message-3-line" 
            label="Messages" 
            href="/messages" 
            active={location === "/messages"}
          />
          
          <NavItem 
            icon="ri-bitcoin-line" 
            label="Crypto" 
            href="/crypto" 
            active={location === "/crypto"}
          />
          
          <NavItem 
            icon="ri-line-chart-line" 
            label="Analytics" 
            href="/analytics" 
            active={location === "/analytics"}
          />
        </div>
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-[#2A2A2A]">
        {/* Crypto Price Ticker */}
        <CryptoPriceTicker />
        
        {/* User Profile */}
        {user ? (
          <div className="flex items-center mt-4">
            <Avatar className="h-10 w-10 rounded-full bg-dark-lighter p-0.5 border border-neon-green">
              <AvatarImage src={user.photoURL || ""} alt={user.displayName} />
              <AvatarFallback className="bg-dark-lighter text-neon-green">
                {user.displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">{user.displayName}</p>
              <p className="text-xs text-gray-medium">Level {user.level} Explorer</p>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-col space-y-2">
            <Button asChild variant="default" className="bg-neon-green hover:bg-neon-green/90 text-black w-full">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild variant="outline" className="border-neon-green text-neon-green hover:bg-neon-green/10 w-full">
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SideNavigation;
