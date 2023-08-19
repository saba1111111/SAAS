import { Injectable } from '@nestjs/common';
import { FindOptions, transactionConfig } from '@app/common';
import { AccountModel } from '../entities/account.entity';
import { Account } from '../interfaces';
import { AccountRepository } from '../interfaces';
import sequelize from 'sequelize';

@Injectable()
export class AccountSequelizeRepository implements AccountRepository {
  public findOne(
    findOptions: FindOptions<Account>,
    transactionConfig?: transactionConfig,
  ): Promise<AccountModel> {
    return AccountModel.findOne({
      where: findOptions,
      ...transactionConfig,
    });
  }

  public create(
    accountData: Account,
    transaction?: sequelize.Transaction,
  ): Promise<AccountModel> {
    const account = new AccountModel();
    account.name = accountData.name;
    account.email = accountData.email;
    account.password = accountData.password;
    account.balance = accountData.balance;
    account.authorize = accountData.authorize;

    return transaction ? account.save() : account.save({ transaction });
  }

  public update(
    whereClause: FindOptions<Account>,
    updateObject: FindOptions<Account>,
    transaction?: sequelize.Transaction,
  ): Promise<unknown> {
    const transactionOptions = transaction ? { transaction } : {};

    return AccountModel.update(updateObject, {
      where: whereClause,
      ...transactionOptions,
    });
  }

  public find(): Promise<AccountModel[]> {
    return AccountModel.findAll();
  }

  public remove(id: number): Promise<number> {
    return AccountModel.destroy({ where: { id } });
  }
}
