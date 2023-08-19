import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptions } from '@app/common';
import { AccountModel } from '../entities/account.entity';
import { Account, DecreaceBalance, UpdatePassword } from '../interfaces';
import { CryptoService } from '@app/utils';
import { SEQUILIZE_ACCOUNT_REPO_TOKEN } from '@app/common';
import { UserRequest } from '@app/common';
import { topUpBalanceDto } from '../dtos';
import { AccountRepository } from '../interfaces';

@Injectable()
export class AccountService {
  public constructor(
    @Inject(SEQUILIZE_ACCOUNT_REPO_TOKEN)
    private readonly accountRepository: AccountRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  public async findOne(findOptions: FindOptions<AccountModel>) {
    const accountData = await this.accountRepository.findOne(findOptions);

    if (!accountData) {
      throw new NotFoundException('Account not found!');
    }

    return accountData['dataValues'];
  }

  public async topUpBalance(
    { user }: UserRequest<AccountModel>,
    credentials: topUpBalanceDto,
  ) {
    try {
      const account = await this.findOne({ id: user.id });

      await this.accountRepository.update(
        { ...account },
        { balance: account.balance + credentials.amount },
      );

      return { message: 'Successfully update balance!' };
    } catch (error) {
      const message = error.message || 'Somthing went wrong!';
      throw new BadRequestException(message);
    }
  }

  public async decreaseBalance(credentials: DecreaceBalance): Promise<unknown> {
    const { lock, transaction, accountId, amount } = credentials;

    const transactionConfig = transaction ? { lock, transaction } : undefined;

    const account = await this.accountRepository.findOne(
      { id: accountId },
      transactionConfig,
    );
    if (!account) {
      throw new NotFoundException('Account not found!');
    }

    return this.accountRepository.update(
      { id: accountId },
      { balance: account.balance - amount },
      transaction && transaction,
    );
  }

  public async checkEmailAvailability(email: string): Promise<boolean> {
    const account = await this.accountRepository.findOne({ email });

    return !account;
  }

  public async createAccount(accountData: Account): Promise<Account> {
    return this.accountRepository.create(accountData);
  }

  public updateAccount(
    whereClause: FindOptions<Account>,
    updateObject: FindOptions<Account>,
  ) {
    return this.accountRepository.update(whereClause, updateObject);
  }

  public async updateAccountPassword(credentials: UpdatePassword) {
    const { newPassword, existingPassword, email } = credentials;

    const isNewPasswordAndOldPasswordSame =
      await this.cryptoService.compareHashs(newPassword, existingPassword);
    if (isNewPasswordAndOldPasswordSame) {
      throw new ConflictException('New password and old password is Same!');
    }

    const hashedNewPassword = await this.cryptoService.hash(newPassword);

    await this.updateAccount({ email }, { password: hashedNewPassword });
  }
}
