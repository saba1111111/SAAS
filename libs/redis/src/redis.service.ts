import { Injectable } from '@nestjs/common';
import { RedisRepository } from './redis.repository';

@Injectable()
export class RedisService {
  constructor(private readonly redisRepository: RedisRepository) {}

  public async add(key: string, value: any): Promise<void>;
  public async add(key: string, value: any, expiration: number): Promise<void>;
  public async add(
    key: string,
    value: any,
    expiration?: number,
  ): Promise<void> {
    await this.redisRepository.create(key, value, expiration);
  }

  public async get(key: string): Promise<string | null> {
    const data = await this.redisRepository.findOne(key);
    return data ? data : null;
  }

  public async remove(key: string): Promise<void> {
    await this.redisRepository.delete(key);
  }
}
