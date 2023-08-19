import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsNumber()
  balance: number;
}
