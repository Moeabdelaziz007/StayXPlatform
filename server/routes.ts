import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertConnectionSchema, 
  insertMessageSchema,
  insertActivitySchema,
  insertUserAchievementSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix
  const apiRouter = app.route('/api');
  
  // Users
  app.get('/api/users/me', async (req, res) => {
    const firebaseId = req.headers['firebase-id'] as string;
    if (!firebaseId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = await storage.getUserByFirebaseId(firebaseId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  });
  
  app.post('/api/users', async (req, res) => {
    try {
      const userInput = insertUserSchema.parse(req.body);
      
      // Check if user with the same username or email already exists
      const existingByUsername = await storage.getUserByUsername(userInput.username);
      if (existingByUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      
      const existingByEmail = await storage.getUserByEmail(userInput.email);
      if (existingByEmail) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      
      const user = await storage.createUser(userInput);
      
      // Create early adopter achievement for new user
      const achievements = await storage.getAllAchievements();
      const earlyAdopterAchievement = achievements.find(a => a.name === 'Early Adopter');
      
      if (earlyAdopterAchievement) {
        await storage.createUserAchievement({
          userId: user.id,
          achievementId: earlyAdopterAchievement.id,
        });
        
        // Create activity for achievement
        await storage.createActivity({
          userId: user.id,
          type: 'achievement_earned',
          data: { achievementId: earlyAdopterAchievement.id }
        });
      }
      
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid user data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating user' });
    }
  });
  
  app.patch('/api/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    const firebaseId = req.headers['firebase-id'] as string;
    
    if (!firebaseId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const currentUser = await storage.getUserByFirebaseId(firebaseId);
    if (!currentUser || currentUser.id !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    try {
      const updatedUser = await storage.updateUser(userId, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user' });
    }
  });
  
  app.get('/api/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    
    try {
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user' });
    }
  });
  
  app.get('/api/users/search', async (req, res) => {
    const query = req.query.q as string;
    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Search query too short' });
    }
    
    try {
      const users = await storage.searchUsers(query);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error searching users' });
    }
  });
  
  // Connections
  app.get('/api/connections', async (req, res) => {
    const firebaseId = req.headers['firebase-id'] as string;
    if (!firebaseId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = await storage.getUserByFirebaseId(firebaseId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const status = req.query.status as string | undefined;
    
    try {
      const connections = await storage.getUserConnections(user.id, status);
      
      // Get the connected user details for each connection
      const enrichedConnections = await Promise.all(
        connections.map(async (conn) => {
          const otherUserId = conn.senderId === user.id ? conn.receiverId : conn.senderId;
          const otherUser = await storage.getUser(otherUserId);
          return {
            ...conn,
            user: otherUser
          };
        })
      );
      
      res.json(enrichedConnections);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving connections' });
    }
  });
  
  app.post('/api/connections', async (req, res) => {
    const firebaseId = req.headers['firebase-id'] as string;
    if (!firebaseId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const sender = await storage.getUserByFirebaseId(firebaseId);
    if (!sender) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    try {
      const connectionInput = insertConnectionSchema.parse({
        ...req.body,
        senderId: sender.id
      });
      
      // Check if connection already exists
      const existingConnection = await storage.getConnectionByUsers(
        connectionInput.senderId,
        connectionInput.receiverId
      );
      
      if (existingConnection) {
        return res.status(400).json({ message: 'Connection already exists' });
      }
      
      // Calculate AI match score
      const matchScore = await storage.calculateMatchScore(
        connectionInput.senderId,
        connectionInput.receiverId
      );
      
      const connection = await storage.createConnection({
        ...connectionInput,
        aiMatchScore: matchScore
      });
      
      // Create activity for connection request
      await storage.createActivity({
        userId: connectionInput.receiverId,
        type: 'connection_request',
        data: { connectionId: connection.id, senderId: sender.id }
      });
      
      // Check if this is the first connection
      const userConnections = await storage.getUserConnections(sender.id);
      if (userConnections.length === 1) {
        const achievements = await storage.getAllAchievements();
        const networkStarterAchievement = achievements.find(a => a.name === 'Network Starter');
        
        if (networkStarterAchievement) {
          await storage.createUserAchievement({
            userId: sender.id,
            achievementId: networkStarterAchievement.id,
          });
          
          // Create activity for achievement
          await storage.createActivity({
            userId: sender.id,
            type: 'achievement_earned',
            data: { achievementId: networkStarterAchievement.id }
          });
        }
      }
      
      res.status(201).json(connection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid connection data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating connection' });
    }
  });
  
  app.patch('/api/connections/:id', async (req, res) => {
    const connectionId = parseInt(req.params.id);
    const firebaseId = req.headers['firebase-id'] as string;
    
    if (!firebaseId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = await storage.getUserByFirebaseId(firebaseId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    try {
      const connection = await storage.getConnection(connectionId);
      if (!connection) {
        return res.status(404).json({ message: 'Connection not found' });
      }
      
      // Only the receiver can update the connection status
      if (connection.receiverId !== user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      const { status } = req.body;
      if (!status || !['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      
      const updatedConnection = await storage.updateConnection(connectionId, status);
      
      // Create activity for accepted connection
      if (status === 'accepted') {
        await storage.createActivity({
          userId: connection.senderId,
          type: 'connection_accepted',
          data: { connectionId, receiverId: user.id }
        });
      }
      
      res.json(updatedConnection);
    } catch (error) {
      res.status(500).json({ message: 'Error updating connection' });
    }
  });
  
  // Messages
  app.get('/api/messages/:userId', async (req, res) => {
    const otherUserId = parseInt(req.params.userId);
    const firebaseId = req.headers['firebase-id'] as string;
    
    if (!firebaseId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const currentUser = await storage.getUserByFirebaseId(firebaseId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    try {
      const messages = await storage.getConversation(currentUser.id, otherUserId);
      
      // Mark all messages from the other user as read
      await Promise.all(
        messages
          .filter(msg => msg.senderId === otherUserId && !msg.read)
          .map(msg => storage.markMessageAsRead(msg.id))
      );
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving messages' });
    }
  });
  
  app.post('/api/messages', async (req, res) => {
    const firebaseId = req.headers['firebase-id'] as string;
    if (!firebaseId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const sender = await storage.getUserByFirebaseId(firebaseId);
    if (!sender) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    try {
      const messageInput = insertMessageSchema.parse({
        ...req.body,
        senderId: sender.id
      });
      
      // Check if users are connected
      const connection = await storage.getConnectionByUsers(
        messageInput.senderId,
        messageInput.receiverId
      );
      
      if (!connection || connection.status !== 'accepted') {
        return res.status(403).json({ message: 'Users are not connected' });
      }
      
      const message = await storage.createMessage(messageInput);
      
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid message data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating message' });
    }
  });
  
  // Activities
  app.get('/api/activities', async (req, res) => {
    const firebaseId = req.headers['firebase-id'] as string;
    if (!firebaseId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = await storage.getUserByFirebaseId(firebaseId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    try {
      const activities = await storage.getUserActivities(user.id);
      
      // Enrich activities with related data
      const enrichedActivities = await Promise.all(
        activities.map(async (activity) => {
          let enrichedData = { ...activity };
          
          switch (activity.type) {
            case 'connection_request':
              if (activity.data && activity.data.senderId) {
                const sender = await storage.getUser(activity.data.senderId as number);
                enrichedData = { ...enrichedData, sender };
              }
              break;
            case 'connection_accepted':
              if (activity.data && activity.data.receiverId) {
                const receiver = await storage.getUser(activity.data.receiverId as number);
                enrichedData = { ...enrichedData, receiver };
              }
              break;
            case 'achievement_earned':
              if (activity.data && activity.data.achievementId) {
                const achievement = await storage.getAchievement(activity.data.achievementId as number);
                enrichedData = { ...enrichedData, achievement };
              }
              break;
          }
          
          return enrichedData;
        })
      );
      
      res.json(enrichedActivities);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving activities' });
    }
  });
  
  // Achievements
  app.get('/api/achievements', async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving achievements' });
    }
  });
  
  app.get('/api/user-achievements', async (req, res) => {
    const firebaseId = req.headers['firebase-id'] as string;
    if (!firebaseId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = await storage.getUserByFirebaseId(firebaseId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    try {
      const userAchievements = await storage.getUserAchievements(user.id);
      
      // Enrich with achievement details
      const enrichedAchievements = await Promise.all(
        userAchievements.map(async (ua) => {
          const achievement = await storage.getAchievement(ua.achievementId);
          return {
            ...ua,
            achievement
          };
        })
      );
      
      res.json(enrichedAchievements);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user achievements' });
    }
  });
  
  // Recommendations
  app.get('/api/recommendations', async (req, res) => {
    const firebaseId = req.headers['firebase-id'] as string;
    if (!firebaseId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = await storage.getUserByFirebaseId(firebaseId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    try {
      const recommendations = await storage.getRecommendedConnections(user.id);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving recommendations' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
