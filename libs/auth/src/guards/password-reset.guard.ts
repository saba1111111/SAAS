import { AuthGuard } from '@nestjs/passport';

export class ResetPasswordGuard extends AuthGuard('reset-password') {}
