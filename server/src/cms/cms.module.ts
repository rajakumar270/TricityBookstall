import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CmsService } from './cms.service';
import { CmsController } from './cms.controller';

@Module({
  imports: [DatabaseModule],
  providers: [CmsService],
  controllers: [CmsController],
  exports: [CmsService],
})
export class CmsModule {}
