import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtTokenPayload } from '../interfaces';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from '../interfaces';

@Injectable()
export class JwtLibService {
  public constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public signJwtAccessToken(
    payload: JwtTokenPayload,
    config?: JwtConfig,
  ): Promise<string> {
    const secret =
      config?.secret ||
      this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
    const expiresIn =
      (config?.expiresInSeconds ||
        this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')) +
      's';

    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  public signJwtRefreshToken(
    payload: JwtTokenPayload,
    config?: JwtConfig,
  ): Promise<string> {
    const secret =
      config?.secret ||
      this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
    const expiresIn =
      (config?.expiresInSeconds ||
        this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')) +
      's';

    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }
}
