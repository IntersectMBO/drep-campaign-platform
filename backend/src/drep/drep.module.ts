import { Module } from '@nestjs/common';
import { DrepController } from './drep.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drep } from 'src/entities/drep.entity';
import { Attachment } from 'src/entities/attachment.entity';
import { DrepService } from './drep.service';
import { AttachmentService } from 'src/attachment/attachment.service';
import { Note } from 'src/entities/note.entity';
import { CommentsService } from 'src/comments/comments.service';
import { ReactionsService } from 'src/reactions/reactions.service';
import { VoterService } from 'src/voter/voter.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Drep, Attachment, Note], 'default'),
    TypeOrmModule.forFeature([], 'dbsync'),
  ],
  controllers: [DrepController],
  providers: [
    DrepService,
    AttachmentService,
    CommentsService,
    ReactionsService,
    VoterService,
    AuthService,
  ],
})
export class DrepModule {}
