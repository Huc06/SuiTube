import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  BadRequestException,
  Res,
  Headers,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiHeader } from '@nestjs/swagger';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { VideosService } from './videos.service';

@ApiTags('videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  @ApiOperation({ summary: 'Get all videos' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'walrusOnly', required: false, type: Boolean, description: 'Get videos from Walrus only (bypass blockchain)' })
  @ApiResponse({ status: 200, description: 'List of videos' })
  async getAllVideos(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
    @Query('walrusOnly') walrusOnly?: string,
  ) {
    // Validate limit is positive
    if (limit !== undefined && limit <= 0) {
      throw new BadRequestException('Limit must be a positive number');
    }
    
    // Validate offset is non-negative
    if (offset !== undefined && offset < 0) {
      throw new BadRequestException('Offset must be a non-negative number');
    }
    
    // Validate and cap limit to max 100
    const validLimit = limit && limit > 0 ? Math.min(limit, 100) : 50;
    const validOffset = offset && offset >= 0 ? offset : 0;
    
    // If walrusOnly is true, return videos from Walrus (temporary for testing)
    if (walrusOnly === 'true') {
      return this.videosService.getVideosFromWalrus(validLimit, validOffset);
    }
    
    return this.videosService.getAllVideos(validLimit, validOffset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get video by ID' })
  @ApiResponse({ status: 200, description: 'Video details' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async getVideoById(@Param('id') id: string) {
    return this.videosService.getVideoById(id);
  }

  @Get('owner/:address')
  @ApiOperation({ summary: 'Get videos by owner address' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of videos by owner' })
  async getVideosByOwner(
    @Param('address') address: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    // Validate limit is positive
    if (limit !== undefined && limit <= 0) {
      throw new BadRequestException('Limit must be a positive number');
    }
    
    const validLimit = limit && limit > 0 ? Math.min(limit, 100) : 50;
    return this.videosService.getVideosByOwner(address, validLimit);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('video'))
  @ApiOperation({ summary: 'Upload video file' })
  @ApiResponse({ status: 201, description: 'Video uploaded successfully' })
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Query('title') title?: string,
    @Query('description') description?: string,
    @Query('owner') owner?: string,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Save file temporarily
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const tempPath = path.join(uploadDir, file.originalname);
    fs.writeFileSync(tempPath, file.buffer);

    try {
      // Upload to Walrus using HTTP API
      const result = await this.videosService.uploadVideoToWalrus(
        tempPath,
        {
          title: title || file.originalname,
          description: description || '',
          owner: owner || '0x0000000000000000000000000000000000000000',
          epochs: 1, // Default 1 epoch, can be increased for longer storage
          permanent: false, // Default to deletable
        },
      );

      // Clean up temp file
      fs.unlinkSync(tempPath);

      // Register video in temporary storage (until blockchain integration)
      await this.videosService.registerWalrusVideo({
        cid: result.cid,
        title: title || file.originalname,
        description: description || '',
        owner: owner || '0x0000000000000000000000000000000000000000',
        isShort: false,
      });

      return {
        success: true,
        cid: result.cid,
        url: result.url,
        filename: file.originalname,
        size: file.size,
        message: 'Video uploaded successfully to Walrus',
        note: 'Video is registered temporarily. Call smart contract add_video to add to blockchain.',
      };
    } catch (error) {
      // Clean up temp file on error
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
      throw error;
    }
  }

  @Get(':id/stream')
  @ApiOperation({ summary: 'Stream video from Walrus with Range support' })
  @ApiHeader({ name: 'Range', required: false, description: 'HTTP Range header for seeking' })
  @ApiResponse({ status: 200, description: 'Video stream' })
  @ApiResponse({ status: 206, description: 'Partial content (Range request)' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async streamVideo(
    @Param('id') id: string,
    @Headers('range') range: string | undefined,
    @Res() res: Response,
  ) {
    const videoInfo = await this.videosService.streamVideo(id, range);
    
    if (!videoInfo) {
      throw new NotFoundException('Video not found');
    }

    try {
      // Prepare headers for Walrus request
      const headers: Record<string, string> = {};
      if (range) {
        headers['Range'] = range;
      }

      // Stream video from Walrus
      const response = await axios.get(videoInfo.url, {
        headers,
        responseType: 'stream',
        timeout: 300000, // 5 minutes
      });

      // Forward status code
      res.status(response.status);

      // Forward headers
      // Walrus returns application/octet-stream, but we need video/mp4 for browser
      // Try to detect from URL or default to video/mp4
      let contentType = response.headers['content-type'];
      if (!contentType || contentType === 'application/octet-stream') {
        // Try to detect from file extension or default to video/mp4
        contentType = 'video/mp4'; // Default to mp4, can be enhanced later
      }
      res.setHeader('Content-Type', contentType);
      res.setHeader('Accept-Ranges', 'bytes');
      
      if (response.headers['content-length']) {
        res.setHeader('Content-Length', response.headers['content-length']);
      }
      
      if (response.headers['content-range']) {
        res.setHeader('Content-Range', response.headers['content-range']);
      }

      // Enable CORS for video streaming
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Range');

      // Stream the video data
      response.data.pipe(res);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException('Video file not found on Walrus');
      }
      throw error;
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a video that was already uploaded to Walrus' })
  @ApiQuery({ name: 'cid', required: true, description: 'Walrus Blob ID (CID)' })
  @ApiQuery({ name: 'title', required: true })
  @ApiQuery({ name: 'description', required: false })
  @ApiQuery({ name: 'owner', required: false })
  @ApiQuery({ name: 'isShort', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Video registered' })
  async registerVideo(
    @Query('cid') cid: string,
    @Query('title') title: string,
    @Query('description') description?: string,
    @Query('owner') owner?: string,
    @Query('isShort') isShort?: string,
  ) {
    const video = await this.videosService.registerWalrusVideo({
      cid,
      title,
      description: description || '',
      owner: owner || '0x0000000000000000000000000000000000000000',
      isShort: isShort === 'true',
    });
    
    return {
      success: true,
      video,
      message: 'Video registered successfully',
    };
  }

  @Post(':id/view')
  @ApiOperation({ summary: 'Track video view' })
  @ApiResponse({ status: 200, description: 'View tracked' })
  async trackView(
    @Param('id') id: string,
    @Query('viewer') viewerAddress?: string,
  ) {
    return this.videosService.trackView(id, viewerAddress);
  }

}

