import { Injectable } from '@nestjs/common';
import { PlanModel } from '../entities/plan.entity';
import { CreatePlan } from '../interfaces/create-plan.interface';
import { PlanRepository } from '../interfaces/plan-repository.interface';
import { FindOptions } from '@app/common';

@Injectable()
export class PlanSequilizeRepository implements PlanRepository {
  public async create(data: CreatePlan): Promise<PlanModel> {
    const plan = new PlanModel();
    plan.name = data.name;
    plan.price = data.price;
    plan.description = data.description;
    plan.level = data.level;
    plan.creatorId = data.creatorId;
    plan.planDuration = data.planDuration;

    return plan.save();
  }

  public async find(): Promise<PlanModel[] | []> {
    return PlanModel.findAll();
  }

  public async findOne(
    findOptions: FindOptions<PlanModel>,
  ): Promise<PlanModel> {
    return PlanModel.findOne({ where: findOptions });
  }

  public update(
    whereClause: FindOptions<PlanModel>,
    updateObject: FindOptions<PlanModel>,
  ): Promise<unknown> {
    return PlanModel.update(updateObject, { where: whereClause });
  }

  public remove(id: number): Promise<number> {
    return PlanModel.destroy({ where: { id } });
  }
}
