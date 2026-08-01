import { Controller, Get } from '@nestjs/common';
import { EventsService, CampusEvent } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  getAllEvents(): CampusEvent[] {
    return this.eventsService.findAll();
  }
}
