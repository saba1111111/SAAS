import { AccountModel } from '@app/account';
import { Request } from 'express';

export interface UserRequest<T extends Omit<AccountModel, 'password'>>
  extends Request {
  user: T;
}
