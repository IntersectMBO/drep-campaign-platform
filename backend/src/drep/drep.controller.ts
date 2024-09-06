import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Search,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { createDrepDto } from 'src/dto';
import { FileInterceptor } from '@nestjs/platform-express';
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
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: string,
  ) {
    return this.drepService.getAllDReps(s, page, perPage, sortBy, order);
  }
  @Get('epochs/latest/parameters')
  getEpochParams() {
    return this.drepService.getEpochParams();
  }
  @Get(':id/drep')
  async getSingle(@Param('id') drepId: number, @Query('stakeKeys') stakeKeys?: StakeKeys, @Query('startTimeCursor') startTimeCursor?: number, @Query('endTimeCursor') endTimeCursor?: number) {
    const { stakeKey, stakeKeyBech32 } = stakeKeys || {};
    let delegation: Delegation = null;

    if (stakeKey) {
      delegation =
        await this.voterService.getAdaHolderCurrentDelegation(stakeKey);
    }
    return this.drepService.getSingleDrepViaID(
      drepId,
      stakeKeyBech32,
      delegation,
      startTimeCursor,
      endTimeCursor
    );
  }
  @Get(':voterId/voter')
  async getSingleViaVoterId(
    @Param('voterId') voterId: string,
    @Query('stakeKeys') stakeKeys?: StakeKeys,
    @Query('startTimeCursor') startTimeCursor?: number,
    @Query('endTimeCursor') endTimeCursor?: number,
  ) {
    const { stakeKey, stakeKeyBech32 } = stakeKeys || {};

    let delegation: Delegation = null;

    if (stakeKey) {
      delegation =
        await this.voterService.getAdaHolderCurrentDelegation(stakeKey);
    }
    return this.drepService.getSingleDrepViaVoterID(
      voterId,
      stakeKeyBech32,
      delegation,
      startTimeCursor,
      endTimeCursor
    );
  }
  @Post('new')
  @UseInterceptors(FileInterceptor('profileUrl'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() drepDto: createDrepDto,
  ) {
    return this.drepService.registerDrep(drepDto, file);
  }
  @Post(':id/update')
  @UseInterceptors(FileInterceptor('profileUrl'))
  updateDetails(
    @UploadedFile() profileUrl: Express.Multer.File,
    @Param('id') drepId: number,
    @Body() drep: createDrepDto,
  ) {
    return this.drepService.updateDrepInfo(drepId, drep, profileUrl);
  }
}
