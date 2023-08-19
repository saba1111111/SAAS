import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountLibModule } from 'libs/account/account.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [AccountLibModule, PassportModule],
  controllers: [AccountController],
  exports: [AccountLibModule],
})
export class AccountModule {}
