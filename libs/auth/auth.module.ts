import { Module } from '@nestjs/common';
import { AuthService, RefreshTokenService } from './src';
import { AccountLibModule } from 'libs/account/account.module';
import { UtilsModule } from '@app/utils';
import { RedisModule } from 'libs/redis/redis.module';
import { refreshTokenProviders } from './src/providers';

@Module({
  imports: [AccountLibModule, UtilsModule, RedisModule],
  providers: [AuthService, RefreshTokenService, ...refreshTokenProviders],
  exports: [AuthService],
})
export class AuthLibModule {}
