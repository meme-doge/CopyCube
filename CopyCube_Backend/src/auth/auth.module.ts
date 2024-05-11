import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { factory } from 'ts-jest/dist/transformers/hoist-jest';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory:(configService:ConfigService)=>({
        secret:configService.get("SECRET"),
        signOptions:{expiresIn: "30d"}
      }),
      inject:[ConfigService]
    }),
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
