import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { PassportModule } from '@nestjs/passport';
import { SubscriptionLibModule } from 'libs/subscription/subscription.module';

@Module({
  imports: [SubscriptionLibModule, PassportModule],
  controllers: [SubscriptionController],
  exports: [],
})
export class SubscriptionModule {}
