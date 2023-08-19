import { IsEmail, IsNumber } from 'class-validator';

export class forgotPasswordVerifyDto {
  @IsEmail()
  email: string;

  @IsNumber()
  code: number;
}
