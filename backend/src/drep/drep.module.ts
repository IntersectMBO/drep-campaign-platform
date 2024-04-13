import { Module } from '@nestjs/common';
import { DrepController } from './drep.controller';
import { DrepService } from './drep.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drep } from 'src/entities/drep.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Drep])],
  controllers: [DrepController],
  providers:[DrepService]
})
export class DrepModule {}
