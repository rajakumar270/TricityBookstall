import { Controller, Get, Post, Put, Delete, Body, Param, Query, BadRequestException } from '@nestjs/common';
import { MediaService, MediaAsset } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  async getAllAssets(): Promise<MediaAsset[]> {
    return this.mediaService.getAllAssets();
  }

  @Get('usage/:filename')
  async checkUsage(@Param('filename') filename: string): Promise<{ filename: string; usedIn: string[]; usageCount: number }> {
    const usedIn = await this.mediaService.checkUsage(filename);
    return { filename, usedIn, usageCount: usedIn.length };
  }

  @Post('upload')
  async uploadAsset(@Body() body: { filename: string; data: string }) {
    if (!body.filename || !body.data) {
      throw new BadRequestException('Filename and base64 image data are required.');
    }
    return this.mediaService.uploadAsset(body.filename, body.data);
  }

  @Put('rename')
  async renameAsset(@Body() body: { oldName: string; newName: string; updateReferences?: boolean }) {
    if (!body.oldName || !body.newName) {
      throw new BadRequestException('oldName and newName are required.');
    }
    return this.mediaService.renameAsset(body.oldName, body.newName, body.updateReferences !== false);
  }

  @Delete(':filename')
  async deleteAsset(@Param('filename') filename: string, @Query('force') force?: string) {
    const isForce = force === 'true' || force === '1';
    try {
      return await this.mediaService.deleteAsset(filename, isForce);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
