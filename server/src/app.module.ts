import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { BooksModule } from './books/books.module';
import { BookingsModule } from './bookings/bookings.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, BooksModule, BookingsModule, EventsModule, AuthModule],
})
export class AppModule {}
