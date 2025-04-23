import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { UtilsModule } from 'src/utils/utils.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './passport/local.strategy';
import { SessionGuard } from './passport/session.guard';
import { RedisModule } from 'src/redis/redis.module';
import { GoogleStrategy } from './passport/google.strategy';
import { DiscordStrategy } from './passport/discord.strategy';
@Global()
@Module({
  imports: [
    UsersModule,
    UtilsModule,
    RedisModule,
    PassportModule.register({ defaultStrategy: 'local', session: true }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy,SessionGuard,GoogleStrategy,DiscordStrategy],
  exports: [AuthService],
})
export class AuthModule { }
