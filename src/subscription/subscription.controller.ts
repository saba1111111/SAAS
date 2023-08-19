import { AccountModel } from '@app/account';
import { AccessTokenGuard, UserRequest } from '@app/common';
import { SubScribePlanDto } from '@app/subscription';
import { CreateSubscriptionTokenDto } from '@app/subscription/dtos';
import { SubscriptionTokenService } from '@app/subscription/services/subscription-token.service';
import { SubscriptionService } from '@app/subscription/services/subscription.service';
import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';

@Controller('subscription')
export class SubscriptionController {
  public constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly subscriptionTokenService: SubscriptionTokenService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Post('/subscribePlan')
  public async subscribePlan(
    @Request() request: UserRequest<AccountModel>,
    @Body() credentials: SubScribePlanDto,
  ) {
    return this.subscriptionService.subscribePlan(request, credentials);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/subscriptionToken')
  public async createSubscriptionToken(
    @Request() request: UserRequest<AccountModel>,
    @Body()
    credentials: CreateSubscriptionTokenDto,
  ) {
    return this.subscriptionTokenService.createSubscriptionToken(
      request,
      credentials,
    );
  }
}
