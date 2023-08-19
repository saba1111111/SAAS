import { IsNumber } from 'class-validator';

export class SubScribePlanDto {
  @IsNumber()
  planId: number;

  @IsNumber()
  tokenExpirationDuration: number;
}
