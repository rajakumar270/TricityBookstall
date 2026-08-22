import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { CmsService } from './cms.service';

@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get()
  async getAllBlocks() {
    return this.cmsService.getAllBlocks();
  }

  @Get(':key')
  async getBlock(@Param('key') key: string) {
    return this.cmsService.getBlock(key);
  }

  @Put(':key')
  async updateBlock(@Param('key') key: string, @Body() body: any) {
    return this.cmsService.updateBlock(key, body);
  }
}
