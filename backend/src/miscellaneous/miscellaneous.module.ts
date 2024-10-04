import { Module } from '@nestjs/common';
import { MiscellaneousController } from './miscellaneous.controller';
import { MiscellaneousService } from './miscellaneous.service';

@Module({
  imports: [],
  controllers: [MiscellaneousController],
  providers: [MiscellaneousService],
})
export class MiscellaneousModule {}
