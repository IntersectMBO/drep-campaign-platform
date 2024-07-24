import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import jwtConstants from './jwtConstants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret:jwtConstants.secret
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService]
})
export class AuthModule {}
