import { AccountModel, topUpBalanceDto } from '@app/account';
import { AccountService } from '@app/account/services/account.service';
import { AccessTokenGuard } from '@app/common';
import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { UserRequest } from '@app/common';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/topUpBalance')
  public async topUpBalance(
    @Request() request: UserRequest<AccountModel>,
    @Body() credentials: topUpBalanceDto,
  ) {
    return this.accountService.topUpBalance(request, credentials);
  }
}
