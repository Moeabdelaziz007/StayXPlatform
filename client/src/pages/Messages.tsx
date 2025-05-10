import { useState } from "react";
import { useRoute } from "wouter";
import Layout from "@/components/layout/Layout";
import ContactList from "@/components/messages/ContactList";
import ChatInterface from "@/components/messages/ChatInterface";
import MessageList from "@/components/messages/MessageList";
import { useAuth } from "@/hooks/useAuth";
import { useConnections, EnrichedConnection } from "@/hooks/useConnections";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

const Messages = () => {
  const { user } = useAuth();
  const { acceptedConnections, isLoading } = useConnections();
  const [, params] = useRoute("/messages/:userId");
  const userId = params?.userId ? parseInt(params.userId) : undefined;
  
  // Selected user from route or state
  const selectedUser = userId 
    ? acceptedConnections?.find(conn => conn.user.id === userId)?.user 
    : undefined;

  if (!user) {
    return (
      <Layout title="Messages">
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your messages</h1>
          <Button asChild className="bg-neon-green hover:bg-opacity-80 text-dark font-medium">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Messages">
      <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-240px)]">
        <div className="hidden md:block">
          <ContactList 
            selectedUserId={userId} 
            onSelectContact={(id) => window.location.href = `/messages/${id}`} 
          />
        </div>
        
        {selectedUser ? (
          <ChatInterface otherUser={selectedUser} />
        ) : (
          <div className="flex-1">
            <div className="md:hidden mb-4">
              <ContactList 
                selectedUserId={userId} 
                onSelectContact={(id) => window.location.href = `/messages/${id}`} 
              />
            </div>
            
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <MessageList 
                onSelectContact={(id) => window.location.href = `/messages/${id}`} 
              />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Messages;
