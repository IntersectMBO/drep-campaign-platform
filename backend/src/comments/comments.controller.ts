import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';

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

  @Post(':parentId/:parentEntity/add')
  async insertComment(
    @Param('parentId') parentId: number,
    @Param('parentEntity') parentEntity: string,
    @Body('comment') comment: string,
    @Body('voter') voter: string,
  ) {
    return this.commentsService.insertComment(
      parentId,
      parentEntity,
      comment,
      voter,
    );
  }

  @Post(':parentId/:parentEntity/remove')
  async removeComment(
    @Param('parentId') parentId: number,
    @Param('parentEntity') parentEntity: string,
    @Body('comment') comment: string,
    @Body('voter') voter: string,
  ) {
    return this.commentsService.removeComment(
      parentId,
      parentEntity,
      comment,
      voter,
    );
  }
}
