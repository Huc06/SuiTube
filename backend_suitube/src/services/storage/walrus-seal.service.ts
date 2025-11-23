import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';

/**
 * Walrus + Seal Service
 * Decentralized storage with access control
 */
@Injectable()
export class WalrusSealService {
  private walrusApiUrl: string;
  private walrusApiKey: string;
  private httpClient: AxiosInstance;

  private publisherUrl: string;
  private aggregatorUrl: string;

  constructor(private configService: ConfigService) {
    // Walrus HTTP API - no API key needed for public services
    this.publisherUrl = 
      this.configService.get<string>('WALRUS_PUBLISHER_URL') || 
      'https://publisher.walrus-testnet.walrus.space';
    this.aggregatorUrl = 
      this.configService.get<string>('WALRUS_AGGREGATOR_URL') || 
      'https://aggregator.walrus-testnet.walrus.space';

    this.httpClient = axios.create({
      timeout: 300000, // 5 minutes for large video uploads
    });
  }

  /**
   * Upload video file to Walrus using HTTP API
   * Returns the blob ID and object ID
   */
  async uploadVideo(
    filePath: string,
    metadata?: {
      title?: string;
      description?: string;
      owner?: string;
      epochs?: number; // Storage epochs (default: 1)
      permanent?: boolean; // Permanent blob (default: false, deletable)
    },
  ): Promise<{ cid: string; url: string; blobId: string; objectId?: string }> {
    try {
      const fileStream = fs.createReadStream(filePath);
      const fileStats = fs.statSync(filePath);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (metadata?.epochs) {
        params.append('epochs', metadata.epochs.toString());
      }
      if (metadata?.permanent) {
        params.append('permanent', 'true');
      } else {
        params.append('deletable', 'true'); // Default to deletable
      }

      const url = `${this.publisherUrl}/v1/blobs${params.toString() ? '?' + params.toString() : ''}`;

      const response = await this.httpClient.put(url, fileStream, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': fileStats.size.toString(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      // Handle response format from Walrus API
      let blobId: string;
      let objectId: string | undefined;

      if (response.data.newlyCreated) {
        blobId = response.data.newlyCreated.blobObject.blobId;
        objectId = response.data.newlyCreated.blobObject.id;
      } else if (response.data.alreadyCertified) {
        blobId = response.data.alreadyCertified.blobId;
      } else {
        throw new Error('Unexpected response format from Walrus');
      }

      return {
        cid: blobId, // Use blobId as CID
        blobId: blobId,
        objectId: objectId,
        url: `${this.aggregatorUrl}/v1/blobs/${blobId}`,
      };
    } catch (error) {
      console.error('Error uploading video to Walrus:', error);
      throw new Error(`Failed to upload video: ${error.message}`);
    }
  }

  /**
   * Upload file buffer to Walrus using HTTP API
   */
  async uploadBuffer(
    buffer: Buffer,
    filename: string,
    options?: {
      epochs?: number;
      permanent?: boolean;
    },
  ): Promise<{ cid: string; url: string; blobId: string; objectId?: string }> {
    try {
      const params = new URLSearchParams();
      if (options?.epochs) {
        params.append('epochs', options.epochs.toString());
      }
      if (options?.permanent) {
        params.append('permanent', 'true');
      } else {
        params.append('deletable', 'true');
      }

      const url = `${this.publisherUrl}/v1/blobs${params.toString() ? '?' + params.toString() : ''}`;

      const response = await this.httpClient.put(url, buffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': buffer.length.toString(),
        },
      });

      let blobId: string;
      let objectId: string | undefined;

      if (response.data.newlyCreated) {
        blobId = response.data.newlyCreated.blobObject.blobId;
        objectId = response.data.newlyCreated.blobObject.id;
      } else if (response.data.alreadyCertified) {
        blobId = response.data.alreadyCertified.blobId;
      } else {
        throw new Error('Unexpected response format from Walrus');
      }

      return {
        cid: blobId,
        blobId: blobId,
        objectId: objectId,
        url: `${this.aggregatorUrl}/v1/blobs/${blobId}`,
      };
    } catch (error) {
      console.error('Error uploading buffer to Walrus:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Upload thumbnail image
   */
  async uploadThumbnail(
    imagePath: string,
    videoId: string,
    options?: {
      epochs?: number;
      permanent?: boolean;
    },
  ): Promise<{ cid: string; url: string; blobId: string; objectId?: string }> {
    try {
      const fileStream = fs.createReadStream(imagePath);
      const fileStats = fs.statSync(imagePath);
      
      const params = new URLSearchParams();
      if (options?.epochs) {
        params.append('epochs', options.epochs.toString());
      }
      if (options?.permanent) {
        params.append('permanent', 'true');
      } else {
        params.append('deletable', 'true');
      }

      const url = `${this.publisherUrl}/v1/blobs${params.toString() ? '?' + params.toString() : ''}`;

      const response = await this.httpClient.put(url, fileStream, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Length': fileStats.size.toString(),
        },
      });

      let blobId: string;
      let objectId: string | undefined;

      if (response.data.newlyCreated) {
        blobId = response.data.newlyCreated.blobObject.blobId;
        objectId = response.data.newlyCreated.blobObject.id;
      } else if (response.data.alreadyCertified) {
        blobId = response.data.alreadyCertified.blobId;
      } else {
        throw new Error('Unexpected response format from Walrus');
      }

      return {
        cid: blobId,
        blobId: blobId,
        objectId: objectId,
        url: `${this.aggregatorUrl}/v1/blobs/${blobId}`,
      };
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      throw new Error(`Failed to upload thumbnail: ${error.message}`);
    }
  }

