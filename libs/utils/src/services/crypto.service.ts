import { Injectable } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  public async hash(
    value: string | Buffer,
    saltRounds: string | number = 10,
  ): Promise<string> {
    const salt = await genSalt(saltRounds);
    return hash(value, salt);
  }

  public async compareHashs(
    value: string | Buffer,
    encryptedValue: string,
  ): Promise<boolean> {
    return compare(value, encryptedValue);
  }

  public async generateUniqueToken(): Promise<string> {
    const randomBytes = crypto.randomBytes(16);
    const timestamp = Date.now();

    return crypto
      .createHash('sha256')
      .update(randomBytes + timestamp.toString())
      .digest('hex');
  }

  public generateOtpCode(): number {
    return Math.floor(Math.random() * 1000000);
  }
}
