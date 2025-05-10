import { useConnections, EnrichedConnection } from "@/hooks/useConnections";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface ContactListProps {
  selectedUserId?: number;
  onSelectContact: (userId: number) => void;
}

const ContactList = ({ selectedUserId, onSelectContact }: ContactListProps) => {
  const { acceptedConnections, isLoading } = useConnections();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter contacts based on search
  const filteredContacts = acceptedConnections?.filter(connection => 
    connection.user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connection.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-full md:w-80 border-[#2A2A2A] bg-[#1E1E1E]">
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Messages</span>
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
            <i className="ri-edit-line text-neon-green"></i>
          </Button>
        </CardTitle>
        <div className="mt-2">
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#2A2A2A] border-[#2A2A2A] focus:border-neon-green"
          />
        </div>
      </CardHeader>
      <CardContent className="px-2 py-0 max-h-[calc(100vh-240px)] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-2 px-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : filteredContacts && filteredContacts.length > 0 ? (
          <div className="space-y-1 py-1">
            {filteredContacts.map((connection: EnrichedConnection) => (
              <button
                key={connection.id}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#2A2A2A] transition-colors",
                  selectedUserId === connection.user.id && "bg-[#2A2A2A]"
                )}
                onClick={() => onSelectContact(connection.user.id)}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={connection.user.photoURL || ""} alt={connection.user.displayName} />
                  <AvatarFallback className="bg-[#2A2A2A] text-neon-green">
                    {connection.user.displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="font-medium">{connection.user.displayName}</p>
                  <p className="text-xs text-gray-medium truncate">
                    {connection.user.lastActive 
                      ? `Last active ${formatDistanceToNow(new Date(connection.user.lastActive), { addSuffix: true })}` 
                      : "Offline"
                    }
                  </p>
                </div>
                
                {/* This would show unread message count in a real app */}
                {/* <div className="bg-neon-green rounded-full h-5 w-5 flex items-center justify-center text-xs text-black font-bold">2</div> */}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-medium text-sm">
              {searchQuery 
                ? "No contacts match your search"
                : "No contacts found"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactList;
