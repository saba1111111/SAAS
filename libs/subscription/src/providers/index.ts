import {
  SEQUILIZE_SUBSCRIPTION_REPO_TOKEN,
  SEQUILIZE_SUBSCRIPTION_TOKEN_REPO_TOKEN,
} from '@app/common';
import { SubscriptionSequilizeRepository } from '../repositories/subscription.respository';
import { SubscriptionTokenSequilizeRepository } from '../repositories/subscription-token.repository';

export const subscriptionProviders = [
  {
    provide: SEQUILIZE_SUBSCRIPTION_REPO_TOKEN,
    useClass: SubscriptionSequilizeRepository,
  },
  {
    provide: SEQUILIZE_SUBSCRIPTION_TOKEN_REPO_TOKEN,
    useClass: SubscriptionTokenSequilizeRepository,
  },
];
