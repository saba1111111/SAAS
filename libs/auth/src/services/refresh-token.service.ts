import { Inject, Injectable } from '@nestjs/common';
import { JwtLibService } from '@app/utils';
import { ConfigService } from '@nestjs/config';
import { JwtTokenPayload } from '@app/utils';
import { RefreshToken, RefreshTokenRepository } from '../interfaces';
import { SEQUILIZE_REFRESH_TOKEN_REPO } from '@app/common';

@Injectable()
export class RefreshTokenService {
  public constructor(
    @Inject(SEQUILIZE_REFRESH_TOKEN_REPO)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtLibService,
    private readonly configService: ConfigService,
  ) {}

  public async generateJwtRefreshTokenCookie(payload: JwtTokenPayload) {
    const refreshToken = await this.jwtService.signJwtRefreshToken(payload);

    const expirationTime = this.configService.get<string>(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    );
    const cookie = `RefreshToken=${refreshToken}; HttpOnly=true; Path=/; Max-Age=${expirationTime}`;

    return {
      cookie,
      token: refreshToken,
      expirationTime,
    };
  }

  public async saveRefreshToken(data: RefreshToken) {
    const oldRefreshToken = await this.refreshTokenRepository.findOne({
      accountId: data.accountId,
    });
    if (oldRefreshToken) {
      await this.refreshTokenRepository.remove(data.accountId);
    }

    await this.refreshTokenRepository.create({
      accountId: data.accountId,
      token: data.token,
      expiresAt: data.expiresAt,
    });
  }

  public async removeRefreshToken(id: number) {
    return this.refreshTokenRepository.remove(id);
  }
}
