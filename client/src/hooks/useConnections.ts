import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { Connection, User } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { trackConnection } from '@/firebase/analytics';

export interface EnrichedConnection extends Connection {
  user: User;
}

export const useConnections = () => {
  const { firebaseUser, user } = useAuth();
  const { toast } = useToast();

  // Get all connections
  const { data: connections, isLoading: isLoadingConnections } = useQuery({
    queryKey: ['/api/connections'],
    enabled: !!firebaseUser && !!user,
    queryFn: async () => {
      if (!firebaseUser) return [];
      const res = await fetch('/api/connections', {
        headers: {
          'firebase-id': firebaseUser.uid
        }
      });
      if (!res.ok) throw new Error('Failed to fetch connections');
      return res.json() as Promise<EnrichedConnection[]>;
    }
  });

  // Get pending connection requests
  const { data: pendingConnections, isLoading: isLoadingPending } = useQuery({
    queryKey: ['/api/connections', 'pending'],
    enabled: !!firebaseUser && !!user,
    queryFn: async () => {
      if (!firebaseUser) return [];
      const res = await fetch('/api/connections?status=pending', {
        headers: {
          'firebase-id': firebaseUser.uid
        }
      });
      if (!res.ok) throw new Error('Failed to fetch pending connections');
      return res.json() as Promise<EnrichedConnection[]>;
    }
  });

  // Get accepted connections
  const { data: acceptedConnections, isLoading: isLoadingAccepted } = useQuery({
    queryKey: ['/api/connections', 'accepted'],
    enabled: !!firebaseUser && !!user,
    queryFn: async () => {
      if (!firebaseUser) return [];
      const res = await fetch('/api/connections?status=accepted', {
        headers: {
          'firebase-id': firebaseUser.uid
        }
      });
      if (!res.ok) throw new Error('Failed to fetch accepted connections');
      return res.json() as Promise<EnrichedConnection[]>;
    }
  });

  // Get recommended connections
  const { data: recommendedConnections, isLoading: isLoadingRecommended } = useQuery({
    queryKey: ['/api/recommendations'],
    enabled: !!firebaseUser && !!user,
    queryFn: async () => {
      if (!firebaseUser) return [];
      const res = await fetch('/api/recommendations', {
        headers: {
          'firebase-id': firebaseUser.uid
        }
      });
      if (!res.ok) throw new Error('Failed to fetch recommendations');
      return res.json() as Promise<{user: User, matchScore: number}[]>;
    }
  });

  // Send connection request
  const sendConnectionRequest = useMutation({
    mutationFn: async (receiverId: number) => {
      if (!firebaseUser || !user) throw new Error('User not authenticated');
      
      const res = await apiRequest('POST', '/api/connections', {
        receiverId
      }, {
        'firebase-id': firebaseUser.uid
      });
      
      trackConnection('send_request');
      return res;
    },
    onSuccess: () => {
      toast({
        title: "Connection Request Sent",
        description: "Your connection request has been sent!",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/connections'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send connection request",
        variant: "destructive",
      });
    }
  });

  // Accept connection request
  const acceptConnectionRequest = useMutation({
    mutationFn: async (connectionId: number) => {
      if (!firebaseUser || !user) throw new Error('User not authenticated');
      
      const res = await apiRequest('PATCH', `/api/connections/${connectionId}`, {
        status: 'accepted'
      }, {
        'firebase-id': firebaseUser.uid
      });
      
      trackConnection('accept');
      return res;
    },
    onSuccess: () => {
      toast({
        title: "Connection Accepted",
        description: "You are now connected!",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/connections'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to accept connection request",
        variant: "destructive",
      });
    }
  });

  // Reject connection request
  const rejectConnectionRequest = useMutation({
    mutationFn: async (connectionId: number) => {
      if (!firebaseUser || !user) throw new Error('User not authenticated');
      
      const res = await apiRequest('PATCH', `/api/connections/${connectionId}`, {
        status: 'rejected'
      }, {
        'firebase-id': firebaseUser.uid
      });
      
      trackConnection('reject');
      return res;
    },
    onSuccess: () => {
      toast({
        title: "Connection Rejected",
        description: "The connection request has been rejected",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/connections'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject connection request",
        variant: "destructive",
      });
    }
  });

  return {
    connections,
    pendingConnections,
    acceptedConnections,
    recommendedConnections,
    isLoading: isLoadingConnections || isLoadingPending || isLoadingAccepted || isLoadingRecommended,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest
  };
};
