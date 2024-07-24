import { Body, Controller, Post } from '@nestjs/common';
import { createReactionDto } from 'src/dto/createReactionDto';
import { ReactionsService } from './reactions.service';

@Controller('reactions')
export class ReactionsController {
  constructor(private reactionsService: ReactionsService) {}
  @Post('add')
  async createReaction(@Body() reactionBody: createReactionDto) {
    return this.reactionsService.insertReaction(
      reactionBody.parentId,
      reactionBody.parentEntity,
      reactionBody.type,
      reactionBody.voter,
    );
  }

  @Post('remove')
  async removeReaction(@Body() reactionBody: createReactionDto) {
    return this.reactionsService.removeReaction(
      reactionBody.parentId,
      reactionBody.parentEntity,
      reactionBody.type,
      reactionBody.voter,
    );
  }
}
