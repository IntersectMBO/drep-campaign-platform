import { Global, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConstants from './jwtConstants';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
type Payload = {
  drepId?: string;
  voterId?: string;
  stakeKey: string;
  signature: string;
  key: string;
};
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectDataSource('default')
    private voltaireService: DataSource,
  ) {}
  async signJWT(payload: Payload, tte: number | string) {
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
  async login(payload: Payload, tte: number | string) {
    //basically should check if the user signature is valid in the case of a drep or just provide a token for a normal user.
    const token = await this.signJWT(payload, tte);
    const signatureDto = {
      drep: payload.drepId,
      voterId: payload.voterId,
      stakeKey: payload.stakeKey,
      signatureKey: payload.key,
      signature: payload.signature,
    };
    //check for existing signature
    const existingSig = await this.voltaireService
      .getRepository('Signature')
      .findOne({
        where: { signature: payload.signature, signatureKey:payload.key, stakeKey: payload.stakeKey, },
      });
    if (existingSig) {
      //update the signature
      const updatedSig=await this.voltaireService
        .getRepository('Signature')
        .update(existingSig.id, signatureDto)
      return { token, updatedSig };
    }
    const insertedSig = await this.voltaireService
      .getRepository('Signature')
      .insert(signatureDto);
    return { token, insertedSig };
  }
  async verifyLogin(token: string) {
    // should check if there is an existing drep signature in the db. Well this is for dreps who have a profile.
  }
}
