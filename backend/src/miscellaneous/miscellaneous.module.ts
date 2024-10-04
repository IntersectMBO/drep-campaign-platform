import { Module } from '@nestjs/common';
import { MiscellaneousController } from './miscellaneous.controller';
import { MiscellaneousService } from './miscellaneous.service';
import { BlockfrostService } from 'src/blockfrost/blockfrost.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [MiscellaneousController],
  providers: [MiscellaneousService, BlockfrostService],
})
export class MiscellaneousModule {}
