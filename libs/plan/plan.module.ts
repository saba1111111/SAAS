import { Module } from '@nestjs/common';
import { PlanService } from './src';
import { planProviders } from './src/providers';

@Module({
  providers: [PlanService, ...planProviders],
  exports: [PlanService],
})
export class PlanLibModule {}
