import { Controller, Get } from '@nestjs/common';
import { MiscellaneousService } from './miscellaneous.service';

@Controller('misc')
export class MiscellaneousController {
  constructor(private miscService: MiscellaneousService) {}
  @Get('epochs/first')
  getFirstEpoch() {
    return this.miscService.getFirstEpoch();
  }
}
