import { Injectable, NotFoundException } from '@nestjs/common';

export interface BookingRequest {
  id: string;
  institutionName: string;
  institutionType: 'School' | 'College' | 'University' | 'Public Event' | 'Other';
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  city: 'Chandigarh' | 'Mohali' | 'Panchkula' | 'Other';
  eventLocation: string;
  preferredDate: string;
  estimatedFootfall: string;
  additionalNotes?: string;
  status: 'Pending' | 'Approved' | 'Completed' | 'Declined';
  createdAt: string;
}

@Injectable()
export class BookingsService {
  private bookings: BookingRequest[] = [
    {
      id: 'req-1',
      institutionName: 'Panjab University (Student Center)',
      institutionType: 'University',
      contactPerson: 'Harpreet Singh',
      designation: 'Cultural Secretary',
      email: 'harpreet.pu@gmail.com',
      phone: '+91 98765 43210',
      city: 'Chandigarh',
      eventLocation: 'Sector 14, Panjab University, Chandigarh',
      preferredDate: '2026-08-20',
      estimatedFootfall: '3,000+ Students',
      additionalNotes: 'Requesting bookstall setup during annual youth fest.',
      status: 'Approved',
      createdAt: '2026-07-28',
    },
    {
      id: 'req-2',
      institutionName: 'Doon Public School',
      institutionType: 'School',
      contactPerson: 'Meenakshi Sharma',
      designation: 'Vice Principal',
      email: 'meenakshi.doon@gmail.com',
      phone: '+91 98123 45678',
      city: 'Panchkula',
      eventLocation: 'Sector 21, Panchkula',
      preferredDate: '2026-09-05',
      estimatedFootfall: '800 Students & Parents',
      additionalNotes: 'Special request for Kids Wisdom stories and Bal Gita during PTM.',
      status: 'Pending',
      createdAt: '2026-07-30',
    }
  ];

  findAll(): BookingRequest[] {
    return this.bookings;
  }

  findOne(id: string): BookingRequest {
    const b = this.bookings.find(req => req.id === id);
    if (!b) throw new NotFoundException(`Booking request ${id} not found`);
    return b;
  }

  create(data: Omit<BookingRequest, 'id' | 'status' | 'createdAt'>): BookingRequest {
    const newBooking: BookingRequest = {
      id: 'req-' + Date.now(),
      ...data,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.bookings.unshift(newBooking);
    return newBooking;
  }

  updateStatus(id: string, status: 'Pending' | 'Approved' | 'Completed' | 'Declined'): BookingRequest {
    const booking = this.findOne(id);
    booking.status = status;
    return booking;
  }
}
