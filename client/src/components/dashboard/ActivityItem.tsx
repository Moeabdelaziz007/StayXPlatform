import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

interface ActivityItemProps {
  type: "connection_request" | "connection_accepted" | "achievement_earned" | "message_received";
  data: {
    user?: {
      id: number;
      displayName: string;
      photoURL?: string;
    };
    achievement?: {
      name: string;
      points: number;
      icon: string;
    };
    message?: {
      preview: string;
    };
    timestamp: Date;
  };
  onAction?: (action: string) => void;
}

const ActivityItem = ({ type, data, onAction }: ActivityItemProps) => {
  // Icon and color based on activity type
  let icon = "";
  let iconColor = "";
  let bgColor = "";
  
  switch (type) {
    case "connection_request":
    case "connection_accepted":
      icon = "ri-user-add-line";
      iconColor = "text-neon-green";
      bgColor = "bg-neon-green";
      break;
    case "achievement_earned":
      icon = "ri-award-line";
      iconColor = "text-purple-500";
      bgColor = "bg-purple-500";
      break;
    case "message_received":
      icon = "ri-message-3-line";
      iconColor = "text-blue-500";
      bgColor = "bg-blue-500";
      break;
  }

  // Activity content based on type
  let content = null;
  
  switch (type) {
    case "connection_request":
      content = (
        <>
          <p><span className="font-medium">{data.user?.displayName}</span> sent you a connection request</p>
          <p className="text-sm text-gray-medium mt-1">AI Match Score: {Math.floor(Math.random() * 25) + 75}%</p>
          <div className="flex mt-3 space-x-3">
            <Button 
              variant="link" 
              className="text-sm text-neon-green hover:underline p-0 h-auto"
              onClick={() => onAction?.("accept")}
            >
              Accept
            </Button>
            <Button 
              variant="link" 
              className="text-sm text-gray-medium hover:text-neon-green transition-colors p-0 h-auto"
              onClick={() => onAction?.("decline")}
            >
              Decline
            </Button>
          </div>
        </>
      );
      break;
    case "connection_accepted":
      content = (
        <>
          <p><span className="font-medium">{data.user?.displayName}</span> accepted your connection request</p>
          <div className="flex mt-3 space-x-3">
            <Button 
              variant="link" 
              className="text-sm text-neon-green hover:underline p-0 h-auto"
              asChild
            >
              <Link href={`/profile/${data.user?.id}`}>View Profile</Link>
            </Button>
            <Button 
              variant="link" 
              className="text-sm text-gray-medium hover:text-neon-green transition-colors p-0 h-auto"
              asChild
            >
              <Link href={`/messages/${data.user?.id}`}>Message</Link>
            </Button>
          </div>
        </>
      );
      break;
    case "achievement_earned":
      content = (
        <>
          <p>You earned the <span className="font-medium">{data.achievement?.name}</span> achievement</p>
          <p className="text-sm text-gray-medium mt-1">+{data.achievement?.points} achievement points</p>
          <div className="flex mt-3 space-x-3">
            <Button 
              variant="link" 
              className="text-sm text-neon-green hover:underline p-0 h-auto"
              asChild
            >
              <Link href="/profile">View Badge</Link>
            </Button>
            <Button 
              variant="link" 
              className="text-sm text-gray-medium hover:text-neon-green transition-colors p-0 h-auto"
              onClick={() => onAction?.("share")}
            >
              Share
            </Button>
          </div>
        </>
      );
      break;
    case "message_received":
      content = (
        <>
          <p><span className="font-medium">{data.user?.displayName}</span> sent you a message</p>
          <p className="text-sm text-gray-medium mt-1">{data.message?.preview}</p>
          <div className="flex mt-3 space-x-3">
            <Button 
              variant="link" 
              className="text-sm text-neon-green hover:underline p-0 h-auto"
              asChild
            >
              <Link href={`/messages/${data.user?.id}`}>Reply</Link>
            </Button>
            <Button 
              variant="link" 
              className="text-sm text-gray-medium hover:text-neon-green transition-colors p-0 h-auto"
              asChild
            >
              <Link href={`/messages/${data.user?.id}`}>View Thread</Link>
            </Button>
          </div>
        </>
      );
      break;
  }

  return (
    <div className="card bg-[#1E1E1E] rounded-xl p-4 flex items-start space-x-4">
      <div className={`w-10 h-10 rounded-full ${bgColor} bg-opacity-10 flex items-center justify-center flex-shrink-0 mt-1`}>
        <i className={`${icon} ${iconColor}`}></i>
      </div>
      <div className="flex-1">
        {content}
      </div>
      <span className="text-xs text-gray-medium">
        {formatDistanceToNow(data.timestamp, { addSuffix: true })}
      </span>
    </div>
  );
};

export default ActivityItem;
