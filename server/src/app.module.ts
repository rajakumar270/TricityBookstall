import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { BooksModule } from './books/books.module';
import { BookingsModule } from './bookings/bookings.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { GalleryModule } from './gallery/gallery.module';
import { CmsModule } from './cms/cms.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [DatabaseModule, BooksModule, BookingsModule, EventsModule, AuthModule, SettingsModule, GalleryModule, CmsModule, MediaModule],
})
export class AppModule {}
