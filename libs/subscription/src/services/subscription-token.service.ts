import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { SubscriptionTokenRepository } from '../interfaces';
import {
  SEQUILIZE_SUBSCRIPTION_TOKEN_REPO_TOKEN,
  UserRequest,
  expirationDate,
  subscriptionTokenStatuses,
} from '@app/common';
import { CryptoService } from '@app/utils';
import sequelize from 'sequelize';
import { AccountModel } from '@app/account';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionTokenDto } from '../dtos';

@Injectable()
export class SubscriptionTokenService {
  public constructor(
    @Inject(SEQUILIZE_SUBSCRIPTION_TOKEN_REPO_TOKEN)
    private readonly subscriptionTokenRepository: SubscriptionTokenRepository,
    private readonly cryptoService: CryptoService,
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,
  ) {}

  public async createSubscriptionToken(
    { user }: UserRequest<AccountModel>,
    credentials: CreateSubscriptionTokenDto,
  ) {
    const { subscriptionId, tokenExpirationDuration } = credentials;
    try {
      const { subscription } =
        await this.subscriptionService.checkSubscriptionValidity(
          subscriptionId,
          user.id,
        );

      const tokenExpirationDate = expirationDate(tokenExpirationDuration);
      if (tokenExpirationDate > subscription.expireDate) {
        throw new ConflictException(
          'Token expiration time can not be higher than plans.',
        );
      }

      const { token } = await this.generateSubscriptionToken({
        subscriptionId,
        expireDate: tokenExpirationDate,
      });
      return { message: 'Successfully generate token!', token };
    } catch (error) {
      const message = error.message || 'Somthing went wrong!';
      throw new BadRequestException(message);
    }
  }

  public async generateSubscriptionToken(
    credentials: { subscriptionId: number; expireDate: Date },
    transaction?: sequelize.Transaction,
  ) {
    const token = await this.cryptoService.generateUniqueToken();
    await this.subscriptionTokenRepository.create(
      { ...credentials, token },
      transaction,
    );

    return { token };
  }

  public async checkTokenValidity(token: string) {
    const subscriptionToken = await this.subscriptionTokenRepository.findOne({
      token,
      status: subscriptionTokenStatuses.ACTIVE,
    });

    if (!subscriptionToken) {
      throw new BadRequestException('Wrong token!');
    } else if (subscriptionToken.expireDate < new Date()) {
      await this.subscriptionTokenRepository.update(
        { id: subscriptionToken.id },
        { status: subscriptionTokenStatuses.EXPIRED },
      );
      throw new BadRequestException('Token expired!');
    }

    return { subscriptionId: subscriptionToken.subscriptionId };
  }
}
