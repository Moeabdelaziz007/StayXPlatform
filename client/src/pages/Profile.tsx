import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { insertUserSchema } from "@shared/schema";
import { trackProfileUpdate } from "@/firebase/analytics";

// Update profile validation schema
const profileSchema = z.object({
  displayName: z.string().min(3, "Display name must be at least 3 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
  interests: z.string().optional()
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, firebaseUser, refreshUserData } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user achievements
  const { data: userAchievements, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ['/api/user-achievements'],
    enabled: !!firebaseUser && !!user,
    queryFn: async () => {
      if (!firebaseUser) return [];
      const res = await fetch('/api/user-achievements', {
        headers: {
          'firebase-id': firebaseUser.uid
        }
      });
      if (!res.ok) throw new Error('Failed to fetch achievements');
      return res.json();
    }
  });

  // Form setup
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      username: user?.username || "",
      bio: user?.bio || "",
      interests: user?.interests ? user.interests.join(", ") : ""
    }
  });

  // Update form values when user data changes
  const { reset } = form;
  useState(() => {
    if (user) {
      reset({
        displayName: user.displayName,
        username: user.username,
        bio: user.bio || "",
        interests: user.interests ? user.interests.join(", ") : ""
      });
    }
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      if (!firebaseUser || !user) throw new Error('User not authenticated');
      
      // Convert interests string to array
      const interests = data.interests
        ? data.interests.split(",").map(i => i.trim()).filter(i => i.length > 0)
        : [];
      
      const res = await apiRequest('PATCH', `/api/users/${user.id}`, {
        displayName: data.displayName,
        username: data.username,
        bio: data.bio,
        interests
      }, {
        'firebase-id': firebaseUser.uid
      });
      
      trackProfileUpdate('profile_update');
      return res;
    },
    onSuccess: async () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
      
      // Update user data
      await refreshUserData();
      
      // Exit edit mode
      setIsEditing(false);
      
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile.mutate(data);
  };

  if (!user && !isLoadingAchievements) {
    return (
      <Layout title="Profile">
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
          <Button asChild className="bg-neon-green hover:bg-opacity-80 text-dark font-medium">
            <a href="/login">Sign In</a>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Profile">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="h-40 bg-gradient-to-r from-blue-900 to-purple-900 crypto-grid" />
          
          <CardContent className="pt-0 -mt-12">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 mb-6">
              <Avatar className="w-24 h-24 border-4 border-[#1E1E1E]">
                <AvatarImage src={user?.photoURL || ""} alt={user?.displayName} />
                <AvatarFallback className="bg-[#2A2A2A] text-neon-green text-2xl">
                  {user?.displayName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{user?.displayName}</h1>
                <p className="text-gray-medium">@{user?.username}</p>
              </div>
              
              <Button
                variant={isEditing ? "default" : "outline"}
                className={isEditing 
                  ? "bg-neon-green text-dark hover:bg-neon-green/90" 
                  : "border-neon-green text-neon-green hover:bg-neon-green/10"
                }
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
            
            {isEditing ? (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Display Name</label>
                    <Input
                      {...form.register("displayName")}
                      className="bg-[#2A2A2A] border-[#2A2A2A] focus:border-neon-green"
                    />
                    {form.formState.errors.displayName && (
                      <p className="text-xs text-red-500">{form.formState.errors.displayName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <Input
                      {...form.register("username")}
                      className="bg-[#2A2A2A] border-[#2A2A2A] focus:border-neon-green"
                    />
                    {form.formState.errors.username && (
                      <p className="text-xs text-red-500">{form.formState.errors.username.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea
                    {...form.register("bio")}
                    className="bg-[#2A2A2A] border-[#2A2A2A] focus:border-neon-green resize-none h-24"
                  />
                  {form.formState.errors.bio && (
                    <p className="text-xs text-red-500">{form.formState.errors.bio.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Interests (comma separated)</label>
                  <Input
                    {...form.register("interests")}
                    placeholder="blockchain, crypto, fintech, investing"
                    className="bg-[#2A2A2A] border-[#2A2A2A] focus:border-neon-green"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-neon-green text-dark hover:bg-neon-green/90"
                    disabled={updateProfile.isPending}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <p className="mb-4">{user?.bio || "No bio available"}</p>
                
                {user?.interests && user.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {user.interests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-neon-green bg-opacity-10 text-neon-green border-0"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Stats & Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="ri-trophy-line text-neon-green mr-2"></i>
                Achievement Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{user?.achievementPoints || 0}</div>
              <p className="text-gray-medium text-sm">
                Level {user?.level || 1} Explorer • {650 - ((user?.achievementPoints || 0) % 1000)} points to Level {(user?.level || 1) + 1}
              </p>
              
              <div className="mt-4 h-2 w-full bg-[#2A2A2A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-neon-green rounded-full"
                  style={{ width: `${((user?.achievementPoints || 0) % 1000) / 10}%` }}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="ri-user-search-line text-neon-green mr-2"></i>
                Profile Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-medium">Profile Views</span>
                <span>42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-medium">Connection Rate</span>
                <span>87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-medium">Response Time</span>
                <span>2h avg</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="ri-line-chart-line text-neon-green mr-2"></i>
                AI Match Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">89%</div>
              <p className="text-gray-medium text-sm">
                Your profile is highly optimized for AI matching
              </p>
              
              <div className="mt-4 h-2 w-full bg-[#2A2A2A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-neon-green rounded-full"
                  style={{ width: "89%" }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <i className="ri-award-line text-neon-green mr-2"></i>
              Achievements
            </CardTitle>
            <CardDescription>
              Earn achievements by being active on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAchievements ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              userAchievements && userAchievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userAchievements.map((ua: any) => (
                    <div key={ua.id} className="flex items-center p-4 rounded-lg bg-[#2A2A2A]">
                      <div className="w-12 h-12 rounded-full bg-neon-green bg-opacity-10 flex items-center justify-center mr-4">
                        <i className={`${ua.achievement.icon} text-neon-green text-xl`}></i>
                      </div>
                      <div>
                        <h3 className="font-medium">{ua.achievement.name}</h3>
                        <p className="text-sm text-gray-medium">{ua.achievement.description}</p>
                        <div className="text-xs text-neon-green mt-1">+{ua.achievement.points} points</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-medium">No achievements yet</p>
                  <p className="text-sm mt-2">Stay active to earn achievements and level up!</p>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
