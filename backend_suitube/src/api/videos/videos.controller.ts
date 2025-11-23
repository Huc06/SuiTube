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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { VideosService } from './videos.service';

@ApiTags('videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  @ApiOperation({ summary: 'Get all videos' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of videos' })
  async getAllVideos(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
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

      return {
        success: true,
        cid: result.cid,
        url: result.url,
        filename: file.originalname,
        size: file.size,
        message: 'Video uploaded successfully to Walrus',
      };
    } catch (error) {
      // Clean up temp file on error
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
      throw error;
    }
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

