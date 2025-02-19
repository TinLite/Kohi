import { DynamicModule, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule } from '@nestjs/config';

export interface RedisModuleOptions {
  url: string;
}

@Module({
  imports: [ConfigModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
