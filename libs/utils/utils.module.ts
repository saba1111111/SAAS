import { Module } from '@nestjs/common';
import {
  CryptoService,
  MailSenderService,
  JwtLibService,
} from './src/services';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [CryptoService, MailSenderService, JwtLibService],
  exports: [CryptoService, MailSenderService, JwtLibService],
})
export class UtilsModule {}
