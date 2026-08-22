import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/mysql.service';

export interface SiteSettings {
  catalogEnabled: boolean;
  showVersionToggle: boolean;
  logoConfig: {
    title: string;       // Organization Name (e.g. Ekatva Foundation)
    subtitle: string;    // Punch Line / Tagline below logo (e.g. Clarity of Mind • Freedom of Being)
    logoUrl?: string;    // Logo Image URL
    faviconUrl?: string; // Favicon URL
  };
  quoteConfig?: {
    line1: string;
    line2: string;
    line3: string;
    author?: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
    instagram: string;
    youtube: string;
    facebook: string;
  };
  homeBanner: {
    badge: string;       // Hero Badge / Punch line
    title: string;
    subtitle: string;
    imageUrl: string;
    bannerImages: string[];
  };
  eventsConfig: {
    bannerImage: string;
    title: string;
    description: string;
  };
}

const DEFAULT_SETTINGS: SiteSettings = {
  catalogEnabled: false,
  showVersionToggle: false,
  logoConfig: {
    title: 'Ekatva Foundation',
    subtitle: 'Clarity of Mind • Freedom of Being',
    logoUrl: '/assets/ekatva_v3_logo_1.jpg',
    faviconUrl: '/assets/ekatva_logo_1.jpg',
  },
  quoteConfig: {
    line1: 'Books open minds.',
    line2: 'Dialogues open possibilities.',
    line3: 'Together, we create change.',
    author: 'Ekatva Movement',
  },
  contactInfo: {
    phone: '+91 80544 48521',
    email: 'ekatvafoundation.bookstall@gmail.com',
    address: 'Tricity Stall Center, Sector 17, Chandigarh',
    whatsapp: 'https://wa.me/918054448521',
    instagram: 'https://instagram.com/ekatvafoundation',
    youtube: 'https://youtube.com/acharyaprashant',
    facebook: 'https://facebook.com/ekatvafoundation',
  },
  homeBanner: {
    badge: 'Tricity Campus & PTM Literature Movement',
    title: 'Transforming Lives Through Higher Wisdom Literature',
    subtitle: 'Bringing timeless clarity, Vedanta, and youth character-building literature to schools, universities, and book stalls across Chandigarh, Mohali, and Panchkula.',
    imageUrl: '/assets/cgc1.jpg',
    bannerImages: [
      '/assets/cgc1.jpg',
      '/assets/cgc2.jpg',
      '/assets/cu1.jpg',
      '/assets/ekatva_v3_logo_1.jpg',
    ],
  },
  eventsConfig: {
    bannerImage: '/assets/cgc1.jpg',
    title: 'Campus Impact & Bookstall Gallery',
    description: 'Moments of student engagement, book fairs, and PTM bookstalls across Tricity educational institutions.',
  },
};

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(private readonly db: DatabaseService) {}

  async onModuleInit() {
    try {
      await this.db.query(`
        CREATE TABLE IF NOT EXISTS site_settings (
          key_name VARCHAR(100) PRIMARY KEY,
          value_json TEXT NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `);
    } catch (err) {
      console.warn('Could not auto-create site_settings table:', err);
    }
  }

  async getAllSettings(): Promise<SiteSettings> {
    try {
      const rows = await this.db.query<any[]>('SELECT * FROM site_settings');
      const settings = { ...DEFAULT_SETTINGS };

      for (const row of rows) {
        try {
          const parsed = JSON.parse(row.value_json);
          if (row.key_name === 'catalog_enabled') {
            settings.catalogEnabled = Boolean(parsed);
          } else if (row.key_name === 'show_version_toggle') {
            settings.showVersionToggle = Boolean(parsed);
          } else if (row.key_name === 'logo_config') {
            settings.logoConfig = { ...settings.logoConfig, ...parsed };
          } else if (row.key_name === 'quote_config') {
            settings.quoteConfig = { ...settings.quoteConfig, ...parsed };
          } else if (row.key_name === 'contact_info') {
            settings.contactInfo = { ...settings.contactInfo, ...parsed };
          } else if (row.key_name === 'home_banner') {
            settings.homeBanner = { ...settings.homeBanner, ...parsed };
          } else if (row.key_name === 'events_config') {
            settings.eventsConfig = { ...settings.eventsConfig, ...parsed };
          }
        } catch (e) {
          console.error(`Failed to parse setting JSON for key "${row.key_name}":`, e);
        }
      }

      return settings;
    } catch (err) {
      console.warn('Fallback to default settings:', err);
      return DEFAULT_SETTINGS;
    }
  }

  async updateSetting(key: string, value: any): Promise<SiteSettings> {
    let keyName = key;
    if (key === 'catalogEnabled') keyName = 'catalog_enabled';
    if (key === 'showVersionToggle') keyName = 'show_version_toggle';
    if (key === 'logoConfig') keyName = 'logo_config';
    if (key === 'quoteConfig') keyName = 'quote_config';
    if (key === 'contactInfo') keyName = 'contact_info';
    if (key === 'homeBanner') keyName = 'home_banner';
    if (key === 'eventsConfig') keyName = 'events_config';

    const valueJson = JSON.stringify(value);

    await this.db.query(
      `INSERT INTO site_settings (key_name, value_json)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE value_json = VALUES(value_json)`,
      [keyName, valueJson],
    );

    return this.getAllSettings();
  }

  async updateAllSettings(settingsData: Partial<SiteSettings>): Promise<SiteSettings> {
    if (settingsData.catalogEnabled !== undefined) {
      await this.updateSetting('catalogEnabled', settingsData.catalogEnabled);
    }
    if (settingsData.showVersionToggle !== undefined) {
      await this.updateSetting('showVersionToggle', settingsData.showVersionToggle);
    }
    if (settingsData.logoConfig !== undefined) {
      await this.updateSetting('logoConfig', settingsData.logoConfig);
    }
    if (settingsData.quoteConfig !== undefined) {
      await this.updateSetting('quoteConfig', settingsData.quoteConfig);
    }
    if (settingsData.contactInfo !== undefined) {
      await this.updateSetting('contactInfo', settingsData.contactInfo);
    }
    if (settingsData.homeBanner !== undefined) {
      await this.updateSetting('homeBanner', settingsData.homeBanner);
    }
    if (settingsData.eventsConfig !== undefined) {
      await this.updateSetting('eventsConfig', settingsData.eventsConfig);
    }
    return this.getAllSettings();
  }
}
