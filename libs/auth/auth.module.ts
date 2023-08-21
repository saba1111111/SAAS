import { Module } from '@nestjs/common';
import {
  AccessTokenStrategy,
  AuthService,
  LocalStrategy,
  PasswordRessetStrategy,
  RefreshTokenService,
  RefreshTokenStrategy,
} from './src';
import { AccountLibModule } from 'libs/account/account.module';
import { UtilsModule } from '@app/utils';
import { RedisModule } from 'libs/redis/redis.module';
import { refreshTokenProviders } from './src/providers';

@Module({
  imports: [AccountLibModule, UtilsModule, RedisModule],
  providers: [
    AuthService,
    RefreshTokenService,
    AccessTokenStrategy,
    LocalStrategy,
    PasswordRessetStrategy,
    RefreshTokenStrategy,
    ...refreshTokenProviders,
  ],
  exports: [AuthService],
})
export class AuthLibModule {}
