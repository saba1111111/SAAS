import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { PlanModule } from './plan/plan.module';
import { DatabaseModule } from './database/database.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ConfigModule } from '@nestjs/config';
import { CompressionModule } from './compression/compression.module';

@Module({
  imports: [
    AuthModule,
    AccountModule,
    PlanModule,
    DatabaseModule,
    SubscriptionModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CompressionModule,
  ],
  controllers: [],
})
export class AppModule {}
