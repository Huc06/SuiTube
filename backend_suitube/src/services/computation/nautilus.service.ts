import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

/**
 * Nautilus Service
 * Off-chain computation with TEE (Trusted Execution Environment)
 * Used for video processing, transcoding, and other heavy computations
 */
@Injectable()
export class NautilusService {
  private nautilusApiUrl: string;
  private httpClient: AxiosInstance;
  private enabled: boolean;

  constructor(private configService: ConfigService) {
    this.nautilusApiUrl = 
      this.configService.get<string>('NAUTILUS_API_URL') || 
      'https://nautilus.sui.io';
    this.enabled = this.configService.get<boolean>('NAUTILUS_ENABLED') ?? true;

    this.httpClient = axios.create({
      baseURL: this.nautilusApiUrl,
      timeout: 600000, // 10 minutes for video processing
    });
  }

  /**
   * Process video (transcoding, thumbnail generation)
   * This runs in a TEE for security and verifiability
   */
  async processVideo(params: {
    videoCid: string;
    videoUrl: string;
    options?: {
      generateThumbnails?: boolean;
      thumbnailCount?: number;
      transcodeQualities?: string[]; // ['1080p', '720p', '480p', '360p']
      generateHLS?: boolean;
    };
  }): Promise<{
    jobId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    results?: {
      transcodedVideos?: Array<{ quality: string; cid: string; url: string }>;
      thumbnails?: Array<{ timestamp: number; cid: string; url: string }>;
      hlsManifest?: { cid: string; url: string };
      metadata?: {
        duration: number;
        resolution: string;
        codec: string;
        bitrate: number;
      };
    };
  }> {
    if (!this.enabled) {
      throw new Error('Nautilus service is not enabled');
    }

    try {
      const response = await this.httpClient.post('/api/v1/compute/video-process', {
        videoCid: params.videoCid,
        videoUrl: params.videoUrl,
        options: {
          generateThumbnails: true,
          thumbnailCount: 3,
          transcodeQualities: ['1080p', '720p', '480p', '360p'],
          generateHLS: true,
          ...params.options,
        },
      });

      return {
        jobId: response.data.jobId,
        status: response.data.status,
        results: response.data.results,
      };
    } catch (error) {
      console.error('Error processing video with Nautilus:', error);
      throw new Error(`Failed to process video: ${error.message}`);
    }
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress?: number;
    results?: any;
    error?: string;
  }> {
    try {
      const response = await this.httpClient.get(`/api/v1/compute/jobs/${jobId}`);
      return {
        status: response.data.status,
        progress: response.data.progress,
        results: response.data.results,
        error: response.data.error,
      };
    } catch (error) {
      console.error('Error getting job status:', error);
      throw new Error(`Failed to get job status: ${error.message}`);
    }
  }

  /**
   * Generate video thumbnails
   */
  async generateThumbnails(params: {
    videoCid: string;
    videoUrl: string;
    count?: number;
    timestamps?: number[]; // in seconds
  }): Promise<Array<{ timestamp: number; cid: string; url: string }>> {
    if (!this.enabled) {
      throw new Error('Nautilus service is not enabled');
    }

    try {
      const response = await this.httpClient.post('/api/v1/compute/thumbnails', {
        videoCid: params.videoCid,
        videoUrl: params.videoUrl,
        count: params.count || 3,
        timestamps: params.timestamps,
      });

      return response.data.thumbnails || [];
    } catch (error) {
      console.error('Error generating thumbnails:', error);
      throw new Error(`Failed to generate thumbnails: ${error.message}`);
    }
  }

  /**
   * Transcode video to multiple qualities
   */
  async transcodeVideo(params: {
    videoCid: string;
    videoUrl: string;
    qualities: string[];
  }): Promise<Array<{ quality: string; cid: string; url: string }>> {
    if (!this.enabled) {
      throw new Error('Nautilus service is not enabled');
    }

    try {
      const response = await this.httpClient.post('/api/v1/compute/transcode', {
        videoCid: params.videoCid,
        videoUrl: params.videoUrl,
        qualities: params.qualities,
      });

      return response.data.transcodedVideos || [];
    } catch (error) {
      console.error('Error transcoding video:', error);
      throw new Error(`Failed to transcode video: ${error.message}`);
    }
  }

  /**
   * Extract video metadata
   */
  async extractMetadata(params: {
    videoCid: string;
    videoUrl: string;
  }): Promise<{
    duration: number;
    resolution: string;
    codec: string;
    bitrate: number;
    fps: number;
    size: number;
  }> {
    if (!this.enabled) {
      throw new Error('Nautilus service is not enabled');
    }

    try {
      const response = await this.httpClient.post('/api/v1/compute/metadata', {
        videoCid: params.videoCid,
        videoUrl: params.videoUrl,
      });

      return response.data.metadata;
    } catch (error) {
      console.error('Error extracting metadata:', error);
      throw new Error(`Failed to extract metadata: ${error.message}`);
    }
  }

  /**
   * Generate HLS manifest for adaptive streaming
   */
  async generateHLS(params: {
    videoCid: string;
    transcodedVideos: Array<{ quality: string; cid: string; url: string }>;
  }): Promise<{ manifestCid: string; manifestUrl: string }> {
    if (!this.enabled) {
      throw new Error('Nautilus service is not enabled');
    }

    try {
      const response = await this.httpClient.post('/api/v1/compute/hls', {
        videoCid: params.videoCid,
        transcodedVideos: params.transcodedVideos,
      });

      return {
        manifestCid: response.data.manifestCid,
        manifestUrl: response.data.manifestUrl,
      };
    } catch (error) {
      console.error('Error generating HLS:', error);
      throw new Error(`Failed to generate HLS: ${error.message}`);
    }
  }

  /**
   * Verify computation result
   * This verifies that the computation was done correctly in TEE
   */
  async verifyComputation(jobId: string, expectedHash: string): Promise<boolean> {
    try {
      const response = await this.httpClient.post('/api/v1/compute/verify', {
        jobId,
        expectedHash,
      });
      return response.data.verified || false;
    } catch (error) {
      console.error('Error verifying computation:', error);
      return false;
    }
  }
}

