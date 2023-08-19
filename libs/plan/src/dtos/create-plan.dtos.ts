import { PlanLevels } from '@app/common';
import { IsIn, IsNumber, IsString, Min } from 'class-validator';

export class createPlanDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  description: string;

  @IsIn(Object.values(PlanLevels))
  level: string;

  @IsNumber()
  planDuration: number;
}
