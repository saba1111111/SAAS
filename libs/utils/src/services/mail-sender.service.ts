import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailSenderService {
  private transporter: nodemailer.Transporter;

  public constructor(private readonly configService: ConfigService) {
    const user = this.configService.get<string>('EMAIL');
    const pass = this.configService.get<string>('EMAIL_PASSWORD');

    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: { user, pass },
    });
  }

  async sendMessage(to: string, topic: string, message: string): Promise<any> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL,
      to,
      subject: topic,
      text: message,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
