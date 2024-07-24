import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { ReactionsService } from 'src/reactions/reactions.service';

@Module({
  imports:[TypeOrmModule.forFeature([Comment])],
  controllers: [CommentsController],
  providers: [CommentsService,ReactionsService ]
})
export class CommentsModule {}
