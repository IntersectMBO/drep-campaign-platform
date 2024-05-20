import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from 'src/entities/attachment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment])],
  controllers: [],
  providers: [AttachmentService],
})
export class AttachmentModule {}
