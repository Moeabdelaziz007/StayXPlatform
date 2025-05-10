import { useState, useRef, useEffect } from "react";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { User, Message } from "@shared/schema";

interface ChatInterfaceProps {
  otherUser: User;
}

const ChatInterface = ({ otherUser }: ChatInterfaceProps) => {
  const { user } = useAuth();
  const { messages, sendMessage, isLoading } = useMessages(otherUser.id);
  const [newMessage, setNewMessage] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      sendMessage.mutate({
        receiverId: otherUser.id,
        content: newMessage
      });
      setNewMessage("");
    }
  };

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!user) {
    return (
      <Card className="flex-1 flex flex-col overflow-hidden border-[#2A2A2A] bg-[#1E1E1E]">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-gray-medium">Please sign in to chat</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-1 flex flex-col h-full border-[#2A2A2A] bg-[#1E1E1E]">
      <CardHeader className="border-b border-[#2A2A2A] py-3 px-4 flex flex-row items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={otherUser.photoURL || ""} alt={otherUser.displayName} />
          <AvatarFallback className="bg-[#2A2A2A] text-neon-green">
            {otherUser.displayName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{otherUser.displayName}</h3>
          <p className="text-xs text-gray-medium">
            {otherUser.lastActive ? `Last active ${formatDistanceToNow(new Date(otherUser.lastActive), { addSuffix: true })}` : "Offline"}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 py-4 px-4 overflow-y-auto space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-medium">Loading messages...</p>
          </div>
        ) : messages && messages.length > 0 ? (
          <>
            {messages.map((message: Message) => {
              const isOwn = message.senderId === user.id;
              
              return (
                <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    isOwn 
                      ? 'bg-neon-green bg-opacity-10 text-neon-green rounded-tr-none' 
                      : 'bg-[#2A2A2A] rounded-tl-none'
                  }`}>
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={endOfMessagesRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-medium mb-2">No messages yet</p>
              <p className="text-sm text-gray-medium">Start the conversation!</p>
            </div>
          </div>
        )}
      </CardContent>
      
      <form onSubmit={handleSendMessage} className="border-t border-[#2A2A2A] p-4 flex gap-2">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="bg-[#2A2A2A] border-[#2A2A2A] focus:border-neon-green resize-none h-12 flex-1"
        />
        <Button 
          type="submit" 
          className="bg-neon-green text-black hover:bg-neon-green/90"
          disabled={!newMessage.trim() || sendMessage.isPending}
        >
          <i className="ri-send-plane-fill"></i>
        </Button>
      </form>
    </Card>
  );
};

export default ChatInterface;
