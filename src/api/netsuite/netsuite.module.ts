import { Module } from '@nestjs/common';
import { NetsuiteService } from './netsuite.service';
import { NetsuiteController } from './netsuite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customers, Users } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Customers, Users])],
  controllers: [NetsuiteController],
  providers: [NetsuiteService],
})
export class NetsuiteModule { }
