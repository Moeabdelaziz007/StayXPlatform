import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import StatsCard from "@/components/dashboard/StatsCard";
import ConnectionCard from "@/components/dashboard/ConnectionCard";
import ActivityItem from "@/components/dashboard/ActivityItem";
import AiInsights from "@/components/dashboard/AiInsights";
import UpcomingFeatures from "@/components/dashboard/UpcomingFeatures";
import { useAuth } from "@/hooks/useAuth";
import { useConnections } from "@/hooks/useConnections";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Activity, User } from "@shared/schema";

const Dashboard = () => {
  const { user, firebaseUser } = useAuth();
  const { recommendedConnections, isLoading: isLoadingConnections } = useConnections();
  
  // Fetch user activities
  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['/api/activities'],
    enabled: !!firebaseUser && !!user,
    queryFn: async () => {
      if (!firebaseUser) return [];
      const res = await fetch('/api/activities', {
        headers: {
          'firebase-id': firebaseUser.uid
        }
      });
      if (!res.ok) throw new Error('Failed to fetch activities');
      return res.json();
    }
  });

  return (
    <Layout title="Dashboard">
      <WelcomeSection />
      
      {/* Stats Overview */}
      {user ? (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title="Network Growth" 
            value={user.connections?.length || 0}
            icon="ri-user-add-line"
            trend={{
              value: "18%",
              positive: true,
              text: "vs last week"
            }}
          />
          
          <StatsCard 
            title="AI Match Score" 
            value="87%"
            icon="ri-brain-line"
            trend={{
              value: "5%",
              positive: true,
              text: "improving"
            }}
          />
          
          <StatsCard 
            title="Achievement Points" 
            value={user.achievementPoints || 0}
            icon="ri-award-line"
            trend={{
              value: `Level ${user.level}`,
              positive: true,
              text: `${650 - (user.achievementPoints || 0) % 1000} to Level ${(user.level || 1) + 1}`
            }}
          />
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </section>
      )}
      
      {/* Connection Recommendations */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-poppins">AI-Powered Connections</h2>
          <Button
            variant="link"
            className="text-neon-green hover:underline text-sm flex items-center"
            asChild
          >
            <Link href="/connections">
              View all
              <i className="ri-arrow-right-line ml-1"></i>
            </Link>
          </Button>
        </div>
        
        {user ? (
          isLoadingConnections ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            recommendedConnections && recommendedConnections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedConnections.slice(0, 3).map((recommendation) => (
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
                <p className="text-gray-medium">No recommendations available yet</p>
                <Button
                  className="mt-4 bg-neon-green hover:bg-opacity-80 text-dark font-medium"
                  asChild
                >
                  <Link href="/connections">Explore Connections</Link>
                </Button>
              </div>
            )
          )
        ) : (
          <div className="text-center py-10 bg-[#1E1E1E] rounded-xl border border-[#2A2A2A]">
            <p className="text-gray-medium">Sign in to see personalized recommendations</p>
            <div className="mt-4 flex justify-center space-x-4">
              <Button
                className="bg-neon-green hover:bg-opacity-80 text-dark font-medium"
                asChild
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                variant="outline"
                className="border-neon-green text-neon-green hover:bg-neon-green hover:bg-opacity-10"
                asChild
              >
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        )}
      </section>
      
      {/* Activity Feed */}
      {user && (
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-poppins">Activity Feed</h2>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => window.location.reload()}
                className="p-2 text-gray-medium hover:text-neon-green transition-colors"
              >
                <i className="ri-refresh-line"></i>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="p-2 text-gray-medium hover:text-neon-green transition-colors"
              >
                <i className="ri-filter-3-line"></i>
              </Button>
            </div>
          </div>
          
          {isLoadingActivities ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            activities && activities.length > 0 ? (
              <div className="space-y-4">
                {activities.slice(0, 3).map((activity: Activity & any) => {
                  let activityType: any;
                  let activityData: any = {
                    timestamp: new Date(activity.createdAt)
                  };
                  
                  switch (activity.type) {
                    case 'connection_request':
                      activityType = "connection_request";
                      if (activity.sender) {
                        activityData.user = activity.sender;
                      }
                      break;
                    case 'connection_accepted':
                      activityType = "connection_accepted";
                      if (activity.receiver) {
                        activityData.user = activity.receiver;
                      }
                      break;
                    case 'achievement_earned':
                      activityType = "achievement_earned";
                      if (activity.achievement) {
                        activityData.achievement = activity.achievement;
                      }
                      break;
                    default:
                      return null;
                  }
                  
                  return (
                    <ActivityItem 
                      key={activity.id}
                      type={activityType}
                      data={activityData}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 bg-[#1E1E1E] rounded-xl border border-[#2A2A2A]">
                <p className="text-gray-medium">No activities yet</p>
                <Button
                  className="mt-4 bg-neon-green hover:bg-opacity-80 text-dark font-medium"
                  asChild
                >
                  <Link href="/connections">Start Connecting</Link>
                </Button>
              </div>
            )
          )}
        </section>
      )}
      
      {/* AI Insights */}
      <AiInsights />
      
      {/* Upcoming Features */}
      <UpcomingFeatures />
    </Layout>
  );
};

export default Dashboard;
