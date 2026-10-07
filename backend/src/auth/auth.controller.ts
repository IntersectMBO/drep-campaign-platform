import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { LoginDto } from 'src/dto';
import { Public } from './auth.principal';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('challenge')
  challenge() {
    return this.authService.issueChallenge();
  }

  @Public()
  @Post('login')
  async login(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    payload: LoginDto,
  ) {
    return this.authService.login(payload);
  }
}
