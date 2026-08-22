import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/mysql.service';

export interface CmsBlock {
  block_key: string;
  content: any;
}

const DEFAULT_BLOCKS: Record<string, any> = {
  hero_section: {
    badge: 'Clarity of Mind, Freedom of Being • स्पष्ट मन, मुक्त जीवन',
    title: 'Timeless Wisdom. Meaningful Dialogues. Stronger Communities.',
    subtitle: 'We bring philosophical books and reflective dialogue to schools, colleges, institutions, and public events across the Tri-City.',
    ctaPrimary: 'Explore Book Catalog',
    ctaSecondary: 'Invite a Bookstall',
  },
  impact_stats: {
    stats: [
      { label: 'Books Distributed', value: '55+' },
      { label: 'Events Conducted', value: '185+' },
      { label: 'Students Engaged', value: '10K+' },
      { label: 'Dedicated Volunteers', value: '50+' },
    ],
  },
  what_we_do: {
    sectionTitle: 'What We Do',
    sectionSubtitle: 'Spreading clarity & character through books and conversation',
    cards: [
      { title: 'Schools & Colleges', description: 'Bringing value-based literature closer to students and educators.' },
      { title: 'Events & Fairs', description: 'Engaging communities through book fairs, melas, and cultural events.' },
      { title: 'Meaningful Dialogue', description: 'Encouraging conversations that nurture clarity, character and compassion.' },
      { title: 'Curated Selection', description: 'Handpicked books on philosophy, self-growth, indian thought and mindful living.' },
    ],
  },
  quote_banner: {
    lines: [
      'Books open minds.',
      'Dialogues open possibilities.',
      'Together, we create change.',
    ],
  },
  invite_banner: {
    tagline: 'Be a part of the movement',
    heading: 'Invite a Bookstall to Your Institution',
    subtext: "Let's bring meaningful books and conversations to your campus, event, or community.",
    ctaText: 'Invite Now',
    image: '/assets/cgc2.jpg',
  },
  events_header: {
    sectionTag: 'Upcoming Events',
    viewAllText: 'View All Events',
  },
  footer: {
    tagline: 'Clarity of Mind • Freedom of Being',
    description: 'Bringing timeless wisdom literature to campuses, communities, and youth across the Tri-City region.',
    copyright: '© 2026 Ekatva Foundation. All rights reserved.',
  },
};

@Injectable()
export class CmsService implements OnModuleInit {
  constructor(private readonly db: DatabaseService) {}

  async onModuleInit() {
    try {
      await this.db.query(`
        CREATE TABLE IF NOT EXISTS cms_blocks (
          block_key VARCHAR(100) PRIMARY KEY,
          content_json TEXT NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `);

      // Seed defaults for any missing blocks
      for (const [key, content] of Object.entries(DEFAULT_BLOCKS)) {
        const rows = await this.db.query<any[]>(
          'SELECT block_key FROM cms_blocks WHERE block_key = ?',
          [key],
        );
        if (!rows || rows.length === 0) {
          await this.db.query(
            `INSERT INTO cms_blocks (block_key, content_json) VALUES (?, ?)`,
            [key, JSON.stringify(content)],
          );
        }
      }
      console.log('✅ CMS content blocks initialized');
    } catch (err) {
      console.warn('CMS table init warning:', err);
    }
  }

  async getAllBlocks(): Promise<Record<string, any>> {
    try {
      const rows = await this.db.query<any[]>('SELECT * FROM cms_blocks');
      const blocks: Record<string, any> = { ...DEFAULT_BLOCKS };
      for (const row of rows) {
        try {
          blocks[row.block_key] = JSON.parse(row.content_json);
        } catch (e) {
          // keep default
        }
      }
      return blocks;
    } catch (err) {
      console.warn('CMS getAllBlocks fallback:', err);
      return DEFAULT_BLOCKS;
    }
  }

  async getBlock(key: string): Promise<any> {
    try {
      const rows = await this.db.query<any[]>(
        'SELECT content_json FROM cms_blocks WHERE block_key = ?',
        [key],
      );
      if (rows && rows.length > 0) {
        return JSON.parse(rows[0].content_json);
      }
      return DEFAULT_BLOCKS[key] || {};
    } catch (err) {
      return DEFAULT_BLOCKS[key] || {};
    }
  }

  async updateBlock(key: string, content: any): Promise<Record<string, any>> {
    const json = JSON.stringify(content);
    await this.db.query(
      `INSERT INTO cms_blocks (block_key, content_json) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE content_json = VALUES(content_json)`,
      [key, json],
    );
    return this.getAllBlocks();
  }
}
