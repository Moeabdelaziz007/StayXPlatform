import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useConnections, EnrichedConnection } from "@/hooks/useConnections";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import ConnectionCard from "@/components/dashboard/ConnectionCard";
import { trackSearch } from "@/firebase/analytics";

const Connections = () => {
  const { user, firebaseUser } = useAuth();
  const { 
    recommendedConnections, 
    pendingConnections, 
    acceptedConnections, 
    isLoading,
    acceptConnectionRequest,
    rejectConnectionRequest 
  } = useConnections();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("recommended");
  
  // Search users
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['/api/users/search', searchQuery],
    enabled: !!searchQuery && searchQuery.length >= 2,
    queryFn: async () => {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error('Failed to search users');
      return res.json();
    }
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length >= 2) {
      trackSearch(searchQuery);
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchQuery("");
  };
  
  if (!user) {
    return (
      <Layout title="Connections">
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your connections</h1>
          <Button asChild className="bg-neon-green hover:bg-opacity-80 text-dark font-medium">
            <a href="/login">Sign In</a>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Connections">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-poppins mb-2">Your Network</h1>
        <p className="text-gray-medium">Connect with like-minded crypto enthusiasts</p>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <TabsList className="h-10">
            <TabsTrigger 
              value="recommended" 
              className="data-[state=active]:bg-neon-green data-[state=active]:text-dark"
            >
              Recommended
            </TabsTrigger>
            <TabsTrigger 
              value="pending" 
              className="data-[state=active]:bg-neon-green data-[state=active]:text-dark"
            >
              Pending
              {pendingConnections && pendingConnections.length > 0 && (
                <Badge className="ml-2 bg-neon-green text-dark">{pendingConnections.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="connections" 
              className="data-[state=active]:bg-neon-green data-[state=active]:text-dark"
            >
              Connections
            </TabsTrigger>
            <TabsTrigger 
              value="search" 
              className="data-[state=active]:bg-neon-green data-[state=active]:text-dark"
            >
              Search
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "search" && (
            <div className="flex-1 max-w-md">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search by name or username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#2A2A2A] border-[#2A2A2A] focus:border-neon-green"
                />
                <Button 
                  type="submit" 
                  className="bg-neon-green text-dark hover:bg-neon-green/90"
                  disabled={searchQuery.length < 2}
                >
                  <i className="ri-search-line mr-2"></i>
                  Search
                </Button>
              </form>
            </div>
          )}
        </div>
        
        <TabsContent value="recommended" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : (
            recommendedConnections && recommendedConnections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedConnections.map((recommendation) => (
                  <ConnectionCard 
                    key={recommendation.user.id}
                    user={recommendation.user}
                    matchScore={recommendation.matchScore}
                    interests={recommendation.user.interests}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-[#1E1E1E] rounded-xl border border-[#2A2A2A]">
                <p className="text-gray-medium">No recommendations available</p>
                <p className="text-sm mt-2">
                  Try updating your profile with more details to get better matches
                </p>
              </div>
            )
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            pendingConnections && pendingConnections.length > 0 ? (
              <div className="space-y-4">
                {pendingConnections.map((connection: EnrichedConnection) => (
                  <Card key={connection.id} className="overflow-hidden">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={connection.user.photoURL || ""} alt={connection.user.displayName} />
                        <AvatarFallback className="bg-[#2A2A2A] text-neon-green">
                          {connection.user.displayName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-medium">{connection.user.displayName}</h3>
                        <p className="text-sm text-gray-medium">@{connection.user.username}</p>
                        
                        {connection.user.interests && connection.user.interests.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {connection.user.interests.slice(0, 3).map((interest, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-neon-green bg-opacity-10 text-neon-green border-0 text-xs"
                              >
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-medium">
                        <span className="text-neon-green font-semibold">{connection.aiMatchScore}%</span> match
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => acceptConnectionRequest.mutate(connection.id)}
                          disabled={acceptConnectionRequest.isPending}
                          className="bg-neon-green text-dark hover:bg-neon-green/90"
                        >
                          Accept
                        </Button>
                        <Button 
                          onClick={() => rejectConnectionRequest.mutate(connection.id)}
                          disabled={rejectConnectionRequest.isPending}
                          variant="outline"
                          className="border-[#2A2A2A] hover:bg-[#2A2A2A]"
                        >
                          Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-[#1E1E1E] rounded-xl border border-[#2A2A2A]">
                <p className="text-gray-medium">No pending connection requests</p>
              </div>
            )
          )}
        </TabsContent>
        
        <TabsContent value="connections" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            acceptedConnections && acceptedConnections.length > 0 ? (
              <div className="space-y-4">
                {acceptedConnections.map((connection: EnrichedConnection) => (
                  <Card key={connection.id} className="overflow-hidden">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={connection.user.photoURL || ""} alt={connection.user.displayName} />
                        <AvatarFallback className="bg-[#2A2A2A] text-neon-green">
                          {connection.user.displayName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-medium">{connection.user.displayName}</h3>
                        <p className="text-sm text-gray-medium">@{connection.user.username}</p>
                        
                        {connection.user.interests && connection.user.interests.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {connection.user.interests.slice(0, 3).map((interest, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-neon-green bg-opacity-10 text-neon-green border-0 text-xs"
                              >
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          asChild
                          variant="outline"
                          className="border-neon-green text-neon-green hover:bg-neon-green/10"
                        >
                          <Link href={`/messages/${connection.user.id}`}>
                            <i className="ri-message-3-line mr-2"></i> Message
                          </Link>
                        </Button>
                        <Button 
                          asChild
                          variant="ghost"
                          className="text-gray-medium hover:text-neon-green hover:bg-transparent"
                        >
                          <Link href={`/profile/${connection.user.id}`}>
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-[#1E1E1E] rounded-xl border border-[#2A2A2A]">
                <p className="text-gray-medium">You don't have any connections yet</p>
                <Button
                  asChild
                  className="mt-4 bg-neon-green hover:bg-opacity-80 text-dark font-medium"
                >
                  <a href="#recommended" onClick={() => setActiveTab("recommended")}>
                    Find Connections
                  </a>
                </Button>
              </div>
            )
          )}
        </TabsContent>
        
        <TabsContent value="search" className="space-y-4">
          {searchQuery.length < 2 ? (
            <div className="text-center py-10 bg-[#1E1E1E] rounded-xl border border-[#2A2A2A]">
              <p className="text-gray-medium">Enter at least 2 characters to search</p>
            </div>
          ) : isSearching ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            searchResults && searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((result: any) => (
                  <Card key={result.id} className="overflow-hidden">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={result.photoURL || ""} alt={result.displayName} />
                        <AvatarFallback className="bg-[#2A2A2A] text-neon-green">
                          {result.displayName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-medium">{result.displayName}</h3>
                        <p className="text-sm text-gray-medium">@{result.username}</p>
                        
                        {result.interests && result.interests.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {result.interests.slice(0, 3).map((interest: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-neon-green bg-opacity-10 text-neon-green border-0 text-xs"
                              >
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        variant="outline"
                        className="border-neon-green text-neon-green hover:bg-neon-green/10"
                        onClick={() => {
                          // Here you would check if already connected
                          // For simplicity, we'll just show a message
                          alert("Connection functionality would go here");
                        }}
                      >
                        <i className="ri-user-add-line mr-2"></i> Connect
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-[#1E1E1E] rounded-xl border border-[#2A2A2A]">
                <p className="text-gray-medium">No results found for "{searchQuery}"</p>
              </div>
            )
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Connections;
