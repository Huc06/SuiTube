import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLClient } from 'graphql-request';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

/**
 * SuiGraphQL Service
 * Query data from Sui blockchain using GraphQL API
 */
@Injectable()
export class SuiGraphQLService {
  private graphqlClient: GraphQLClient;
  private suiClient: SuiClient;
  private packageId: string;
  private platformId: string;

  constructor(private configService: ConfigService) {
    const graphqlUrl = this.configService.get<string>('SUI_GRAPHQL_URL') || 
      'https://sui-testnet.mystenlabs.com/graphql';
    
    this.graphqlClient = new GraphQLClient(graphqlUrl);
    const network = (this.configService.get<string>('SUI_NETWORK') || 'testnet') as 'mainnet' | 'testnet' | 'devnet' | 'localnet';
    this.suiClient = new SuiClient({
      url: getFullnodeUrl(network),
    });
    
    this.packageId = this.configService.get<string>('SUI_PACKAGE_ID') || '';
    this.platformId = this.configService.get<string>('SUI_PLATFORM_ID') || '';
  }

  /**
   * Query all videos from blockchain
   */
  async getAllVideos(limit: number = 50, offset: number = 0) {
    const query = `
      query GetVideos($limit: Int, $offset: Int) {
        videos: objects(
          filter: { type: "${this.packageId}::VideoPlatform::Video" }
          first: $limit
          offset: $offset
        ) {
          nodes {
            id
            version
            digest
            owner {
              __typename
              ... on AddressOwner {
                owner
              }
            }
            data {
              type
              content {
                dataType
                type
                hasPublicTransfer
                fields {
                  id
                  title
                  description
                  cid
                  owner
                  is_short
                  category
                  tags
                  tips
                  views
                  likes
                  created_at
                  updated_at
                }
              }
            }
          }
        }
      }
    `;

    try {
      const data = await this.graphqlClient.request(query, { limit, offset });
      return this.transformVideos(data.videos?.nodes || []);
    } catch (error) {
      console.error('Error querying videos from SuiGraphQL:', error);
      // Return empty array instead of throwing to prevent 500 errors
      // In production, you might want to handle this differently
      return [];
    }
  }

  /**
   * Get video by ID
   */
  async getVideoById(videoId: string) {
    const query = `
      query GetVideo($id: ID!) {
        object(id: $id) {
          id
          version
          digest
          owner {
            __typename
            ... on AddressOwner {
              owner
            }
          }
          data {
            type
            content {
              dataType
              type
              fields {
                id
                title
                description
                cid
                owner
                is_short
                category
                tags
                tips
                views
                likes
                created_at
                updated_at
              }
            }
          }
        }
      }
    `;

    try {
      const data = await this.graphqlClient.request(query, { id: videoId });
      return this.transformVideo(data.object);
    } catch (error) {
      console.error('Error querying video from SuiGraphQL:', error);
      return null;
    }
  }

  /**
   * Get videos by owner address
   */
  async getVideosByOwner(ownerAddress: string, limit: number = 50) {
    const query = `
      query GetVideosByOwner($owner: String!, $limit: Int) {
        videos: objects(
          filter: {
            type: "${this.packageId}::VideoPlatform::Video"
            owner: $owner
          }
          first: $limit
        ) {
          nodes {
            id
            data {
              content {
                fields {
                  id
                  title
                  description
                  cid
                  owner
                  is_short
                  category
                  tags
                  tips
                  views
                  likes
                  created_at
                }
              }
            }
          }
        }
      }
    `;

    try {
      const data = await this.graphqlClient.request(query, { owner: ownerAddress, limit });
      return this.transformVideos(data.videos?.nodes || []);
    } catch (error) {
      console.error('Error querying videos by owner:', error);
      return [];
    }
  }

  /**
   * Get user profile from blockchain
   */
  async getUserProfile(walletAddress: string) {
    const query = `
      query GetUserProfile($address: String!) {
        user: objects(
          filter: {
            type: "${this.packageId}::VideoPlatform::UserProfile"
            owner: $address
          }
          first: 1
        ) {
          nodes {
            id
            data {
              content {
                fields {
                  wallet
                  username
                  is_verified
                  subscribers
                  subscribed_to
                  total_earnings
                  reputation_score
                }
              }
            }
          }
        }
      }
    `;

    try {
      const data = await this.graphqlClient.request(query, { address: walletAddress });
      const user = data.user?.nodes?.[0];
      if (!user) return null;
      
      return this.transformUserProfile(user);
    } catch (error) {
      console.error('Error querying user profile:', error);
      throw error;
    }
  }

  /**
   * Query events from blockchain
   */
  async getVideoEvents(videoId?: string, limit: number = 100) {
    const query = `
      query GetVideoEvents($videoId: String, $limit: Int) {
        events(
          filter: {
            package: "${this.packageId}"
            module: "VideoPlatform"
          }
          first: $limit
        ) {
          nodes {
            id
            timestamp
            type {
              repr
            }
            parsedJson
          }
        }
      }
    `;

    try {
      const data = await this.graphqlClient.request(query, { videoId, limit });
      return data.events?.nodes || [];
    } catch (error) {
      console.error('Error querying events:', error);
      throw error;
    }
  }

  /**
   * Get platform stats
   */
  async getPlatformStats() {
    try {
      const platformObject = await this.suiClient.getObject({
        id: this.platformId,
        options: { showContent: true },
      });

      if (platformObject.data?.content && 'fields' in platformObject.data.content) {
        const fields = platformObject.data.content.fields as any;
        return {
          videoCount: fields.video_count || 0,
          platformFee: fields.platform_fee || 0,
        };
      }

      return { videoCount: 0, platformFee: 0 };
    } catch (error) {
      console.error('Error getting platform stats:', error);
      return { videoCount: 0, platformFee: 0 };
    }
  }

  /**
   * Transform GraphQL video data to app format
   */
  private transformVideos(nodes: any[]) {
    return nodes.map(node => this.transformVideo(node));
  }

  private transformVideo(node: any) {
    if (!node?.data?.content?.fields) return null;

    const fields = node.data.content.fields;
    return {
      id: fields.id || node.id,
      suiObjectId: node.id,
      title: fields.title || '',
      description: fields.description || '',
      cid: fields.cid || '',
      walrusHash: fields.cid || '',
      owner: fields.owner || node.owner?.owner || '',
      isShort: fields.is_short || false,
      category: fields.category || '',
      tags: fields.tags || [],
      tips: parseInt(fields.tips || '0'),
      views: parseInt(fields.views || '0'),
      likes: parseInt(fields.likes || '0'),
      createdAt: parseInt(fields.created_at || '0'),
      updatedAt: parseInt(fields.updated_at || '0'),
    };
  }

  private transformUserProfile(node: any) {
    if (!node?.data?.content?.fields) return null;

    const fields = node.data.content.fields;
    return {
      walletAddress: fields.wallet || '',
      username: fields.username || '',
      isVerified: fields.is_verified || false,
      subscribers: fields.subscribers || [],
      subscribedTo: fields.subscribed_to || [],
      totalEarnings: parseInt(fields.total_earnings || '0'),
      reputationScore: parseInt(fields.reputation_score || '0'),
    };
  }
}

