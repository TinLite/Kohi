import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { UtilsModule } from 'src/utils/utils.module';
import { UtilsService } from 'src/utils/utils.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './passport/jwt.strategy';
import { LocalStrategy } from './passport/local.strategy';


@Global()
@Module({
  imports: [
    UsersModule,
    UtilsModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRED'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UtilsService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
