import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';

import { createDrepDto, ValidateMetadataDTO } from 'src/dto';
import { DrepService } from './drep.service';
import { VoterService } from 'src/voter/voter.service';
import { Delegation, StakeKeys } from 'src/common/types';

@Controller('dreps')
export class DrepController {
  constructor(
    private drepService: DrepService,
    private voterService: VoterService,
  ) {}
  @Get('')
  getAll(
    @Query('s', new DefaultValuePipe('')) s: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,
    @Query('perPage', new DefaultValuePipe(24), ParseIntPipe)
    perPage: number,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
    @Query('onChainStatus') onChainStatus?: 'active' | 'inactive',
    @Query('campaignStatus') campaignStatus?: 'claimed' | 'unclaimed',
    @Query('includeRetired') includeRetired?: 'true' | 'undefined',
    @Query('type') type?: 'has_script', // add more types if needed
  ) {
    return this.drepService.getAllDReps(
      s,
      page,
      perPage,
      sort,
      order,
      onChainStatus,
      campaignStatus,
      Boolean(includeRetired),
      type,
    );
  }
  @Get('epochs/latest/parameters')
  getEpochParams() {
    return this.drepService.getEpochParams();
  }
  @Get(':id/drep')
  async getSingle(@Param('id') drepId: number) {
    return this.drepService.getSingleDrepViaID(drepId);
  }
  @Get(':voterId/voter')
  async getSingleViaVoterId(@Param('voterId') voterId: string) {
    return this.drepService.getSingleDrepViaVoterID(voterId);
  }

  @Get(':idOrVoterId/activity')
  async getDrepActivity(
    @Param('idOrVoterId') idOrVoterId: string,
    @Query('stakeKeys') stakeKeys?: StakeKeys,
    @Query('startTimeCursor') startTimeCursor?: number,
    @Query('endTimeCursor') endTimeCursor?: number,
    @Query('filterValues') filterValues?: string[] | undefined,
  ) {
    let drepId: number | undefined;
    let drepVoterId: string | undefined;
    let drep = null;
    let delegation: Delegation = null;

    const { stakeKey, stakeKeyBech32 } = stakeKeys || {};

    if (!isNaN(Number(idOrVoterId))) {
      drepId = Number(idOrVoterId);
    } else {
      drepVoterId = idOrVoterId;
    }

    if (drepId) {
      drep = await this.drepService.getSingleDrepViaID(drepId);
      drepVoterId = drep.signature_voterId;
    } else if (drepVoterId) {
      drep = await this.drepService.getSingleDrepViaVoterID(drepVoterId);
    }

    if (stakeKey) {
      delegation =
        await this.voterService.getAdaHolderCurrentDelegation(stakeKey);
    }

    const drepTimeline = await this.drepService.getDrepTimeline({
      drep,
      drepVoterId,
      stakeKeyBech32,
      delegation,
      beforeDate: startTimeCursor,
      tillDate: endTimeCursor,
      filterValues,
    });

    return drepTimeline;
  }

  @Post('new')
  create(@Body() drepDto: createDrepDto) {
    return this.drepService.registerDrep(drepDto);
  }
  @Post(':id/update')
  updateDetails(@Param('id') drepId: number, @Body() drep: createDrepDto) {
    return this.drepService.updateDrepInfo(drepId, drep);
  }

  @Get(':voterId/metadata')
  getMetadata(@Param('voterId') voterId: string) {
    return this.drepService.getMetadata(voterId);
  }

  @Get('/metadata/external')
  getExternalMetadata(@Query('metadataUrl') metadataUrl: string) {
    return this.drepService.getMetadataFromExternalLink(metadataUrl);
  }

  @Post('metadata/validate')
  validateMetadata(@Body() metadataBody: ValidateMetadataDTO) {
    return this.drepService.validateMetadata(metadataBody);
  }

  @Post('metadata/save')
  saveMetadata(@Body('metadata') metadata: any) {
    return this.drepService.saveMetadata(metadata);
  }
  @Get(':voterId/stats')
  getStats(@Param('voterId') voterId: string) {
    return this.drepService.getStats(voterId);
  }

  @Get(':voterId/is-registered')
  isRegistered(@Param('voterId') voterId: string) {
    return this.drepService.isDrepRegistered(voterId);
  }

  @Get(':voterId/delegators')
  getDrepDelegators(
    @Param('voterId') voterId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,
    @Query('perPage', new DefaultValuePipe(24), ParseIntPipe)
    perPage: number,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
  ) {
    return this.drepService.getDrepDelegatorsWithVotingPower(
      voterId,
      page,
      perPage,
      sort,
      order,
    );
  }
}
