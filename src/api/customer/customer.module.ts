import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customers, Groups } from 'src/entities';
import { GroupService } from '../group/group.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customers, Groups])],
  controllers: [CustomerController],
  providers: [CustomerService, GroupService],
})
export class CustomerModule { }
