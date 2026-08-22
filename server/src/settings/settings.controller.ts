import { Controller, Get, Put, Body } from '@nestjs/common';
import { SettingsService, SiteSettings } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(): Promise<SiteSettings> {
    return this.settingsService.getAllSettings();
  }

  @Put()
  async updateSettings(@Body() body: Partial<SiteSettings>): Promise<SiteSettings> {
    return this.settingsService.updateAllSettings(body);
  }
}
