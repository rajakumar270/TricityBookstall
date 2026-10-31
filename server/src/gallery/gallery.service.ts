import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/mysql.service';

export interface GalleryImage {
  id: number;
  image_url: string;
  caption: string;
  category: string;
  display_order: number;
  is_active: boolean;
}

@Injectable()
export class GalleryService implements OnModuleInit {
  constructor(private readonly db: DatabaseService) {}

  async onModuleInit() {
    try {
      await this.db.query(`
        CREATE TABLE IF NOT EXISTS gallery_images (
          id INT AUTO_INCREMENT PRIMARY KEY,
          image_url VARCHAR(500) NOT NULL,
          caption VARCHAR(500) DEFAULT '',
          category VARCHAR(100) DEFAULT 'General',
          display_order INT DEFAULT 0,
          is_active TINYINT(1) DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      const rows = await this.db.query<any[]>('SELECT COUNT(*) as count FROM gallery_images');
      if (rows && rows[0] && rows[0].count === 0) {
        const seeds = [
          { url: '/assets/cgc1.jpg', caption: 'CGC Landran Bookstall Setup', category: 'Campus Events' },
          { url: '/assets/cgc2.jpg', caption: 'Student Engagement at CGC', category: 'Campus Events' },
          { url: '/assets/cu1.jpg', caption: 'Chandigarh University Stall', category: 'Campus Events' },
          { url: '/assets/new_logo.jpg', caption: 'Ekatva Foundation Logo', category: 'Branding' },
        ];
        for (let i = 0; i < seeds.length; i++) {
          await this.db.query(
            `INSERT INTO gallery_images (image_url, caption, category, display_order) VALUES (?, ?, ?, ?)`,
            [seeds[i].url, seeds[i].caption, seeds[i].category, i],
          );
        }
        console.log('✅ Auto-seeded gallery images');
      } else {
        // Migrate any legacy logo path in gallery table
        await this.db.query(
          "UPDATE gallery_images SET image_url = '/assets/new_logo.jpg' WHERE image_url = '/assets/ekatva_v3_logo_1.jpg'",
        );
      }
    } catch (err) {
      console.warn('Gallery table init/seed warning:', err);
    }
  }

  async findAll(): Promise<GalleryImage[]> {
    try {
      const rows = await this.db.query<any[]>(
        'SELECT * FROM gallery_images ORDER BY display_order ASC, id ASC',
      );
      return rows.map((r) => ({
        id: r.id,
        image_url: r.image_url,
        caption: r.caption || '',
        category: r.category || 'General',
        display_order: r.display_order || 0,
        is_active: Boolean(r.is_active),
      }));
    } catch (err) {
      console.warn('Gallery findAll error:', err);
      return [];
    }
  }

  async create(data: Partial<GalleryImage>): Promise<GalleryImage[]> {
    await this.db.query(
      `INSERT INTO gallery_images (image_url, caption, category, display_order) VALUES (?, ?, ?, ?)`,
      [data.image_url || '', data.caption || '', data.category || 'General', data.display_order || 0],
    );
    return this.findAll();
  }

  async update(id: number, data: Partial<GalleryImage>): Promise<GalleryImage[]> {
    const updates: string[] = [];
    const params: any[] = [];
    if (data.image_url !== undefined) { updates.push('image_url = ?'); params.push(data.image_url); }
    if (data.caption !== undefined) { updates.push('caption = ?'); params.push(data.caption); }
    if (data.category !== undefined) { updates.push('category = ?'); params.push(data.category); }
    if (data.display_order !== undefined) { updates.push('display_order = ?'); params.push(data.display_order); }
    if (data.is_active !== undefined) { updates.push('is_active = ?'); params.push(data.is_active ? 1 : 0); }

    if (updates.length > 0) {
      params.push(id);
      await this.db.query(`UPDATE gallery_images SET ${updates.join(', ')} WHERE id = ?`, params);
    }
    return this.findAll();
  }

  async delete(id: number): Promise<GalleryImage[]> {
    await this.db.query('DELETE FROM gallery_images WHERE id = ?', [id]);
    return this.findAll();
  }
}
