// export interface CreateSubscriptionToken {
//   token: string;
//   subscriptionId: number;
//   expireDate: Date;
// }

import { IsNumber } from 'class-validator';

export class CreateSubscriptionTokenDto {
  @IsNumber()
  subscriptionId: number;

  @IsNumber()
  tokenExpirationDuration: number;
}
