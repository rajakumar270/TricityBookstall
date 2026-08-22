import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { BookingsService, BookingRequest } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async getAllBookings(): Promise<BookingRequest[]> {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  async getBookingById(@Param('id') id: string): Promise<BookingRequest> {
    return this.bookingsService.findOne(id);
  }

  @Post()
  async createBooking(@Body() data: Omit<BookingRequest, 'id' | 'status' | 'createdAt'>): Promise<BookingRequest> {
    return this.bookingsService.create(data);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'Pending' | 'Approved' | 'Completed' | 'Declined'
  ): Promise<BookingRequest> {
    return this.bookingsService.updateStatus(id, status);
  }
}
