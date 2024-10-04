import { Module } from '@nestjs/common';
import { BlockfrostService } from './blockfrost.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
    }),
  ],
  providers: [BlockfrostService],
})
export class BlockfrostModule {}
