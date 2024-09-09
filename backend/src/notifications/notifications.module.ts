import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from 'src/entities/reaction.entity';
import {NotificationsService} from "./notifications.service";
import {NotificationsController} from "./notifications.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Reaction])],
  controllers: [NotificationsController],
  providers: [NotificationsService]
})
export class NotificationsModule {}
