import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/mysql.service';

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
  constructor(private readonly db: DatabaseService) {}

  private mapRowToBooking(row: any): BookingRequest {
    return {
      id: row.id,
      institutionName: row.institution_name,
      institutionType: row.institution_type,
      contactPerson: row.contact_person,
      designation: row.designation || '',
      email: row.email,
      phone: row.phone,
      city: row.city,
      eventLocation: row.event_location,
      preferredDate: row.preferred_date ? (row.preferred_date instanceof Date ? row.preferred_date.toISOString().split('T')[0] : String(row.preferred_date)) : '',
      estimatedFootfall: row.estimated_footfall || '',
      additionalNotes: row.additional_notes || '',
      status: row.status,
      createdAt: row.created_at ? (row.created_at instanceof Date ? row.created_at.toISOString().split('T')[0] : String(row.created_at)) : '',
    };
  }

  async findAll(): Promise<BookingRequest[]> {
    const rows = await this.db.query<any[]>('SELECT * FROM stall_requests ORDER BY created_at DESC');
    return rows.map(r => this.mapRowToBooking(r));
  }

  async findOne(id: string): Promise<BookingRequest> {
    const rows = await this.db.query<any[]>('SELECT * FROM stall_requests WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      throw new NotFoundException(`Booking request ${id} not found`);
    }
    return this.mapRowToBooking(rows[0]);
  }

  async create(data: Omit<BookingRequest, 'id' | 'status' | 'createdAt'>): Promise<BookingRequest> {
    const id = 'req-' + Date.now();
    const createdAt = new Date().toISOString().split('T')[0];
    const newBooking: BookingRequest = {
      id,
      ...data,
      status: 'Pending',
      createdAt,
    };

    await this.db.query(
      `INSERT INTO stall_requests (id, institution_name, institution_type, contact_person, designation, email, phone, city, event_location, preferred_date, estimated_footfall, additional_notes, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newBooking.id,
        newBooking.institutionName,
        newBooking.institutionType,
        newBooking.contactPerson,
        newBooking.designation,
        newBooking.email,
        newBooking.phone,
        newBooking.city,
        newBooking.eventLocation,
        newBooking.preferredDate,
        newBooking.estimatedFootfall,
        newBooking.additionalNotes || '',
        newBooking.status,
        newBooking.createdAt,
      ],
    );

    return newBooking;
  }

  async updateStatus(id: string, status: 'Pending' | 'Approved' | 'Completed' | 'Declined'): Promise<BookingRequest> {
    await this.findOne(id);
    await this.db.query('UPDATE stall_requests SET status = ? WHERE id = ?', [status, id]);
    return this.findOne(id);
  }
}
