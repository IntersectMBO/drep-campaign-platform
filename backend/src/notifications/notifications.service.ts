import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectDataSource('default')
    private voltaireService: DataSource,
  ) {}

  async getNotifications() {
    return [
      // {
      //   label: 'dbSync Error',
      //   text: 'Register to become a DRep, delegate voting power to DReps, & review & vote on governance actions.',
      //   type: 'info'
      // },
    ];
    // const notifications = await this.voltaireService
    //   .getRepository('Notification')
    //   .createQueryBuilder('Notification')
    //   .where('Notification.parentId = :parentId', { parentId })
    //   .andWhere('Notification.parentEntity = :parentEntity', { parentEntity })
    //   .getMany();
    // return notifications;
  }
}
