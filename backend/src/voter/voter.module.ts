import { Module } from '@nestjs/common';
import { VoterService } from './voter.service';
import { VoterController } from './voter.controller';

@Module({
  controllers: [VoterController],
  providers: [VoterService],
})
export class VoterModule {}
