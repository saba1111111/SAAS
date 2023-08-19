import { BaseRepository } from '@app/common';
import { SubscriptionTokenModel } from '../entities/subscriptionToken.entity';

export type SubscriptionTokenRepository =
  BaseRepository<SubscriptionTokenModel>;
