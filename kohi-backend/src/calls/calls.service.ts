import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CallsService {
    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
    ) { }
    async createCallsSession() {
        const response = await fetch(`${this.configService.get('CALLS_API_URL')}/sessions/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.configService.get('CALLS_API_KEY')}`
            },
        }).then(response => response.json());
        return response.sessionId;
    }

    async getCallSessionByChannelId(channelId: string) {
        return this.redisService.getClient().then(async (client) => {
            const sessionId = await client.get(`kohi:call:${channelId}`);
            if (sessionId) {
                return sessionId;
            } else {
                return null;
            }
        })
    }

    async createCallSession(channelId: string) {
        const sessionId = await this.createCallsSession();
        await this.redisService.getClient().then((client) =>
            client.set(`kohi:call:${channelId}`, sessionId, {
                EX: parseInt(this.configService.get('CALLS_SESSION_EXPIRE_TIME')) ?? 10800,
            })
        )
        return sessionId;
    }
}
