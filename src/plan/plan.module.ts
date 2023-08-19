import { Module } from '@nestjs/common';
import { PlanController } from './plan.controller';
import { PlanLibModule } from 'libs/plan/plan.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PlanLibModule, PassportModule],
  controllers: [PlanController],
  exports: [],
})
export class PlanModule {}
