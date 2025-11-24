/**
 * Transform API responses to frontend format
 */
import type { Video as APIVideo } from './api';

export interface Creator {
  id: number;
  username: string;
  walletAddress?: string;
}

export interface TransformedVideo {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  views: number;
  likes: number;
  suiRewards: number;
  isShort: boolean;
  creatorId: number;
  walrusHash: string;
  isVerified: boolean;
  createdAt: Date;
}

/**
 * Transform API video to frontend Video format
 */
export function transformVideo(apiVideo: APIVideo, creator?: Creator): TransformedVideo {
  // Try to parse ID as number, fallback to hash-based ID
  const numericId = parseInt(apiVideo.id);
  const videoId = !isNaN(numericId) ? numericId : Math.abs(apiVideo.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  
  return {
    id: videoId,
    title: apiVideo.title,
    description: apiVideo.description || '',
    thumbnailUrl: apiVideo.thumbnailUrl || apiVideo.videoUrl || '',
    videoUrl: apiVideo.videoUrl || '',
    duration: 0, // Will be set from video metadata if available
    views: apiVideo.views || 0,
    likes: apiVideo.likes || 0,
    suiRewards: apiVideo.tips || 0,
    isShort: apiVideo.isShort || false,
    creatorId: creator?.id || 0,
    walrusHash: apiVideo.cid || apiVideo.walrusHash || '',
    isVerified: false,
    createdAt: new Date(apiVideo.createdAt * 1000),
  };
}

/**
 * Transform API videos array to frontend format
 */
export function transformVideos(apiVideos: APIVideo[], creators: Creator[] = []): TransformedVideo[] {
  return apiVideos.map((apiVideo, index) => {
    // Try to find creator by owner address, or use first creator as fallback
    const creator = creators.find(c => c.walletAddress === apiVideo.owner) || creators[0];
    
    return transformVideo(apiVideo, creator);
  });
}

