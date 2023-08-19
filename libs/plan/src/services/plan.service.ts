import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AccountModel } from '@app/account';
import { SEQUILIZE_PLAN_REPO_TOKEN, UserRequest } from '@app/common';
import { createPlanDto } from '../dtos/create-plan.dtos';
import { PlanRepository } from '../interfaces/plan-repository.interface';

@Injectable()
export class PlanService {
  public constructor(
    @Inject(SEQUILIZE_PLAN_REPO_TOKEN)
    private readonly plainRepository: PlanRepository,
  ) {}

  public async createPlan(
    { user }: UserRequest<AccountModel>,
    data: createPlanDto,
  ) {
    try {
      await this.plainRepository.create({ ...data, creatorId: user.id });

      return { message: 'Successfully created plan!' };
    } catch (error) {
      const message = error.message || 'Somthing went wrong!';
      throw new BadRequestException(message);
    }
  }

  public async findPlan(id: number) {
    return this.plainRepository.findOne({ id });
  }
}
