import { SEQUILIZE_ACCOUNT_REPO_TOKEN } from '@app/common';
import { AccountSequelizeRepository } from '../repositories/account.respository';

export const accountProviders = [
  {
    provide: SEQUILIZE_ACCOUNT_REPO_TOKEN,
    useClass: AccountSequelizeRepository,
  },
];
