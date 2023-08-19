import { Module } from '@nestjs/common';
import { CompressionController } from './compression.controller';
import { SubscriptionLibModule } from 'libs/subscription/subscription.module';
import { CompressionLibModule } from 'libs/compression/compression.module';

@Module({
  imports: [CompressionLibModule, SubscriptionLibModule],
  controllers: [CompressionController],
})
export class CompressionModule {}
