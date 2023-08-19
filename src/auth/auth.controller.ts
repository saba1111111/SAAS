import { AccountModel } from '@app/account';
import {
  AuthService,
  ChangePasswordDto,
  CreateAccountDto,
  LocalAuthGuard,
  RefreshTokenGuard,
  ResetPasswordGuard,
  VerifyAccountDto,
  forgotPasswordDto,
  forgotPasswordVerifyDto,
  resetPasswordDto,
} from '@app/auth';
import { AccessTokenGuard, UserRequest } from '@app/common';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post('/register')
  public register(@Body() createUserDto: CreateAccountDto) {
    return this.authService.register(createUserDto);
  }

  @Get('/verify/:token')
  public verify(@Param() param: VerifyAccountDto) {
    const { token } = param;
    return this.authService.verify({ token });
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  public async login(@Request() request: UserRequest<AccountModel>) {
    return this.authService.login(request);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/logout')
  public async logout(@Request() request: UserRequest<AccountModel>) {
    return this.authService.logout(request);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/change-password')
  public async changePassword(
    @Request() request: UserRequest<AccountModel>,
    @Body() changePasswordCredentials: ChangePasswordDto,
  ) {
    return this.authService.changePassword(request, changePasswordCredentials);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-token')
  public async RefreshToken(@Request() request: UserRequest<AccountModel>) {
    return this.authService.refreshToken(request);
  }

  @Post('/forgot-password')
  public async forgotPassword(@Body() credentials: forgotPasswordDto) {
    return this.authService.forgotPassword(credentials);
  }

  @Post('/forgot-password/verify')
  public async forgotPasswordCodeVerify(
    @Body() credentials: forgotPasswordVerifyDto,
  ) {
    return this.authService.forgotPasswordCodeVerify(credentials);
  }

  @UseGuards(ResetPasswordGuard)
  @Post('/forgot-password/reset')
  public async resetPassword(
    @Request() request: UserRequest<AccountModel>,
    @Body() credentials: resetPasswordDto,
  ) {
    return this.authService.resetPassword(request, credentials);
  }
}
