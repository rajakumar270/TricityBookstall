import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/mysql.service';
import * as path from 'path';
import * as fs from 'fs';

export interface MediaAsset {
  name: string;
  url: string;
  sizeBytes: number;
  modifiedAt: string;
  usageCount: number;
  usedIn: string[];
}

@Injectable()
export class MediaService {
  constructor(private readonly db: DatabaseService) {}

  private getAssetsDir(): string {
    // Try multiple possible paths to client/public/assets
    const candidates = [
      path.resolve(process.cwd(), 'client/public/assets'),
      path.resolve(process.cwd(), '../client/public/assets'),
      path.resolve(__dirname, '../../../client/public/assets'),
      path.resolve(__dirname, '../../client/public/assets'),
      path.resolve(__dirname, '../../../../client/public/assets'),
    ];

    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }

    // Fallback: create if missing in candidate 0 or 1
    const fallback = path.resolve(process.cwd(), '../client/public/assets');
    if (!fs.existsSync(fallback)) {
      try {
        fs.mkdirSync(fallback, { recursive: true });
      } catch (e) {
        // ignore
      }
    }
    return fallback;
  }

  async getAllAssets(): Promise<MediaAsset[]> {
    const assetsDir = this.getAssetsDir();
    if (!fs.existsSync(assetsDir)) return [];

    const files = this.listImageFilesRecursive(assetsDir, '');
    const usageMap = await this.buildUsageMap();

    return files.map((file) => {
      const url = `/assets/${file.relPath}`;
      const usedIn = usageMap[url] || usageMap[file.name] || [];
      return {
        name: file.relPath,
        url: url,
        sizeBytes: file.size,
        modifiedAt: file.mtime.toISOString(),
        usageCount: usedIn.length,
        usedIn,
      };
    });
  }

  private listImageFilesRecursive(dir: string, subDir: string): Array<{ name: string; relPath: string; size: number; mtime: Date }> {
    const entries = fs.readdirSync(path.join(dir, subDir), { withFileTypes: true });
    let results: Array<{ name: string; relPath: string; size: number; mtime: Date }> = [];

    const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.ico'];

    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const rel = subDir ? `${subDir}/${entry.name}` : entry.name;
      const full = path.join(dir, rel);

      if (entry.isDirectory()) {
        results = results.concat(this.listImageFilesRecursive(dir, rel));
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (validExts.includes(ext)) {
          const stat = fs.statSync(full);
          results.push({
            name: entry.name,
            relPath: rel,
            size: stat.size,
            mtime: stat.mtime,
          });
        }
      }
    }
    return results;
  }

  async checkUsage(assetUrlOrName: string): Promise<string[]> {
    const usageMap = await this.buildUsageMap();
    const cleanUrl = assetUrlOrName.startsWith('/assets/') ? assetUrlOrName : `/assets/${assetUrlOrName}`;
    const baseName = path.basename(assetUrlOrName);

    return usageMap[cleanUrl] || usageMap[baseName] || [];
  }

  private async buildUsageMap(): Promise<Record<string, string[]>> {
    const map: Record<string, string[]> = {};

    const addUsage = (url: string | null | undefined, locationLabel: string) => {
      if (!url || typeof url !== 'string') return;
      const clean = url.trim();
      if (!clean) return;
      if (!map[clean]) map[clean] = [];
      if (!map[clean].includes(locationLabel)) map[clean].push(locationLabel);

      const base = path.basename(clean);
      if (!map[base]) map[base] = [];
      if (!map[base].includes(locationLabel)) map[base].push(locationLabel);
    };

    try {
      // 1. Check site_settings
      const settingsRows = await this.db.query<any[]>('SELECT * FROM site_settings');
      for (const row of settingsRows) {
        try {
          const val = JSON.parse(row.value_json);
          if (row.key_name === 'logo_config') {
            if (val.logoUrl) addUsage(val.logoUrl, 'Site Logo Image');
            if (val.faviconUrl) addUsage(val.faviconUrl, 'Site Favicon');
          } else if (row.key_name === 'home_banner') {
            if (val.imageUrl) addUsage(val.imageUrl, 'Hero Banner Main Image');
            if (Array.isArray(val.bannerImages)) {
              val.bannerImages.forEach((img: string, i: number) => addUsage(img, `Home Slideshow Image #${i + 1}`));
            }
          } else if (row.key_name === 'events_config') {
            if (val.bannerImage) addUsage(val.bannerImage, 'Events Banner Cover');
          }
        } catch (e) {
          // ignore
        }
      }

      // 2. Check campus_events & event_images
      const eventImgs = await this.db.query<any[]>(
        `SELECT ei.image_url, ce.title FROM event_images ei JOIN campus_events ce ON ei.event_id = ce.id`,
      );
      for (const img of eventImgs) {
        addUsage(img.image_url, `Campus Event: "${img.title}"`);
      }

      // 3. Check gallery_images
      const galleryImgs = await this.db.query<any[]>('SELECT image_url, caption FROM gallery_images');
      for (const g of galleryImgs) {
        addUsage(g.image_url, `Gallery Photo: "${g.caption || 'Photo'}"`);
      }

      // 4. Check books
      const bookRows = await this.db.query<any[]>('SELECT title, cover_image FROM books WHERE cover_image IS NOT NULL AND cover_image != ""');
      for (const b of bookRows) {
        addUsage(b.cover_image, `Book Cover: "${b.title}"`);
      }

      // 5. Check cms_blocks
      const cmsRows = await this.db.query<any[]>('SELECT block_key, content_json FROM cms_blocks');
      for (const c of cmsRows) {
        try {
          const json = c.content_json;
          // Match any /assets/... string in content
          const matches = json.match(/\/assets\/[a-zA-Z0-9_\-\.\/]+/g);
          if (matches) {
            matches.forEach((m: string) => addUsage(m, `CMS Block: "${c.block_key}"`));
          }
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      console.warn('Could not complete buildUsageMap:', err);
    }

    return map;
  }

  async uploadAsset(filename: string, base64Data: string): Promise<{ name: string; url: string; sizeBytes: number }> {
    const assetsDir = this.getAssetsDir();
    let cleanName = filename.trim().replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    if (!cleanName) cleanName = `upload_${Date.now()}.jpg`;

    // Handle base64 header like "data:image/jpeg;base64,"
    const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');

    const targetPath = path.join(assetsDir, cleanName);
    fs.writeFileSync(targetPath, buffer);

    // Also copy to client/dist/assets if dist exists
    const distAssetsDir = path.resolve(assetsDir, '../../dist/assets');
    if (fs.existsSync(distAssetsDir)) {
      try {
        fs.writeFileSync(path.join(distAssetsDir, cleanName), buffer);
      } catch (e) {
        // ignore
      }
    }

    return {
      name: cleanName,
      url: `/assets/${cleanName}`,
      sizeBytes: buffer.length,
    };
  }

  async renameAsset(oldName: string, newName: string, updateReferences = true): Promise<{ success: boolean; newUrl: string }> {
    const assetsDir = this.getAssetsDir();
    const cleanOld = oldName.replace(/^\/assets\//, '');
    let cleanNew = newName.replace(/^\/assets\//, '').trim().replace(/[^a-zA-Z0-9_\-\.]/g, '_');

    const oldPath = path.join(assetsDir, cleanOld);
    const newPath = path.join(assetsDir, cleanNew);

    if (!fs.existsSync(oldPath)) {
      throw new Error(`Asset ${cleanOld} does not exist.`);
    }

    fs.renameSync(oldPath, newPath);

    const oldUrl = `/assets/${cleanOld}`;
    const newUrl = `/assets/${cleanNew}`;

    if (updateReferences) {
      await this.updateAllReferences(oldUrl, newUrl, cleanOld, cleanNew);
    }

    return { success: true, newUrl };
  }

  async deleteAsset(name: string, force = false): Promise<{ success: boolean }> {
    const assetsDir = this.getAssetsDir();
    const cleanName = name.replace(/^\/assets\//, '');
    const filePath = path.join(assetsDir, cleanName);

    if (!fs.existsSync(filePath)) {
      return { success: true };
    }

    if (!force) {
      const usage = await this.checkUsage(cleanName);
      if (usage.length > 0) {
        throw new Error(`Cannot delete image because it is used in: ${usage.join(', ')}`);
      }
    }

    fs.unlinkSync(filePath);
    return { success: true };
  }

  private async updateAllReferences(oldUrl: string, newUrl: string, oldName: string, newName: string) {
    try {
      // 1. Update event_images
      await this.db.query('UPDATE event_images SET image_url = ? WHERE image_url = ? OR image_url = ?', [newUrl, oldUrl, oldName]);

      // 2. Update gallery_images
      await this.db.query('UPDATE gallery_images SET image_url = ? WHERE image_url = ? OR image_url = ?', [newUrl, oldUrl, oldName]);

      // 3. Update books
      await this.db.query('UPDATE books SET cover_image = ? WHERE cover_image = ? OR cover_image = ?', [newUrl, oldUrl, oldName]);

      // 4. Update site_settings
      const settings = await this.db.query<any[]>('SELECT * FROM site_settings');
      for (const s of settings) {
        let text = s.value_json;
        if (text.includes(oldUrl) || text.includes(oldName)) {
          text = text.split(oldUrl).join(newUrl).split(oldName).join(newName);
          await this.db.query('UPDATE site_settings SET value_json = ? WHERE key_name = ?', [text, s.key_name]);
        }
      }

      // 5. Update cms_blocks
      const cms = await this.db.query<any[]>('SELECT * FROM cms_blocks');
      for (const c of cms) {
        let text = c.content_json;
        if (text.includes(oldUrl) || text.includes(oldName)) {
          text = text.split(oldUrl).join(newUrl).split(oldName).join(newName);
          await this.db.query('UPDATE cms_blocks SET content_json = ? WHERE block_key = ?', [text, c.block_key]);
        }
      }
    } catch (err) {
      console.warn('Could not update all references:', err);
    }
  }
}
