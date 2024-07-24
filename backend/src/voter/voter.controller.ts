import { Controller, Get, Param } from '@nestjs/common';
import { VoterService } from './voter.service';

@Controller('voters')
export class VoterController {
  
  constructor(private readonly voterService: VoterService) {}

  @Get(':stakeKey/delegation')
  getAdaHolderCurrentDelegation(@Param('stakeKey') stakeKey: string) {
    return this.voterService.getAdaHolderCurrentDelegation(stakeKey);
  }
}
