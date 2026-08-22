import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Module({
  imports: [DatabaseModule],
  providers: [MediaService],
  controllers: [MediaController],
  exports: [MediaService],
})
export class MediaModule {}
