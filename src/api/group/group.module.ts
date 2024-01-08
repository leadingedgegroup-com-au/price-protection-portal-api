import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groups } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Groups])],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule { }
