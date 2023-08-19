import { AccountModel } from '@app/account';
import { AccountService } from '@app/account/services/account.service';
import { RedisService } from '@app/redis/redis.service';
import { CryptoService, JwtLibService } from '@app/utils';
import { MailSenderService } from '@app/utils';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto, VerifyAccountDto } from '../dtos';
import { CreateAccountDto } from '../dtos';
import { UserRequest } from '@app/common';
import { resetPasswordDto } from '../dtos';
import { RefreshTokenService } from './refresh-token.service';
import { forgotPasswordDto } from '../dtos';
import { forgotPasswordVerifyDto } from '../dtos';

@Injectable()
export class AuthService {
  public constructor(
    private readonly accountService: AccountService,
    private readonly cryptoService: CryptoService,
    private readonly mailSenderService: MailSenderService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtLibService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  public async register(account: CreateAccountDto) {
    try {
      const emailIsAvailable = await this.accountService.checkEmailAvailability(
        account.email,
      );
      if (!emailIsAvailable) {
        const errorMessage = 'Account with corresponding email already exist!';
        throw new BadRequestException(errorMessage);
      }

      const hashedPassword = await this.cryptoService.hash(account.password);
      const authorize = false;
      const newEccount = await this.accountService.createAccount({
        ...account,
        authorize,
        password: hashedPassword,
      });

      const token = await this.cryptoService.generateUniqueToken();
      const clientAddres = this.configService.get<string>('CLIENT_ADDRES');
      await this.mailSenderService.sendMessage(
        newEccount.email,
        'Verify',
        `Follow this link to verify - ${clientAddres}/auth/verify/${token}`,
      );
      await this.redisService.add(token, newEccount.email, 300000);

      return { message: 'Successfully registred!', email: newEccount.email };
    } catch (error) {
      const message = error.message || 'Something went wrong during signing up';
      throw new InternalServerErrorException(message);
    }
  }

  public async verify({ token }: VerifyAccountDto) {
    try {
      const email = await this.redisService.get(token);
      if (!email) {
        throw new BadRequestException('The verification code is invalid.');
      }

      await this.redisService.remove(token);

      await this.accountService.updateAccount({ email }, { authorize: true });

      return { message: 'Succesfuly verified!' };
    } catch (error) {
      const message = error.message || 'Verification failed!';
      throw new BadRequestException(message);
    }
  }

  public async login({ user, res }: UserRequest<AccountModel>) {
    try {
      const payload = {
        accountId: user.id,
        email: user.email,
      };
      const accessToken = await this.jwtService.signJwtAccessToken(payload);
      const refreshToken = await this.jwtService.signJwtRefreshToken(payload);

      res.cookie('refreshToken', refreshToken, { httpOnly: true });

      const expirationTime = this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      );
      const expireDate = new Date(+expirationTime * 1000 + Date.now());
      await this.refreshTokenService.saveRefreshToken({
        accountId: user.id,
        token: refreshToken,
        expiresAt: expireDate,
      });

      return { message: 'Successfuly login!', data: { user, accessToken } };
    } catch (error) {
      const message = error.message || 'login failed!';
      throw new BadRequestException(message);
    }
  }

  public async logout({ user, res }: UserRequest<AccountModel>) {
    try {
      res.clearCookie('refreshToken');
      await this.refreshTokenService.removeRefreshToken(user.id);

      return { message: 'logout successfully!' };
    } catch (error) {
      const message = error.message || 'logout failed!';
      throw new BadRequestException(message);
    }
  }

  public async changePassword(
    { user }: UserRequest<AccountModel>,
    changePasswordCredentials: ChangePasswordDto,
  ) {
    try {
      const { newPassword, oldPassword } = changePasswordCredentials;
      const account = await this.accountService.findOne({
        id: user.id,
      });

      const comparePasswords = await this.cryptoService.compareHashs(
        oldPassword,
        account.password,
      );
      if (!comparePasswords) {
        throw new ConflictException('Passwords does not match!');
      }

      await this.accountService.updateAccountPassword({
        email: account.email,
        newPassword,
        existingPassword: account.password,
      });

      return { message: 'Successfuly update password!' };
    } catch (error) {
      const message = error.message || 'Password change failed!';
      throw new BadRequestException(message);
    }
  }

  public async refreshToken({ user }: UserRequest<AccountModel>) {
    try {
      const payload = {
        accountId: user.id,
        email: user.email,
      };

      const accessToken = await this.jwtService.signJwtAccessToken(payload);

      return {
        message: 'Successfuly generated access token!',
        data: { accessToken },
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  public async forgotPassword({ email }: forgotPasswordDto) {
    try {
      const account = await this.accountService.findOne({ email });
      if (!account) {
        throw new NotFoundException('No such account!');
      }

      const OTP = this.cryptoService.generateOtpCode();
      await this.redisService.add(email, `${OTP}`);
      await this.mailSenderService.sendMessage(
        email,
        'The OTP is valid for five minutes.',
        `${OTP}`,
      );

      return { message: 'Successfuly sent otp on email!', data: { email } };
    } catch (error) {
      const message = error.message || 'Somthing went wrong!';
      throw new BadRequestException(message);
    }
  }

  public async forgotPasswordCodeVerify({
    code,
    email,
  }: forgotPasswordVerifyDto) {
    try {
      const OTP = await this.redisService.get(email);
      if (OTP == null || Number(OTP) !== code) {
        throw new ConflictException('Wrong code!');
      }
      await this.redisService.remove(email);

      const account = await this.accountService.findOne({ email });
      if (!account) {
        throw new NotFoundException('No such account!');
      }

      const jwtSecret = await this.configService.get(
        'JWT_PASSWORD_RESET_SECRET',
      );
      const jwtExpiration = await this.configService.get(
        'JWT_PASSWORD_RESET_EXPIRATION_TIME',
      );
      const jwt = await this.jwtService.signJwtAccessToken(
        {
          email,
          accountId: account.id,
        },
        { expiresInSeconds: jwtExpiration, secret: jwtSecret },
      );

      return { message: 'Successfuly verify!', data: { token: jwt, email } };
    } catch (error) {
      const message = error.message || 'Somthing went wrong!';
      throw new BadRequestException(message);
    }
  }

  public async resetPassword(
    { user }: UserRequest<AccountModel>,
    credentials: resetPasswordDto,
  ) {
    try {
      const account = await this.accountService.findOne({ id: user.id });
      if (!account) {
        throw new NotFoundException('No such account!');
      }

      await this.accountService.updateAccountPassword({
        email: account.email,
        existingPassword: account.password,
        newPassword: credentials.password,
      });

      return { message: 'Successfuly reset password!' };
    } catch (error) {
      const message = error.message || 'Failed password reset!';
      throw new BadRequestException(message);
    }
  }

  public async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.accountService.findOne({ email });
    if (user) {
      const comparePasswords = await this.cryptoService.compareHashs(
        pass,
        user.password,
      );

      if (comparePasswords) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    }

    return false;
  }
}
