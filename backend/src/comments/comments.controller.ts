import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthPrincipal, AuthUser } from 'src/auth/auth.principal';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}
  @Get(':parentId/:parentEntity')
  async getComments(
    @Param('parentId') parentId: number,
    @Param('parentEntity') parentEntity: string,
  ) {
    return this.commentsService.getComments(parentId, parentEntity);
  }

  // The author is the logged-in stake address, not a value from the body
  @Post(':parentId/:parentEntity/add')
  async insertComment(
    @Param('parentId') parentId: number,
    @Param('parentEntity') parentEntity: string,
    @Body('comment') comment: string,
    @AuthUser() principal: AuthPrincipal,
  ) {
    return this.commentsService.insertComment(
      parentId,
      parentEntity,
      comment,
      principal.stakeAddress,
    );
  }

  @Post(':parentId/:parentEntity/remove')
  async removeComment(
    @Param('parentId') parentId: number,
    @Param('parentEntity') parentEntity: string,
    @Body('comment') comment: string,
    @AuthUser() principal: AuthPrincipal,
  ) {
    return this.commentsService.removeComment(
      parentId,
      parentEntity,
      comment,
      principal.stakeAddress,
    );
  }
}
