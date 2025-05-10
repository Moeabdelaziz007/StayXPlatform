import { 
  users, type User, type InsertUser,
  connections, type Connection, type InsertConnection,
  messages, type Message, type InsertMessage,
  activities, type Activity, type InsertActivity,
  achievements, type Achievement, type InsertAchievement,
  userAchievements, type UserAchievement, type InsertUserAchievement
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseId(firebaseId: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  searchUsers(query: string, limit?: number): Promise<User[]>;
  
  // Connection operations
  getConnection(id: number): Promise<Connection | undefined>;
  getConnectionByUsers(senderId: number, receiverId: number): Promise<Connection | undefined>;
  getUserConnections(userId: number, status?: string): Promise<Connection[]>;
  createConnection(connection: InsertConnection): Promise<Connection>;
  updateConnection(id: number, status: string): Promise<Connection | undefined>;
  
  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getConversation(user1Id: number, user2Id: number, limit?: number): Promise<Message[]>;
  getUserMessages(userId: number, limit?: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  
  // Activity operations
  getActivity(id: number): Promise<Activity | undefined>;
  getUserActivities(userId: number, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Achievement operations
  getAchievement(id: number): Promise<Achievement | undefined>;
  getAllAchievements(): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // User Achievement operations
  getUserAchievement(userId: number, achievementId: number): Promise<UserAchievement | undefined>;
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;
  
  // AI/Recommendation operations
  getRecommendedConnections(userId: number, limit?: number): Promise<{ user: User; matchScore: number }[]>;
  calculateMatchScore(user1Id: number, user2Id: number): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private connections: Map<number, Connection>;
  private messages: Map<number, Message>;
  private activities: Map<number, Activity>;
  private achievements: Map<number, Achievement>;
  private userAchievements: Map<number, UserAchievement>;
  
  private userIdCounter: number;
  private connectionIdCounter: number;
  private messageIdCounter: number;
  private activityIdCounter: number;
  private achievementIdCounter: number;
  private userAchievementIdCounter: number;

  constructor() {
    this.users = new Map();
    this.connections = new Map();
    this.messages = new Map();
    this.activities = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    
    this.userIdCounter = 1;
    this.connectionIdCounter = 1;
    this.messageIdCounter = 1;
    this.activityIdCounter = 1;
    this.achievementIdCounter = 1;
    this.userAchievementIdCounter = 1;
    
    // Initialize with some achievements
    this.initializeAchievements();
  }

  private initializeAchievements() {
    const defaultAchievements: InsertAchievement[] = [
      {
        name: "Early Adopter",
        description: "Joined StayX in its early days",
        icon: "ri-rocket-line",
        points: 150,
        category: "profile"
      },
      {
        name: "Network Starter",
        description: "Made your first connection",
        icon: "ri-user-add-line",
        points: 50,
        category: "social"
      },
      {
        name: "Crypto Enthusiast",
        description: "Added crypto-related interests to your profile",
        icon: "ri-bitcoin-line",
        points: 100,
        category: "crypto"
      }
    ];

    defaultAchievements.forEach(achievement => {
      this.createAchievement(achievement);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseId(firebaseId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.firebaseId === firebaseId);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const newUser: User = {
      ...user,
      id,
      createdAt: now,
      lastActive: now
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const updatedUser: User = { ...user, ...userData, lastActive: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.users.values())
      .filter(user => 
        user.username.toLowerCase().includes(lowercaseQuery) ||
        user.displayName.toLowerCase().includes(lowercaseQuery) ||
        (user.bio && user.bio.toLowerCase().includes(lowercaseQuery))
      )
      .slice(0, limit);
  }

  // Connection operations
  async getConnection(id: number): Promise<Connection | undefined> {
    return this.connections.get(id);
  }

  async getConnectionByUsers(senderId: number, receiverId: number): Promise<Connection | undefined> {
    return Array.from(this.connections.values()).find(
      conn => (conn.senderId === senderId && conn.receiverId === receiverId) ||
              (conn.senderId === receiverId && conn.receiverId === senderId)
    );
  }

  async getUserConnections(userId: number, status?: string): Promise<Connection[]> {
    return Array.from(this.connections.values()).filter(conn => 
      (conn.senderId === userId || conn.receiverId === userId) &&
      (!status || conn.status === status)
    );
  }

  async createConnection(connection: InsertConnection): Promise<Connection> {
    const id = this.connectionIdCounter++;
    const now = new Date();
    const newConnection: Connection = {
      ...connection,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.connections.set(id, newConnection);
    return newConnection;
  }

  async updateConnection(id: number, status: string): Promise<Connection | undefined> {
    const connection = await this.getConnection(id);
    if (!connection) return undefined;

    const updatedConnection: Connection = { 
      ...connection, 
      status, 
      updatedAt: new Date() 
    };
    
    this.connections.set(id, updatedConnection);
    return updatedConnection;
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getConversation(user1Id: number, user2Id: number, limit: number = 50): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => 
        (msg.senderId === user1Id && msg.receiverId === user2Id) ||
        (msg.senderId === user2Id && msg.receiverId === user1Id)
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(-limit);
  }

  async getUserMessages(userId: number, limit: number = 50): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => msg.senderId === userId || msg.receiverId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const newMessage: Message = {
      ...message,
      id,
      createdAt: new Date()
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = await this.getMessage(id);
    if (!message) return undefined;

    const updatedMessage: Message = { ...message, read: true };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  // Activity operations
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async getUserActivities(userId: number, limit: number = 20): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const newActivity: Activity = {
      ...activity,
      id,
      createdAt: new Date()
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  // Achievement operations
  async getAchievement(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const id = this.achievementIdCounter++;
    const newAchievement: Achievement = {
      ...achievement,
      id
    };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }

  // User Achievement operations
  async getUserAchievement(userId: number, achievementId: number): Promise<UserAchievement | undefined> {
    return Array.from(this.userAchievements.values()).find(
      ua => ua.userId === userId && ua.achievementId === achievementId
    );
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values())
      .filter(ua => ua.userId === userId);
  }

  async createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const id = this.userAchievementIdCounter++;
    const newUserAchievement: UserAchievement = {
      ...userAchievement,
      id,
      earnedAt: new Date()
    };
    this.userAchievements.set(id, newUserAchievement);
    
    // Update user's achievement points
    const achievement = await this.getAchievement(userAchievement.achievementId);
    if (achievement) {
      const user = await this.getUser(userAchievement.userId);
      if (user) {
        await this.updateUser(user.id, {
          achievementPoints: (user.achievementPoints || 0) + achievement.points
        });
      }
    }
    
    return newUserAchievement;
  }

  // AI/Recommendation operations
  async getRecommendedConnections(userId: number, limit: number = 10): Promise<{ user: User; matchScore: number }[]> {
    const currentUser = await this.getUser(userId);
    if (!currentUser) return [];

    const userConnections = await this.getUserConnections(userId);
    const connectedUserIds = userConnections.map(conn => 
      conn.senderId === userId ? conn.receiverId : conn.senderId
    );

    // Get users who are not connected to the current user
    const potentialConnections = Array.from(this.users.values())
      .filter(user => user.id !== userId && !connectedUserIds.includes(user.id));

    const recommendations: { user: User; matchScore: number }[] = [];

    for (const user of potentialConnections) {
      const matchScore = await this.calculateMatchScore(userId, user.id);
      recommendations.push({ user, matchScore });
    }

    // Sort by match score and limit
    return recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  async calculateMatchScore(user1Id: number, user2Id: number): Promise<number> {
    const user1 = await this.getUser(user1Id);
    const user2 = await this.getUser(user2Id);
    
    if (!user1 || !user2) return 0;

    // Simple matching algorithm based on shared interests
    // In a real application, this would be much more sophisticated
    let score = 60; // Base score
    
    // Add random factor for demo purposes (this would be a real AI calculation in production)
    score += Math.floor(Math.random() * 40);
    
    // Cap at 100
    return Math.min(score, 100);
  }
}

export const storage = new MemStorage();
