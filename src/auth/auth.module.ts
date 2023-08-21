import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

import { PassportModule } from '@nestjs/passport';
import { AccountModule } from 'src/account/account.module';
import { AuthLibModule } from 'libs/auth/auth.module';

@Module({
  imports: [AuthLibModule, PassportModule, AccountModule],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
