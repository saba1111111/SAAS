import { SEQUILIZE_PLAN_REPO_TOKEN } from '@app/common';
import { PlanSequilizeRepository } from '../repositories/plan.repository';

export const planProviders = [
  {
    provide: SEQUILIZE_PLAN_REPO_TOKEN,
    useClass: PlanSequilizeRepository,
  },
];
