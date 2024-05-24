import { Controller, Get } from '@nestjs/common';

@Controller('healthz')
export class HealthzController {
  constructor() {}
  @Get('/live')
  getLiveliness() {
    return true;
  }
  @Get('/ready')
  getReadiness() {
    return true;
  }
}
