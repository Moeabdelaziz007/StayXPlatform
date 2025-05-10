import React from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/context/UIContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  title?: string;
}

const TopBar: React.FC<TopBarProps> = ({ title }) => {
  const { user, logout } = useAuth();
  const { toggleSidebar, isMobile } = useUI();

  return (
    <div className="h-16 bg-dark-card border-b border-[#2A2A2A] flex items-center justify-between px-4 sticky top-0 z-20 w-full">
      {/* Left section - Menu toggle and Logo (mobile only) */}
      <div className="flex items-center">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2 md:hidden"
          >
            <i className="ri-menu-line"></i>
          </Button>
        )}
        
        {isMobile && (
          <h1 className="text-xl font-bold font-poppins tracking-wider text-white md:hidden">
            <span className="text-neon-green neon-text">Stay</span>
            <span className="text-white">X</span>
          </h1>
        )}

        {title && !isMobile && (
          <h2 className="text-lg font-poppins font-medium hidden md:block">
            {title}
          </h2>
        )}
      </div>

      {/* Center section - Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search people, drops, rooms..."
            className="bg-dark-lighter border-none pl-9 pr-4 h-9 text-sm focus-visible:ring-1 focus-visible:ring-neon-green"
          />
          <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-medium"></i>
        </div>
      </div>

      {/* Right section - User menu */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="text-gray-medium relative">
          <i className="ri-notification-3-line"></i>
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-neon-green text-dark p-0 text-xs">
            3
          </Badge>
        </Button>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 border border-neon-green/30">
                  <AvatarImage src={user.photoURL || ""} alt={user.displayName} />
                  <AvatarFallback className="bg-dark-lighter text-neon-green">
                    {user.displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-1 mr-1">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user.displayName}</span>
                  <span className="text-xs text-gray-medium">@{user.username}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <i className="ri-user-line mr-2"></i> Profile
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem className="cursor-pointer">
                  <i className="ri-settings-3-line mr-2"></i> Settings
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-destructive" 
                onClick={() => logout()}
              >
                <i className="ri-logout-box-r-line mr-2"></i> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-neon-green"
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild variant="default" size="sm">
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;