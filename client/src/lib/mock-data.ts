import type { Video, User } from "@shared/schema";

export const mockUsers: User[] = [
  {
    id: 1,
    username: "TechCrypto Academy",
    walletAddress: "0x1234...5678",
    suiBalance: 15420,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    isVerified: true,
    subscribers: 125000,
    createdAt: new Date(),
  },
  {
    id: 2,
    username: "CryptoEducate",
    walletAddress: "0x2345...6789",
    suiBalance: 8950,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    isVerified: true,
    subscribers: 89000,
    createdAt: new Date(),
  },
  {
    id: 3,
    username: "CreatorSuccess",
    walletAddress: "0x3456...7890",
    suiBalance: 12340,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    isVerified: true,
    subscribers: 234000,
    createdAt: new Date(),
  },
];

export const mockVideos: Video[] = [
  {
    id: 1,
    title: "Building the Future: Decentralized Video Streaming on Sui",
    description: "Learn how to build decentralized applications on the Sui blockchain with real-world examples.",
    thumbnailUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop",
    videoUrl: "https://example.com/video1.mp4",
    duration: 765, // 12:45
    views: 125000,
    likes: 3200,
    suiRewards: 250,
    isShort: false,
    creatorId: 1,
    walrusHash: "QmX1234...",
    isVerified: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "Sui Blockchain Explained: The Next Generation of Smart Contracts",
    description: "Complete guide to understanding Sui's unique approach to blockchain technology.",
    thumbnailUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
    videoUrl: "https://example.com/video2.mp4",
    duration: 512, // 8:32
    views: 89000,
    likes: 2100,
    suiRewards: 180,
    isShort: false,
    creatorId: 2,
    walrusHash: "QmY5678...",
    isVerified: true,
    createdAt: new Date(),
  },
  {
    id: 3,
    title: "How I Earned 10,000 SUI in My First Month as a Creator",
    description: "My journey from zero to earning thousands in SUI tokens through content creation.",
    thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    videoUrl: "https://example.com/video3.mp4",
    duration: 920, // 15:20
    views: 234000,
    likes: 5600,
    suiRewards: 420,
    isShort: false,
    creatorId: 3,
    walrusHash: "QmZ9012...",
    isVerified: true,
    createdAt: new Date(),
  },
];

export const mockShorts: Video[] = [
  {
    id: 4,
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
    walrusHash: "QmA3456...",
    isVerified: true,
    createdAt: new Date(),
  },
  {
    id: 5,
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
    walrusHash: "QmB7890...",
    isVerified: true,
    createdAt: new Date(),
  },
  {
    id: 6,
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
    walrusHash: "QmC2345...",
    isVerified: true,
    createdAt: new Date(),
  },
];
