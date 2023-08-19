import { IsEmail } from 'class-validator';

export class forgotPasswordDto {
  @IsEmail()
  email: string;
}
