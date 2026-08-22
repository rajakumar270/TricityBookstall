import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { EventsService, CampusEvent } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getAllEvents(): Promise<CampusEvent[]> {
    return this.eventsService.findAll();
  }

  @Post()
  async createEvent(@Body() body: Partial<CampusEvent>) {
    return this.eventsService.create(body);
  }

  @Put(':id')
  async updateEvent(@Param('id') id: string, @Body() body: Partial<CampusEvent>) {
    return this.eventsService.update(id, body);
  }

  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }
}
