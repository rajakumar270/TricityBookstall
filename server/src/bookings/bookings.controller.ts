import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { BookingsService, BookingRequest } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  getAllBookings(): BookingRequest[] {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  getBookingById(@Param('id') id: string): BookingRequest {
    return this.bookingsService.findOne(id);
  }

  @Post()
  createBooking(@Body() data: Omit<BookingRequest, 'id' | 'status' | 'createdAt'>): BookingRequest {
    return this.bookingsService.create(data);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'Pending' | 'Approved' | 'Completed' | 'Declined'
  ): BookingRequest {
    return this.bookingsService.updateStatus(id, status);
  }
}
