import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { VoterService } from './voter.service';

@Controller('voters')
export class VoterController {
  constructor(private readonly voterService: VoterService) {}
  //can either be a stakeKey, raw address hex or a drepid
  @Get(':voterIdentity')
  getVoter(@Param('voterIdentity') voterIdentity: string) {
    return this.voterService.getVoter(voterIdentity);
  }
  @Get(':stakeKey/delegation')
  getAdaHolderCurrentDelegation(@Param('stakeKey') stakeKey: string) {
    return this.voterService.getAdaHolderCurrentDelegation(stakeKey);
  }
  //can either be a stakeKey, raw address hex or a drepid
  @Get(':voterIdentity/governance-actions')
  getGovActions(
    @Param('voterIdentity') voterIdentity: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,
    @Query('perPage', new DefaultValuePipe(6), ParseIntPipe)
    perPage: number,
  ) {
    return this.voterService.getGovActions(voterIdentity, page, perPage);
  }
}
