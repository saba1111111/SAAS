import { Injectable } from '@nestjs/common';
import { FindOptions } from '@app/common';
import sequelize from 'sequelize';
import { SubscriptionTokenRepository } from '../interfaces';
import { SubscriptionTokenModel } from '../entities/subscriptionToken.entity';
import { CreateSubscriptionToken } from '../interfaces';

@Injectable()
export class SubscriptionTokenSequilizeRepository
  implements SubscriptionTokenRepository
{
  constructor() {}

  findOne(
    findOptions: FindOptions<SubscriptionTokenModel>,
  ): Promise<SubscriptionTokenModel> {
    return SubscriptionTokenModel.findOne({ where: findOptions });
  }

  public create(
    subscriptionTokenCredentials: CreateSubscriptionToken,
    transaction?: sequelize.Transaction,
  ): Promise<SubscriptionTokenModel> {
    const subscription = new SubscriptionTokenModel();
    subscription.token = subscriptionTokenCredentials.token;
    subscription.subscriptionId = subscriptionTokenCredentials.subscriptionId;
    subscription.expireDate = subscriptionTokenCredentials.expireDate;

    return subscription.save({ transaction } || undefined);
  }

  public update(
    whereClause: FindOptions<SubscriptionTokenModel>,
    updateObject: FindOptions<SubscriptionTokenModel>,
  ): Promise<unknown> {
    return SubscriptionTokenModel.update(updateObject, { where: whereClause });
  }

  public find(): Promise<SubscriptionTokenModel[]> {
    return SubscriptionTokenModel.findAll();
  }

  public remove(id: number): Promise<number> {
    return SubscriptionTokenModel.destroy({ where: { id } });
  }
}
