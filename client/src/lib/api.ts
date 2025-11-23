/**
 * SuiTube Backend API Client
 * Connects to NestJS backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Video {
  id: string;
  suiObjectId?: string;
  title: string;
  description?: string;
  cid: string;
  walrusHash: string;
  owner: string;
  isShort: boolean;
  category?: string;
  tags?: string[];
  tips: number;
  views: number;
  likes: number;
  createdAt: number;
  updatedAt: number;
  videoUrl: string | null;
}

export interface UploadVideoResponse {
  success: boolean;
  cid: string;
  url: string;
  filename: string;
  size: number;
  message: string;
}

export interface ViewTrackResponse {
  videoId: string;
  views: number;
}

class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log(`[API] Requesting: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    console.log(`[API] Response status: ${response.status}`, response);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      console.error(`[API] Error:`, error);
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[API] Response data:`, data);
    return data;
  }

  /**
   * Get all videos
   */
  async getVideos(params?: {
    limit?: number;
    offset?: number;
  }): Promise<Video[]> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const query = queryParams.toString();
    return this.request<Video[]>(`/videos${query ? `?${query}` : ''}`);
  }

  /**
   * Get video by ID
   */
  async getVideoById(id: string): Promise<Video | null> {
    return this.request<Video | null>(`/videos/${id}`);
  }

  /**
   * Get video streaming URL
   * This endpoint supports HTTP Range requests for seeking
   */
  getVideoStreamUrl(id: string): string {
    return `${this.baseURL}/videos/${id}/stream`;
  }

  /**
   * Get videos by owner address
   */
  async getVideosByOwner(
    ownerAddress: string,
    limit?: number,
  ): Promise<Video[]> {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit.toString());
    
    const query = queryParams.toString();
    return this.request<Video[]>(
      `/videos/owner/${ownerAddress}${query ? `?${query}` : ''}`,
    );
  }

  /**
   * Upload video file
   */
  async uploadVideo(
    file: File,
    metadata: {
      title: string;
      description?: string;
      owner?: string;
    },
    onProgress?: (progress: number) => void,
  ): Promise<UploadVideoResponse> {
    const formData = new FormData();
    formData.append('video', file);
    
    if (metadata.title) {
      formData.append('title', metadata.title);
    }
    if (metadata.description) {
      formData.append('description', metadata.description);
    }
    if (metadata.owner) {
      formData.append('owner', metadata.owner);
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded * 100) / e.total);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.message || 'Upload failed'));
          } catch {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error'));
      });

      xhr.open('POST', `${this.baseURL}/videos/upload`);
      xhr.send(formData);
    });
  }

  /**
   * Track video view
   */
  async trackView(
    videoId: string,
    viewerAddress?: string,
  ): Promise<ViewTrackResponse> {
    const queryParams = new URLSearchParams();
    if (viewerAddress) {
      queryParams.append('viewer', viewerAddress);
    }
    
    const query = queryParams.toString();
    return this.request<ViewTrackResponse>(
      `/videos/${videoId}/view${query ? `?${query}` : ''}`,
      {
        method: 'POST',
      },
    );
  }
}

export const apiClient = new APIClient();

