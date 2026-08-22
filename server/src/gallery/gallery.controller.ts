import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { GalleryService, GalleryImage } from './gallery.service';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  async findAll(): Promise<GalleryImage[]> {
    return this.galleryService.findAll();
  }

  @Post()
  async create(@Body() body: Partial<GalleryImage>) {
    return this.galleryService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<GalleryImage>) {
    return this.galleryService.update(Number(id), body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.galleryService.delete(Number(id));
  }
}
