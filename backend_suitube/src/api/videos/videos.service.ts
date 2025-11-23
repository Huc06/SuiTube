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
    // First try blockchain
    const blockchainVideo = await this.suigraphqlService.getVideoById(videoId);
    if (blockchainVideo) {
      return {
        ...blockchainVideo,
        videoUrl: blockchainVideo.cid ? this.walrusService.getFileUrl(blockchainVideo.cid) : null,
      };
    }

    // Fallback to Walrus videos (temporary for testing)
    const walrusVideo = this.walrusVideos.find(v => v.id === videoId || v.cid === videoId);
    if (walrusVideo) {
      return {
        id: walrusVideo.id,
        suiObjectId: walrusVideo.id,
        title: walrusVideo.title,
        description: walrusVideo.description,
        cid: walrusVideo.cid,
        walrusHash: walrusVideo.cid,
        owner: walrusVideo.owner,
        isShort: walrusVideo.isShort,
        category: undefined,
        tags: [],
        tips: walrusVideo.tips,
        views: walrusVideo.views,
        likes: walrusVideo.likes,
        createdAt: walrusVideo.createdAt,
        updatedAt: walrusVideo.createdAt,
        videoUrl: this.walrusService.getFileUrl(walrusVideo.cid),
      };
    }

    return null;
  }

  /**
   * Get videos by owner
   */
  async getVideosByOwner(ownerAddress: string, limit: number = 50) {
    const videos = await this.suigraphqlService.getVideosByOwner(ownerAddress, limit);
    
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
  }> = [];

  async getVideosFromWalrus(limit: number = 50, offset: number = 0) {
    // Return tracked videos from Walrus uploads
    const videos = this.walrusVideos
      .slice(offset, offset + limit)
      .map(video => ({
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
      }));
    
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
    };
    
    this.walrusVideos.unshift(video); // Add to beginning
    this.saveWalrusVideos(); // Persist to file
    return video;
  }

  /**
   * Load videos from file
   */
  private loadWalrusVideos() {
    try {
      if (fs.existsSync(this.walrusVideosFile)) {
        const data = fs.readFileSync(this.walrusVideosFile, 'utf-8');
        this.walrusVideos = JSON.parse(data);
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
}

