import {Controller, Get} from '@nestjs/common';
import {NotificationsService} from "./notifications.service";

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationsService) {}
  @Get('/')
  async getNotifications() {
    return this.notificationService.getNotifications();
  }
}
