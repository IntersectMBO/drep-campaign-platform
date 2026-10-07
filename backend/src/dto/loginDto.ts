import { Type } from 'class-transformer';
import {
  IsDefined,
  IsHexadecimal,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export const LOGIN_PERIODS = {
  '24 hrs': '24h',
  '2 weeks': '14d',
} as const;

export class DataSignatureDto {
  @IsHexadecimal()
  @MaxLength(4096)
  signature: string;

  @IsHexadecimal()
  @MaxLength(512)
  key: string;
}

export class LoginDto {
  // challenge returned by GET /auth/challenge
  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  message: string;

  // bech32 reward address whose stake key signed the challenge
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  stakeAddress: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => DataSignatureDto)
  stake: DataSignatureDto;

  // optional signature of the challenge with the wallet's DRep key
  @IsOptional()
  @ValidateNested()
  @Type(() => DataSignatureDto)
  drep?: DataSignatureDto;

  @IsOptional()
  @IsIn(Object.keys(LOGIN_PERIODS))
  expiry?: keyof typeof LOGIN_PERIODS;
}
