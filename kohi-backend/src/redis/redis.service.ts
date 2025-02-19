import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@redis/client';
import { config } from 'process';

@Injectable()
export class RedisService {
  private url: string;
  constructor(private readonly configService: ConfigService) {
    this.url = this.configService.get('REDIS_URL') ?? 'redis://localhost:6379';
  }

  getClient = async () => createClient({
      url: this.url,
    }).on('error', (err) => console.error('Redis Client Error', err)).connect();
}
