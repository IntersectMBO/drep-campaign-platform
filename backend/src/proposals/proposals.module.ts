import { Module } from '@nestjs/common';
import { ProposalsController } from './proposals.controller';
import { ProposalsService } from './proposals.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([], 'dbsync'),
  ],
  controllers: [ProposalsController],
  providers: [ProposalsService]
})
export class ProposalsModule {}
