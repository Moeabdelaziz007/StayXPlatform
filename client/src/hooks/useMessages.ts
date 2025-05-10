import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { Message } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { trackMessageSent } from '@/firebase/analytics';

export const useMessages = (otherUserId?: number) => {
  const { firebaseUser, user } = useAuth();
  const { toast } = useToast();

  // Get messages between current user and another user
  const { 
    data: messages, 
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ['/api/messages', otherUserId],
    enabled: !!firebaseUser && !!user && !!otherUserId,
    queryFn: async () => {
      if (!firebaseUser || !otherUserId) return [];
      
      const res = await fetch(`/api/messages/${otherUserId}`, {
        headers: {
          'firebase-id': firebaseUser.uid
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch messages');
      return res.json() as Promise<Message[]>;
    }
  });

  // Send a new message
  const sendMessage = useMutation({
    mutationFn: async ({ receiverId, content }: { receiverId: number; content: string }) => {
      if (!firebaseUser || !user) throw new Error('User not authenticated');
      
      const res = await apiRequest('POST', '/api/messages', {
        receiverId,
        content
      }, {
        'firebase-id': firebaseUser.uid
      });
      
      trackMessageSent();
      return res;
    },
    onSuccess: (_, variables) => {
      // Invalidate messages query
      queryClient.invalidateQueries({ queryKey: ['/api/messages', variables.receiverId] });
      
      // Optimistically add the message to the existing messages
      if (messages) {
        const newMessage: Message = {
          id: Date.now(), // Temporary ID
          senderId: user!.id,
          receiverId: variables.receiverId,
          content: variables.content,
          read: false,
          createdAt: new Date()
        };
        
        queryClient.setQueryData(['/api/messages', variables.receiverId], [
          ...messages,
          newMessage
        ]);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    }
  });

  // Poll for new messages when in a conversation
  const pollInterval = 10000; // 10 seconds
  
  useQuery({
    queryKey: ['/api/messages/poll', otherUserId],
    enabled: !!firebaseUser && !!user && !!otherUserId,
    queryFn: async () => {
      await refetchMessages();
      return null;
    },
    refetchInterval: pollInterval
  });

  return {
    messages,
    isLoading: isLoadingMessages,
    sendMessage,
    refetchMessages
  };
};
