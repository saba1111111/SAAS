import { Injectable } from '@nestjs/common';
import { RedisRepository } from './redis.repository';
import { RedisKey, RedisValue } from 'ioredis';

@Injectable()
export class RedisService {
  public constructor(private readonly redisRepository: RedisRepository) {}

  public async add(key: RedisKey, value: RedisValue): Promise<void>;
  public async add(
    key: RedisKey,
    value: RedisValue,
    expiration: number,
  ): Promise<void>;
  public async add(
    key: RedisKey,
    value: RedisValue,
    expiration?: string | number,
  ): Promise<void> {
    await this.redisRepository.create(key, value, expiration);
  }

  public async get(key: RedisKey): Promise<string | null> {
    const data = await this.redisRepository.findOne(key);
    return data ? data : null;
  }

  public async remove(key: string): Promise<void> {
    await this.redisRepository.delete(key);
  }
}
