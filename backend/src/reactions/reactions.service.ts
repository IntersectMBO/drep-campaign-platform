import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectDataSource('default')
    private voltaireService: DataSource,
  ) {}

  async getReactions(parentId: number, parentEntity: string) {
    const reactions = await this.voltaireService
      .getRepository('Reaction')
      .createQueryBuilder('reaction')
      .where('reaction.parentId = :parentId', { parentId })
      .andWhere('reaction.parentEntity = :parentEntity', { parentEntity })
      .getMany();
    return reactions;
  }
  async insertReaction(parentId: number, parentEntity: string, type: string, voter: string) {
    const newReaction = this.voltaireService.getRepository('Reaction').create({
      parentId,
      parentEntity,
      type,
      voter,
    });
    return this.voltaireService.getRepository('Reaction').save(newReaction);
  }
  async removeReaction(parentId: number, parentEntity: string, type: string, voter: string) {
    const reaction = await this.voltaireService
      .getRepository('Reaction')
      .createQueryBuilder('reaction')
      .where('reaction.parentId = :parentId', { parentId })
      .andWhere('reaction.parentEntity = :parentEntity', { parentEntity })
      .andWhere('reaction.type = :type', { type })
      .andWhere('reaction.voter = :voter', { voter })
      .getOne();
    return this.voltaireService.getRepository('Reaction').delete(reaction.id);
  }
}
