import { AccountModel } from '@app/account';
import {
  AccessTokenGuard,
  AccountRoles,
  Roles,
  RolesGuard,
  UserRequest,
} from '@app/common';
import { PlanService, createPlanDto } from '@app/plan';
import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';

@Controller('plan')
export class PlanController {
  public constructor(private readonly planService: PlanService) {}

  @Roles(AccountRoles.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post('/create')
  public async createPlan(
    @Request() request: UserRequest<AccountModel>,
    @Body() credentials: createPlanDto,
  ) {
    return this.planService.createPlan(request, credentials);
  }
}
