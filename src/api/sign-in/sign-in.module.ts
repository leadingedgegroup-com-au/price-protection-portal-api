import { Module } from '@nestjs/common';
import { SignInService } from './sign-in.service';
import { SignInController } from './sign-in.controller';
import appConfiguration from 'src/app.configuration';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sessions, Users } from 'src/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Sessions]),
    JwtModule.register({
      secret: appConfiguration().JWT.SECRET,
      signOptions: { expiresIn: appConfiguration().JWT.EXP },
    }),
  ],
  controllers: [SignInController],
  providers: [SignInService],
})
export class SignInModule { }
