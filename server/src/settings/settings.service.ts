import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/mysql.service';

export interface SiteSettings {
  catalogEnabled: boolean;
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
    badge: string;
    title: string;
    subtitle: string;
    imageUrl: string;
  };
  eventsConfig: {
    bannerImage: string;
    title: string;
    description: string;
  };
}

const DEFAULT_SETTINGS: SiteSettings = {
  catalogEnabled: false, // Default OFF as requested by user until enabled from Admin panel
  contactInfo: {
    phone: '+91 98765 43210',
    email: 'contact@ekatvafoundation.org',
    address: 'Tricity Stall Center, Sector 17, Chandigarh',
    whatsapp: 'https://wa.me/919876543210',
    instagram: 'https://instagram.com/ekatvafoundation',
    youtube: 'https://youtube.com/acharyaprashant',
    facebook: 'https://facebook.com/ekatvafoundation',
  },
  homeBanner: {
    badge: 'Tricity Campus & PTM Literature Movement',
    title: 'Transforming Lives Through Higher Wisdom Literature',
    subtitle: 'Bringing timeless clarity, Vedanta, and youth character-building literature to schools, universities, and book stalls across Chandigarh, Mohali, and Panchkula.',
    imageUrl: '/assets/banner.jpg',
  },
  eventsConfig: {
    bannerImage: '/assets/cgc1.jpg',
    title: 'Campus Impact & Bookstall Gallery',
    description: 'Moments of student engagement, book fairs, and PTM bookstalls across Tricity educational institutions.',
  },
};

@Injectable()
export class SettingsService {
  constructor(private readonly db: DatabaseService) {}

  async getAllSettings(): Promise<SiteSettings> {
    try {
      const rows = await this.db.query<any[]>('SELECT * FROM site_settings');
      const settings = { ...DEFAULT_SETTINGS };

      for (const row of rows) {
        try {
          const parsed = JSON.parse(row.value_json);
          if (row.key_name === 'catalog_enabled') {
            settings.catalogEnabled = Boolean(parsed);
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
