import { AccountService } from '@app/account/services/account.service';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PasswordRessetStrategy extends PassportStrategy(
  Strategy,
  'reset-password',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly accountService: AccountService,
  ) {
    super({
      secretOrKey: configService.get('JWT_PASSWORD_RESET_SECRET'),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request.body?.token;

          if (!token) {
            return null;
          }

          return token;
        },
      ]),
    });
  }

  async validate(payload: any) {
    const { email } = payload;
    const account = await this.accountService.findOne({ email });
    if (!account) {
      throw new NotFoundException('No such account!');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = account;

    return rest;
  }
}
