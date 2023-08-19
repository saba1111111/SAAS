import { Module } from '@nestjs/common';
import { AccountService } from './src/services/account.service';
import { UtilsModule } from '@app/utils';
import { accountProviders } from './src/providers';

@Module({
  imports: [UtilsModule],
  providers: [AccountService, ...accountProviders],
  exports: [AccountService],
})
export class AccountLibModule {}
