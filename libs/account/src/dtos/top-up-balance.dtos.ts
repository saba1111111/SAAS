import { IsNumber, Min } from 'class-validator';

export class topUpBalanceDto {
  @IsNumber()
  @Min(0, { message: 'Amount must be greater than or equal to 0' })
  amount: number;
}
