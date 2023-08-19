import { Module } from '@nestjs/common';
import { RedisService } from './src/redis.service';
import { RedisRepository } from './src/redis.repository';

@Module({
  providers: [RedisService, RedisRepository],
  exports: [RedisService],
})
export class RedisModule {}
