import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisRepository {
  private redisClient: Redis;

  public constructor(configService: ConfigService) {
    this.redisClient = new Redis({
      host: configService.get<string>('REDIS_HOST'),
      port: Number(configService.get<string>('REDIS_PORT')),
    });
  }

  public async findOne(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  public async create(
    key: string,
    value: string,
    expireTime?: number,
  ): Promise<string> {
    if (expireTime != undefined) {
      return this.redisClient.set(key, value, 'EX', expireTime);
    }
    return this.redisClient.set(key, value);
  }

  public async delete(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }
}
