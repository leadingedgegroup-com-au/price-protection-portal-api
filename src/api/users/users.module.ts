import { Module, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities';
import { BullModule } from '@nestjs/bull';
import Constants from 'src/app.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    BullModule.registerQueue({ name: Constants.QUEUE.CONSUMERS.NOTIFICATION })
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements OnModuleInit {

  constructor(private UsersService: UsersService) { }

  async onModuleInit() {
    await this.UsersService.onBoardAdministrator();
  }
}