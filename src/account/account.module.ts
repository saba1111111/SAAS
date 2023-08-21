import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountLibModule } from 'libs/account/account.module';

@Module({
  imports: [AccountLibModule],
  controllers: [AccountController],
  exports: [AccountLibModule],
})
export class AccountModule {}
