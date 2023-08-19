import { SubscriptionService } from '@app/subscription/services/subscription.service';
import { SubscriptionTokenService } from '@app/subscription/services/subscription-token.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class CompressionAccessGuard implements CanActivate {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly subscriptionTokenService: SubscriptionTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['compression-access'];

    if (!token) {
      throw new UnauthorizedException('You need access token!');
    }

    const { subscriptionId } =
      await this.subscriptionTokenService.checkTokenValidity(token);
    await this.subscriptionService.checkSubscriptionValidity(subscriptionId);

    return true;
  }
}
