import { Module } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { ProgramsController } from './programs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brands, Groups, ProgramAdmins, ProgramAttributes, ProgramGroups, Programs, Suppliers, Users } from 'src/entities';
import { BrandService } from '../brand/brand.service';
import { SupplierService } from '../supplier/supplier.service';
import { GroupService } from '../group/group.service';
import { S3Service } from 'src/helpers/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Brands, Suppliers, Users, Groups,
    Programs, ProgramAdmins, ProgramGroups, ProgramAttributes,
  ])],
  controllers: [ProgramsController],
  providers: [ProgramsService, BrandService, SupplierService, GroupService, S3Service],
})
export class ProgramsModule { }
