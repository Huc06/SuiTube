import { Injectable, OnModuleInit } from '@nestjs/common';
import { SuiGraphQLService } from '../../services/blockchain/suigraphql.service';
import { WalrusSealService } from '../../services/storage/walrus-seal.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VideosService implements OnModuleInit {
  private readonly walrusVideosFile = path.join(process.cwd(), 'walrus-videos.json');

  constructor(
    private suigraphqlService: SuiGraphQLService,
    private walrusService: WalrusSealService,
  ) {}

  onModuleInit() {
    // Load videos from file on startup
    console.log('VideosService: Loading videos from file...');
    this.loadWalrusVideos();
    console.log(`VideosService: Loaded ${this.walrusVideos.length} videos`);
  }

  /**
   * Get all videos from blockchain
   * Falls back to Walrus videos if blockchain is empty (for testing)
   */
  async getAllVideos(limit: number = 50, offset: number = 0) {
    const videos = await this.suigraphqlService.getAllVideos(limit, offset);
    
    // If no videos on blockchain, fallback to Walrus videos (temporary for testing)
    if (videos.length === 0) {
      console.log(`No videos on blockchain (${videos.length}), checking Walrus videos (${this.walrusVideos.length})...`);
      if (this.walrusVideos.length > 0) {
        console.log('Falling back to Walrus videos');
        return this.getVideosFromWalrus(limit, offset);
      }
      console.log('No videos in Walrus either');
    }
    
    // Enrich with Walrus URLs
    return videos
      .filter(video => video !== null)
      .map(video => ({
        ...video,
        videoUrl: video?.cid ? this.walrusService.getFileUrl(video.cid) : null,
      }));
  }

  /**
   * Get video by ID
   */
  async getVideoById(videoId: string) {
    // Prefer Walrus-tracked videos to avoid unnecessary blockchain lookups
    const walrusVideo = this.findWalrusVideo(videoId);
    if (walrusVideo) {
      return this.mapWalrusVideo(walrusVideo);
    }

    // Fallback to blockchain
    try {
      const blockchainVideo = await this.suigraphqlService.getVideoById(videoId);
      if (blockchainVideo) {
        return {
          ...blockchainVideo,
          videoUrl: blockchainVideo.cid ? this.walrusService.getFileUrl(blockchainVideo.cid) : null,
        };
      }
    } catch (error) {
      console.warn(`VideosService: Unable to fetch video ${videoId} from SuiGraphQL, falling back to Walrus cache`, error?.message || error);
    }

    return null;
  }

  /**
   * Get videos by owner
   */
  async getVideosByOwner(ownerAddress: string, limit: number = 50) {
    let videos: any[] = [];
    try {
      videos = await this.suigraphqlService.getVideosByOwner(ownerAddress, limit);
    } catch (error) {
      console.warn(`VideosService: Unable to fetch videos for owner ${ownerAddress} from SuiGraphQL`, error?.message || error);
    }
    
    return videos
      .filter(video => video !== null)
      .map(video => ({
        ...video,
        videoUrl: video?.cid ? this.walrusService.getFileUrl(video.cid) : null,
      }));
  }

  /**
   * Upload video to Walrus
   */
  async uploadVideoToWalrus(
    filePath: string,
    metadata?: {
      title?: string;
      description?: string;
      owner?: string;
      epochs?: number;
      permanent?: boolean;
    },
  ) {
    return this.walrusService.uploadVideo(filePath, metadata);
  }

  /**
   * Upload thumbnail image to Walrus
   */
  async uploadThumbnailToWalrus(
    filePath: string,
    options?: {
      epochs?: number;
      permanent?: boolean;
    },
  ) {
    return this.walrusService.uploadThumbnail(filePath, 'thumbnail', options);
  }

  /**
   * Upload video (this would typically be called from frontend)
   * Video processing can be done client-side or with external services
   */
  async processUploadedVideo(params: {
    videoCid: string;
    videoUrl: string;
    owner: string;
  }) {
    // For now, just return the video info
    // Video processing (transcoding, thumbnails) can be handled:
    // 1. Client-side with ffmpeg.js
    // 2. External service (AWS MediaConvert, Cloudflare Stream, etc.)
    // 3. Add Nautilus later when needed
    
    return {
      cid: params.videoCid,
      url: params.videoUrl,
      owner: params.owner,
      status: 'ready',
      message: 'Video uploaded. Processing can be added later if needed.',
    };
  }

  /**
   * Increment view count (track on-chain)
   * This would trigger a blockchain transaction
   */
  async trackView(videoId: string, viewerAddress?: string) {
    // In a real implementation, this would call the smart contract
    // For now, we just return the current view count
    const video = await this.getVideoById(videoId);
    return {
      videoId,
      views: video?.views || 0,
    };
  }

  /**
   * Stream video from Walrus with HTTP Range support
   * This allows seeking and efficient streaming
   */
  async streamVideo(videoId: string, range?: string) {
    const video = await this.getVideoById(videoId);
    if (!video || !video.cid) {
      return null;
    }

    const walrusUrl = this.walrusService.getFileUrl(video.cid);
    return {
      url: walrusUrl,
      cid: video.cid,
      contentType: 'video/mp4', // Default, can be detected from file
    };
  }

  /**
   * Get videos directly from Walrus (temporary solution)
   * This bypasses blockchain query for testing purposes
   * TODO: Remove this once blockchain integration is complete
   * 
   * Note: Walrus doesn't have a list endpoint, so we track uploads in memory
   * In production, this should be replaced with blockchain query
   */
  private walrusVideos: Array<{
    id: string;
    cid: string;
    title: string;
    description: string;
    owner: string;
    createdAt: number;
    views: number;
    likes: number;
    tips: number;
    isShort: boolean;
    thumbnailCid?: string | null;
    thumbnailUrl?: string | null;
  }> = [];

  async getVideosFromWalrus(limit: number = 50, offset: number = 0) {
    // Return tracked videos from Walrus uploads
    const videos = this.walrusVideos
      .slice(offset, offset + limit)
      .map(video => this.mapWalrusVideo(video));
    
    return videos;
  }

  /**
   * Register uploaded video (called after Walrus upload)
   * This is a temporary solution until blockchain integration is complete
   */
  async registerWalrusVideo(params: {
    cid: string;
    title: string;
    description: string;
    owner: string;
    isShort?: boolean;
    thumbnailCid?: string | null;
    thumbnailUrl?: string | null;
  }) {
    const video = {
      id: params.cid, // Use CID as ID temporarily
      cid: params.cid,
      title: params.title,
      description: params.description,
      owner: params.owner,
      createdAt: Math.floor(Date.now() / 1000),
      views: 0,
      likes: 0,
      tips: 0,
      isShort: params.isShort || false,
      thumbnailCid: params.thumbnailCid || null,
      thumbnailUrl: params.thumbnailUrl || (params.thumbnailCid ? this.walrusService.getFileUrl(params.thumbnailCid) : null),
    };
    
    this.walrusVideos.unshift(video); // Add to beginning
    this.saveWalrusVideos(); // Persist to file
    return this.mapWalrusVideo(video);
  }

  /**
   * Remove Walrus video (testing utility)
   */
  async removeWalrusVideo(videoId: string) {
    const index = this.walrusVideos.findIndex(v => v.id === videoId || v.cid === videoId);
    if (index === -1) {
      return null;
    }

    const [removed] = this.walrusVideos.splice(index, 1);
    this.saveWalrusVideos();
    return this.mapWalrusVideo(removed);
  }

  /**
   * Load videos from file
   */
  private loadWalrusVideos() {
    try {
      if (fs.existsSync(this.walrusVideosFile)) {
        const data = fs.readFileSync(this.walrusVideosFile, 'utf-8');
        const parsed = JSON.parse(data);
        this.walrusVideos = Array.isArray(parsed)
          ? parsed.map(video => ({
              ...video,
              thumbnailCid: video.thumbnailCid || null,
              thumbnailUrl: video.thumbnailUrl || (video.thumbnailCid ? this.walrusService.getFileUrl(video.thumbnailCid) : null),
            }))
          : [];
        console.log(`Loaded ${this.walrusVideos.length} videos from file`);
      }
    } catch (error) {
      console.error('Error loading walrus videos:', error);
      this.walrusVideos = [];
    }
  }

  /**
   * Save videos to file
   */
  private saveWalrusVideos() {
    try {
      fs.writeFileSync(this.walrusVideosFile, JSON.stringify(this.walrusVideos, null, 2));
    } catch (error) {
      console.error('Error saving walrus videos:', error);
    }
  }

  /**
   * Helper: find Walrus video by ID/CID
   */
  private findWalrusVideo(videoId: string) {
    return this.walrusVideos.find(v => v.id === videoId || v.cid === videoId);
  }

  /**
   * Helper: map Walrus video to API response shape
   */
  private mapWalrusVideo(video: {
    id: string;
    cid: string;
    title: string;
    description: string;
    owner: string;
    createdAt: number;
    views: number;
    likes: number;
    tips: number;
    isShort: boolean;
    thumbnailCid?: string | null;
    thumbnailUrl?: string | null;
  }) {
    return {
      id: video.id,
      suiObjectId: video.id,
      title: video.title,
      description: video.description,
      cid: video.cid,
      walrusHash: video.cid,
      owner: video.owner,
      isShort: video.isShort,
      category: undefined,
      tags: [],
      tips: video.tips,
      views: video.views,
      likes: video.likes,
      createdAt: video.createdAt,
      updatedAt: video.createdAt,
      videoUrl: this.walrusService.getFileUrl(video.cid),
      thumbnailCid: video.thumbnailCid || null,
      thumbnailUrl: video.thumbnailUrl || null,
    };
  }
}

