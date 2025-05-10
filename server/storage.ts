import { 
  users, type User, type InsertUser,
  connections, type Connection, type InsertConnection,
  messages, type Message, type InsertMessage, 
  activities, type Activity, type InsertActivity,
  achievements, type Achievement, type InsertAchievement,
  userAchievements, type UserAchievement, type InsertUserAchievement
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, sql, like } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByFirebaseId(firebaseId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseId, firebaseId));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...userData, lastActive: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    return db
      .select()
      .from(users)
      .where(
        or(
          like(users.username, `%${query}%`),
          like(users.displayName, `%${query}%`),
          like(users.bio, `%${query}%`)
        )
      )
      .limit(limit);
  }

  // Connection operations
  async getConnection(id: number): Promise<Connection | undefined> {
    const [connection] = await db.select().from(connections).where(eq(connections.id, id));
    return connection;
  }

  async getConnectionByUsers(senderId: number, receiverId: number): Promise<Connection | undefined> {
    const [connection] = await db
      .select()
      .from(connections)
      .where(
        or(
          and(
            eq(connections.senderId, senderId),
            eq(connections.receiverId, receiverId)
          ),
          and(
            eq(connections.senderId, receiverId),
            eq(connections.receiverId, senderId)
          )
        )
      );
    return connection;
  }

  async getUserConnections(userId: number, status?: string): Promise<Connection[]> {
    let query = db
      .select()
      .from(connections)
      .where(
        or(
          eq(connections.senderId, userId),
          eq(connections.receiverId, userId)
        )
      );

    if (status) {
      query = query.where(eq(connections.status, status));
    }

    return query.orderBy(desc(connections.updatedAt));
  }

  async createConnection(connection: InsertConnection): Promise<Connection> {
    const [newConnection] = await db
      .insert(connections)
      .values(connection)
      .returning();
    return newConnection;
  }

  async updateConnection(id: number, status: string): Promise<Connection | undefined> {
    const [updatedConnection] = await db
      .update(connections)
      .set({ status, updatedAt: new Date() })
      .where(eq(connections.id, id))
      .returning();
    return updatedConnection;
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }

  async getConversation(user1Id: number, user2Id: number, limit: number = 50): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(
        or(
          and(
            eq(messages.senderId, user1Id),
            eq(messages.receiverId, user2Id)
          ),
          and(
            eq(messages.senderId, user2Id),
            eq(messages.receiverId, user1Id)
          )
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(limit);
  }

  async getUserMessages(userId: number, limit: number = 50): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(
        or(
          eq(messages.senderId, userId),
          eq(messages.receiverId, userId)
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(limit);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const [updatedMessage] = await db
      .update(messages)
      .set({ read: true })
      .where(eq(messages.id, id))
      .returning();
    return updatedMessage;
  }

  // Activity operations
  async getActivity(id: number): Promise<Activity | undefined> {
    const [activity] = await db.select().from(activities).where(eq(activities.id, id));
    return activity;
  }

  async getUserActivities(userId: number, limit: number = 20): Promise<Activity[]> {
    return db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db
      .insert(activities)
      .values(activity)
      .returning();
    return newActivity;
  }

  // Achievement operations
  async getAchievement(id: number): Promise<Achievement | undefined> {
    const [achievement] = await db.select().from(achievements).where(eq(achievements.id, id));
    return achievement;
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return db.select().from(achievements);
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db
      .insert(achievements)
      .values(achievement)
      .returning();
    return newAchievement;
  }

  // User Achievement operations
  async getUserAchievement(userId: number, achievementId: number): Promise<UserAchievement | undefined> {
    const [userAchievement] = await db
      .select()
      .from(userAchievements)
      .where(
        and(
          eq(userAchievements.userId, userId),
          eq(userAchievements.achievementId, achievementId)
        )
      );
    return userAchievement;
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));
  }

  async createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const [newUserAchievement] = await db
      .insert(userAchievements)
      .values(userAchievement)
      .returning();
    return newUserAchievement;
  }

  // AI/Recommendation operations
  async getRecommendedConnections(userId: number, limit: number = 10): Promise<{ user: User; matchScore: number }[]> {
    // Get all users except the current user and exclude those who already have a connection
    // First find existing connections
    const existingConnections = await this.getUserConnections(userId);
    const connectedUserIds = new Set(
      existingConnections.map(conn => 
        conn.senderId === userId ? conn.receiverId : conn.senderId
      )
    );
    
    // Then find potential connections
    const potentialUsers = await db
      .select()
      .from(users)
      .where(
        sql`${users.id} != ${userId} AND ${users.id} NOT IN (${Array.from(connectedUserIds).join(',') || 0})`
      )
      .limit(limit);
    
    // Calculate match scores for each potential connection
    const recommendations: { user: User; matchScore: number }[] = [];
    
    for (const user of potentialUsers) {
      const matchScore = await this.calculateMatchScore(userId, user.id);
      recommendations.push({ user, matchScore });
    }
    
    // Sort by match score (descending)
    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }

  async calculateMatchScore(user1Id: number, user2Id: number): Promise<number> {
    // Get both users
    const user1 = await this.getUser(user1Id);
    const user2 = await this.getUser(user2Id);
    
    if (!user1 || !user2) {
      return 0;
    }
    
    // Simple scoring algorithm based on shared interests
    const interests1 = new Set(user1.interests || []);
    const interests2 = new Set(user2.interests || []);
    
    let score = 0;
    
    // Calculate interest overlap
    if (interests1.size > 0 && interests2.size > 0) {
      const sharedInterests = [...interests1].filter(interest => interests2.has(interest));
      score += (sharedInterests.length / Math.max(interests1.size, interests2.size)) * 70;
    }
    
    // Add some randomness for discovery (0-30 points)
    score += Math.floor(Math.random() * 30);
    
    // Return final score between 0-100
    return Math.min(Math.round(score), 100);
  }
}

// Export a singleton instance of DatabaseStorage
export const storage = new DatabaseStorage();