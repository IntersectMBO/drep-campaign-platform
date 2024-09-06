import { Global, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConstants from './jwtConstants';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async signJWT(payload: any, tte: number | string) {
    const accessSecret = jwtConstants.secret;
    return this.jwtService.signAsync(payload, {
      secret: accessSecret,
      expiresIn: tte as string,
    });
  }
  async verifyJWT(token: string) {
    const accessSecret = jwtConstants.secret;
    return this.jwtService.verifyAsync(token, {
      secret: accessSecret,
    });
  }
  //the payload could consist of the 
  async login(payload: any, tte: number | string) {
    //basically should check if the user signature is valid in the case of a drep or just provide a token for a normal user.
    const token = await this.signJWT(payload, tte);
    return { token };
  }
  async verifyLogin(token: string) {
    // should check if there is an existing drep signature in the db. Well this is for dreps who have a profile.
  }
}
