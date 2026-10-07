import { Body, Controller, Post } from '@nestjs/common';
import { createReactionDto } from 'src/dto/createReactionDto';
import { ReactionsService } from './reactions.service';
import { AuthPrincipal, AuthUser } from 'src/auth/auth.principal';

@Controller('reactions')
export class ReactionsController {
  constructor(private reactionsService: ReactionsService) {}
  // The reacting voter is the logged-in stake address, not the body's voter
  @Post('add')
  async createReaction(
    @Body() reactionBody: createReactionDto,
    @AuthUser() principal: AuthPrincipal,
  ) {
    return this.reactionsService.insertReaction(
      reactionBody.parentId,
      reactionBody.parentEntity,
      reactionBody.type,
      principal.stakeAddress,
    );
  }

  @Post('remove')
  async removeReaction(
    @Body() reactionBody: createReactionDto,
    @AuthUser() principal: AuthPrincipal,
  ) {
    return this.reactionsService.removeReaction(
      reactionBody.parentId,
      reactionBody.parentEntity,
      reactionBody.type,
      principal.stakeAddress,
    );
  }
}
