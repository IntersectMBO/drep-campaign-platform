import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { createDrepDto } from 'src/dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DrepService } from './drep.service';

@Controller('dreps')
export class DrepController {
  constructor(private drepService: DrepService) {}
  @Get('')
  getAll() {
    return this.drepService.getAllDreps();
  }
  @Get(':id/drep')
  getSingle(@Param('id') drepId: number) {
    return this.drepService.getSingleDrepViaID(drepId);
  }
  @Get(':voterId/voter')
  getSingleViaVoterId(@Param('voterId') voterId: string) {
    return this.drepService.getSingleDrepViaVoterID(voterId);
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
