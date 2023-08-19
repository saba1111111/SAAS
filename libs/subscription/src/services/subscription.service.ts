import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import {
  SEQUILIZE_SUBSCRIPTION_REPO_TOKEN,
  SequilizeLocks,
  SubscriptionStatuses,
  UserRequest,
  expirationDate,
} from '@app/common';
import { SubscriptionRepository } from '../interfaces/subscription-repository.interface';
import { AccountModel } from '@app/account';
import { AccountService } from '@app/account/services/account.service';
import { SubScribePlanDto } from '../dtos/subscribe-plan.dtos';
import { PlanService } from '@app/plan/services/plan.service';
import { SubscriptionTokenService } from './subscription-token.service';
import { SubscriptionTransaction } from '../interfaces';
import { SubscriptionModel } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionService {
  public constructor(
    @Inject(SEQUILIZE_SUBSCRIPTION_REPO_TOKEN)
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly plansServie: PlanService,
    private readonly accountService: AccountService,
    @Inject(forwardRef(() => SubscriptionTokenService))
    private readonly subscriptionTokenService: SubscriptionTokenService,
  ) {}

  public async subscribePlan(
    { user }: UserRequest<AccountModel>,
    { planId, tokenExpirationDuration }: SubScribePlanDto,
  ) {
    try {
      const subscription = await this.subscriptionRepository.findOne({
        planId,
        subscriberId: user.id,
        status: SubscriptionStatuses.ACTIVE,
      });
      if (subscription) {
        throw new ConflictException('Account Already has this plan.');
      }
      const plan = await this.plansServie.findPlan(planId);
      if (!plan || plan.price > user.balance) {
        const message = !plan
          ? 'No such plan!'
          : 'Not enough money to your balance to subscribe this plan';
        throw new BadRequestException(message);
      }
      if (plan.planDuration < tokenExpirationDuration) {
        throw new BadRequestException(
          'Token expiration time can not be higher than plans.',
        );
      }
      const subscriptionExpirationDate = expirationDate(plan.planDuration);
      const tokenExpirationDate = expirationDate(tokenExpirationDuration);
      const { token } = await this.createSubscribtionTransaction({
        accountId: user.id,
        amount: plan.price,
        planId,
        subscriptionExpirationDate,
        tokenExpirationDate,
      });
      return { message: 'Successfully purchased plan!', token };
    } catch (error) {
      throw new ConflictException(error.message || 'Subscription Failed!');
    }
  }

  private async createSubscribtionTransaction(
    credentials: SubscriptionTransaction,
  ) {
    const transaction = await SubscriptionModel.sequelize.transaction();
    try {
      await this.accountService.decreaseBalance({
        accountId: credentials.accountId,
        amount: credentials.amount,
        transaction: transaction,
        lock: SequilizeLocks.UPDATE,
      });
      const subscription = await this.subscriptionRepository.create(
        {
          subscriberId: credentials.accountId,
          planId: credentials.planId,
          expireDate: credentials.subscriptionExpirationDate,
        },
        transaction,
      );
      const { token } =
        await this.subscriptionTokenService.generateSubscriptionToken(
          {
            expireDate: credentials.tokenExpirationDate,
            subscriptionId: subscription.dataValues.id,
          },
          transaction,
        );
      await transaction.commit();
      return { token };
    } catch (error) {
      await transaction.rollback();
      throw new ConflictException(error.message || 'Subscription Failed!');
    }
  }

  public async checkSubscriptionValidity(
    subscriptionId: number,
    accountId?: number,
  ) {
    const subscription = await this.subscriptionRepository.findOne({
      id: subscriptionId,
    });
    const accountCheck = accountId
      ? subscription?.subscriberId == accountId
      : true;
    if (
      !subscription ||
      !accountCheck ||
      subscription?.status != SubscriptionStatuses.ACTIVE
    ) {
      throw new ConflictException('Can not find active Subscription!');
    } else if (subscription.expireDate < new Date()) {
      await this.subscriptionRepository.update(
        { id: subscriptionId },
        { status: SubscriptionStatuses.EXPIRED },
      );
      throw new ConflictException('Subscription time is expired!');
    }
    return { subscription };
  }
}
