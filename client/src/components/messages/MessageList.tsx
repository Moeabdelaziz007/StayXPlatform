import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

interface MessageListProps {
  onSelectContact: (userId: number) => void;
}

interface ConversationPreview {
  userId: number;
  username: string;
  displayName: string;
  photoURL?: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

const MessageList = ({ onSelectContact }: MessageListProps) => {
  const { user, firebaseUser } = useAuth();
  
  // This would fetch recent conversations in a real app
  // Here we'll simulate some recent conversations
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['/api/messages/recent'],
    enabled: !!firebaseUser && !!user,
    queryFn: async () => {
      // In a real app, this would be an API call
      // For now, return some mock data
      return [
        {
          userId: 2,
          username: "sarahchen",
          displayName: "Sarah Chen",
          photoURL: "",
          lastMessage: "Looking forward to our discussion on the new DeFi project!",
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          unread: true
        },
        {
          userId: 3,
          username: "michaelr",
          displayName: "Michael Rodriguez",
          photoURL: "",
          lastMessage: "Have you seen the latest Bitcoin price movement?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
          unread: false
        }
      ] as ConversationPreview[];
    }
  });

  if (!user) {
    return (
      <Card className="border-[#2A2A2A] bg-[#1E1E1E]">
        <CardContent className="flex items-center justify-center h-48 p-6">
          <div className="text-center">
            <p className="text-gray-medium mb-4">Sign in to view your messages</p>
            <Button asChild className="bg-neon-green text-dark hover:bg-neon-green/90">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#2A2A2A] bg-[#1E1E1E]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <i className="ri-message-3-line text-neon-green mr-2"></i>
          Recent Messages
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : conversations && conversations.length > 0 ? (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <div
                key={conversation.userId}
                className="flex gap-4 p-3 rounded-lg hover:bg-[#2A2A2A] cursor-pointer transition-colors"
                onClick={() => onSelectContact(conversation.userId)}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={conversation.photoURL || ""} alt={conversation.displayName} />
                  <AvatarFallback className="bg-[#2A2A2A] text-neon-green">
                    {conversation.displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium">{conversation.displayName}</h3>
                    <span className="text-xs text-gray-medium">
                      {formatDistanceToNow(conversation.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${conversation.unread ? 'text-gray-light font-medium' : 'text-gray-medium'}`}>
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unread && (
                  <div className="bg-neon-green rounded-full h-3 w-3"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-medium mb-2">No messages yet</p>
            <p className="text-sm text-gray-medium mb-4">Start connecting with other users to begin messaging</p>
            <Button asChild className="bg-neon-green text-dark hover:bg-neon-green/90">
              <Link href="/connections">Find Connections</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageList;