  /**
   * Get file from Walrus by blob ID
   */
  async getFile(blobId: string): Promise<Buffer> {
    try {
      const response = await this.httpClient.get(`${this.aggregatorUrl}/v1/blobs/${blobId}`, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error getting file from Walrus:', error);
      throw new Error(`Failed to get file: ${error.message}`);
    }
  }

  /**
   * Get file by object ID
   */
  async getFileByObjectId(objectId: string): Promise<Buffer> {
    try {
      const response = await this.httpClient.get(
        `${this.aggregatorUrl}/v1/blobs/by-object-id/${objectId}`,
        {
          responseType: 'arraybuffer',
        },
      );
      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error getting file by object ID from Walrus:', error);
      throw new Error(`Failed to get file: ${error.message}`);
    }
  }

  /**
   * Get file URL from blob ID
   */
  getFileUrl(blobId: string): string {
    return `${this.aggregatorUrl}/v1/blobs/${blobId}`;
  }

  /**
   * Create access policy with Seal
   * This allows fine-grained access control for encrypted content
   */
  async createAccessPolicy(params: {
    cid: string;
    policy: {
      allowedAddresses?: string[];
      expirationTime?: number;
      conditions?: any[];
    };
  }): Promise<{ policyId: string }> {
    try {
      const response = await this.httpClient.post('/api/v1/seal/policy', {
        cid: params.cid,
        policy: params.policy,
      });

      return {
        policyId: response.data.policyId,
      };
    } catch (error) {
      console.error('Error creating access policy:', error);
      throw new Error(`Failed to create access policy: ${error.message}`);
    }
  }

  /**
   * Check if address has access to content
   */
  async checkAccess(cid: string, address: string): Promise<boolean> {
    try {
      const response = await this.httpClient.get(`/api/v1/seal/access/${cid}`, {
        params: { address },
      });
      return response.data.hasAccess || false;
    } catch (error) {
      console.error('Error checking access:', error);
      return false;
    }
  }

  /**
   * Note: Walrus HTTP API doesn't support deletion through HTTP
   * Deletion must be done through Sui blockchain transactions
   */
  async deleteFile(blobId: string, ownerAddress: string): Promise<boolean> {
    // Walrus deletion requires on-chain transaction
    // This is a placeholder - actual deletion should be done via Sui SDK
    console.warn('File deletion must be done through Sui blockchain transaction');
    return false;
  }

  /**
   * Get file metadata/info by blob ID
   * Note: Walrus HTTP API doesn't provide metadata endpoint
   * Metadata should be stored on-chain or in a separate service
   */
  async getFileMetadata(blobId: string) {
    // Walrus HTTP API doesn't provide metadata endpoint
    // Metadata should be retrieved from Sui blockchain or separate service
    console.warn('Metadata retrieval not available through Walrus HTTP API');
    return null;
  }
}

