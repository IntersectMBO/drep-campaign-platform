import { Controller, Post, UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login() {
    throw new UnauthorizedException(
      'Direct login is disabled until wallet signature verification is implemented',
    );
  }
}
