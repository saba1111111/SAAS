import { Module } from '@nestjs/common';
import { subscriptionProviders } from './src';
import { SubscriptionService } from './src/services/subscription.service';
import { PlanLibModule } from 'libs/plan/plan.module';
import { AccountLibModule } from 'libs/account/account.module';
import { SubscriptionTokenService } from './src/services/subscription-token.service';
import { UtilsModule } from '@app/utils';

@Module({
  imports: [PlanLibModule, AccountLibModule, UtilsModule],
  providers: [
    SubscriptionService,
    SubscriptionTokenService,
    ...subscriptionProviders,
  ],
  exports: [SubscriptionService, SubscriptionTokenService],
})
export class SubscriptionLibModule {}
