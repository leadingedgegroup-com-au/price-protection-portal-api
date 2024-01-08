import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities';
import { JwtModule } from '@nestjs/jwt';
import appConfiguration from 'src/app.configuration';
import { BullModule } from '@nestjs/bull';
import Constants from 'src/app.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      secret: appConfiguration().JWT.SECRET,
      signOptions: { expiresIn: appConfiguration().JWT.EXP },
    }),
    BullModule.registerQueue({ name: Constants.QUEUE.CONSUMERS.NOTIFICATION })
  ],
  controllers: [PasswordController],
  providers: [PasswordService,],
})
export class PasswordModule { }
