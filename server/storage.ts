import { 
  users, videos, comments, tips,
  type User, type InsertUser,
  type Video, type InsertVideo,
  type Comment, type InsertComment,
  type Tip, type InsertTip
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Video methods
  getVideo(id: number): Promise<Video | undefined>;
  getAllVideos(): Promise<Video[]>;
  getShorts(): Promise<Video[]>;
  getVideosByCreator(creatorId: number): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;

  // Comment methods
  getCommentsByVideo(videoId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;

  // Tip methods
  getTipsByVideo(videoId: number): Promise<Tip[]>;
  getTipsByUser(userId: number): Promise<Tip[]>;
  createTip(tip: InsertTip): Promise<Tip>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getVideo(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video || undefined;
  }

  async getAllVideos(): Promise<Video[]> {
    return await db.select().from(videos).where(eq(videos.isShort, false));
  }

  async getShorts(): Promise<Video[]> {
    return await db.select().from(videos).where(eq(videos.isShort, true));
  }

  async getVideosByCreator(creatorId: number): Promise<Video[]> {
    return await db.select().from(videos).where(eq(videos.creatorId, creatorId));
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const [video] = await db
      .insert(videos)
      .values(insertVideo)
      .returning();
    return video;
  }

  async getCommentsByVideo(videoId: number): Promise<Comment[]> {
    return await db.select().from(comments).where(eq(comments.videoId, videoId));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(insertComment)
      .returning();
    return comment;
  }

  async getTipsByVideo(videoId: number): Promise<Tip[]> {
    return await db.select().from(tips).where(eq(tips.videoId, videoId));
  }

  async getTipsByUser(userId: number): Promise<Tip[]> {
    return await db.select().from(tips).where(eq(tips.toUserId, userId));
  }

  async createTip(insertTip: InsertTip): Promise<Tip> {
    const [tip] = await db
      .insert(tips)
      .values(insertTip)
      .returning();
    return tip;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private videos: Map<number, Video>;
  private comments: Map<number, Comment>;
  private tips: Map<number, Tip>;
  private currentUserId: number;
  private currentVideoId: number;
  private currentCommentId: number;
  private currentTipId: number;

  constructor() {
    this.users = new Map();
    this.videos = new Map();
    this.comments = new Map();
    this.tips = new Map();
    this.currentUserId = 1;
    this.currentVideoId = 1;
    this.currentCommentId = 1;
    this.currentTipId = 1;

    this.seedData();
  }

  private seedData() {
    // Seed users
    const seedUsers: User[] = [
      {
        id: this.currentUserId++,
        username: "TechCrypto Academy",
        walletAddress: "0x1234...5678",
        suiBalance: 15420,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        isVerified: true,
        subscribers: 125000,
        createdAt: new Date(),
      },
      {
        id: this.currentUserId++,
        username: "CryptoEducate",
        walletAddress: "0x2345...6789",
        suiBalance: 8950,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        isVerified: true,
        subscribers: 89000,
        createdAt: new Date(),
      },
      {
        id: this.currentUserId++,
        username: "CreatorSuccess",
        walletAddress: "0x3456...7890",
        suiBalance: 12340,
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        isVerified: true,
        subscribers: 234000,
        createdAt: new Date(),
      },
    ];

    seedUsers.forEach(user => this.users.set(user.id, user));

    // Seed videos
    const seedVideos: Video[] = [
      {
        id: this.currentVideoId++,
        title: "Building the Future: Decentralized Video Streaming on Sui",
        description: "Learn how to build decentralized applications on the Sui blockchain with real-world examples.",
        thumbnailUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop",
        videoUrl: "https://example.com/video1.mp4",
        duration: 765,
        views: 125000,
        likes: 3200,
        suiRewards: 250,
        isShort: false,
        creatorId: 1,
        ipfsHash: "QmX1234...",
        isVerified: true,
        createdAt: new Date(),
      },
      {
        id: this.currentVideoId++,
        title: "Sui Blockchain Explained: The Next Generation of Smart Contracts",
        description: "Complete guide to understanding Sui's unique approach to blockchain technology.",
        thumbnailUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
        videoUrl: "https://example.com/video2.mp4",
        duration: 512,
        views: 89000,
        likes: 2100,
        suiRewards: 180,
        isShort: false,
        creatorId: 2,
        ipfsHash: "QmY5678...",
        isVerified: true,
        createdAt: new Date(),
      },
      {
        id: this.currentVideoId++,
        title: "How I Earned 10,000 SUI in My First Month as a Creator",
        description: "My journey from zero to earning thousands in SUI tokens through content creation.",
        thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        videoUrl: "https://example.com/video3.mp4",
        duration: 920,
        views: 234000,
        likes: 5600,
        suiRewards: 420,
        isShort: false,
        creatorId: 3,
        ipfsHash: "QmZ9012...",
        isVerified: true,
        createdAt: new Date(),
      },
      // Shorts
      {
        id: this.currentVideoId++,
        title: "DeFi Trading Tips",
        description: "Quick tips for successful DeFi trading in 60 seconds",
        thumbnailUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=600&fit=crop",
        videoUrl: "https://example.com/short1.mp4",
        duration: 45,
        views: 2100000,
        likes: 89000,
        suiRewards: 75,
        isShort: true,
        creatorId: 1,
        ipfsHash: "QmA3456...",
        isVerified: true,
        createdAt: new Date(),
      },
      {
        id: this.currentVideoId++,
        title: "Sui Explained",
        description: "Understanding Sui blockchain in under a minute",
        thumbnailUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=600&fit=crop",
        videoUrl: "https://example.com/short2.mp4",
        duration: 32,
        views: 850000,
        likes: 34000,
        suiRewards: 45,
        isShort: true,
        creatorId: 2,
        ipfsHash: "QmB7890...",
        isVerified: true,
        createdAt: new Date(),
      },
      {
        id: this.currentVideoId++,
        title: "Creator Tips",
        description: "Essential tips for new content creators",
        thumbnailUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=600&fit=crop",
        videoUrl: "https://example.com/short3.mp4",
        duration: 58,
        views: 1300000,
        likes: 67000,
        suiRewards: 92,
        isShort: true,
        creatorId: 3,
        ipfsHash: "QmC2345...",
        isVerified: true,
        createdAt: new Date(),
      },
    ];

    seedVideos.forEach(video => this.videos.set(video.id, video));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      walletAddress: insertUser.walletAddress || null,
      suiBalance: insertUser.suiBalance || 0,
      avatar: insertUser.avatar || null,
      isVerified: insertUser.isVerified || false,
      subscribers: insertUser.subscribers || 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Video methods
  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getAllVideos(): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(video => !video.isShort);
  }

  async getShorts(): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(video => video.isShort);
  }

  async getVideosByCreator(creatorId: number): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(video => video.creatorId === creatorId);
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = this.currentVideoId++;
    const video: Video = {
      ...insertVideo,
      id,
      description: insertVideo.description || null,
      thumbnailUrl: insertVideo.thumbnailUrl || null,
      videoUrl: insertVideo.videoUrl || null,
      duration: insertVideo.duration || null,
      views: 0,
      likes: 0,
      suiRewards: 0,
      isShort: insertVideo.isShort || false,
      creatorId: insertVideo.creatorId || null,
      ipfsHash: insertVideo.ipfsHash || null,
      isVerified: insertVideo.isVerified || false,
      createdAt: new Date(),
    };
    this.videos.set(id, video);
    return video;
  }

  // Comment methods
  async getCommentsByVideo(videoId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(comment => comment.videoId === videoId);
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const comment: Comment = {
      ...insertComment,
      id,
      videoId: insertComment.videoId || null,
      userId: insertComment.userId || null,
      likes: 0,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);
    return comment;
  }

  // Tip methods
  async getTipsByVideo(videoId: number): Promise<Tip[]> {
    return Array.from(this.tips.values()).filter(tip => tip.videoId === videoId);
  }

  async getTipsByUser(userId: number): Promise<Tip[]> {
    return Array.from(this.tips.values()).filter(tip => tip.toUserId === userId);
  }

  async createTip(insertTip: InsertTip): Promise<Tip> {
    const id = this.currentTipId++;
    const tip: Tip = {
      ...insertTip,
      id,
      videoId: insertTip.videoId || null,
      fromUserId: insertTip.fromUserId || null,
      toUserId: insertTip.toUserId || null,
      createdAt: new Date(),
    };
    this.tips.set(id, tip);
    return tip;
  }
}

// Use MemStorage for now - can be switched to DatabaseStorage when database is available
export const storage = new MemStorage();
