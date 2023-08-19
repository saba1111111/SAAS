import { Injectable } from '@nestjs/common';
import { SubscriptionModel } from '../entities/subscription.entity';
import { SubscriptionRepository } from '../interfaces/subscription-repository.interface';
import { FindOptions } from '@app/common';
import sequelize from 'sequelize';
import { createSubscription } from '../interfaces';

@Injectable()
export class SubscriptionSequilizeRepository implements SubscriptionRepository {
  constructor() {}

  findOne(
    findOptions: FindOptions<SubscriptionModel>,
  ): Promise<SubscriptionModel> {
    return SubscriptionModel.findOne({ where: findOptions });
  }

  public create(
    subscriptionCredentials: createSubscription,
    transaction?: sequelize.Transaction,
  ): Promise<SubscriptionModel> {
    const subscription = new SubscriptionModel();
    subscription.subscriberId = subscriptionCredentials.subscriberId;
    subscription.planId = subscriptionCredentials.planId;
    subscription.expireDate = subscriptionCredentials.expireDate;

    return subscription.save({ transaction } || undefined);
  }

  public update(
    whereClause: FindOptions<SubscriptionModel>,
    updateObject: FindOptions<SubscriptionModel>,
  ): Promise<unknown> {
    return SubscriptionModel.update(updateObject, { where: whereClause });
  }

  public find(): Promise<SubscriptionModel[]> {
    return SubscriptionModel.findAll();
  }

  public remove(id: number): Promise<number> {
    return SubscriptionModel.destroy({ where: { id } });
  }
}
