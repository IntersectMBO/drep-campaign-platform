import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ReactionsService } from 'src/reactions/reactions.service';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectDataSource('default')
    private voltaireService: DataSource,
    private reactionsService: ReactionsService,
  ) {}

  async getComments(parentId: number, parentEntity: string) {
    const comments = await this.voltaireService
      .getRepository('Comment')
      .createQueryBuilder('comment')
      .where('comment.parentId = :parentId', { parentId })
      .andWhere('comment.parentEntity = :parentEntity', { parentEntity })
      .getMany();
    for (const comment of comments) {
      comment.reactions = await this.reactionsService.getReactions(
        comment.id,
        'comment',
      );
      comment.comments = await this.getComments(comment.id, 'comment');
    }
    const sortedComments = comments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return sortedComments;
  }

  async insertComment(
    parentId: number,
    parentEntity: string,
    comment: string,
    voter: string,
    rootEntity: string,
    rootEntityId: number,
  ) {
    const newComment = this.voltaireService.getRepository('Comment').create({
      parentId,
      parentEntity,
      content: comment,
      voter,
    });

    if (rootEntity === 'note') {
      const note = await this.voltaireService
        .getRepository('Note')
        .findOne({ where: { id: rootEntityId } });
      if (note) {
        await this.voltaireService
          .getRepository('Note')
          .update({ id: rootEntityId }, { updatedAt: new Date() });
      }
    }

    return this.voltaireService.getRepository('Comment').save(newComment);
  }

  async removeComment(
    parentId: number,
    parentEntity: string,
    comment: string,
    voter: string,
  ) {
    const commentToRemove = await this.voltaireService
      .getRepository('Comment')
      .createQueryBuilder('comment')
      .where('comment.parentId = :parentId', { parentId })
      .andWhere('comment.parentEntity = :parentEntity', { parentEntity })
      .andWhere('comment.comment = :comment', { comment })
      .andWhere('comment.voter = :voter', { voter })
      .getOne();
    return this.voltaireService
      .getRepository('Comment')
      .delete(commentToRemove.id);
  }
}
