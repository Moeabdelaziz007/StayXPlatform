import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useConnections } from "@/hooks/useConnections";
import { Link } from "wouter";
import { User } from "@shared/schema";

interface ConnectionCardProps {
  user: User;
  matchScore: number;
  interests?: string[];
  className?: string;
}

const ConnectionCard = ({ user, matchScore, interests = [], className }: ConnectionCardProps) => {
  const { sendConnectionRequest } = useConnections();

  const handleConnect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sendConnectionRequest.mutate(user.id);
  };

  // Generate a random gradient for the card header
  const gradients = [
    "from-blue-900 to-purple-900",
    "from-gray-900 to-blue-900",
    "from-purple-900 to-indigo-900",
    "from-green-900 to-blue-900",
    "from-indigo-900 to-purple-900",
  ];
  
  const randomGradient = gradients[user.id % gradients.length];

  return (
    <div className="card bg-[#1E1E1E] rounded-xl overflow-hidden gradient-border">
      <div className="relative">
        {/* Background gradient */}
        <div className={`h-28 bg-gradient-to-r ${randomGradient} crypto-grid`}></div>
        
        {/* Profile avatar */}
        <div className="absolute -bottom-10 left-4">
          <Avatar className="w-20 h-20 rounded-full border-4 border-[#1E1E1E]">
            <AvatarImage src={user.photoURL || ""} alt={user.displayName} />
            <AvatarFallback className="bg-[#2A2A2A] text-neon-green text-xl">
              {user.displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <div className="p-6 pt-12">
        {/* User info */}
        <h3 className="font-medium text-lg">{user.displayName}</h3>
        <p className="text-gray-medium text-sm mb-3">{user.bio || "StayX Explorer"}</p>
        
        {/* User interests */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {(user.interests || []).slice(0, 3).map((interest, index) => (
            <Badge key={index} variant="outline" className="bg-neon-green bg-opacity-10 text-neon-green border-0">
              {interest}
            </Badge>
          ))}
        </div>
        
        {/* Match score and action button */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-medium">
            <span className="text-neon-green font-semibold">{matchScore}%</span> match
          </div>
          <Button
            onClick={handleConnect}
            disabled={sendConnectionRequest.isPending}
            className="text-neon-green border border-neon-green hover:bg-neon-green hover:bg-opacity-10 rounded-lg px-3 py-1.5 text-sm transition-colors duration-200"
          >
            Connect
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
