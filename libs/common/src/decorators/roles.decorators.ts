import { SetMetadata } from '@nestjs/common';
import { AccountRoles } from '../constants';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AccountRoles[]) =>
  SetMetadata(ROLES_KEY, roles);
