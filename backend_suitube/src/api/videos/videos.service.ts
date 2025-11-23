import { Injectable } from '@nestjs/common';
import { SuiGraphQLService } from '../../services/blockchain/suigraphql.service';
import { WalrusSealService } from '../../services/storage/walrus-seal.service';

@Injectable()
export class VideosService {
  constructor(
    private suigraphqlService: SuiGraphQLService,
    private walrusService: WalrusSealService,
  ) {}

  /**
   * Get all videos from blockchain
   */
  async getAllVideos(limit: number = 50, offset: number = 0) {
    const videos = await this.suigraphqlService.getAllVideos(limit, offset);
    
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
    const video = await this.suigraphqlService.getVideoById(videoId);
    if (!video) return null;

    return {
      ...video,
      videoUrl: video.cid ? this.walrusService.getFileUrl(video.cid) : null,
    };
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
}

