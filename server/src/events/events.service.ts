import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/mysql.service';

export interface CampusEvent {
  id: string;
  title: string;
  location: string;
  city: string;
  date: string;
  description: string;
  images: string[];
  category: string;
}

const DEFAULT_EVENTS: CampusEvent[] = [
  {
    id: 'e1',
    title: 'CGC Landran Bookstall & PTM Wisdom Pavilion',
    location: 'CGC Landran Campus, Mohali',
    city: 'Mohali',
    date: 'Feb 2026',
    category: 'University Fest',
    description: 'Engaged 1,200+ students and parents during annual day fest with interactive book displays and character literature.',
    images: ['/assets/cgc1.jpg', '/assets/cgc2.jpg'],
  },
  {
    id: 'e2',
    title: 'CU Student Literature Dialogue Stall',
    location: 'Chandigarh University, Gharuan',
    city: 'Gharuan',
    date: 'Jan 2026',
    category: 'University Fest',
    description: 'Special youth literature stall focusing on mental clarity, exam stress reduction, and self-reflection books.',
    images: ['/assets/cu1.jpg', '/assets/cgc1.jpg'],
  },
  {
    id: 'e3',
    title: 'Sector 17 Plaza Open Literature Bookstall',
    location: 'Sector 17 Plaza, Chandigarh',
    city: 'Chandigarh',
    date: 'Jan 2026',
    category: 'Book Fair',
    description: 'Community weekend stall serving Tricity residents with Vedanta & youth development literature.',
    images: ['/assets/cgc2.jpg', '/assets/cu1.jpg'],
  },
];

@Injectable()
export class EventsService implements OnModuleInit {
  constructor(private readonly db: DatabaseService) {}

  async onModuleInit() {
    try {
      await this.db.query(`
        CREATE TABLE IF NOT EXISTS campus_events (
          id VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          city VARCHAR(100) NOT NULL DEFAULT '',
          event_date VARCHAR(100) NOT NULL,
          description TEXT,
          category VARCHAR(100) DEFAULT 'University Fest',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await this.db.query(`
        CREATE TABLE IF NOT EXISTS event_images (
          id INT AUTO_INCREMENT PRIMARY KEY,
          event_id VARCHAR(100) NOT NULL,
          image_url VARCHAR(500) NOT NULL,
          display_order INT DEFAULT 0
        );
      `);

      // Ensure columns are wide enough to accept any category / text
      try {
        await this.db.query(`ALTER TABLE campus_events MODIFY COLUMN category VARCHAR(255) DEFAULT 'University Fest'`);
        await this.db.query(`ALTER TABLE campus_events MODIFY COLUMN description TEXT`);
        await this.db.query(`ALTER TABLE campus_events MODIFY COLUMN location VARCHAR(255)`);
        await this.db.query(`ALTER TABLE campus_events MODIFY COLUMN city VARCHAR(100)`);
        await this.db.query(`ALTER TABLE campus_events MODIFY COLUMN event_date VARCHAR(100)`);
      } catch (alterErr) {
        // Table might already be configured
      }

      const rows = await this.db.query<any[]>('SELECT COUNT(*) as count FROM campus_events');
      if (rows && rows[0] && rows[0].count === 0) {
        for (const ev of DEFAULT_EVENTS) {
          await this.db.query(
            `INSERT INTO campus_events (id, title, location, city, event_date, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [ev.id, ev.title, ev.location, ev.city, ev.date, ev.description, ev.category],
          );
          for (let i = 0; i < ev.images.length; i++) {
            await this.db.query(
              `INSERT INTO event_images (event_id, image_url, display_order) VALUES (?, ?, ?)`,
              [ev.id, ev.images[i], i],
            );
          }
        }
        console.log('✅ Auto-seeded initial campus events');
      }
    } catch (err) {
      console.warn('Events table init/seed warning:', err);
    }
  }

  async findAll(): Promise<CampusEvent[]> {
    try {
      const events = await this.db.query<any[]>(
        `SELECT id, title, location, city, event_date, description, category FROM campus_events ORDER BY created_at DESC`,
      );
      const images = await this.db.query<any[]>(
        `SELECT event_id, image_url FROM event_images ORDER BY display_order ASC`,
      );
      const imageMap: Record<string, string[]> = {};
      for (const img of images) {
        if (!imageMap[img.event_id]) imageMap[img.event_id] = [];
        imageMap[img.event_id].push(img.image_url);
      }
      return events.map((e) => ({
        id: e.id,
        title: e.title,
        location: e.location,
        city: e.city || '',
        date: e.event_date,
        description: e.description || '',
        images: imageMap[e.id] || ['/assets/cgc1.jpg'],
        category: e.category || 'University Fest',
      }));
    } catch (err) {
      console.warn('Fallback to DEFAULT_EVENTS:', err);
      return DEFAULT_EVENTS;
    }
  }

  async create(data: Partial<CampusEvent>): Promise<CampusEvent[]> {
    const id = 'ev_' + Date.now();
    await this.db.query(
      `INSERT INTO campus_events (id, title, location, city, event_date, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, data.title || '', data.location || '', data.city || '', data.date || '', data.description || '', data.category || 'University Fest'],
    );
    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        if (data.images[i]) {
          await this.db.query(
            `INSERT INTO event_images (event_id, image_url, display_order) VALUES (?, ?, ?)`,
            [id, data.images[i], i],
          );
        }
      }
    }
    return this.findAll();
  }

  async update(id: string, data: Partial<CampusEvent>): Promise<CampusEvent[]> {
    await this.db.query(
      `UPDATE campus_events SET title = ?, location = ?, city = ?, event_date = ?, description = ?, category = ? WHERE id = ?`,
      [data.title || '', data.location || '', data.city || '', data.date || '', data.description || '', data.category || 'University Fest', id],
    );
    // Replace images
    if (data.images) {
      await this.db.query('DELETE FROM event_images WHERE event_id = ?', [id]);
      for (let i = 0; i < data.images.length; i++) {
        if (data.images[i]) {
          await this.db.query(
            `INSERT INTO event_images (event_id, image_url, display_order) VALUES (?, ?, ?)`,
            [id, data.images[i], i],
          );
        }
      }
    }
    return this.findAll();
  }

  async delete(id: string): Promise<CampusEvent[]> {
    await this.db.query('DELETE FROM event_images WHERE event_id = ?', [id]);
    await this.db.query('DELETE FROM campus_events WHERE id = ?', [id]);
    return this.findAll();
  }
}
