import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/mysql.service';

export interface CampusEvent {
  id: string;
  title: string;
  location: string;
  city: string;
  date: string;
  description: string;
  images: string[];
  category: 'University Fest' | 'School PTM' | 'Book Fair' | 'Youth Conference';
}

@Injectable()
export class EventsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<CampusEvent[]> {
    const events = await this.db.query<any[]>(`
      SELECT e.id, e.title, e.location, e.city, e.event_date, e.description, e.category
      FROM campus_events e
      ORDER BY e.created_at DESC
    `);

    const images = await this.db.query<any[]>(`
      SELECT event_id, image_url
      FROM event_images
      ORDER BY display_order ASC
    `);

    const imageMap: Record<string, string[]> = {};
    for (const img of images) {
      if (!imageMap[img.event_id]) {
        imageMap[img.event_id] = [];
      }
      imageMap[img.event_id].push(img.image_url);
    }

    return events.map(e => ({
      id: e.id,
      title: e.title,
      location: e.location,
      city: e.city,
      date: e.event_date,
      description: e.description,
      images: imageMap[e.id] || [],
      category: e.category,
    }));
  }
}
